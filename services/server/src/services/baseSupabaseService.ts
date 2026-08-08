import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../config/database';
import { handleSupabaseQuery, handleSupabaseInsert, handleSupabaseDelete, handleSupabaseCount } from '../utils/supabaseHelpers';

export class BaseSupabaseService {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  protected async findOne(column: string, value: any): Promise<any> {
    return handleSupabaseQuery(
      supabase
        .from(this.tableName)
        .select('*')
        .eq(column, value)
        .single(),
      `Failed to find record in ${this.tableName}`
    );
  }

  protected async findMany(
    column: string,
    value: any,
    options?: {
      limit?: number;
      offset?: number;
      orderBy?: string;
      ascending?: boolean;
    }
  ): Promise<any[]> {
    let query = supabase
      .from(this.tableName)
      .select('*')
      .eq(column, value);

    if (options?.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options.ascending ?? true
      });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    return handleSupabaseQuery(
      query,
      `Failed to find records in ${this.tableName}`
    );
  }

  protected async findAll(options?: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    ascending?: boolean;
    filter?: Record<string, any>;
  }): Promise<any[]> {
    let query = supabase
      .from(this.tableName)
      .select('*');

    if (options?.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options.ascending ?? true
      });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    return handleSupabaseQuery(
      query,
      `Failed to find records in ${this.tableName}`
    );
  }

  protected async findById(id: string): Promise<any> {
    return this.findOne('id', id);
  }

  protected async create(data: Record<string, any>): Promise<any> {
    return handleSupabaseInsert(
      supabase
        .from(this.tableName)
        .insert(data)
        .select()
        .single(),
      `Failed to create record in ${this.tableName}`
    );
  }

  protected async createMany(data: Record<string, any>[]): Promise<any[]> {
    return handleSupabaseInsert(
      supabase
        .from(this.tableName)
        .insert(data)
        .select(),
      `Failed to create multiple records in ${this.tableName}`
    );
  }

  protected async update(id: string, data: Record<string, any>): Promise<any> {
    return handleSupabaseQuery(
      supabase
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single(),
      `Failed to update record in ${this.tableName}`
    );
  }

  protected async updateWhere(
    column: string,
    value: any,
    data: Record<string, any>
  ): Promise<any[]> {
    return handleSupabaseQuery(
      supabase
        .from(this.tableName)
        .update(data)
        .eq(column, value)
        .select(),
      `Failed to update records in ${this.tableName}`
    );
  }

  protected async delete(id: string): Promise<any> {
    return handleSupabaseDelete(
      supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)
        .select()
        .single(),
      `Failed to delete record in ${this.tableName}`
    );
  }

  protected async deleteWhere(column: string, value: any): Promise<any[]> {
    return handleSupabaseDelete(
      supabase
        .from(this.tableName)
        .delete()
        .eq(column, value)
        .select(),
      `Failed to delete records in ${this.tableName}`
    );
  }

  protected async count(filter?: Record<string, any>): Promise<number> {
    let query = supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true });

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    return handleSupabaseCount(
      query,
      `Failed to count records in ${this.tableName}`
    );
  }

  protected async upsert(data: Record<string, any>, onConflict?: string): Promise<any> {
    let query = supabase
      .from(this.tableName)
      .upsert(data, {
        onConflict: onConflict || 'id',
        ignoreDuplicates: false
      })
      .select();

    if (Array.isArray(data)) {
      return handleSupabaseQuery(
        query,
        `Failed to upsert multiple records in ${this.tableName}`
      );
    }

    return handleSupabaseQuery(
      query.single(),
      `Failed to upsert record in ${this.tableName}`
    );
  }
}