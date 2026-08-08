import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './useAuth';

export interface Order {
  id: string;
  rental_number: string;
  product_name: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'active' | 'overdue' | 'returned' | 'cancelled';
  total_amount: number;
  deposit_amount: number;
  late_fee?: number;
  refund_amount?: number;
  product_image?: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/rentals/user');
      setOrders(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch orders'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
      setIsLoading(false);
    }
  }, [user]);

  const returnOrder = async (orderId: string, returnDate: string) => {
    try {
      const response = await api.put(`/rentals/${orderId}/return`, { returnDate });
      // Refresh orders after return
      await fetchOrders();
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to return order');
    }
  };

  const getInvoice = async (orderId: string) => {
    try {
      const response = await api.get(`/rentals/${orderId}/invoice`);
      return response.data.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to fetch invoice');
    }
  };

  return {
    orders,
    isLoading,
    error,
    refetch: fetchOrders,
    returnOrder,
    getInvoice,
  };
}