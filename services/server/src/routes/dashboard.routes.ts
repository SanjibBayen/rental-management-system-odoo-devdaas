import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { supabaseAuth } from '../middleware/supabaseAuth.middleware';
import { rbacMiddleware } from '../middleware/rbac.middleware';

const router = Router();
const controller = new DashboardController();

router.get('/', supabaseAuth, rbacMiddleware(['admin']), controller.getStats);

export { router as dashboardRoutes };