import { z } from 'zod';

export interface Payment {
  id: string;
  rental_id: string;
  user_id: string;
  amount: number;
  payment_type: 'deposit' | 'rental_fee' | 'late_fee' | 'refund';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method?: string;
  transaction_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const PaymentSchema = z.object({
  rental_id: z.string().uuid(),
  user_id: z.string().uuid(),
  amount: z.number().positive(),
  payment_type: z.enum(['deposit', 'rental_fee', 'late_fee', 'refund']),
  payment_method: z.string().optional(),
  transaction_id: z.string().optional(),
  notes: z.string().optional()
});