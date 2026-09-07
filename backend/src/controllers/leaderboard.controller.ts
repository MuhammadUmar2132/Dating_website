import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import { getLeaderboard, getUserLeaderboardData } from '../services/leaderboard.service';

export async function getLeaderboardHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const scope = (req.query.scope as string) || 'national';
    const scopeId = req.query.scopeId as string | undefined;
    const limit = parseInt(req.query.limit as string || '50', 10);

    if (!['campus', 'market', 'national', 'participation'].includes(scope)) {
      throw new AppError('Invalid scope. Must be campus, market, national, or participation', 400);
    }

    const leaderboard = await getLeaderboard(scope as any, scopeId, limit);
    res.json({ leaderboard });
  } catch (err) {
    next(err);
  }
}

export async function getMyLeaderboard(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const scope = (req.query.scope as string) || 'national';
    const scopeId = req.query.scopeId as string | undefined;

    if (!['campus', 'market', 'national', 'participation'].includes(scope)) {
      throw new AppError('Invalid scope', 400);
    }

    const data = await getUserLeaderboardData(req.user!.id, scope as any, scopeId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
