import { Router } from 'express';
import { RentalController } from '../controllers/rental.controller';
import { supabaseAuth } from '../middleware/supabaseAuth.middleware';
import { rbacMiddleware } from '../middleware/rbac.middleware';

const router = Router();
const controller = new RentalController();

// Public routes (authenticated)
router.get('/', supabaseAuth, controller.getAll);
router.get('/:id', supabaseAuth, controller.getById);
router.post('/', supabaseAuth, controller.create);
router.put('/:id/return', supabaseAuth, controller.returnRental);

// Customer only
router.get('/user', supabaseAuth, rbacMiddleware(['customer']), controller.getByUser);

// Admin only
router.get('/active', supabaseAuth, rbacMiddleware(['admin']), controller.getActive);
router.get('/overdue', supabaseAuth, rbacMiddleware(['admin']), controller.getOverdue);

export { router as rentalRoutes };