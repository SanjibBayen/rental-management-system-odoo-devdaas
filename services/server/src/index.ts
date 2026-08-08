import app from './app';
import { config } from './config/env';
import { redis } from './config/redis';
import { logger } from './utils/logger';

const PORT = config.app.port;

const startServer = async (): Promise<void> => {
    try {
  
        await redis.ping();
        logger.info('Redis connected successfully');

        
        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
            logger.info(`Environment: ${config.app.nodeEnv || 'development'}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();


const shutdown = async (signal: string): Promise<void> => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    try {
      
        if (typeof redis.quit === 'function') {
            await redis.quit();
            logger.info('Redis connection closed');
        }
        
        logger.info('Server shutdown complete');
        process.exit(0);
    } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
    }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));