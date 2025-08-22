import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { Container, Heading, Spinner, Text, VStack } from "@chakra-ui/react";

// Load Stripe outside of the component to avoid re-creating on every render
// This uses the environment variable you created in frontend/.env.local
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
	const { orderId } = useParams();
	const [clientSecret, setClientSecret] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchClientSecret = async () => {
			try {
				const res = await fetch("/api/payments/create-payment-intent", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ orderId }),
				});
				if (!res.ok) throw new Error("Failed to initialize payment");
				const data = await res.json();
				setClientSecret(data.clientSecret);
			} catch (error) {
				console.error("Failed to fetch client secret", error);
			} finally {
				setLoading(false);
			}
		};
		if (orderId) {
			fetchClientSecret();
		}
	}, [orderId]);

	const appearance = {
		theme: "stripe",
	};
	const options = {
		clientSecret,
		appearance,
	};

	if (loading) {
		return (
			<Container centerContent py={20}>
				<VStack>
					<Spinner />
					<Text mt={4}>Loading Payment Gateway...</Text>
				</VStack>
			</Container>
		);
	}

	return (
		<Container py={10}>
			<Heading as='h1' size='lg' mb={6} textAlign='center'>
				Complete Your Payment
			</Heading>
			{/* Only render the Elements provider when clientSecret is available */}
			{clientSecret && (
				<Elements options={options} stripe={stripePromise}>
					<CheckoutForm />
				</Elements>
			)}
		</Container>
	);
};

export default PaymentPage;
