import { Router } from 'express';
import * as users from '../controllers/admin/users.controller';
import * as competitions from '../controllers/admin/competitions.controller';
import * as rewards from '../controllers/admin/rewards.controller';
import * as analytics from '../controllers/admin/analytics.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

// ── Analytics ──────────────────────────────────
router.get('/analytics', analytics.getAnalytics);
router.get('/leaderboards', analytics.getAdminLeaderboard);

// ── Users ──────────────────────────────────────
router.get('/users', users.listUsers);
router.get('/users/:id', users.getUser);
router.patch('/users/:id', users.updateUser);
router.delete('/users/:id', users.deleteUser);

// ── Schools ────────────────────────────────────
router.get('/schools', competitions.listSchoolsAdmin);
router.post('/schools', competitions.createSchool);
router.patch('/schools/:id', competitions.updateSchool);
router.delete('/schools/:id', competitions.deleteSchool);

// ── Markets ────────────────────────────────────
router.get('/markets', competitions.listMarketsAdmin);
router.post('/markets', competitions.createMarket);
router.patch('/markets/:id', competitions.updateMarket);
router.delete('/markets/:id', competitions.deleteMarket);

// ── Competitions ───────────────────────────────
router.get('/competitions', competitions.listCompetitions);
router.post('/competitions', competitions.createCompetition);
router.get('/competitions/:id', competitions.getCompetition);
router.patch('/competitions/:id', competitions.updateCompetition);
router.delete('/competitions/:id', competitions.deleteCompetition);

// ── Rewards ────────────────────────────────────
router.get('/rewards', rewards.listRewards);
router.post('/rewards', rewards.createReward);
router.patch('/rewards/:id', rewards.updateReward);
router.delete('/rewards/:id', rewards.deleteReward);

// ── Reward Redemptions ─────────────────────────
router.get('/reward-redemptions', rewards.listRedemptions);
router.patch('/reward-redemptions/:id', rewards.updateRedemption);

// ── Orders ─────────────────────────────────────
router.get('/orders', analytics.listOrders);
router.patch('/orders/:id', analytics.updateOrder);

export default router;
