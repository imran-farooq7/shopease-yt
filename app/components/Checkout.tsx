"use client";
import { useCartStore } from "@/store/CartProvider";
import { useEffect, useState } from "react";
import { StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { stripePromise } from "@/utils/constants";
import CheckoutForm from "./CheckoutForm";
import { FiSettings } from "react-icons/fi";

const Checkout = () => {
	const { cart, paymentIntent, setPaymentIntent } = useCartStore();
	const [clientSecret, setClientSecret] = useState("");
	const router = useRouter();
	const createCustomerPaymentIntent = async () => {
		const res = await fetch("/api/create-payment-intent", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				cart,
				payment_intent_id: paymentIntent,
			}),
		});
		if (res.status === 403) {
			router.push("/api/auth/signin");
		}
		const data = await res.json();
		setClientSecret(data.client_secret);
		setPaymentIntent(data.id);
	};

	useEffect(() => {
		createCustomerPaymentIntent();
	}, []);
	const options: StripeElementsOptions = {
		clientSecret: clientSecret,
		appearance: {
			theme: "stripe",
			labels: "floating",
		},
	};
	return (
		<div>
			{!clientSecret && (
				<div className="flex items-center w-full justify-center">
					<p className="mr-2">Your order is being processed</p>
					<FiSettings
						size={24}
						className="animate-spin text-center text-black"
					/>
				</div>
			)}
			{clientSecret && (
				<Elements options={options} stripe={stripePromise}>
					<CheckoutForm clientSecret={clientSecret} />
				</Elements>
			)}
		</div>
	);
};

export default Checkout;
