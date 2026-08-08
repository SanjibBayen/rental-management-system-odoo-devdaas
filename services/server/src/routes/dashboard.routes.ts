import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbacMiddleware } from '../middleware/rbac.middleware';

const router = Router();
const controller = new DashboardController();

router.get('/', authMiddleware, rbacMiddleware(['admin']), controller.getStats);

export { router as dashboardRoutes };
