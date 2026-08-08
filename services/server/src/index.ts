import app from './app';
import dotenv from 'dotenv';
import { redis } from './config/redis';
import { logger } from './utils/logger';
import db from './db/Database';

dotenv.config({ path: '.env' });

const PORT = process.env.PORT || 3000;


db().then(() => {
  logger.info('Supabase connected successfully');
}).catch((err) => {
  logger.error('Failed to connect to Supabase:', err);
  process.exit(1);
});

const startServer = async () => {
  try {
    await redis.ping();
    logger.info('Redis connected successfully');

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  if (typeof redis.quit === 'function') await redis.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  if (typeof redis.quit === 'function') await redis.quit();
  process.exit(0);
});
