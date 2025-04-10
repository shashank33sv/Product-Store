import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";

dotenv.config(); // Load .env first

const app = express(); // Initialize app AFTER dotenv

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Before routes
app.use(cors({
	origin: "*", // your frontend Render URL
	credentials: true, // optional if you're using cookies/auth
  }));


// Middleware
app.use(express.json());



// API routes
app.use("/api/products", productRoutes);

// Serve frontend if in production
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// Start server
app.listen(PORT, () => {
	connectDB();
	console.log(`🚀 Server started at http://localhost:${PORT}`);
});
