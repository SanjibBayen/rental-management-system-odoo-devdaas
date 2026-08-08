export type Role = 'admin' | 'customer' | 'delivery';

export type Permission = 
  | 'manage_users'
  | 'manage_inventory'
  | 'view_all_rentals'
  | 'manage_own_rentals'
  | 'view_assigned_deliveries'
  | 'update_delivery_status';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
  avatar?: string;
  phone?: string;
  address?: UserAddress;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  role?: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}