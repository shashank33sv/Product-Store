import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import Order from "../models/order.model.js";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create a stripe payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
	const { orderId } = req.body;

	const order = await Order.findById(orderId);

	if (!order) {
		res.status(404);
		throw new Error("Order not found");
	}

	// Create a PaymentIntent with the order amount and currency
	const paymentIntent = await stripe.paymentIntents.create({
		amount: order.price * 100, // Stripe expects the amount in cents
		currency: "inr", // Change to your currency
		automatic_payment_methods: {
			enabled: true,
		},
	});

	res.send({
		clientSecret: paymentIntent.client_secret,
	});
});

export { createPaymentIntent };
