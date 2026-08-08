import { query, queryOne } from '../config/database';

export class ReturnService {
  async getTodayReturns() {
    const today = new Date().toISOString().split('T')[0];
    return query(`
      SELECT ret.*, 
             r.rental_number,
             u.full_name as customer_name,
             p.name as product_name
      FROM returns ret
      JOIN rentals r ON ret.rental_id = r.id
      JOIN user_profiles u ON r.user_id = u.id
      JOIN products p ON r.product_id = p.id
      WHERE DATE(ret.return_date) = $1
        AND ret.status = 'pending'
      ORDER BY ret.return_date ASC
    `, [today]);
  }

  async getReturnById(id: string) {
    return queryOne(`
      SELECT ret.*, 
             r.rental_number,
             u.full_name as customer_name,
             p.name as product_name
      FROM returns ret
      JOIN rentals r ON ret.rental_id = r.id
      JOIN user_profiles u ON r.user_id = u.id
      JOIN products p ON r.product_id = p.id
      WHERE ret.id = $1
    `, [id]);
  }

  async inspectReturn(id: string, data: { condition?: string, damage_report?: string, missing_accessories?: string }) {
    return queryOne(`
      UPDATE returns
      SET condition = COALESCE($1, condition),
          damage_report = COALESCE($2, damage_report),
          missing_accessories = COALESCE($3, missing_accessories),
          updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `, [data.condition || null, data.damage_report || null, data.missing_accessories || null, id]);
  }

  async confirmReturn(id: string) {
    return queryOne(`
      UPDATE returns
      SET status = 'approved',
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id]);
  }
}