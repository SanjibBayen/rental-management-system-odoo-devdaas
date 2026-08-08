import Redis from 'ioredis';
import { config } from './env';

export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password || undefined,
  db: config.redis.db,
  tls: config.redis.tlsEnabled ? { rejectUnauthorized: false } : undefined
});