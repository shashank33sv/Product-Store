import {
	Box,
	Button,
	Container,
	Divider,
	FormControl,
	FormLabel,
	Heading,
	HStack,
	Image,
	Input,
	Spinner,
	Stack,
	Text,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../store/product";

const CheckoutPage = () => {
	const { productId } = useParams();
	const navigate = useNavigate();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const { placeOrder } = useProductStore();
	const toast = useToast();

	const [shippingDetails, setShippingDetails] = useState({
		address: "",
		city: "",
		postalCode: "",
		country: "",
	});

	useEffect(() => {
		const fetchProductDetails = async () => {
			setLoading(true);
			try {
				// First, try to find the product in the store
				const store = useProductStore.getState();
				let foundProduct = store.products.find((p) => p._id === productId);

				// If not in store (e.g., on page refresh), fetch from API
				if (!foundProduct) {
					const res = await fetch(`/api/products/${productId}`);
					if (!res.ok) throw new Error("Product not found");
					const data = await res.json();
					foundProduct = data.data;
				}
				setProduct(foundProduct);
			} catch (error) {
				console.error("Failed to fetch product details", error);
				toast({ title: "Error", description: "Could not load product details.", status: "error" });
			} finally {
				setLoading(false);
			}
		};
		fetchProductDetails();
	}, [productId, toast]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setShippingDetails((prev) => ({ ...prev, [name]: value }));
	};

	const handlePlaceOrder = async () => {
		if (!shippingDetails.address || !shippingDetails.city || !shippingDetails.postalCode || !shippingDetails.country) {
			toast({
				title: "Missing Information",
				description: "Please fill in all shipping details.",
				status: "warning",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		const { success, message, order } = await placeOrder(productId, shippingDetails);
		if (success && order?._id) {
			toast({
				title: "Order Placed!",
				description: "Redirecting to payment...",
				status: "success",
				duration: 2000,
				isClosable: true,
			});
			navigate(`/payment/${order._id}`);
		} else {
			toast({
				title: "Error",
				description: message || "Failed to place order. Please try again.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	if (loading) {
		return (
			<Container centerContent py={20}>
				<Spinner />
			</Container>
		);
	}

	if (!product) {
		return (
			<Container centerContent py={20}>
				<Heading>Product not found.</Heading>
			</Container>
		);
	}

	return (
		<Container maxW='container.xl' py={10}>
			<Stack direction={{ base: "column", md: "row" }} spacing={10}>
				{/* Shipping Details Form */}
				<VStack w='full' spacing={6} alignItems='flex-start'>
					<Heading as='h1' size='lg'>
						Shipping Details
					</Heading>
					<FormControl isRequired>
						<FormLabel>Address</FormLabel>
						<Input name='address' value={shippingDetails.address} onChange={handleInputChange} />
					</FormControl>
					<HStack w='full'>
						<FormControl isRequired>
							<FormLabel>City</FormLabel>
							<Input name='city' value={shippingDetails.city} onChange={handleInputChange} />
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Postal Code</FormLabel>
							<Input
								name='postalCode'
								value={shippingDetails.postalCode}
								onChange={handleInputChange}
							/>
						</FormControl>
					</HStack>
					<FormControl isRequired>
						<FormLabel>Country</FormLabel>
						<Input name='country' value={shippingDetails.country} onChange={handleInputChange} />
					</FormControl>
				</VStack>

				{/* Order Summary */}
				<VStack
					w='full'
					maxW='md'
					spacing={6}
					alignItems='flex-start'
					p={6}
					borderWidth='1px'
					borderRadius='lg'
				>
					<Heading as='h2' size='md'>
						Order Summary
					</Heading>
					<HStack w='full' justifyContent='space-between'>
						<Image src={product.image} alt={product.name} boxSize='100px' objectFit='cover' />
						<Text fontWeight='bold'>{product.name}</Text>
						<Text fontWeight='bold'>${product.price}</Text>
					</HStack>
					<Divider />
					<HStack w='full' justifyContent='space-between'>
						<Text>Subtotal</Text>
						<Text>${product.price}</Text>
					</HStack>
					<HStack w='full' justifyContent='space-between'>
						<Text>Shipping</Text>
						<Text>Free</Text>
					</HStack>
					<Divider />
					<HStack w='full' justifyContent='space-between'>
						<Text fontWeight='bold' fontSize='lg'>
							Total
						</Text>
						<Text fontWeight='bold' fontSize='lg'>
							${product.price}
						</Text>
					</HStack>
					<Button colorScheme='green' w='full' onClick={handlePlaceOrder}>
						Proceed to Payment
					</Button>
				</VStack>
			</Stack>
		</Container>
	);
};

export default CheckoutPage;
