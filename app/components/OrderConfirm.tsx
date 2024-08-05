"use client";

import { useCartStore } from "@/store/CartProvider";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { BiSolidShoppingBag } from "react-icons/bi";

const OrderConfirm = () => {
	const { setCheckout, toggleCart, setPaymentIntent, clearCart } =
		useCartStore();
	useEffect(() => {
		setPaymentIntent("");
		clearCart();
	}, []);
	return (
		<motion.div
			initial={{ scale: 0.5, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
		>
			<div className="flex text-center mb-4 gap-3 justify-center flex-col items-center">
				<h1 className="text-2xl font-medium">Your order has been placed</h1>
				<h2 className="text-sm">Check your email for receipt</h2>
				<BiSolidShoppingBag size={100} />
				<div>
					<Link href={"/dashboard"}>
						<button
							onClick={() => {
								setCheckout("cart");
								toggleCart();
							}}
							className="bg-sky-400 px-4 text-white rounded-lg py-2 w-full mx-auto hover:opacity-75"
						>
							Check your orders
						</button>
					</Link>
				</div>
			</div>
		</motion.div>
	);
};

export default OrderConfirm;
