import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		buyer: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		seller: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		product: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Product",
		},
		price: {
			type: Number,
			required: true,
		},
		// --- THIS IS THE NEW SECTION TO ADD ---
		shippingAddress: {
			address: { type: String, required: true },
			city: { type: String, required: true },
			postalCode: { type: String, required: true },
			country: { type: String, required: true },
		},
		// -----------------------------------------
		isPaid: {
			type: Boolean,
			required: true,
			default: false,
		},
		paidAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

const Order = mongoose.model("Order", orderSchema);

export default Order;