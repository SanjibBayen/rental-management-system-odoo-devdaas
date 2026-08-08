import { query, queryOne } from '../config/database';

export class BaseRepository {
  protected table: string;

  constructor(table: string) {
    this.table = table;
  }

  async getAll(): Promise<any[]> {
    return query(`SELECT * FROM ${this.table}`);
  }

  async getById(id: string): Promise<any | null> {
    return queryOne(`SELECT * FROM ${this.table} WHERE id = $1`, [id]);
  }

  async create(data: Record<string, any>): Promise<any> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const columns = keys.join(', ');

    const result = await queryOne(
      `INSERT INTO ${this.table} (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return result;
  }

  async update(id: string, data: Record<string, any>): Promise<any> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

    const result = await queryOne(
      `UPDATE ${this.table} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );
    return result;
  }

  async delete(id: string): Promise<void> {
    await query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);
  }
}
