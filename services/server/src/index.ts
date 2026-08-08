import app from './app';
import { config } from './config/env';
import { redis } from './config/redis';
import { logger } from './utils/logger';

const PORT = config.app.port;

const startServer = async () => {
  try {
    await redis.ping();
    logger.info('Redis connected successfully');

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${config.app.nodeEnv}`);
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
