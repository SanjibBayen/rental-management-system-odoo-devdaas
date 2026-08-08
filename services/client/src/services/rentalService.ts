import { api } from './api';

export const rentalService = {
  // ============================================================
  // Get all rentals (Admin only)
  // ============================================================
  getAll: async (params?: Record<string, any>) => {
    const response = await api.get('/rentals', { params });
    return response.data;
  },

  // ============================================================
  // Get active rentals (Admin only)
  // ============================================================
  getActive: async () => {
    const response = await api.get('/rentals/active');
    return response.data;
  },

  // ============================================================
  // Get overdue rentals (Admin only)
  // ============================================================
  getOverdue: async () => {
    const response = await api.get('/rentals/overdue');
    return response.data;
  },

  // ============================================================
  // Get user's rentals (Customer)
  // ============================================================
  getUserRentals: async () => {
    const response = await api.get('/rentals/user');
    return response.data;
  },

  // ============================================================
  // Get rental by ID
  // ============================================================
  getById: async (id: string) => {
    const response = await api.get(`/rentals/${id}`);
    return response.data;
  },

  // ============================================================
  // Create rental
  // ============================================================
  create: async (data: {
    product_id: string;
    start_date: string;
    end_date: string;
    total_amount: number;
    deposit_amount: number;
  }) => {
    const response = await api.post('/rentals', data);
    return response.data;
  },

  // ============================================================
  // Return rental
  // ============================================================
  return: async (id: string, returnDate: string) => {
    const response = await api.put(`/rentals/${id}/return`, { returnDate });
    return response.data;
  },

  // ============================================================
  // Confirm payment (Razorpay)
  // ============================================================
  confirmPayment: async (id: string, paymentId: string) => {
    const response = await api.put(`/rentals/${id}/payment-confirm`, {
      payment_id: paymentId,
      status: 'completed',
    });
    return response.data;
  },

  // ============================================================
  // Get invoice
  // ============================================================
  getInvoice: async (id: string) => {
    const response = await api.get(`/rentals/${id}/invoice`);
    return response.data;
  },
};