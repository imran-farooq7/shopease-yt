"use client";

import { useCartStore } from "@/store/CartProvider";
import { User } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { AiFillShopping } from "react-icons/ai";
import Cart from "./Cart";
import { AnimatePresence, motion } from "framer-motion";
interface Props {
	user: User;
}

const Navbar = ({ user }: Props) => {
	const { cart, isOpen, toggleCart } = useCartStore();
	return (
		<nav className="flex justify-between mt-5 items-center">
			<Link href={"/"}>
				<Image
					src={"/shopease.png"}
					width={100}
					height={100}
					alt="logo"
					className="object-cover"
				/>
			</Link>
			<ul className="flex items-center gap-5">
				<li className="relative cursor-pointer" onClick={() => toggleCart()}>
					<AiFillShopping size={30} />
					<AnimatePresence>
						{cart.length > 0 && (
							<motion.span
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								exit={{ scale: 0 }}
								className="absolute flex items-center justify-center font-bold bg-teal-700 text-sm text-white rounded-full w-5 h-5 left-5 bottom-4"
							>
								{cart.length}
							</motion.span>
						)}
					</AnimatePresence>
				</li>
				<li>
					{!user && (
						<button
							onClick={() => signIn("google")}
							className="bg-cyan-500 px-6 py-2 text-white rounded-lg"
						>
							Sign in
						</button>
					)}
					{user && (
						<div className="flex items-center gap-3">
							<Image
								src={user.image!}
								width={40}
								height={40}
								alt={user.name!}
								className="rounded-full"
							/>
							<button
								onClick={() => signOut()}
								className="bg-red-400 px-6 py-3 rounded-lg text-white text-sm hover:bg-red-600"
							>
								Sign out
							</button>
							<button className="bg-emerald-400 px-6 py-3 rounded-lg text-white text-sm hover:bg-emerald-600">
								<Link href={"/dashboard"}>Orders</Link>
							</button>
						</div>
					)}
				</li>
			</ul>
			<AnimatePresence>{isOpen && <Cart />}</AnimatePresence>
		</nav>
	);
};
export default Navbar;
