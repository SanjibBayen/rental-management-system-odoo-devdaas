import { pool, query, queryOne } from '../config/database';

export class QuotationService {
  async createQuotation(data: any) {
    const quotationNumber = `Q-${Date.now()}`;
    return queryOne(`
      INSERT INTO quotations (
        quotation_number, 
        customer_name, 
        customer_email, 
        customer_phone,
        product_id,
        start_date,
        end_date,
        total_amount,
        deposit_amount,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'draft')
      RETURNING *
    `, [
      quotationNumber,
      data.customer_name,
      data.customer_email,
      data.customer_phone,
      data.product_id,
      data.start_date,
      data.end_date,
      data.total_amount,
      data.deposit_amount
    ]);
  }

  async getQuotationById(id: string) {
    return queryOne(`
      SELECT q.*, 
             p.name as product_name,
             p.daily_rate
      FROM quotations q
      JOIN products p ON q.product_id = p.id
      WHERE q.id = $1
    `, [id]);
  }

  async convertToRental(id: string, rentalData: any) {
    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Get quotation
      const quotation = await client.query(
        `SELECT * FROM quotations WHERE id = $1 AND status = 'draft'`,
        [id]
      );
      if (!quotation.rows[0]) {
        throw new Error('Quotation not found or already converted');
      }

      // Create rental
      const rentalNumber = `RENT-${Date.now()}`;
      const rental = await client.query(`
        INSERT INTO rentals (
          rental_number, 
          user_id, 
          product_id, 
          start_date, 
          end_date, 
          total_amount, 
          deposit_amount,
          status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
        RETURNING *
      `, [
        rentalNumber,
        rentalData.user_id,
        quotation.rows[0].product_id,
        quotation.rows[0].start_date,
        quotation.rows[0].end_date,
        quotation.rows[0].total_amount,
        quotation.rows[0].deposit_amount
      ]);

      // Mark quotation as converted
      await client.query(
        `UPDATE quotations SET status = 'converted' WHERE id = $1`,
        [id]
      );

      await client.query('COMMIT');
      return rental.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}