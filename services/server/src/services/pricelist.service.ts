import { BaseRepository } from '../repositories/base.repository';

export class PricelistService extends BaseRepository {
  constructor() {
    super('pricelists');
  }

  async getAll(): Promise<any[]> {
    return super.getAll();
  }

  async getById(id: string): Promise<any | null> {
    return super.getById(id);
  }

  async create(data: Record<string, any>): Promise<any> {
    return super.create(data);
  }

  async update(id: string, data: Record<string, any>): Promise<any> {
    return super.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return super.delete(id);
  }
}
