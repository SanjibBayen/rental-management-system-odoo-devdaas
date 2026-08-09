import { Router } from 'express';
import { MapsService } from '../services/maps.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbacMiddleware } from '../middleware/rbac.middleware';

const router = Router();
const mapsService = new MapsService();

// GET /api/ai/optimize-route?addresses=addr1,addr2,addr3
router.get(
    '/optimize-route',
    authMiddleware,
    rbacMiddleware(['admin', 'delivery']),
    async (req, res) => {
        try {
            const { addresses } = req.query;

            if (!addresses || typeof addresses !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Addresses are required (comma-separated)',
                });
            }

            const addressList = addresses.split(',').map((a) => a.trim());
            const optimized = await mapsService.optimizeRoute(addressList);

            res.json({
                success: true,
                data: {
                    original: addressList,
                    optimized,
                },
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
);

export { router as aiRoutes };