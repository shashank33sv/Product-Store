import { Container, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useProductStore } from "../store/product";
import ProductCard from "../components/ProductCard";

const MyProductsPage = () => {
	// We can reuse the same store, but we need a new fetch function
	const { products, setProducts } = useProductStore();

	useEffect(() => {
		const getMyProducts = async () => {
			try {
				const res = await fetch("/api/products/myproducts");
				if (!res.ok) throw new Error("Failed to fetch products");
				const data = await res.json();
				setProducts(data.data);
			} catch (error) {
				console.error(error);
			}
		};
		getMyProducts();
	}, [setProducts]);

	return (
		<Container maxW='container.xl' py={12}>
			<VStack spacing={8}>
				<Text fontSize={"3xl"} fontWeight={"bold"} color='cyan.400'>
					My Listed Products
				</Text>

				{products.length === 0 ? (
					<Text>You haven't listed any products yet.</Text>
				) : (
					<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} w={"full"}>
						{products.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}
					</SimpleGrid>
				)}
			</VStack>
		</Container>
	);
};

export default MyProductsPage;
