import app from './app';
import dotenv from 'dotenv';
import { redis } from './config/redis';
import { logger } from './utils/logger';
import { initializeDatabase } from './db/init'; // PostgreSQL init

dotenv.config({ path: '.env' });

const PORT = process.env.PORT || 3000;

// 1. Initialize PostgreSQL database
initializeDatabase()
  .then(() => {
    logger.info('PostgreSQL database initialized successfully');
  })
  .catch((err) => {
    logger.error('Failed to initialize PostgreSQL database:', err);
    process.exit(1);
  });

// 2. Start the server
const startServer = async () => {
  try {
    // Verify Redis connection
    await redis.ping();
    logger.info('Redis connected successfully');

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// 3. Graceful shutdown handlers
const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  try {
    if (typeof redis.quit === 'function') {
      await redis.quit();
    }
    logger.info('Redis connection closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));