import { query, queryOne } from '../config/database';

export class PickupService {
  async getTodayPickups() {
    const today = new Date().toISOString().split('T')[0];
    return query(`
      SELECT pd.*, 
             r.rental_number,
             u.full_name as customer_name,
             p.name as product_name
      FROM pickup_deliveries pd
      JOIN rentals r ON pd.rental_id = r.id
      JOIN user_profiles u ON r.user_id = u.id
      JOIN products p ON r.product_id = p.id
      WHERE pd.type = $1 
        AND DATE(pd.scheduled_date) = $2
        AND pd.status = 'scheduled'
      ORDER BY pd.scheduled_date ASC
    `, ['pickup', today]);
  }

  async getPickupById(id: string) {
    return queryOne(`
      SELECT pd.*, 
             r.rental_number,
             u.full_name as customer_name,
             p.name as product_name
      FROM pickup_deliveries pd
      JOIN rentals r ON pd.rental_id = r.id
      JOIN user_profiles u ON r.user_id = u.id
      JOIN products p ON r.product_id = p.id
      WHERE pd.id = $1
    `, [id]);
  }

  async confirmPickup(id: string, notes?: string) {
    return queryOne(`
      UPDATE pickup_deliveries
      SET status = 'completed', 
          actual_date = NOW(),
          notes = COALESCE($1, notes)
      WHERE id = $2
      RETURNING *
    `, [notes || null, id]);
  }
}