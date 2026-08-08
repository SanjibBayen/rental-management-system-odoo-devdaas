import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { supabaseAuth } from '../middleware/supabaseAuth.middleware';

const router = Router();
const controller = new AuthController();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', supabaseAuth, controller.getMe);

export { router as authRoutes };