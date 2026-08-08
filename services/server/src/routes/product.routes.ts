import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbacMiddleware } from '../middleware/rbac.middleware';

const router = Router();
const controller = new ProductController();

// Public routes (no auth)
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

// Admin only
router.post('/', authMiddleware, rbacMiddleware(['admin']), controller.create);
router.put('/:id', authMiddleware, rbacMiddleware(['admin']), controller.update);
router.delete('/:id', authMiddleware, rbacMiddleware(['admin']), controller.delete);

export { router as productRoutes };