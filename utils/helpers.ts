import { cartItem } from "@/store/store";
import { stripe } from "./constants";

export const getProducts = async () => {
	const products = await stripe.products.list();
	const productsWithPrices = await Promise.all(
		products.data.map(async (product) => {
			const prices = await stripe.prices.list({ product: product.id });
			return {
				id: product.id,
				name: product.name,
				price: prices.data[0].unit_amount! / 100,
				image: product.images[0],
				currency: prices.data[0].currency,
				description: product.description,
			};
		})
	);
	return productsWithPrices;
};
export const formatPrice = (price: number) => {
	const format = new Intl.NumberFormat("en-US", {
		currency: "USD",
		style: "currency",
	});
	return format.format(price);
};
export const priceTotal = (cart: cartItem[]) => {
	return cart.reduce((acc, item) => {
		return acc + item.price * item.quantity!;
	}, 0);
};
