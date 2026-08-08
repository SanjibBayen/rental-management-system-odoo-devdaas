import { z } from 'zod';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: 'admin' | 'customer' | 'delivery';
  email_verified: boolean;
  avatar_url?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export const UserProfileSchema = z.object({
  user_id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  role: z.enum(['admin', 'customer', 'delivery']).default('customer'),
  email_verified: z.boolean().default(false),
  avatar_url: z.string().url().optional(),
  address_line1: z.string().max(255).optional(),
  address_line2: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  postal_code: z.string().max(20).optional(),
  country: z.string().max(100).optional()
});