import { BaseService } from './base.service';
import { supabase } from '../config/database';

export class RentalService extends BaseService {
  constructor() {
    super('rentals');
  }

  async getActiveRentals() {
    const { data, error } = await supabase
      .from('rentals')
      .select('*, products(name)')
      .eq('status', 'active');
    if (error) throw error;
    return data;
  }

  async getOverdueRentals() {
    const { data, error } = await supabase
      .from('rentals')
      .select('*, products(name)')
      .eq('status', 'overdue');
    if (error) throw error;
    return data;
  }

  async findByUser(userId: string) {
    const { data, error } = await supabase
      .from('rentals')
      .select('*, products(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async returnRental(id: string, returnDate: Date) {
    const { data: rental } = await supabase
      .from('rentals')
      .select('*')
      .eq('id', id)
      .single();

    if (!rental) {
      throw new Error('Rental not found');
    }

    const dueDate = new Date(rental.end_date);
    const daysLate = Math.max(0, Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    const lateFee = daysLate * 10;
    const refund = Math.max(0, rental.deposit_amount - lateFee);

    const { data, error } = await supabase
      .from('rentals')
      .update({
        actual_return_date: returnDate.toISOString(),
        status: 'returned',
        late_fee: lateFee,
        refund_amount: refund
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getTotalRevenue(): Promise<number> {
    const { data, error } = await supabase
      .from('payments')
      .select('amount')
      .eq('payment_type', 'rental_fee')
      .eq('status', 'completed');

    if (error) throw error;
    return data.reduce((sum, p) => sum + Number(p.amount), 0);
  }

  async getRecentRentals(limit: number = 10) {
    const { data, error } = await supabase
      .from('rentals')
      .select('*, products(name), user_profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async getRevenueByMonth() {
    const { data, error } = await supabase
      .from('payments')
      .select('amount, created_at')
      .eq('payment_type', 'rental_fee')
      .eq('status', 'completed');

    if (error) throw error;

    const monthly: Record<string, number> = {};
    data.forEach((p) => {
      const month = new Date(p.created_at).toISOString().slice(0, 7);
      monthly[month] = (monthly[month] || 0) + Number(p.amount);
    });

    return Object.entries(monthly).map(([month, revenue]) => ({
      month,
      revenue
    }));
  }
}