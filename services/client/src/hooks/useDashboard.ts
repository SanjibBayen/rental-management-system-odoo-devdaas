import { useState, useEffect } from 'react';
import { api } from '../services/api';

interface DashboardStats {
  activeRentals: number;
  overdueRentals: number;
  totalProducts: number;
  totalRevenue: number;
  recentRentals: any[];
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/dashboard');
      setStats(response.data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboard stats'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}