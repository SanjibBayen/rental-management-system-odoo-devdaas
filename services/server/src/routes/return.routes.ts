import { Router } from 'express';
import { ReturnController } from '../controllers/return.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbacMiddleware } from '../middleware/rbac.middleware';

const router = Router();
const controller = new ReturnController();

router.get('/today', authMiddleware, rbacMiddleware(['admin', 'delivery']), controller.getTodayReturns);
router.get('/:id', authMiddleware, rbacMiddleware(['admin', 'delivery']), controller.getReturnById);
router.put('/:id/inspect', authMiddleware, rbacMiddleware(['admin', 'delivery']), controller.inspectReturn);
router.put('/:id/confirm', authMiddleware, rbacMiddleware(['admin', 'delivery']), controller.confirmReturn);

export { router as returnRoutes };