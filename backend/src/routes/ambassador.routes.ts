import { Router } from 'express';
import * as ambassador from '../controllers/ambassador.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { ambassadorMiddleware } from '../middleware/admin.middleware';

const router = Router();

router.use(authMiddleware, ambassadorMiddleware);

router.get('/dashboard', ambassador.getAmbassadorDashboard);
router.get('/network', ambassador.getAmbassadorNetwork);
router.get('/leaderboard', ambassador.getAmbassadorLeaderboard);
router.get('/prizes', ambassador.getAmbassadorPrizes);
router.get('/calendar', ambassador.getAmbassadorCalendar);
router.post('/invite', ambassador.sendAmbassadorInvite);

export default router;
