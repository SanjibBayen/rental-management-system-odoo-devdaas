import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './env';

class DatabaseConfig {
  private static instance: DatabaseConfig;
  private supabaseClient: SupabaseClient;
  private supabaseAdminClient: SupabaseClient;

  private constructor() {
    this.supabaseClient = createClient(
      String(config.supabase.url),
      String(config.supabase.anonKey)
    );

    this.supabaseAdminClient = createClient(
      String(config.supabase.url),
      String(config.supabase.serviceRoleKey)
    );
  }

  public static getInstance(): DatabaseConfig {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new DatabaseConfig();
    }
    return DatabaseConfig.instance;
  }

  public getClient(): SupabaseClient {
    return this.supabaseClient;
  }

  public getAdminClient(): SupabaseClient {
    return this.supabaseAdminClient;
  }

  public async testConnection(): Promise<boolean> {
    try {
      const { error } = await this.supabaseClient.from('users').select('id').limit(1);

      if (error) {
        console.error('Supabase connection test failed:', error.message);
        return false;
      }

      console.log('Supabase connection established successfully');
      return true;
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
  }
}

export const supabase = DatabaseConfig.getInstance().getClient();
export const supabaseAdmin = DatabaseConfig.getInstance().getAdminClient();
