import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Product } from '../types';

interface PaginationData {
  page: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
}

interface FilterOptions {
  categories: string[];
  brands: string[];
  duration: string;
  maxPrice: number;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    totalPages: 0,
    total: 0,
    from: 0,
    to: 0,
  });
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    categories: [],
    brands: [],
    duration: 'day',
    maxPrice: 500,
  });
  const [category, setCategory] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: pagination.page,
        ...(activeFilters.categories.length > 0 && { category: activeFilters.categories.join(',') }),
        ...(activeFilters.brands.length > 0 && { brand: activeFilters.brands.join(',') }),
        ...(activeFilters.maxPrice < 500 && { maxPrice: activeFilters.maxPrice }),
      };

      const response = await api.get('/products', { params });
      
      setProducts(response.data.data || []);
      setPagination({
        page: response.data.page || 1,
        totalPages: response.data.totalPages || 1,
        total: response.data.total || 0,
        from: response.data.from || 0,
        to: response.data.to || 0,
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, activeFilters]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/products/categories');
      setCategories(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      const response = await api.get('/products/brands');
      setBrands(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch brands:', err);
    }
  }, []);

  const filterProducts = useCallback((filters: Partial<FilterOptions>) => {
    setActiveFilters(prev => ({ ...prev, ...filters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const changePage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const setProductsCategory = useCallback((categoryName: string | null) => {
    setCategory(categoryName);
    if (categoryName) {
      filterProducts({ categories: [categoryName] });
    } else {
      filterProducts({ categories: [] });
    }
  }, [filterProducts]);

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Load categories and brands once
  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  return {
    products,
    categories,
    brands,
    isLoading,
    error,
    pagination,
    activeFilters,
    category,
    filterProducts,
    changePage,
    setCategory: setProductsCategory,
    refetch: fetchProducts,
  };
}