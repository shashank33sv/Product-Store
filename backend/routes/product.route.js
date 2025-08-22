import express from "express";
import {
	createProduct,
	deleteProduct,
	getProducts,
	getMyProducts,
	updateProduct,
	getProductById,
} from "../controllers/product.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes for the main /api/products collection
// GET /api/products - fetches all products
// POST /api/products - creates a new product (protected)
router.route("/").get(getProducts).post(protect, createProduct);

// Route for fetching the current user's own products
// GET /api/products/myproducts - fetches products for the logged-in user (protected)
router.get("/myproducts", protect, getMyProducts);

// Routes for a specific product by its ID
// GET /api/products/:id - fetches a single product
// PUT /api/products/:id - updates a single product (protected)
// DELETE /api/products/:id - deletes a single product (protected)
router
	.route("/:id")
	.get(getProductById)
	.put(protect, updateProduct)
	.delete(protect, deleteProduct);

export default router;
