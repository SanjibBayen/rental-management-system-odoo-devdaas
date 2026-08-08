export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  pricePerDay: number; // legacy frontend alias for daily_rate
  rating: number;
  reviewsCount: number;
  image: string; // legacy frontend alias for images[0]
  badge?: {
    text: string;
    type: 'success' | 'warning' | 'info' | 'default';
  };
  
  // API Matches
  description?: string;
  sku?: string;
  daily_rate?: number;
  deposit_amount?: number;
  stock_quantity?: number;
  is_active?: boolean;
  images?: string[];
}
