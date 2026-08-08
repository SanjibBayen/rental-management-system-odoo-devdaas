import { query, queryOne } from '../config/database';
import { redis } from '../config/redis';

export class RentalService {

  async getAll() {
    return query(`
      SELECT r.*, 
             p.name as product_name, 
             p.daily_rate, 
             u.full_name as customer_name
      FROM rentals r
      JOIN products p ON r.product_id = p.id
      JOIN user_profiles u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `);
  }


  async getById(id: string) {
    return queryOne(`
      SELECT r.*, 
             p.name as product_name, 
             p.daily_rate, 
             u.full_name as customer_name
      FROM rentals r
      JOIN products p ON r.product_id = p.id
      JOIN user_profiles u ON r.user_id = u.id
      WHERE r.id = $1
    `, [id]);
  }


  async create(data: any) {
    const rentalNumber = `RENT-${Date.now()}`;
    
    return queryOne(`
      INSERT INTO rentals (
        rental_number, user_id, product_id, 
        start_date, end_date, total_amount, deposit_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      rentalNumber,
      data.user_id,
      data.product_id,
      data.start_date,
      data.end_date,
      data.total_amount,
      data.deposit_amount
    ]);
  }

  
  async getActiveRentals() {
    return query(`
      SELECT r.*, 
             p.name as product_name, 
             u.full_name as customer_name
      FROM rentals r
      JOIN products p ON r.product_id = p.id
      JOIN user_profiles u ON r.user_id = u.id
      WHERE r.status = $1
      ORDER BY r.start_date ASC
    `, ['active']);
  }


  async getOverdueRentals() {
    return query(`
      SELECT r.*, 
             p.name as product_name, 
             u.full_name as customer_name
      FROM rentals r
      JOIN products p ON r.product_id = p.id
      JOIN user_profiles u ON r.user_id = u.id
      WHERE r.status = $1
      ORDER BY r.end_date ASC
    `, ['overdue']);
  }


  async findByUser(userId: string) {
    return query(`
      SELECT r.*, 
             p.name as product_name,
             p.daily_rate
      FROM rentals r
      JOIN products p ON r.product_id = p.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `, [userId]);
  }


  async returnRental(id: string, returnDate: Date) {
    // 1. Get rental + product details
    const rental = await queryOne(`
      SELECT r.*, 
             p.daily_rate, 
             p.deposit_amount
      FROM rentals r
      JOIN products p ON r.product_id = p.id
      WHERE r.id = $1
    `, [id]);

    if (!rental) {
      throw new Error('Rental not found');
    }

    // 2. Calculate late fee
    const dueDate = new Date(rental.end_date);
    const returnDateObj = new Date(returnDate);
    const daysLate = Math.max(0, Math.ceil(
      (returnDateObj.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
    ));
    const lateFee = daysLate * (rental.daily_rate || 10);
    const refund = Math.max(0, rental.deposit_amount - lateFee);

    // 3. Update rental
    const updated = await queryOne(`
      UPDATE rentals 
      SET actual_return_date = $1, 
          status = 'returned', 
          late_fee = $2, 
          refund_amount = $3
      WHERE id = $4
      RETURNING *
    `, [returnDate.toISOString(), lateFee, refund, id]);

    // 4. Cache invalidation
    await redis.del('dashboard_stats');

    return updated;
  }


  async getTotalRevenue(): Promise<number> {
    const result = await queryOne(`
      SELECT SUM(amount) as total
      FROM payments
      WHERE payment_type = $1 AND status = $2
    `, ['rental_fee', 'completed']);

    return parseFloat(result?.total || 0);
  }


  async getRecentRentals(limit: number = 10) {
    return query(`
      SELECT r.*, 
             p.name as product_name, 
             u.full_name as customer_name
      FROM rentals r
      JOIN products p ON r.product_id = p.id
      JOIN user_profiles u ON r.user_id = u.id
      ORDER BY r.created_at DESC
      LIMIT $1
    `, [limit]);
  }


  async getRevenueByMonth() {
    const results = await query(`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month,
        SUM(amount) as revenue
      FROM payments
      WHERE payment_type = $1 AND status = $2
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month DESC
    `, ['rental_fee', 'completed']);

    return results;
  }

  
  async getDashboardStats() {
    // Try Redis cache first
    const cached = await redis.get('dashboard_stats');
    if (cached) {
      return JSON.parse(cached);
    }

    // Raw SQL queries
    const active = await queryOne(
      'SELECT COUNT(*) as count FROM rentals WHERE status = $1',
      ['active']
    );
    const overdue = await queryOne(
      'SELECT COUNT(*) as count FROM rentals WHERE status = $1',
      ['overdue']
    );
    const revenue = await queryOne(
      'SELECT SUM(amount) as total FROM payments WHERE status = $1',
      ['completed']
    );
    const products = await queryOne(
      'SELECT COUNT(*) as count FROM products WHERE is_active = true'
    );

    const stats = {
      activeRentals: parseInt(active?.count || 0),
      overdueRentals: parseInt(overdue?.count || 0),
      totalProducts: parseInt(products?.count || 0),
      totalRevenue: parseFloat(revenue?.total || 0)
    };

    await redis.setex('dashboard_stats', 60, JSON.stringify(stats));

    return stats;
  }

  async getInvoiceById(id: string) {
    const invoice = await queryOne(`
      SELECT r.*, 
             p.name as product_name, 
             p.daily_rate, 
             u.full_name as customer_name, 
             u.email as customer_email
      FROM rentals r
      JOIN products p ON r.product_id = p.id
      JOIN user_profiles u ON r.user_id = u.id
      WHERE r.id = $1
    `, [id]);
    return invoice;
  }
  

}