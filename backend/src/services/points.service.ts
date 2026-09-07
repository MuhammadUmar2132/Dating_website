import { prisma } from '../config/prisma';
import { PointCategory } from '@prisma/client';

export async function awardPoints(
  userId: string,
  points: number,
  sourceType: string,
  sourceId?: string,
  category?: PointCategory,
  description?: string
): Promise<void> {
  await prisma.pointsLedger.create({
    data: {
      userId,
      points,
      sourceType,
      sourceId,
      pointCategory: category,
      description,
    },
  });
}

export async function getUserTotalPoints(userId: string): Promise<number> {
  const result = await prisma.pointsLedger.aggregate({
    where: { userId },
    _sum: { points: true },
  });
  return result._sum.points || 0;
}

export async function getUserPointsBreakdown(userId: string) {
  const breakdown = await prisma.pointsLedger.groupBy({
    by: ['pointCategory'],
    where: { userId },
    _sum: { points: true },
  });

  const result = {
    invitePoints: 0,
    promptPoints: 0,
    participationPoints: 0,
    bonusPoints: 0,
  };

  for (const item of breakdown) {
    if (item.pointCategory === PointCategory.INVITE) result.invitePoints = item._sum.points || 0;
    if (item.pointCategory === PointCategory.PROMPT) result.promptPoints = item._sum.points || 0;
    if (item.pointCategory === PointCategory.PARTICIPATION) result.participationPoints = item._sum.points || 0;
    if (item.pointCategory === PointCategory.BONUS) result.bonusPoints = item._sum.points || 0;
  }

  return result;
}
