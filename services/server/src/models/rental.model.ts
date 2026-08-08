import { z } from 'zod';

export interface Rental {
  id: string;
  rental_number: string;
  user_id: string;
  product_id: string;
  pricelist_id?: string;
  start_date: string;
  end_date: string;
  actual_return_date?: string;
  status: 'pending' | 'active' | 'overdue' | 'returned' | 'cancelled';
  total_amount: number;
  deposit_amount: number;
  late_fee: number;
  refund_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const RentalSchema = z.object({
  user_id: z.string().uuid(),
  product_id: z.string().uuid(),
  pricelist_id: z.string().uuid().optional(),
  start_date: z.string().date(),
  end_date: z.string().date(),
  total_amount: z.number().positive(),
  deposit_amount: z.number().positive(),
  notes: z.string().optional(),
  created_by: z.string().uuid().optional()
}).refine((data) => new Date(data.end_date) > new Date(data.start_date), {
  message: 'End date must be after start date',
  path: ['end_date']
});