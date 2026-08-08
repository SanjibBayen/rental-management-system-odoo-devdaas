import { z } from 'zod';

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  category?: string;
  brand?: string;
  model?: string;
  color?: string;
  size?: string;
  daily_rate: number;
  deposit_amount: number;
  stock_quantity: number;
  available_quantity: number;
  min_rental_days: number;
  max_rental_days: number;
  images?: string[];
  tags?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const ProductSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().optional(),
  sku: z.string().max(50).optional(),
  category: z.string().max(100).optional(),
  brand: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  color: z.string().max(50).optional(),
  size: z.string().max(50).optional(),
  daily_rate: z.number().positive(),
  deposit_amount: z.number().positive(),
  stock_quantity: z.number().int().min(0).default(0),
  available_quantity: z.number().int().min(0).default(0),
  min_rental_days: z.number().int().min(1).default(1),
  max_rental_days: z.number().int().min(1).default(30),
  images: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
  is_active: z.boolean().default(true),
  created_by: z.string().uuid().optional()
});