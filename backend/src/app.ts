import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { env } from './config/env';
import { errorMiddleware } from './middleware/error.middleware';

import authRoutes from './routes/auth.routes';
import waitlistRoutes from './routes/waitlist.routes';
import onboardingRoutes from './routes/onboarding.routes';
import leaderboardRoutes from './routes/leaderboard.routes';
import ambassadorRoutes from './routes/ambassador.routes';
import rewardsRoutes from './routes/rewards.routes';
import shopRoutes from './routes/shop.routes';
import schoolsRoutes from './routes/schools.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

// ── Security ────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
}));

// ── Rate Limiting ───────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many auth attempts, please try again later' },
});

app.use(limiter);

// ── Stripe webhook (needs raw body) ─────────────
app.post('/api/shop/webhook', express.raw({ type: 'application/json' }));

// ── Body Parsing ────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ─────────────────────────────────────
if (env.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ── Health Check ─────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: env.nodeEnv });
});

// ── API Routes ───────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/ambassador', ambassadorRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/schools', schoolsRoutes);
app.use('/api/admin', adminRoutes);

// ── 404 Handler ──────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Error Handler ────────────────────────────────
app.use(errorMiddleware);

export default app;
