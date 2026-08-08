import { api } from '../utils/api';

export const aiService = {
  // ============================================================
  // 1. Predictive Maintenance
  // ============================================================
  getPredictiveMaintenance: async (
    productId: string, 
    rentalFrequency: number, 
    productAge: number
  ) => {
    const response = await api.ai.predictiveMaintenance(productId, rentalFrequency, productAge);
    return response;
  },

  // ============================================================
  // 2. Route Optimization
  // ============================================================
  optimizeRoute: async (addresses: string[]) => {
    const response = await api.ai.optimizeRoute({ addresses });
    return response;
  },

  // ============================================================
  // 3. Demand Forecasting
  // ============================================================
  getForecast: async (productId: string, historicalRentals: number[]) => {
    const response = await api.ai.forecast(productId, { historical_rentals: historicalRentals });
    return response;
  },

  // ============================================================
  // 4. Smart Reminder
  // ============================================================
  getSmartReminder: async (rentalEndDate: string) => {
    const response = await api.ai.smartReminder({ rental_end_date: rentalEndDate });
    return response;
  },
};