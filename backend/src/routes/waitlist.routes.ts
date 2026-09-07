import { Router } from 'express';
import * as waitlist from '../controllers/waitlist.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/join', waitlist.joinWaitlist);
router.get('/status', authMiddleware, waitlist.getWaitlistStatus);
router.get('/dashboard', authMiddleware, waitlist.getWaitlistDashboard);

export default router;
