import express from "express";
import { createOrder } from "../controllers/order.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createOrder);

export default router;
