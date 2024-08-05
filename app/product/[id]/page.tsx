import AddToCart from "@/app/components/AddToCart";
import { formatPrice } from "@/utils/helpers";
import Image from "next/image";

interface Props {
	searchParams: {
		name: string;
		image: string;
		price: string;
		description: string;
	};
	params: {
		id: string;
	};
}
const ProductDetail = ({ params, searchParams }: Props) => {
	const { description, image, name, price } = searchParams;
	return (
		<div className="flex flex-col md:flex-row justify-between gap-12 p-12 text-gray-700">
			<Image src={image} alt={name} width={400} height={400} />
			<div>
				<h1 className="font-bold text-3xl text-emerald-400">{name}</h1>
				<p className="my-4"> {description}</p>
				<div className="flex gap-4">
					<p className="font-bold text-teal-700 text-2xl">
						{formatPrice(Number(price))}
					</p>
				</div>
				<AddToCart {...searchParams} price={Number(price)} id={params.id} />
			</div>
		</div>
	);
};
export default ProductDetail;
