import { useCartStore } from "@/store/CartProvider";
import { formatPrice, priceTotal } from "@/utils/helpers";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";
import { SlBasket } from "react-icons/sl";
import Checkout from "./Checkout";
import OrderConfirm from "./OrderConfirm";
const Cart = () => {
	const { toggleCart, cart, removeCart, addToCart, onCheckout, setCheckout } =
		useCartStore();
	let content: string | JSX.Element;
	const totalPrice = priceTotal(cart);
	if (cart.length === 0) {
		content = (
			<AnimatePresence>
				<motion.div
					initial={{ scale: 0.5, rotateZ: -10, opacity: 0 }}
					animate={{ scale: 1, rotateZ: 0, opacity: 0.75 }}
					exit={{ scale: 0.5, rotateZ: -10, opacity: 0 }}
					className="flex flex-col items-center gap-4 text-2xl font-medium"
				>
					<button onClick={() => toggleCart()} className="text-sm font-medium">
						Back to store 🏃
					</button>
					<h1>Ohhh...it's empty</h1>
					<SlBasket size={96} className="text-cyan-400" />
				</motion.div>
			</AnimatePresence>
		);
	} else {
		content = (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<h1>Here's your shopping list 📃</h1>
				{cart.map((item) => (
					<motion.div
						layout
						key={item.id}
						className="flex items-center py-4 gap-3"
					>
						<Image
							src={item.image}
							alt={item.name}
							width={120}
							height={120}
							className="rounded-md object-cover"
						/>
						<motion.div>
							<h2>{item.name}</h2>
							<div className="flex gap-3">
								<h2>Quantity: {item.quantity}</h2>
								<button onClick={() => removeCart(item)}>
									<IoRemoveCircle />
								</button>
								<button onClick={() => addToCart(item)}>
									<IoAddCircle />
								</button>
							</div>
							<p className="text-sm text-teal-500">{formatPrice(item.price)}</p>
						</motion.div>
					</motion.div>
				))}
				<motion.div layout>
					<p>Total :{formatPrice(totalPrice)}</p>
					<button
						onClick={() => setCheckout("checkout")}
						className="py-2 bg-teal-700 mt-4 w-full rounded-md text-white"
					>
						Checkout
					</button>
				</motion.div>
			</motion.div>
		);
	}
	if (onCheckout === "checkout") {
		content = (
			<div className="text-center">
				<button className={"mb-3"} onClick={() => setCheckout("cart")}>
					Back to cart 🛒
				</button>
				<Checkout />
			</div>
		);
	}
	if (onCheckout === "success") {
		content = <OrderConfirm />;
	}
	return (
		<div
			onClick={() => toggleCart()}
			className="fixed w-full h-screen left-0 top-0 bg-black/25 z-50"
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="absolute bg-white w-full right-0 lg:w-1/3 h-screen p-12 overflow-y-scroll text-gray-700"
			>
				{content}
			</div>
		</div>
	);
};
export default Cart;
