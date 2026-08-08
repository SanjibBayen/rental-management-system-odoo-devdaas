import { z } from 'zod';

export interface SecurityDeposit {
  id: string;
  rental_id: string;
  user_id: string;
  amount: number;
  status: 'held' | 'refunded' | 'deducted' | 'partial_refund';
  refund_amount: number;
  deduction_amount: number;
  deduction_reason?: string;
  refund_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const SecurityDepositSchema = z.object({
  rental_id: z.string().uuid(),
  user_id: z.string().uuid(),
  amount: z.number().positive(),
  status: z.enum(['held', 'refunded', 'deducted', 'partial_refund']).default('held'),
  deduction_reason: z.string().optional(),
  notes: z.string().optional()
});