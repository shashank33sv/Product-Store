import asyncHandler from "express-async-handler";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
	// We now expect productId and shippingAddress in the body
	const { productId, shippingAddress } = req.body;

	if (!productId || !shippingAddress) {
		res.status(400);
		throw new Error("Product ID and shipping address are required");
	}

	const product = await Product.findById(productId);

	if (!product) {
		res.status(404);
		throw new Error("Product not found");
	}

	const order = new Order({
		buyer: req.user._id,
		seller: product.user,
		product: productId,
		price: product.price,
		shippingAddress: shippingAddress, // Save the shipping address
	});

	const createdOrder = await order.save();

	res.status(201).json({ data: createdOrder });
});

export { createOrder };
