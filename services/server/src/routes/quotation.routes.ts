import { Router } from 'express';
import { QuotationController } from '../controllers/quotation.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbacMiddleware } from '../middleware/rbac.middleware';

const router = Router();
const controller = new QuotationController();

router.post('/', authMiddleware, rbacMiddleware(['admin']), controller.createQuotation);
router.get('/:id', authMiddleware, rbacMiddleware(['admin', 'customer']), controller.getQuotation);
router.post('/:id/convert', authMiddleware, rbacMiddleware(['admin']), controller.convertToRental);

export { router as quotationRoutes };