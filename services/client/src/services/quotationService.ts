import { api } from './api';

export const quotationService = {
  // ============================================================
  // Create quotation (Admin only)
  // ============================================================
  create: async (data: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    product_id: string;
    start_date: string;
    end_date: string;
    total_amount: number;
    deposit_amount: number;
  }) => {
    const response = await api.post('/quotations', data);
    return response.data;
  },

  // ============================================================
  // Get quotation by ID
  // ============================================================
  getById: async (id: string) => {
    const response = await api.get(`/quotations/${id}`);
    return response.data;
  },

  // ============================================================
  // Convert quotation to rental
  // ============================================================
  convertToRental: async (id: string, userId: string) => {
    const response = await api.post(`/quotations/${id}/convert`, { user_id: userId });
    return response.data;
  },
};