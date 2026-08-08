import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { supabaseAuth } from '../middleware/supabaseAuth.middleware';

const router = Router();
const controller = new UserController();

router.get('/profile', supabaseAuth, controller.getProfile);
router.put('/profile', supabaseAuth, controller.updateProfile);

export { router as userRoutes };