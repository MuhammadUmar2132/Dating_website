import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/error.middleware';
import { AuthRequest } from '../../middleware/auth.middleware';
import { getPagination, buildPaginationMeta } from '../../utils/pagination';

const rewardSchema = z.object({
  title: z.string().min(2),
  description: z.string().nullable().optional(),
  rewardType: z.enum(['PHYSICAL', 'DIGITAL', 'EXPERIENCE', 'CASH']).optional(),
  unlockType: z.enum(['AUTOMATIC', 'MANUAL', 'RANKED']).optional(),
  audienceType: z.enum(['ALL', 'AMBASSADOR', 'NORMAL_USER']).optional(),
  ruleOperator: z.enum(['ALL', 'ANY']).optional(),
  requiredPoints: z.number().int().nullable().optional(),
  requiredInvites: z.number().int().optional(),
  requiredRank: z.number().int().nullable().optional(),
  quantity: z.number().int().nullable().optional(),
  isActive: z.boolean().optional(),
  imageUrl: z.string().nullable().optional(),
});

export async function listRewards(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { skip, take, page, limit } = getPagination({ page: Number(req.query.page), limit: Number(req.query.limit) });
    const [rewards, total] = await Promise.all([
      prisma.reward.findMany({ orderBy: { createdAt: 'desc' }, skip, take }),
      prisma.reward.count(),
    ]);
    res.json({ rewards, pagination: buildPaginationMeta(total, page, limit) });
  } catch (err) {
    next(err);
  }
}

export async function createReward(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = rewardSchema.parse(req.body);
    const reward = await prisma.reward.create({ data: data as any });
    res.status(201).json({ reward });
  } catch (err) {
    next(err);
  }
}

export async function updateReward(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = rewardSchema.partial().parse(req.body);
    const reward = await prisma.reward.update({ where: { id: req.params.id }, data: data as any });
    res.json({ reward });
  } catch (err) {
    next(err);
  }
}

export async function deleteReward(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await prisma.reward.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ message: 'Reward deactivated' });
  } catch (err) {
    next(err);
  }
}

export async function listRedemptions(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { skip, take, page, limit } = getPagination({ page: Number(req.query.page), limit: Number(req.query.limit) });
    const status = req.query.status as string | undefined;
    const where: any = {};
    if (status) where.status = status;

    const [redemptions, total] = await Promise.all([
      prisma.rewardRedemption.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip, take,
        include: {
          user: { select: { id: true, fullName: true, email: true } },
          reward: { select: { id: true, title: true } },
        },
      }),
      prisma.rewardRedemption.count({ where }),
    ]);
    res.json({ redemptions, pagination: buildPaginationMeta(total, page, limit) });
  } catch (err) {
    next(err);
  }
}

export async function updateRedemption(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { status, notes } = z.object({
      status: z.enum(['REQUESTED', 'APPROVED', 'REJECTED', 'REDEEMED', 'CANCELLED']),
      notes: z.string().optional(),
    }).parse(req.body);

    const redemption = await prisma.rewardRedemption.update({
      where: { id: req.params.id },
      data: { status: status as any, notes },
    });

    // If approved, update reward counts
    if (status === 'REDEEMED') {
      await prisma.reward.update({
        where: { id: redemption.rewardId },
        data: { redeemed: { increment: 1 }, reserved: { decrement: 1 } },
      });
    }

    res.json({ redemption });
  } catch (err) {
    next(err);
  }
}
