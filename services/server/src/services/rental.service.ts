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

  async returnRental(id: string, returnDate: Date) {
    const { data: rental } = await supabase
      .from('rentals')
      .select('*')
      .eq('id', id)
      .single();

    const dueDate = new Date(rental.end_date);
    const daysLate = Math.max(0, Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    const lateFee = daysLate * 10; // $10 per day
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
}