import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Rental } from '../types/rental.types';

export type RentalView = 'user' | 'all' | 'recent';

export interface RentalFilters {
  view?: RentalView;
  status?: 'pending' | 'active' | 'overdue' | 'returned' | 'cancelled';
  limit?: number;
  page?: number;
}

export interface RentalStats {
  active: number;
  overdue: number;
  totalRevenue: number;
  totalRentals: number;
}

interface UseRentalsResult {
  rentals: Rental[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  updateFilters: (filters: Partial<RentalFilters>) => void;
  getRentalStats: () => RentalStats;
}

export function useRentals(initialFilters: RentalFilters = {}): UseRentalsResult {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [filters, setFilters] = useState<RentalFilters>({
    view: 'all',
    limit: 20,
    page: 1,
    ...initialFilters,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRentals = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: Record<string, string | number> = {
        page: filters.page || 1,
        limit: filters.limit || 20,
      };

      if (filters.view) params.view = filters.view;
      if (filters.status) params.status = filters.status;

      const response = await api.get('/rentals', { params });
      const data = response.data?.data ?? response.data;
      const items = Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : [];

      setRentals(
        items.map((rental: any) => ({
          ...rental,
          id: rental.id,
          rentalNumber: rental.rentalNumber || rental.rental_number || '',
          userId: rental.userId || rental.user_id || '',
          productId: rental.productId || rental.product_id || '',
          productName: rental.productName || rental.product_name || '',
          customerName: rental.customerName || rental.customer_name || '',
          startDate: rental.startDate || rental.start_date || '',
          endDate: rental.endDate || rental.end_date || '',
          actualReturnDate: rental.actualReturnDate || rental.actual_return_date,
          status: rental.status,
          totalAmount: rental.totalAmount || rental.total_amount || 0,
          depositAmount: rental.depositAmount || rental.deposit_amount || 0,
          lateFee: rental.lateFee || rental.late_fee || 0,
          refundAmount: rental.refundAmount || rental.refund_amount || 0,
          createdAt: rental.createdAt || rental.created_at,
          updatedAt: rental.updatedAt || rental.updated_at,
        })) as Rental[],
      );
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error('Failed to load rentals'));
      setRentals([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const updateFilters = useCallback((newFilters: Partial<RentalFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? prev.page,
      limit: newFilters.limit ?? prev.limit,
    }));
  }, []);

  const getRentalStats = useCallback((): RentalStats => {
    return rentals.reduce(
      (stats, rental) => {
        stats.totalRentals += 1;
        if (rental.status === 'active') stats.active += 1;
        if (rental.status === 'overdue') stats.overdue += 1;
        stats.totalRevenue += rental.totalAmount || 0;
        return stats;
      },
      { active: 0, overdue: 0, totalRevenue: 0, totalRentals: 0 } as RentalStats,
    );
  }, [rentals]);

  const refetch = useCallback(() => {
    fetchRentals();
  }, [fetchRentals]);

  return {
    rentals,
    isLoading,
    error,
    refetch,
    updateFilters,
    getRentalStats,
  };
}

