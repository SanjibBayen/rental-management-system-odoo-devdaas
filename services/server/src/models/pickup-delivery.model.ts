import { z } from 'zod';

export interface PickupDelivery {
  id: string;
  rental_id: string;
  type: 'pickup' | 'delivery' | 'return';
  scheduled_date: string;
  actual_date?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  contact_name?: string;
  contact_phone?: string;
  status: 'scheduled' | 'in_transit' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const PickupDeliverySchema = z.object({
  rental_id: z.string().uuid(),
  type: z.enum(['pickup', 'delivery', 'return']),
  scheduled_date: z.string().datetime(),
  address_line1: z.string().max(255).optional(),
  address_line2: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  postal_code: z.string().max(20).optional(),
  country: z.string().max(100).optional(),
  contact_name: z.string().max(100).optional(),
  contact_phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  status: z.enum(['scheduled', 'in_transit', 'completed', 'cancelled']).default('scheduled'),
  notes: z.string().optional()
});