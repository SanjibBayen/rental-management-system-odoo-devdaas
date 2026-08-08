import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { useAuth } from "./useAuth";

export interface Rental {
  id: string;
  rental_number: string;
  product_name: string;
  product_image?: string;
  product_id?: string;
  customer_name?: string;
  start_date: string;
  end_date: string;
  actual_return_date?: string;
  status: "pending" | "active" | "overdue" | "returned" | "cancelled";
  total_amount: number;
  deposit_amount: number;
  late_fee?: number;
  refund_amount?: number;
}

interface UseRentalsOptions {
  view?: "all" | "active" | "overdue" | "user" | "recent";
  limit?: number;
}

export function useRentals(options: UseRentalsOptions = {}) {
  const { view = "user", limit = 10 } = options;
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchRentals = useCallback(async () => {
    try {
      setIsLoading(true);
      let endpoint = "/rentals";

      if (view === "active") endpoint = "/rentals/active";
      else if (view === "overdue") endpoint = "/rentals/overdue";
      else if (view === "user") endpoint = "/rentals/user";
      else if (view === "recent") endpoint = "/rentals/recent";

      const response = await api.get(endpoint);
      setRentals(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch rentals"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [view]);

  const returnRental = async (rentalId: string, returnDate: string) => {
    try {
      const response = await api.put(`/rentals/${rentalId}/return`, {
        returnDate,
      });
      await fetchRentals();
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to return rental");
    }
  };

  const confirmPayment = async (rentalId: string, paymentId: string) => {
    try {
      const response = await api.put(`/rentals/${rentalId}/payment-confirm`, {
        payment_id: paymentId,
        status: "completed",
      });
      await fetchRentals();
      return response.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to confirm payment");
    }
  };

  const getInvoice = async (rentalId: string) => {
    try {
      const response = await api.get(`/rentals/${rentalId}/invoice`);
      return response.data.data;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to fetch invoice");
    }
  };

  useEffect(() => {
    if (user) {
      fetchRentals();
    } else {
      setRentals([]);
      setIsLoading(false);
    }
  }, [user, view, fetchRentals]);

  return {
    rentals,
    isLoading,
    error,
    refetch: fetchRentals,
    returnRental,
    confirmPayment,
    getInvoice,
  };
}
