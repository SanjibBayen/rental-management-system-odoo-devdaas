import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.middleware';
// import { authRoutes } from './routes/auth.routes';
// import { productRoutes } from './routes/product.routes';
// import { rentalRoutes } from './routes/rental.routes';

const app = express();

app.use(cors());
app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/rentals', rentalRoutes);

app.use(errorHandler);

export default app;