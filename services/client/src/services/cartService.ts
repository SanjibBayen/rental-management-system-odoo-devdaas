import { api } from './api';

export const cartService = {
  // ============================================================
  // Get current cart
  // ============================================================
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // ============================================================
  // Add product to cart
  // ============================================================
  addItem: async (productId: string) => {
    const response = await api.post('/cart/add', { productId });
    return response.data;
  },

  // ============================================================
  // Remove product from cart
  // ============================================================
  removeItem: async (productId: string) => {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response.data;
  },

  // ============================================================
  // Clear cart
  // ============================================================
  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },

  // ============================================================
  // Checkout cart (Create rental)
  // ============================================================
  checkout: async (data: {
    start_date: string;
    end_date: string;
    total_amount: number;
    deposit_amount: number;
  }) => {
    const response = await api.post('/cart/checkout', data);
    return response.data;
  },
};