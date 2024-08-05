import { getProducts } from "@/utils/helpers";
import Product from "./components/Product";

const Home = async () => {
	const products = await getProducts();
	return (
		<div className="grid grid-cols-fluid gap-12 justify-items-center md:justify-items-start mt-6">
			{products.map((product) => (
				<Product key={product.id} product={product} />
			))}
		</div>
	);
};
export default Home;
