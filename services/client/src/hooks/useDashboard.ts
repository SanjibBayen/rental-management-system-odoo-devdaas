import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../services/api";

// Export types for use in other components
export interface DashboardStats {
  activeRentals: number;
  overdueRentals: number;
  totalProducts: number;
  totalRevenue: number;
  recentRentals: Rental[];
  revenueByPeriod?: RevenueData[];
  rentalsByStatus?: RentalStatusData[];
  topProducts?: TopProduct[];
  customerGrowth?: number;
  revenueGrowth?: number;
}

export interface Rental {
  id: string;
  productName: string;
  customerName: string;
  startDate: string;
  endDate: string;
  status: "active" | "overdue" | "completed" | "pending";
  amount: number;
}

export interface RevenueData {
  period: string;
  amount: number;
}

export interface RentalStatusData {
  status: string;
  count: number;
}

export interface TopProduct {
  id: string;
  name: string;
  rentalCount: number;
  revenue: number;
}

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  retryCount: number;
}

interface UseDashboardOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  dateRange?: DateRange;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const DEFAULT_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useDashboard(options: UseDashboardOptions = {}) {
  const {
    autoRefresh = true,
    refreshInterval = DEFAULT_REFRESH_INTERVAL,
    dateRange,
  } = options;

  const [state, setState] = useState<DashboardState>({
    stats: null,
    isLoading: true,
    isRefreshing: false,
    error: null,
    lastUpdated: null,
    retryCount: 0,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
<<<<<<< HEAD
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
=======
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
>>>>>>> bf3bf601e0c49d74f74dedbdf4e75f59be11a47d

  // Transform raw API data to frontend format
  const transformDashboardData = (data: any): DashboardStats => {
    return {
      activeRentals: data.activeRentals || data.active_rentals || 0,
      overdueRentals: data.overdueRentals || data.overdue_rentals || 0,
      totalProducts: data.totalProducts || data.total_products || 0,
      totalRevenue: data.totalRevenue || data.total_revenue || 0,
      recentRentals: (data.recentRentals || data.recent_rentals || []).map(
        (rental: any) => ({
          id: rental.id,
          productName:
            rental.productName || rental.product_name || "Unknown Product",
          customerName:
            rental.customerName || rental.customer_name || "Unknown Customer",
          startDate: rental.startDate || rental.start_date,
          endDate: rental.endDate || rental.end_date,
          status: rental.status || "pending",
          amount: rental.amount || 0,
        }),
      ),
      revenueByPeriod: data.revenueByPeriod || data.revenue_by_period,
      rentalsByStatus: data.rentalsByStatus || data.rentals_by_status,
      topProducts: data.topProducts || data.top_products,
      customerGrowth: data.customerGrowth || data.customer_growth,
      revenueGrowth: data.revenueGrowth || data.revenue_growth,
    };
  };

  // Fetch dashboard stats
  const fetchStats = useCallback(
    async (isRefresh = false) => {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        setState((prev) => ({
          ...prev,
          isLoading: !isRefresh && !prev.stats,
          isRefreshing: isRefresh && !!prev.stats,
          error: null,
        }));

        // Build query parameters
        const params: Record<string, string> = {};
        if (dateRange?.startDate) {
          params.startDate = dateRange.startDate;
        }
        if (dateRange?.endDate) {
          params.endDate = dateRange.endDate;
        }

        const response = await api.get("/dashboard", {
          params,
          signal: abortController.signal,
        });

        const rawData = response.data.data || response.data;
        const transformedStats = transformDashboardData(rawData);

        setState({
          stats: transformedStats,
          isLoading: false,
          isRefreshing: false,
          error: null,
          lastUpdated: new Date(),
          retryCount: 0,
        });

        // Clear retry timeout on success
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }
      } catch (err: any) {
        // Don't update state if request was cancelled
        if (err?.name === "AbortError" || err?.code === "ERR_CANCELED") {
          return;
        }

        const error =
          err instanceof Error
            ? err
            : new Error("Failed to fetch dashboard stats");

        setState((prev) => ({
          ...prev,
          isLoading: false,
          isRefreshing: false,
          error,
          // Keep existing stats if refreshing
          stats: isRefresh ? prev.stats : prev.stats,
          retryCount: prev.retryCount + 1,
        }));

        // Retry logic for failed requests
        if (state.retryCount < MAX_RETRIES) {
          retryTimeoutRef.current = setTimeout(
            () => {
              fetchStats(isRefresh);
            },
            RETRY_DELAY * Math.pow(2, state.retryCount),
          ); // Exponential backoff
        }
      }
    },
    [dateRange, state.retryCount],
  );

  // Initial fetch
  useEffect(() => {
    fetchStats();

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [fetchStats]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) return;

    refreshIntervalRef.current = setInterval(() => {
      fetchStats(true);
    }, refreshInterval);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, fetchStats]);

  // Refetch when date range changes
  useEffect(() => {
    fetchStats();
  }, [dateRange?.startDate, dateRange?.endDate]);

  // Manual refresh function
  const refetch = useCallback(() => {
    fetchStats(true);
  }, [fetchStats]);

  // Calculate derived statistics
  const activeRentalsPercentage = state.stats
    ? Math.round(
        (state.stats.activeRentals / (state.stats.totalProducts || 1)) * 100,
      )
    : 0;

  const overdueRate = state.stats
    ? state.stats.activeRentals > 0
      ? Math.round(
          (state.stats.overdueRentals / state.stats.activeRentals) * 100,
        )
      : 0
    : 0;

  const averageRentalValue = state.stats
    ? state.stats.activeRentals > 0
      ? Math.round(state.stats.totalRevenue / state.stats.activeRentals)
      : 0
    : 0;

  return {
    // Raw data
    stats: state.stats,
    isLoading: state.isLoading,
    isRefreshing: state.isRefreshing,
    error: state.error,
    lastUpdated: state.lastUpdated,
    retryCount: state.retryCount,

    // Actions
    refetch,

    // Derived statistics
    activeRentalsPercentage,
    overdueRate,
    averageRentalValue,

    // Sub-data for easier access
    recentRentals: state.stats?.recentRentals || [],
    revenueByPeriod: state.stats?.revenueByPeriod || [],
    rentalsByStatus: state.stats?.rentalsByStatus || [],
    topProducts: state.stats?.topProducts || [],

    // Convenience getters
    hasError: !!state.error,
    isRetrying: state.retryCount > 0 && !!state.error,
    maxRetriesReached: state.retryCount >= MAX_RETRIES,
  };
}
