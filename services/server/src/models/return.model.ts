import { z } from 'zod';

export interface Return {
  id: string;
  rental_id: string;
  user_id: string;
  product_id: string;
  return_date: string;
  condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  damage_report?: string;
  missing_accessories?: string;
  inspected_by?: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const ReturnSchema = z.object({
  rental_id: z.string().uuid(),
  user_id: z.string().uuid(),
  product_id: z.string().uuid(),
  return_date: z.string().date(),
  condition: z.enum(['excellent', 'good', 'fair', 'poor', 'damaged']).optional(),
  damage_report: z.string().optional(),
  missing_accessories: z.string().optional(),
  inspected_by: z.string().uuid().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  notes: z.string().optional()
});