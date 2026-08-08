import { z } from 'zod';

export interface LateFee {
  id: string;
  rental_id: string;
  user_id: string;
  days_late: number;
  late_fee_per_day: number;
  total_fee: number;
  grace_period_days: number;
  status: 'pending' | 'paid' | 'waived' | 'deducted';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const LateFeeSchema = z.object({
  rental_id: z.string().uuid(),
  user_id: z.string().uuid(),
  days_late: z.number().int().min(0),
  late_fee_per_day: z.number().positive(),
  total_fee: z.number().positive(),
  grace_period_days: z.number().int().min(0).default(0),
  status: z.enum(['pending', 'paid', 'waived', 'deducted']).default('pending'),
  notes: z.string().optional()
});