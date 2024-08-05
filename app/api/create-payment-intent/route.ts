import { stripe } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { priceTotal } from "@/utils/helpers";
import { cartItem } from "@/store/store";
import prisma from "@/prisma/prisma";
export async function POST(req: NextRequest) {
	const session = await auth();
	const body = await req.json();
	const { cart, payment_intent_id } = body;
	if (!session?.user) {
		return NextResponse.json("Not logged in", {
			status: 403,
		});
	}
	const orderData = {
		userId: session.user.id,
		amount: priceTotal(cart),
		currency: "usd",
		status: "pending",
		paymentIntentId: payment_intent_id,
		products: {
			create: cart.map((cartItem: cartItem) => ({
				name: cartItem.name,
				description: cartItem.description,
				price: cartItem.price,
				quantity: cartItem.quantity,
				image: cartItem.image,
			})),
		},
	};
	try {
		if (payment_intent_id) {
			const currentIntent = await stripe.paymentIntents.retrieve(
				payment_intent_id
			);
			if (currentIntent) {
				const updatePaymentIntent = await stripe.paymentIntents.update(
					payment_intent_id,
					{
						amount: priceTotal(cart) * 100,
					}
				);
				const existingOrder = await prisma.order.findFirst({
					where: {
						paymentIntentId: updatePaymentIntent.id,
					},
					include: { products: true },
				});
				if (!existingOrder) {
					return NextResponse.json("Invalid payment intent", {
						status: 400,
					});
				}
				const updateOrder = await prisma.order.update({
					where: {
						id: existingOrder.id,
					},
					data: {
						amount: priceTotal(cart),
						products: {
							deleteMany: {},
							create: cart.map((cartItem: cartItem) => ({
								name: cartItem.name,
								description: cartItem.description,
								price: cartItem.price,
								quantity: cartItem.quantity,
								image: cartItem.image,
							})),
						},
					},
				});
				return NextResponse.json(
					{ paymentIntent: updatePaymentIntent },
					{
						status: 200,
					}
				);
			}
		} else {
			const paymentIntent = await stripe.paymentIntents.create({
				amount: priceTotal(cart) * 100,
				currency: "usd",
				automatic_payment_methods: { enabled: true },
			});
			const newOrder = await prisma.order.create({
				data: {
					amount: orderData.amount,
					paymentIntentId: paymentIntent.id,
					status: orderData.status,
					userId: orderData.userId!,
					products: orderData.products,
				},
			});
			return NextResponse.json(paymentIntent, {
				status: 200,
			});
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json("Internal server error", {
			status: 500,
		});
	}
}
