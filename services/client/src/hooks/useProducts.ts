import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../services/api";
import { Product } from "../types";

interface PaginationData {
  page: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
  limit: number;
}

interface FilterOptions {
  categories: string[];
  brands: string[];
  duration: string;
  maxPrice: number;
  minPrice: number;
  search: string;
  sortBy: "recommended" | "price_asc" | "price_desc" | "rating" | "newest";
  inStock: boolean | null;
  rating: number | null;
}

interface CategoryCount {
  [key: string]: number;
}

interface BrandCount {
  [key: string]: number;
}

interface PriceRange {
  min: number;
  max: number;
}

const DEFAULT_FILTERS: FilterOptions = {
  categories: [],
  brands: [],
  duration: "day",
  maxPrice: 500,
  minPrice: 0,
  search: "",
  sortBy: "recommended",
  inStock: null,
  rating: null,
};

const DEFAULT_PAGINATION: PaginationData = {
  page: 1,
  totalPages: 0,
  total: 0,
  from: 0,
  to: 0,
  limit: 12,
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount>({});
  const [brandCounts, setBrandCounts] = useState<BrandCount>({});
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 500 });
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<PaginationData>(DEFAULT_PAGINATION);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const previousFiltersRef = useRef<string>("");

  const buildQueryParams = useCallback(
    (filters: FilterOptions, page: number, limit: number) => {
      const params: Record<string, string | number | boolean> = {
        page,
        limit,
        sortBy: filters.sortBy,
        duration: filters.duration,
      };

      if (filters.categories.length > 0) {
        params.categories = filters.categories.join(",");
      }
      if (filters.brands.length > 0) {
        params.brands = filters.brands.join(",");
      }
      if (filters.maxPrice < priceRange.max) {
        params.maxPrice = filters.maxPrice;
      }
      if (filters.minPrice > priceRange.min) {
        params.minPrice = filters.minPrice;
      }
      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.inStock !== null) {
        params.inStock = filters.inStock;
      }
      if (filters.rating !== null) {
        params.rating = filters.rating;
      }

      return params;
    },
    [priceRange],
  );

  const fetchProducts = useCallback(
    async (page: number = 1, append: boolean = false) => {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        if (append) {
          setIsFetchingMore(true);
        } else {
          setIsLoading(true);
        }

        const params = buildQueryParams(activeFilters, page, pagination.limit);
        const response = await api.get("/products", {
          params,
          signal: abortController.signal,
        });

        const responseData = response.data.data || response.data;
        const productsData = responseData.products || responseData.items || responseData;
        const paginationData = responseData.pagination || response.data.pagination || {};

        const transformedProducts = Array.isArray(productsData)
          ? productsData.map((product: any) => ({
              ...product,
              pricePerDay: product.pricePerDay || product.price_per_day || product.daily_rate || 0,
              reviewsCount: product.reviewsCount || product.reviews_count || product.review_count || 0,
              image: product.image || product.thumbnail || product.image_url || "",
            }))
          : [];

        if (append) {
          setProducts((prev) => [...prev, ...transformedProducts]);
        } else {
          setProducts(transformedProducts);
        }

        setPagination({
          page: paginationData.page || page,
          totalPages: paginationData.totalPages || Math.ceil((paginationData.total || 0) / pagination.limit),
          total: paginationData.total || 0,
          from: paginationData.from || (page - 1) * pagination.limit + 1,
          to: paginationData.to || Math.min(page * pagination.limit, paginationData.total || 0),
          limit: paginationData.limit || pagination.limit,
        });

        setError(null);
      } catch (err: any) {
        if (err?.name === "AbortError" || err?.code === "ERR_CANCELED") {
          return;
        }
        setError(err instanceof Error ? err : new Error("Failed to fetch products"));
        if (page === 1) {
          setProducts([]);
        }
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    },
    [activeFilters, pagination.limit, buildQueryParams],
  );

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get("/products/categories");
      const data = response.data.data || response.data;
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data.categories && data.counts) {
        setCategories(data.categories);
        setCategoryCounts(data.counts);
      } else {
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      const response = await api.get("/products/brands");
      const data = response.data.data || response.data;
      if (Array.isArray(data)) {
        setBrands(data);
      } else if (data.brands && data.counts) {
        setBrands(data.brands);
        setBrandCounts(data.counts);
      } else {
        setBrands(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch brands:", err);
    }
  }, []);

  const fetchPriceRange = useCallback(async () => {
    try {
      const response = await api.get("/products/price-range");
      const data = response.data.data || response.data;
      if (data) {
        const range = { min: data.min || 0, max: data.max || 500 };
        setPriceRange(range);
        setActiveFilters((prev) => ({
          ...prev,
          maxPrice: Math.min(prev.maxPrice, range.max),
          minPrice: Math.max(prev.minPrice, range.min),
        }));
      }
    } catch (err) {
      console.error("Failed to fetch price range:", err);
    }
  }, []);

  const filterProducts = useCallback((newFilters: Partial<FilterOptions>) => {
    setActiveFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      setPagination((prevP) => ({ ...prevP, page: 1 }));
      return updated;
    });
  }, []);

  useEffect(() => {
    const filtersString = JSON.stringify(activeFilters);
    if (filtersString === previousFiltersRef.current) return;
    previousFiltersRef.current = filtersString;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchProducts(1);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [activeFilters, fetchProducts]);

  const changePage = useCallback(
    (page: number) => {
      setPagination((prev) => ({ ...prev, page }));
      fetchProducts(page);
    },
    [fetchProducts],
  );

  const loadMore = useCallback(() => {
    if (!isFetchingMore && pagination.page < pagination.totalPages) {
      const nextPage = pagination.page + 1;
      setPagination((prev) => ({ ...prev, page: nextPage }));
      fetchProducts(nextPage, true);
    }
  }, [isFetchingMore, pagination.page, pagination.totalPages, fetchProducts]);

  const fetchProductById = useCallback(async (productId: string) => {
    try {
      const response = await api.get(`/products/${productId}`);
      const product = response.data.data || response.data;
      return {
        ...product,
        pricePerDay: product.pricePerDay || product.price_per_day || 0,
        reviewsCount: product.reviewsCount || product.reviews_count || 0,
        image: product.image || product.thumbnail || "",
      } as Product;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to fetch product");
    }
  }, []);

  const searchProducts = useCallback((query: string) => {
    filterProducts({ search: query });
  }, [filterProducts]);

  const clearAllFilters = useCallback(() => {
    setActiveFilters((prev) => ({
      ...DEFAULT_FILTERS,
      maxPrice: priceRange.max,
      minPrice: priceRange.min,
    }));
  }, [priceRange]);

  const setCategory = useCallback(
    (categoryName: string | null) => {
      if (categoryName) {
        filterProducts({ categories: [categoryName] });
      } else {
        filterProducts({ categories: [] });
      }
    },
    [filterProducts],
  );

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchPriceRange();
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchCategories, fetchBrands, fetchPriceRange]);

  return {
    products,
    category: activeFilters.categories[0] || null,
    categories,
    brands,
    categoryCounts,
    brandCounts,
    priceRange,
    selectedProduct,
    isLoading,
    isFetchingMore,
    error,
    pagination,
    activeFilters,
    filterProducts,
    clearAllFilters,
    changePage,
    loadMore,
    searchProducts,
    fetchProductById,
    setCategory,
    refetch: () => fetchProducts(1),
    hasMore: pagination.page < pagination.totalPages,
    isEmpty: !isLoading && products.length === 0,
    totalProducts: pagination.total,
  };
}