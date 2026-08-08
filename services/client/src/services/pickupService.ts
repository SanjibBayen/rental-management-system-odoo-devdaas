import { api } from './api';

export const pickupService = {
  // ============================================================
  // Get today's pickups
  // ============================================================
  getTodayPickups: async () => {
    const response = await api.get('/pickups/today');
    return response.data;
  },

  // ============================================================
  // Get pickup by ID
  // ============================================================
  getPickupById: async (id: string) => {
    const response = await api.get(`/pickups/${id}`);
    return response.data;
  },

  // ============================================================
  // Confirm pickup
  // ============================================================
  confirmPickup: async (id: string, notes?: string) => {
    const response = await api.put(`/pickups/${id}/confirm`, { notes });
    return response.data;
  },
};