"use client";
import { useCartStore } from "@/store/CartProvider";
import { cartItem } from "@/store/store";
const AddToCart = ({
	id,
	image,
	name,
	price,
	description,
	quantity,
}: cartItem) => {
	const { addToCart } = useCartStore();

	return (
		<button
			onClick={() => {
				console.log(id, "from add to cart click");
				addToCart({
					id,
					name,
					description,
					price,
					quantity,
					image,
				});
			}}
			className="w-full text-white my-12 font-medium px-7 py-3 rounded-xl bg-sky-500 self-start hover:opacity-70"
		>
			Add to cart
		</button>
	);
};
export default AddToCart;
