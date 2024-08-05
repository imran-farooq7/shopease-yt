"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/prisma";
export const getOrders = async () => {
	const session = await auth();
	if (!session?.user) {
		return {
			error: "User not logged in",
		};
	} else {
		const orders = await prisma.order.findMany({
			where: {
				userId: session.user.id,
			},
			include: {
				products: true,
			},
		});
		if (orders) {
			return {
				orders,
			};
		}
	}
};
