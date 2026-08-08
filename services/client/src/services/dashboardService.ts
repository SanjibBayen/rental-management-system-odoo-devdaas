import { api } from './api';

export const dashboardService = {
  // ============================================================
  // Get dashboard stats
  // ============================================================
  getStats: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },

  // ============================================================
  // Get recent rentals (for dashboard)
  // ============================================================
  getRecentRentals: async (limit: number = 10) => {
    const response = await api.get(`/dashboard/recent?limit=${limit}`);
    return response.data;
  },

  // ============================================================
  // Get revenue chart data
  // ============================================================
  getRevenueChart: async () => {
    const response = await api.get('/dashboard/revenue-chart');
    return response.data;
  },
};