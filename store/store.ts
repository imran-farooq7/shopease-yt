import { createStore } from "zustand";
import { persist } from "zustand/middleware";
export interface cartItem {
	name: string;
	id: string;
	image: string;
	description?: string;
	price: number;
	quantity?: number | 1;
}
interface cartStore {
	isOpen: boolean;
	cart: cartItem[];
	toggleCart: () => void;
	addToCart: (cartItem: cartItem) => void;
	removeCart: (cartItem: cartItem) => void;
	paymentIntent: string;
	onCheckout: string;
	setCheckout: (checkout: string) => void;
	setPaymentIntent: (payment: string) => void;
	clearCart: () => void;
}
export const createCartStore = () => {
	return createStore<cartStore>()(
		persist(
			(set) => ({
				cart: [],
				isOpen: false,
				onCheckout: "cart",
				paymentIntent: "",
				toggleCart: () =>
					set((state) => ({
						...state,
						isOpen: !state.isOpen,
					})),
				addToCart: (cartItem) =>
					set((state) => {
						const existingItem = state.cart.find((item) => {
							return item.id === cartItem.id;
						});

						if (existingItem && existingItem.quantity! >= 1) {
							const updateCart = state.cart.map((item) => {
								if (item.id === cartItem.id) {
									return {
										...item,
										quantity: item.quantity! + 1,
									};
								}
								return item;
							});
							return {
								cart: updateCart,
							};
						} else {
							return { cart: [...state.cart, { ...cartItem, quantity: 1 }] };
						}
					}),
				removeCart: (cartItem) =>
					set((state) => {
						const existingItem = state.cart.find((item) => {
							return item.id === cartItem.id;
						});

						if (existingItem && existingItem.quantity! > 1) {
							const updateCart = state.cart.map((item) => {
								if (item.id === cartItem.id) {
									return {
										...item,
										quantity: item.quantity! - 1,
									};
								}
								return item;
							});
							return {
								cart: updateCart,
							};
						} else {
							const updateCart = state.cart.filter((item) => {
								return item.id !== cartItem.id;
							});
							return { cart: updateCart };
						}
					}),
				setCheckout: (val) =>
					set((state) => {
						return {
							onCheckout: val,
						};
					}),
				setPaymentIntent: (val) =>
					set((state) => {
						return {
							paymentIntent: val,
						};
					}),
				clearCart: () =>
					set((state) => ({
						cart: [],
					})),
			}),
			{ name: "cart" }
		)
	);
};
