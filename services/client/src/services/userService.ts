import { api } from "./api";

export const userService = {
  // ============================================================
  // Get user profile
  // ============================================================
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },

  // ============================================================
  // Update user profile
  // ============================================================
  updateProfile: async (
    data: Partial<{
      full_name: string;
      phone: string;
      address_line1: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    }>,
  ) => {
    const response = await api.put("/users/profile", data);
    return response.data;
  },

  // ============================================================
  // Update avatar
  // ============================================================
  updateAvatar: async (avatarUrl: string) => {
    const response = await api.put("/users/avatar", { avatar_url: avatarUrl });
    return response.data;
  },
  // ============================================================
  // Admin: Get all users
  // ============================================================
  getAll: async () => {
    const response = await api.get("/users");
    return response.data;
  },
};
