import { z } from 'zod';

export interface Invoice {
  id: string;
  invoice_number: string;
  rental_id: string;
  user_id: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const InvoiceSchema = z.object({
  rental_id: z.string().uuid(),
  user_id: z.string().uuid(),
  issue_date: z.string().date(),
  due_date: z.string().date(),
  subtotal: z.number().positive(),
  tax: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  total: z.number().positive(),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).default('draft'),
  notes: z.string().optional(),
});
