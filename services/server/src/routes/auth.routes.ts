import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new AuthController();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', authMiddleware, controller.getMe);
router.post('/verify-otp', controller.verifyOTP);
router.post('/resend-otp', controller.resendOTP);

export { router as authRoutes };