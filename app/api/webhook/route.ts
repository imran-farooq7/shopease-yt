import prisma from "@/prisma/prisma";
import { stripe } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
export async function POST(req: NextRequest) {
	const sig = req.headers.get("stripe-signature") as string;
	const body = await req.text();
	let event: Stripe.Event;
	if (!sig) {
		return NextResponse.json("missing stripe signature", {
			status: 400,
		});
	}
	try {
		event = stripe.webhooks.constructEvent(
			body,
			sig,
			process.env.STRIPE_WEBHOOK_KEY as string
		);
	} catch (error) {
		return NextResponse.json(
			{
				error: error,
			},
			{
				status: 400,
			}
		);
	}
	if (event.type === "charge.succeeded" || event.type === "charge.updated") {
		const charge = event.data.object as Stripe.Charge;
		if (typeof charge.payment_intent === "string") {
			const orderUpdate = await prisma.order.update({
				where: {
					paymentIntentId: charge.payment_intent,
				},
				data: {
					status: "complete",
				},
			});
		}
	}
	return NextResponse.json({ received: true });
}
