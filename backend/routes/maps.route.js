import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// This route will act as our proxy to the Google Places API
router.get("/places-autocomplete", protect, async (req, res) => {
	const { input } = req.query;
	if (!input) {
		return res.status(400).json({ message: "Input query is required" });
	}

	const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
		input
	)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

	try {
		const response = await fetch(url);
		const data = await response.json();
		res.json(data);
	} catch (error) {
		res.status(500).json({ message: "Error fetching from Google Places API" });
	}
});

export default router;
