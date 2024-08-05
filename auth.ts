import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Google from "next-auth/providers/google";
import { stripe } from "./utils/constants";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [Google],
	events: {
		createUser: async ({ user }) => {
			const customer = await stripe.customers.create({
				email: user.email!,
				name: user.name!,
			});
			await prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					stripeId: customer.id,
				},
			});
		},
	},
});
