import { useEffect, useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, Text, useToast } from "@chakra-ui/react";

export default function CheckoutForm() {
	const stripe = useStripe();
	const elements = useElements();
	const toast = useToast();

	const [message, setMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!stripe) return;

		const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
		if (!clientSecret) return;

		stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
			switch (paymentIntent.status) {
				case "succeeded":
					toast({ title: "Payment Succeeded!", status: "success", duration: 3000 });
					setMessage("Payment succeeded!");
					break;
				case "processing":
					setMessage("Your payment is processing.");
					break;
				case "requires_payment_method":
					setMessage("Your payment was not successful, please try again.");
					break;
				default:
					setMessage("Something went wrong.");
					break;
			}
		});
	}, [stripe, toast]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!stripe || !elements) return;

		setIsLoading(true);

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				// This is where the user will be redirected after payment
				return_url: `${window.location.origin}/`,
			},
		});

		if (error.type === "card_error" || error.type === "validation_error") {
			setMessage(error.message);
		} else {
			setMessage("An unexpected error occurred.");
		}

		setIsLoading(false);
	};

	return (
		<form id='payment-form' onSubmit={handleSubmit}>
			<PaymentElement id='payment-element' />
			<Button
				disabled={isLoading || !stripe || !elements}
				id='submit'
				type='submit'
				colorScheme='green'
				w='full'
				mt={6}
			>
				{isLoading ? "Processing..." : "Pay now"}
			</Button>
			{message && (
				<Text mt={4} color='red.500'>
					{message}
				</Text>
			)}
		</form>
	);
}
