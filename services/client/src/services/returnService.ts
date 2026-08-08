import { api } from './api';

export const returnService = {
  // ============================================================
  // Get today's returns
  // ============================================================
  getTodayReturns: async () => {
    const response = await api.get('/returns/today');
    return response.data;
  },

  // ============================================================
  // Get return by ID
  // ============================================================
  getReturnById: async (id: string) => {
    const response = await api.get(`/returns/${id}`);
    return response.data;
  },

  // ============================================================
  // Inspect return
  // ============================================================
  inspectReturn: async (id: string, data: {
    condition?: string;
    damage_report?: string;
    missing_accessories?: string;
  }) => {
    const response = await api.put(`/returns/${id}/inspect`, data);
    return response.data;
  },

  // ============================================================
  // Confirm return
  // ============================================================
  confirmReturn: async (id: string) => {
    const response = await api.put(`/returns/${id}/confirm`);
    return response.data;
  },
};