import { BaseService } from './base.service';

export class ProductService extends BaseService {
  constructor() {
    super('products');
  }

  async getAvailableProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .gt('available_quantity', 0);
    if (error) throw error;
    return data;
  }
}