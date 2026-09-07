import { Router } from 'express';
import * as rewards from '../controllers/rewards.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/progress', rewards.getRewardsProgress);
router.post('/:id/redeem', rewards.redeemReward);
router.get('/points-history', rewards.getPointsHistory);

export default router;
