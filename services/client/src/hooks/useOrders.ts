import { useCallback, useState } from "react";

export interface Order {
  id: string;
  rentalNumber?: string;
  customerName?: string;
  status: string;
  totalAmount: number;
  createdAt?: string;
}

export interface OrderStats {
  active: number;
  totalSpent: number;
}

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
    // Simulate loading more orders
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const returnOrder = useCallback(async (orderId: string) => {
    setIsLoading(true);
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
    setIsLoading(false);
  }, []);

  const getOrderStats = useCallback(
    (): OrderStats => ({
      active: orders.filter((order) => order.status === "active").length,
      totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    }),
    [orders],
  );

  return {
    orders,
    isLoading,
    filters,
    setFilters,
    loadMore,
    returnOrder,
    getOrderStats,
  };
}