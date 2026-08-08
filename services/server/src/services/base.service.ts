import { supabase } from '../config/database';

export class BaseService {
  protected table: string;

  constructor(table: string) {
    this.table = table;
  }

  async findAll() {
    const { data, error } = await supabase
      .from(this.table)
      .select('*');
    if (error) throw error;
    return data;
  }

  async findById(id: string) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async create(data: any) {
    const { data: result, error } = await supabase
      .from(this.table)
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  }

  async update(id: string, data: any) {
    const { data: result, error } = await supabase
      .from(this.table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
}