import { api } from './api';
import { Product } from '../types';

export const productService = {
  // ============================================================
  // Get all products with filters
  // ============================================================
  getAll: async (params?: Record<string, any>) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // ============================================================
  // Get single product by ID
  // ============================================================
  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // ============================================================
  // Create product (Admin only)
  // ============================================================
  create: async (data: Partial<Product>) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  // ============================================================
  // Update product (Admin only)
  // ============================================================
  update: async (id: string, data: Partial<Product>) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  // ============================================================
  // Delete product (Admin only)
  // ============================================================
  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // ============================================================
  // Get all categories
  // ============================================================
  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },

  // ============================================================
  // Get all brands
  // ============================================================
  getBrands: async () => {
    const response = await api.get('/products/brands');
    return response.data;
  },
};