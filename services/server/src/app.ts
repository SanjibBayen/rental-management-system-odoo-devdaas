import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.middleware';
// import { authRoutes } from './routes/auth.routes';
// import { productRoutes } from './routes/product.routes';
// import { rentalRoutes } from './routes/rental.routes';
// import db from './config/database'; // Uncomment when database config is ready

const app = express();

app.use(cors());
app.use(express.json());


const DATABASECONNECTION= async () => {
    try{
        // await db.authenticate();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    }

}

// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/rentals', rentalRoutes);

app.use(errorHandler);

export default app;