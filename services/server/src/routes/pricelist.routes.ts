import { Router } from 'express';
import { PricelistController } from '../controllers/pricelist.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbacMiddleware } from '../middleware/rbac.middleware';

const router = Router();
const controller = new PricelistController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authMiddleware, rbacMiddleware(['admin']), controller.create);
router.put('/:id', authMiddleware, rbacMiddleware(['admin']), controller.update);
router.delete('/:id', authMiddleware, rbacMiddleware(['admin']), controller.delete);

export { router as pricelistRoutes };