import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

// --- THIS IS THE CRUCIAL FIX ---
// Explicitly configure dotenv to find the .env file in the root directory
const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, ".env") });
// --------------------------------

// --- DEBUGGING LINE ---
// This will now correctly show your key or 'undefined' if it's missing from the file
console.log("Stripe Secret Key Loaded:", process.env.STRIPE_SECRET_KEY);
// ----------------------

// --- DYNAMIC IMPORTS ---
// This ensures dotenv.config() runs before these modules, which depend on environment variables, are loaded.
const { default: productRoutes } = await import("./routes/product.route.js");
const { default: userRoutes } = await import("./routes/user.route.js");
const { default: orderRoutes } = await import("./routes/order.route.js");
const { default: paymentRoutes } = await import("./routes/payment.route.js");
const { notFound, errorHandler } = await import("./middleware/errorMiddleware.js");
// -----------------------

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// --- Production Build Setup ---
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// --- Error Handling Middleware ---
app.use(notFound);
app.use(errorHandler);

// --- Server Startup ---
try {
	await connectDB();
	console.log("MongoDB connected successfully.");
	app.listen(PORT, () => {
		console.log(`Server started at http://localhost:${PORT}`);
	});
} catch (error) {
	console.error("Failed to connect to MongoDB:", error);
	process.exit(1);
}
