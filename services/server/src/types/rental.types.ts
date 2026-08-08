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

export interface RentalWithProduct extends Rental {
  products: {
    name: string;
    sku?: string;
    category?: string;
    daily_rate: number;
    deposit_amount: number;
  };
}

export interface RentalWithUser extends Rental {
  user_profiles: {
    full_name: string;
    email: string;
    phone?: string;
  };
}

export interface CreateRentalInput {
  user_id: string;
  product_id: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  deposit_amount: number;
  notes?: string;
}

export interface ReturnRentalInput {
  returnDate: string;
  condition?: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  damage_report?: string;
}

export interface RentalStats {
  activeRentals: number;
  overdueRentals: number;
  totalRentals: number;
  totalRevenue: number;
  totalDeposits: number;
  lateFeeCollected: number;
}

export interface RentalSummary {
  rental_number: string;
  product_name: string;
  customer_name: string;
  start_date: string;
  end_date: string;
  status: string;
  total_amount: number;
  deposit_amount: number;
  late_fee: number;
}