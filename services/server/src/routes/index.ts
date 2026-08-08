import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { productRoutes } from './product.routes';
import { rentalRoutes } from './rental.routes';
import { userRoutes } from './user.routes';
import { dashboardRoutes } from './dashboard.routes';
import { pickupRoutes } from './pickup.routes';
import { returnRoutes } from './return.routes';
import { quotationRoutes } from './quotation.routes';
import { pricelistRoutes } from './pricelist.routes';

const router = Router();

// Register all route modules
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/rentals', rentalRoutes);
router.use('/users', userRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/pickups', pickupRoutes);
router.use('/returns', returnRoutes);
router.use('/quotations', quotationRoutes);
router.use('/pricelists', pricelistRoutes);

export default router;