<<<<<<< HEAD
﻿import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';

export interface OrderFilters {
  status?: 'pending' | 'active' | 'overdue' | 'returned' | 'cancelled';
  searchQuery?: string;
  sortBy?: 'amount' | 'date' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
=======
import { useCallback, useState } from "react";

export interface Order {
  id: string;
  rentalNumber?: string;
  customerName?: string;
  status: string;
  totalAmount: number;
  createdAt?: string;
>>>>>>> bf3bf601e0c49d74f74dedbdf4e75f59be11a47d
}

export interface OrderStats {
  active: number;
  totalSpent: number;
}

<<<<<<< HEAD
interface UseOrdersResult {
  orders: any[];
  isLoading: boolean;
  error: Error | null;
  filters: OrderFilters;
  setFilters: (filters: OrderFilters) => void;
  loadMore: () => void;
  returnOrder: (orderId: string) => Promise<void>;
  getOrderStats: () => OrderStats;
}

export function useOrders(initialFilters: OrderFilters = {}): UseOrdersResult {
  const [orders, setOrders] = useState<any[]>([]);
  const [filters, setFilters] = useState<OrderFilters>({
    page: 1,
    limit: 20,
    ...initialFilters,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/orders', { params: filters });
      const data = response.data?.data ?? response.data;
      const items = Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : [];
      setOrders(items);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error('Failed to load orders'));
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const loadMore = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      page: (prev.page || 1) + 1,
    }));
  }, []);

  const returnOrder = useCallback(async (orderId: string) => {
    try {
      await api.post(`/orders/${orderId}/return`);
      fetchOrders();
    } catch (err: any) {
      throw err instanceof Error ? err : new Error('Failed to return order');
    }
  }, [fetchOrders]);

  const getOrderStats = useCallback((): OrderStats => {
    return orders.reduce(
      (stats, order) => {
        if (order.status === 'active') stats.active += 1;
        stats.totalSpent += Number(order.total_amount || order.total || 0);
        return stats;
      },
      { active: 0, totalSpent: 0 },
    );
  }, [orders]);
=======
interface OrdersFilters {
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchQuery?: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFiltersState] = useState<OrdersFilters>({});

  const setFilters = useCallback((nextFilters: OrdersFilters) => {
    setFiltersState((prev) => ({ ...prev, ...nextFilters }));
  }, []);

  const loadMore = useCallback(() => {
    setIsLoading(true);
    setOrders((prev) => prev);
    setIsLoading(false);
  }, []);

  const returnOrder = useCallback(async (_orderId: string) => {
    setIsLoading(true);
    setOrders((prev) => prev.filter((order) => order.id !== _orderId));
    setIsLoading(false);
  }, []);

  const getOrderStats = useCallback(
    (): OrderStats => ({
      active: orders.filter((order) => order.status === "active").length,
      totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    }),
    [orders],
  );
>>>>>>> bf3bf601e0c49d74f74dedbdf4e75f59be11a47d

  return {
    orders,
    isLoading,
<<<<<<< HEAD
    error,
=======
>>>>>>> bf3bf601e0c49d74f74dedbdf4e75f59be11a47d
    filters,
    setFilters,
    loadMore,
    returnOrder,
    getOrderStats,
  };
}
