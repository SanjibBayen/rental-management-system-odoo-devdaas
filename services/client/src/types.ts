export interface Product {
  // Frontend Display Fields
  id: string;
  name: string;
  brand: string;
  category: string;
  pricePerDay: number;
  rating: number;
  reviewsCount: number;
  image: string;
  badge?: {
    text: string;
    type: "success" | "warning" | "info" | "default";
  };

  description?: string;
  sku?: string;
  daily_rate?: number;
  deposit_amount?: number;
  stock_quantity?: number;
  is_active?: boolean;
  images?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  permissions?: string[];
}

// Add camelCase aliases to match frontend usage
export interface Product {
  depositAmount?: number;
  stockQuantity?: number;
}

export interface CreateProductData {
  name: string;
  description?: string;
  sku?: string;
  category?: string;
  brand?: string;
  pricePerDay: number;
  depositAmount: number;
  stockQuantity?: number;
  images?: string[];
}

export interface ProductFilters {
  categories: string[];
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  search?: string;
}

export interface ProductsResponse {
  data: Product[];
  page: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
}
