import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();

/**
 * Environment variable schema with validation
 * This ensures all required environment variables are present and correctly formatted
 */
const envSchema = z.object({
  // Application Configuration
  PORT: z
    .string()
    .default('5000')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val < 65536, {
      message: 'PORT must be a valid port number between 1 and 65535',
    }),

  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  JWT_SECRET: z
    .string()
    .min(10, 'JWT_SECRET must be at least 10 characters')
    .max(256, 'JWT_SECRET must be less than 256 characters'),

  JWT_EXPIRES_IN: z
    .string()
    .regex(/^(\d+[smhd])+$/, 'JWT_EXPIRES_IN must be in format like 7d, 24h, 60m, 60s')
    .default('7d'),

  // Supabase Configuration
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),

  SUPABASE_ANON_KEY: z.string().min(10, 'SUPABASE_ANON_KEY must be at least 10 characters'),

  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(10, 'SUPABASE_SERVICE_ROLE_KEY must be at least 10 characters'),

  // Redis Cloud Configuration (from your screenshot)
  REDIS_HOST: z.string().default('mint-jewel-night-31515.db.redis.io'),

  REDIS_PORT: z
    .string()
    .default('19054')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val < 65536, {
      message: 'REDIS_PORT must be a valid port number between 1 and 65535',
    }),

  REDIS_PASSWORD: z.string().optional(),

  REDIS_DB: z
    .string()
    .default('0')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 0 && val <= 15, {
      message: 'REDIS_DB must be between 0 and 15',
    }),

  REDIS_TLS_ENABLED: z
    .string()
    .default('true')
    .transform((val) => val === 'true' || val === '1'),

  // Resend Email Configuration
  RESEND_API_KEY: z.string().min(10, 'RESEND_API_KEY must be at least 10 characters'),

  RESEND_FROM_EMAIL: z.string().email('RESEND_FROM_EMAIL must be a valid email address'),

  // CORS Configuration
  CLIENT_URL: z.string().url('CLIENT_URL must be a valid URL').optional(),

  // Rate Limiting Configuration
  RATE_LIMIT_MAX: z
    .string()
    .default('100')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, {
      message: 'RATE_LIMIT_MAX must be greater than 0',
    }),

  RATE_LIMIT_WINDOW: z
    .string()
    .default('60000')
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, {
      message: 'RATE_LIMIT_WINDOW must be greater than 0',
    }),

  // Optional: Log level
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

/**
 * Validate environment variables
 * This will throw an error if any required variable is missing or invalid
 */
const env = envSchema.parse(process.env);

/**
 * Helper function to get typed environment variables
 */
export function getEnv<T extends keyof typeof env>(key: T): (typeof env)[T] {
  return env[key];
}

/**
 * Export validated environment variables
 */
export { env };

/**
 * Export specific environment configurations for different modules
 */
export const config = {
  app: {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN,
  },
  supabase: {
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  },
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    db: env.REDIS_DB,
    tlsEnabled: env.REDIS_TLS_ENABLED,
  },
  email: {
    apiKey: env.RESEND_API_KEY,
    fromEmail: env.RESEND_FROM_EMAIL,
  },
  cors: {
    clientUrl: env.CLIENT_URL,
  },
  rateLimit: {
    max: env.RATE_LIMIT_MAX,
    window: env.RATE_LIMIT_WINDOW,
  },
  logging: {
    level: env.LOG_LEVEL,
  },
};
