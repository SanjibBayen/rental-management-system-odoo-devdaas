export interface Product {
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
    type: 'success' | 'warning' | 'info' | 'default';
  };
}
