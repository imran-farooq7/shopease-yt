import Image from "next/image";
import { getOrders } from "../actions/actions";
import { formatPrice } from "@/utils/helpers";

const DashboardPage = async () => {
	const data = await getOrders();
	if (data?.error) {
		return (
			<div className="flex h-screen justify-center items-center text-center">
				<h1 className="text-5xl font-bold text-emerald-400">
					Please login to view your orders
				</h1>
			</div>
		);
	}
	return (
		<div>
			{data?.orders?.length === 0 ? (
				<h1>No orders</h1>
			) : (
				<h1 className="text-3xl font-semibold">Your orders</h1>
			)}
			<div>
				{data?.orders?.map((order) => (
					<div
						key={order.id}
						className="my-6 flex flex-col gap-4 lg:flex-row lg:gap-0 justify-between items-center rounded-lg shadow-md p-6 bg-gray-50 "
					>
						<div>
							<h2 className="font-semibold">Order reference: {order.id}</h2>
							<p>Time:{new Date(order.createdAt).toLocaleDateString()}</p>
						</div>
						<p className="text-md py-2">
							Status:{" "}
							<span
								className={`${
									order.status === "complete" ? "bg-emerald-500" : "bg-red-600"
								} px-4 py-2 ml-3 rounded-lg text-white`}
							>
								{order.status}
							</span>
						</p>
						<p className="font-semibold text-emerald-600">
							Total: {formatPrice(order.amount)}
						</p>
						<div>
							{order.products.map((product) => (
								<div key={product.id} className="py-2">
									<h3 className="py-2 font-medium">{product.name}</h3>
									<div className="flex flex-col items-center gap-4">
										<Image
											src={product.image}
											width={50}
											height={50}
											alt={product.name}
										/>
										<div className="flex gap-2">
											<p className="text-emerald-400 font-bold text-sm">
												{formatPrice(product.price)}
											</p>
											<p className="font-bold text-sm">
												Quantity: {product.quantity}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default DashboardPage;
