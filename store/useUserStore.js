import { create } from "zustand";
import axios from "axios";

const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,

  fetchUser: async () => {
    const token = localStorage.getItem("token"); // Get token from local storage
    if (!token) {
      set({ user: null, isLoading: false });
      return;
    }

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/get-user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching user:", error);
      set({ user: null, isLoading: false });
      localStorage.removeItem("token"); // Remove token if invalid
    }
  },

  logout: () => {
    localStorage.removeItem("token"); // Remove token
    set({ user: null });
    window.location.href = "/login"; // Redirect to login
  },
}));

export default useAuthStore;
