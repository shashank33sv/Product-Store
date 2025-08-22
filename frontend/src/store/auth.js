import { create } from "zustand";

const useAuthStore = create((set) => ({
	user: null,
	isLoading: true,
	login: (user) => set({ user }),
	logout: () => set({ user: null }),
	setUser: (user) => set({ user }),
	setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore;
