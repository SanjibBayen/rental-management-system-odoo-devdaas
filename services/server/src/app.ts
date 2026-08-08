import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler.middleware';
import { initializeDatabase } from './db/init';
import router from './routes';
import { logger } from './utils/logger';

const app = express();

// Secure HTTP headers
// app.use(helmet());

// Enable CORS
// app.use(cors({
//     origin: process.env.CLIENT_URL || '*',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// Parse JSON request bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logging
// app.use(morgan('combined', {
//     stream: {
//         write: (message) => logger.info(message.trim())
//     }
// }));



const initializeDatabaseConnection = async (): Promise<void> => {
    try {
        logger.info('Initializing PostgreSQL database...');
        await initializeDatabase();
        logger.info('PostgreSQL database connected and initialized successfully');
    } catch (error) {
        logger.error('Failed to connect to PostgreSQL database:', error);
        process.exit(1);
    }
};

// Run database initialization
initializeDatabaseConnection();


// Health check endpoint (public)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Register all routes under /api
app.use('/api/v1', router);

// 404 handler for unknown routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});


app.use(errorHandler);

export default app;