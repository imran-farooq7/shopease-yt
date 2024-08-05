import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import Navbar from "./components/Navbar";
import { CartStoreProvider } from "@/store/CartProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Create Next App",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();
	return (
		<html lang="en">
			<body className={`${inter.className} mx-auto container`}>
				<CartStoreProvider>
					<Navbar user={session?.user!} />
					{children}
				</CartStoreProvider>
			</body>
		</html>
	);
}
