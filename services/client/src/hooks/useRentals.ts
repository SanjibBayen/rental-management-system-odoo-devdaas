import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";

export interface RentalRecord {
  id: string;
  status: string;
  rental_number?: string;
  customer_name?: string;
  product_name?: string;
  product_image?: string;
  end_date?: string;
  total_amount?: number;
  totalAmount?: number;
  [key: string]: any;
}

interface UseRentalsOptions {
  view?: "user" | "recent" | "all";
  limit?: number;
}

interface UseRentalsFilters {
  status?: string;
}

export function useRentals(options: UseRentalsOptions = {}) {
  const { view = "user", limit = 10 } = options;
  const [rentals, setRentals] = useState<RentalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<UseRentalsFilters>({});

  const fetchRentals = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let endpoint = "/rentals";
      if (view === "user") {
        endpoint = "/rentals/user";
      } else if (view === "recent") {
        endpoint = "/dashboard/recent-rentals";
      }

      const response = await api.get(endpoint, {
        params: { ...filters, limit },
      });

      const payload = response.data?.data || response.data || [];
      const normalized = Array.isArray(payload)
        ? payload.map((item: any) => ({
            ...item,
            id: item.id || item.rental_id,
            rental_number: item.rental_number || item.rentalNumber,
            customer_name: item.customer_name || item.customerName,
            product_name: item.product_name || item.productName,
            product_image: item.product_image || item.productImage,
            end_date: item.end_date || item.endDate,
            total_amount: item.total_amount ?? item.totalAmount ?? 0,
            status: item.status || "pending",
          }))
        : [];

      setRentals(normalized);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load rentals"),
      );
      setRentals([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, limit, view]);

  useEffect(() => {
    void fetchRentals();
  }, [fetchRentals]);

  const refetch = useCallback(() => {
    void fetchRentals();
  }, [fetchRentals]);

  const updateFilters = useCallback((nextFilters: UseRentalsFilters) => {
    setFilters((prev) => ({ ...prev, ...nextFilters }));
  }, []);

  const returnRental = useCallback(
    async (rentalId: string) => {
      await api.put(`/rentals/${rentalId}/return`);
      await refetch();
    },
    [refetch],
  );

  const approveRental = useCallback(
    async (rentalId: string) => {
      await api.put(`/rentals/${rentalId}/approve`);
      await refetch();
    },
    [refetch],
  );

  const getRentalStats = useCallback(() => {
    const active = rentals.filter(
      (rental) => rental.status === "active",
    ).length;
    const totalRevenue = rentals.reduce(
      (sum, rental) => sum + (rental.total_amount ?? rental.totalAmount ?? 0),
      0,
    );

    return {
      active,
      totalRevenue,
    };
  }, [rentals]);

  return {
    rentals,
    isLoading,
    error,
    filters,
    refetch,
    updateFilters,
    returnRental,
    approveRental,
    getRentalStats,
  };
}
