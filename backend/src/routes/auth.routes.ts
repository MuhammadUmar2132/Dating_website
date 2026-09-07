import { Router } from 'express';
import * as auth from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', auth.login);
router.post('/logout', auth.logout);
router.get('/me', authMiddleware, auth.me);
router.post('/magic-link/request', auth.requestMagicLink);
router.get('/magic-link/verify', auth.verifyMagicLink);
router.post('/forgot-password', auth.forgotPassword);
router.post('/reset-password', auth.resetPassword);

export default router;
