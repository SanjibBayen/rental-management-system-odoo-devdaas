import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: '.env' });

const envSchema = z.object({
  // App
  PORT: z.string().default('5000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // PostgreSQL
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().default('5432').transform(Number),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('password'),
  DB_NAME: z.string().default('rental_db'),

  // Redis
  REDIS_HOST: z.string().default('mint-jewel-night-31515.db.redis.io'),
  REDIS_PORT: z.string().default('19054').transform(Number),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.string().default('0').transform(Number),
  REDIS_TLS_ENABLED: z
    .string()
    .default('true')
    .transform((val) => val === 'true'),

  // Nodemailer (SMTP)
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.string().default('587').transform(Number),
  SMTP_SECURE: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  EMAIL_FROM: z.string().email().default('noreply@rental.com'),
  WEB_NAME: z.string().default('Rental Management System'),
  WEB_URL: z.string().url().default('http://localhost:3000'),

  // CORS
  CLIENT_URL: z.string().url().default('http://localhost:3000'),

  // Rate Limiting
  RATE_LIMIT_MAX: z.string().default('100').transform(Number),
  RATE_LIMIT_WINDOW: z.string().default('60000').transform(Number),

CLOUDINARY_CLOUD_NAME: z.string().min(1),
CLOUDINARY_API_KEY: z.string().min(1),
CLOUDINARY_API_SECRET: z.string().min(1),

});

const env = envSchema.parse(process.env);

export const config = {
  app: {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN,
  },
  db: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    db: env.REDIS_DB,
    tlsEnabled: env.REDIS_TLS_ENABLED,
  },
  email: {
    host: env.SMTP_HOST,    
    port: env.SMTP_PORT,      
    secure: env.SMTP_SECURE, 
    user: env.SMTP_USER,      
    pass: env.SMTP_PASS,     
    from: env.EMAIL_FROM,
  },
  cors: {
    clientUrl: env.CLIENT_URL,
  },
  rateLimit: {
    max: env.RATE_LIMIT_MAX,
    window: env.RATE_LIMIT_WINDOW,
  },
  web: {
    name: env.WEB_NAME,
    url: env.WEB_URL,
  },
  cloudinary: {
  cloudName: env.CLOUDINARY_CLOUD_NAME,
  apiKey: env.CLOUDINARY_API_KEY,
  apiSecret: env.CLOUDINARY_API_SECRET,
},
  
};