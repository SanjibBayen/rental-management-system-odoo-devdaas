import { Router } from 'express';
import { RentalController } from '../controllers/rental.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbacMiddleware } from '../middleware/rbac.middleware';
const router = Router();
const controller = new RentalController();

// Authenticated routes
router.get('/', authMiddleware, controller.getAll);
router.get('/:id', authMiddleware, controller.getById);
router.post('/', authMiddleware, controller.create);
router.put('/:id/return', authMiddleware, controller.returnRental);

// Customer only
router.get('/user', authMiddleware, rbacMiddleware(['customer']), controller.getByUser);

// Admin only
router.get('/active', authMiddleware, rbacMiddleware(['admin']), controller.getActive);
router.get('/overdue', authMiddleware, rbacMiddleware(['admin']), controller.getOverdue);

export { router as rentalRoutes };