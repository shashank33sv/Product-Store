import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		// This is the new field to add
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User", // Creates a reference to the User model
		},
		name: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Product = mongoose.model("Product", productSchema);

export default Product;
