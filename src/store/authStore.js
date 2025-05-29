import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

axios.defaults.baseURL = API_URL;

axios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (idToken) => {
        try {
          const response = await axios.post("/auth/google", { idToken });
          const { token, user } = response.data;

          if (user.email !== "abhishek@zuvees.com" && user.role !== "admin") {
            toast.error("Only admin users can access this dashboard");
            return { success: false };
          }

          set({ user, token, isAuthenticated: true });
          toast.success("Welcome back, Admin!");
          return { success: true };
        } catch (error) {
          toast.error(error.response?.data?.message || "Login failed");
          return { success: false };
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        toast.success("Logged out successfully");
      },
    }),
    {
      name: "admin-auth",
    }
  )
);
