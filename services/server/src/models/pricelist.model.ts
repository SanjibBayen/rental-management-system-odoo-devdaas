import { z } from 'zod';

export interface Pricelist {
  id: string;
  name: string;
  description?: string;
  daily_rate: number;
  deposit_percentage: number;
  min_rental_days: number;
  max_rental_days: number;
  late_fee_per_day: number;
  is_active: boolean;
  valid_from?: string;
  valid_to?: string;
  created_at: string;
  updated_at: string;
}

export const PricelistSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  daily_rate: z.number().min(0),
  deposit_percentage: z.number().min(0).max(100).default(20),
  min_rental_days: z.number().int().min(1).default(1),
  max_rental_days: z.number().int().min(1).default(30),
  late_fee_per_day: z.number().min(0).default(10),
  is_active: z.boolean().default(true),
  valid_from: z.string().date().optional(),
  valid_to: z.string().date().optional()
});