import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { supabaseAuth } from '../middleware/supabaseAuth.middleware';
import { rbacMiddleware } from '../middleware/rbac.middleware';

const router = Router();
const controller = new ProductController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', supabaseAuth, rbacMiddleware(['admin']), controller.create);
router.put('/:id', supabaseAuth, rbacMiddleware(['admin']), controller.update);
router.delete('/:id', supabaseAuth, rbacMiddleware(['admin']), controller.delete);

export { router as productRoutes };