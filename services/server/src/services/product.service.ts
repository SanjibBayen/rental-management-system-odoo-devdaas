import { BaseRepository } from '../repositories/base.repository';

export class ProductService {
  private repo: BaseRepository;

  constructor() {
    this.repo = new BaseRepository('products');
  }

  async getAll() {
    return this.repo.getAll();
  }

  async getById(id: string) {
    return this.repo.getById(id);
  }

  async create(data: any) {
    return this.repo.create(data);
  }

  async update(id: string, data: any) {
    return this.repo.update(id, data);
  }

  async delete(id: string) {
    await this.repo.delete(id);
  }

  async getByCategory(category: string) {
    return this.repo.getAll(); //  custom query later
  }
}
