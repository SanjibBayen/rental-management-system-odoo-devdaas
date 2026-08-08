export interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  brand?: string;
  category?: string;
  image?: string;
  pricePerDay: number;
  depositAmount: number;
  stockQuantity: number;
  availableQuantity: number;
  rating: number;
  reviewsCount: number;
  minRentalDays?: number;
  maxRentalDays?: number;
  tags?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  badge?: {
    text: string;
    type: 'success' | 'info' | 'warning' | 'default';
  };
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