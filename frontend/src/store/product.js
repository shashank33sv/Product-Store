import { create } from "zustand";

const BASE_URL = "http://localhost:5000";

export const useProductStore = create((set) => ({
  products: [],

  setProducts: (products) => set({ products }),

  fetchProducts: async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/products`);
      const data = await res.json();

      if (data.success) {
        set({ products: data.data });
      } else {
        console.error("Failed to fetch products:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error.message);
    }
  },

  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      return { success: false, message: "Please fill in all fields." };
    }

    try {
      const res = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();

      if (!data.success) return { success: false, message: data.message };

      set((state) => ({ products: [...state.products, data.data] }));
      return { success: true, message: "Product created!" };
    } catch (error) {
      return { success: false, message: "Error creating product." };
    }
  },

  deleteProduct: async (pid) => {
    try {
      const res = await fetch(`${BASE_URL}/api/products/${pid}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        products: state.products.filter((product) => product._id !== pid),
      }));
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: "Error deleting product." };
    }
  },

  updateProduct: async (pid, updatedProduct) => {
    try {
      const res = await fetch(`${BASE_URL}/api/products/${pid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
      const data = await res.json();

      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        products: state.products.map((product) =>
          product._id === pid ? data.data : product
        ),
      }));
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: "Error updating product." };
    }
  },
}));
