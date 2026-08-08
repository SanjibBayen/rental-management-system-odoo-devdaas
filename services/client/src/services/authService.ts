import { api } from './api';

export const authService = {
  // ============================================================
  // Login
  // ============================================================
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // ============================================================
  // Register / Signup
  // ============================================================
  register: async (name: string, email: string, password: string, phone?: string) => {
    const response = await api.post('/auth/register', {
      full_name: name,
      email,
      password,
      phone: phone || '',
    });
    return response.data;
  },

  // ============================================================
  // Verify OTP
  // ============================================================
  verifyOTP: async (userId: string, otp: string) => {
    const response = await api.post('/auth/verify-otp', { userId, otp });
    return response.data;
  },

  // ============================================================
  // Resend OTP
  // ============================================================
  resendOTP: async (userId: string, email: string) => {
    const response = await api.post('/auth/resend-otp', { userId, email });
    return response.data;
  },

  // ============================================================
  // Get Current User
  // ============================================================
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // ============================================================
  // Logout
  // ============================================================
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};