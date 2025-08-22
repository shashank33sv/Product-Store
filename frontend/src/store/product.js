import { create } from "zustand";

export const useProductStore = create((set) => ({
	products: [],
	setProducts: (products) => set({ products }),

	fetchProducts: async () => {
		try {
			const res = await fetch("/api/products");
			if (!res.ok) throw new Error("Server responded with an error!");

			const data = await res.json();
			set({ products: data.data });
		} catch (error) {
			console.error("Error fetching products:", error);
		}
	},

	createProduct: async (newProduct) => {
		try {
			if (!newProduct.name || !newProduct.image || !newProduct.price) {
				throw new Error("Please fill in all fields.");
			}
			const res = await fetch("/api/products", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newProduct),
			});
			if (!res.ok) throw new Error("Failed to create product");

			const data = await res.json();
			set((state) => ({ products: [...state.products, data.data] }));
			return { success: true };
		} catch (error) {
			console.error("Error creating product:", error);
			return { success: false, message: error.message };
		}
	},

	deleteProduct: async (pid) => {
		try {
			const res = await fetch(`/api/products/${pid}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Failed to delete product");

			const data = await res.json();
			set((state) => ({ products: state.products.filter((p) => p._id !== pid) }));
			return { success: true, message: data.data.message };
		} catch (error) {
			console.error("Error deleting product:", error);
			return { success: false, message: error.message };
		}
	},

	updateProduct: async (pid, updatedProduct) => {
		try {
			const res = await fetch(`/api/products/${pid}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updatedProduct),
			});
			if (!res.ok) throw new Error("Failed to update product");

			const data = await res.json();
			set((state) => ({
				products: state.products.map((p) => (p._id === pid ? data.data : p)),
			}));
			return { success: true };
		} catch (error) {
			console.error("Error updating product:", error);
			return { success: false, message: error.message };
		}
	},

	// Replaced the old buyProduct function with this one
	placeOrder: async (productId, shippingAddress) => {
		try {
			const res = await fetch("/api/orders", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ productId, shippingAddress }),
			});
			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || "Failed to place order");
			}
			const data = await res.json();
			console.log("Order created:", data.data);
			return { success: true, order: data.data };
		} catch (error) {
			console.error("Error in placeOrder:", error);
			return { success: false, message: error.message };
		}
	},
}));
