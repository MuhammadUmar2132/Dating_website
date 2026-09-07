import { Router } from 'express';
import * as leaderboard from '../controllers/leaderboard.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, leaderboard.getLeaderboardHandler);
router.get('/me', authMiddleware, leaderboard.getMyLeaderboard);

export default router;
