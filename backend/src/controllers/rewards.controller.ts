import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { getUserTotalPoints, getUserPointsBreakdown } from '../services/points.service';
import { getLeaderboard } from '../services/leaderboard.service';
import { getPagination, buildPaginationMeta } from '../utils/pagination';

export async function getRewardsProgress(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;

    const [totalPoints, breakdown, rewards, redemptions, directReferrals] = await Promise.all([
      getUserTotalPoints(userId),
      getUserPointsBreakdown(userId),
      prisma.reward.findMany({ where: { isActive: true } }),
      prisma.rewardRedemption.findMany({ where: { userId } }),
      prisma.referralRelation.count({ where: { referrerId: userId, status: 'COUNTED' } }),
    ]);

    const leaderboard = await getLeaderboard('national', undefined, 200);
    const userEntry = leaderboard.find((e) => e.userId === userId);
    const nationalRank = userEntry?.rank || null;

    const rewardsProgress = rewards.map((reward) => {
      const redemption = redemptions.find((r) => r.rewardId === reward.id);
      const unlockStatus = redemption?.status || 'LOCKED';

      const available = reward.quantity !== null ? reward.quantity - reward.reserved - reward.redeemed : null;

      const conditions = [];

      if (reward.requiredInvites > 0) {
        conditions.push({
          key: 'invites',
          label: `${reward.requiredInvites} completed signups`,
          current: directReferrals,
          required: reward.requiredInvites,
          met: directReferrals >= reward.requiredInvites,
          enabled: true,
          autoUnlockable: true,
          percent: Math.min(100, (directReferrals / reward.requiredInvites) * 100),
        });
      }

      if (reward.requiredRank) {
        conditions.push({
          key: 'rank',
          label: `Top ${reward.requiredRank} rank`,
          current: nationalRank,
          required: reward.requiredRank,
          met: nationalRank !== null && nationalRank <= reward.requiredRank,
          enabled: true,
          autoUnlockable: false,
          percent: 0,
        });
      }

      if (reward.requiredPoints) {
        conditions.push({
          key: 'points',
          label: `${reward.requiredPoints} total points`,
          current: totalPoints,
          required: reward.requiredPoints,
          met: totalPoints >= reward.requiredPoints,
          enabled: true,
          autoUnlockable: true,
          percent: Math.min(100, (totalPoints / reward.requiredPoints) * 100),
        });
      }

      const eligible = conditions.length > 0 && conditions.every((c) => c.met);

      return {
        rewardId: reward.id,
        title: reward.title,
        description: reward.description,
        rewardType: reward.rewardType,
        unlockType: reward.unlockType,
        audienceType: reward.audienceType,
        ruleOperator: reward.ruleOperator,
        requiredPoints: reward.requiredPoints,
        requiredInvites: reward.requiredInvites,
        requiredRank: reward.requiredRank,
        requiredAppDownloads: reward.requiredAppDownloads,
        inventory: {
          quantity: reward.quantity,
          reserved: reward.reserved,
          redeemed: reward.redeemed,
          available,
          limited: reward.quantity !== null,
          outOfStock: available !== null && available <= 0,
        },
        conditions,
        unlockStatus,
        eligible,
        redemptionLimitReached: !!redemption,
      };
    });

    res.json({
      totalPoints,
      totalInvites: directReferrals,
      appDownloads: 0,
      ranks: { nationalRank, schoolRank: null, marketRank: null, ambassadorRank: null },
      rewardsProgress,
    });
  } catch (err) {
    next(err);
  }
}

export async function redeemReward(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const reward = await prisma.reward.findUnique({ where: { id } });
    if (!reward) throw new AppError('Reward not found', 404);
    if (!reward.isActive) throw new AppError('Reward is no longer available', 400);

    // Check existing redemption
    const existing = await prisma.rewardRedemption.findFirst({ where: { userId, rewardId: id } });
    if (existing) throw new AppError('You have already requested this reward', 409);

    // Check stock
    if (reward.quantity !== null) {
      const available = reward.quantity - reward.reserved - reward.redeemed;
      if (available <= 0) throw new AppError('This reward is out of stock', 400);
      await prisma.reward.update({ where: { id }, data: { reserved: { increment: 1 } } });
    }

    const redemption = await prisma.rewardRedemption.create({
      data: { userId, rewardId: id, status: 'REQUESTED' },
    });

    res.status(201).json({ id: redemption.id, rewardId: id, userId, status: redemption.status });
  } catch (err) {
    next(err);
  }
}

export async function getPointsHistory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { skip, take, page, limit } = getPagination({ page: Number(req.query.page), limit: Number(req.query.limit) });
    const userId = req.user!.id;

    const [items, total, balance] = await Promise.all([
      prisma.pointsLedger.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, skip, take }),
      prisma.pointsLedger.count({ where: { userId } }),
      prisma.pointsLedger.aggregate({ where: { userId }, _sum: { points: true } }),
    ]);

    res.json({
      items: items.map((i) => ({
        id: i.id,
        points: i.points,
        sourceType: i.sourceType,
        sourceId: i.sourceId,
        pointCategory: i.pointCategory,
        createdAt: i.createdAt.toISOString(),
      })),
      balance: balance._sum.points || 0,
      pagination: buildPaginationMeta(total, page, limit),
    });
  } catch (err) {
    next(err);
  }
}
