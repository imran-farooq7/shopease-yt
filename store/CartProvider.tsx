"use client";
import React, { createContext, useContext, useRef } from "react";
import { createCartStore } from "./store";
import { useStore } from "zustand";
export type CartStoreApi = ReturnType<typeof createCartStore>;
export const cartStoreContext = createContext<CartStoreApi | undefined>(
	undefined
);
export interface CartStoreProps {
	children: React.ReactNode;
}
export const CartStoreProvider = ({ children }: CartStoreProps) => {
	const storeRef = useRef<CartStoreApi>();
	if (!storeRef.current) {
		storeRef.current = createCartStore();
	}
	return (
		<cartStoreContext.Provider value={storeRef.current}>
			{children}
		</cartStoreContext.Provider>
	);
};
export const useCartStore = () => {
	const CartStoreContext = useContext(cartStoreContext);
	if (!CartStoreContext) {
		throw new Error("useCartStore must be used within CartStoreProvider");
	}
	return useStore(CartStoreContext);
};
