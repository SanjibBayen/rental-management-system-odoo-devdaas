import { Router } from 'express';
import { PickupController } from '../controllers/pickup.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbacMiddleware } from '../middleware/rbac.middleware';

const router = Router();
const controller = new PickupController();

// Admin & Delivery only
router.get('/today', authMiddleware, rbacMiddleware(['admin', 'delivery']), controller.getTodayPickups);
router.get('/:id', authMiddleware, rbacMiddleware(['admin', 'delivery']), controller.getPickupById);
router.put('/:id/confirm', authMiddleware, rbacMiddleware(['admin', 'delivery']), controller.confirmPickup);

export { router as pickupRoutes };