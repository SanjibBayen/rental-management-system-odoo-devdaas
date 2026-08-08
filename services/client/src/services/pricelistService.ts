import { api } from './api';

export const pricelistService = {
  // ============================================================
  // Get all pricelists
  // ============================================================
  getAll: async () => {
    const response = await api.get('/pricelists');
    return response.data;
  },

  // ============================================================
  // Get pricelist by ID
  // ============================================================
  getById: async (id: string) => {
    const response = await api.get(`/pricelists/${id}`);
    return response.data;
  },

  // ============================================================
  // Create pricelist (Admin only)
  // ============================================================
  create: async (data: {
    name: string;
    description?: string;
    daily_rate: number;
    deposit_percentage: number;
    min_rental_days: number;
    max_rental_days: number;
    late_fee_per_day: number;
    valid_from?: string;
    valid_to?: string;
  }) => {
    const response = await api.post('/pricelists', data);
    return response.data;
  },

  // ============================================================
  // Update pricelist (Admin only)
  // ============================================================
  update: async (id: string, data: Partial<any>) => {
    const response = await api.put(`/pricelists/${id}`, data);
    return response.data;
  },

  // ============================================================
  // Delete pricelist (Admin only)
  // ============================================================
  delete: async (id: string) => {
    const response = await api.delete(`/pricelists/${id}`);
    return response.data;
  },
};