import mongoose from "mongoose";
import Product from "../models/product.model.js";
import asyncHandler from "express-async-handler";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({});
	res.status(200).json({ data: products });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		res.status(200).json({ data: product });
	} else {
		res.status(404);
		throw new Error("Product not found");
	}
});

// @desc    Get logged in user's products
// @route   GET /api/products/myproducts
// @access  Private
export const getMyProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({ user: req.user._id });
	res.status(200).json({ data: products });
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private
export const createProduct = asyncHandler(async (req, res) => {
	const product = new Product({
		...req.body,
		user: req.user._id, // Attach the logged-in user's ID
	});
	const savedProduct = await product.save();
	res.status(201).json({ data: savedProduct });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const product = await Product.findById(id);

	if (!product) {
		res.status(404);
		throw new Error("Product not found");
	}

	// Security check: Ensure the user owns the product
	if (product.user.toString() !== req.user._id.toString()) {
		res.status(401);
		throw new Error("Not authorized");
	}

	const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
		new: true,
		runValidators: true,
	});
	res.status(200).json({ data: updatedProduct });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
export const deleteProduct = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const product = await Product.findById(id);

	if (!product) {
		res.status(404);
		throw new Error("Product not found");
	}

	// Security check: Ensure the user owns the product
	if (product.user.toString() !== req.user._id.toString()) {
		res.status(401);
		throw new Error("Not authorized");
	}

	await Product.findByIdAndDelete(id);
	res.status(200).json({ data: { message: "Product deleted successfully" } });
});
