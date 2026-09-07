import { Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import { AuthRequest } from '../../middleware/auth.middleware';

export async function getAnalytics(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const [
      totalUsers,
      totalAmbassadors,
      totalNormalUsers,
      totalReferrals,
      totalCountedReferrals,
      totalPoints,
      totalOrders,
      totalRevenue,
      totalRedemptions,
      activeCompetition,
    ] = await Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: 'AMBASSADOR', isActive: true } }),
      prisma.user.count({ where: { role: 'NORMAL_USER', isActive: true } }),
      prisma.referralRelation.count(),
      prisma.referralRelation.count({ where: { status: 'COUNTED' } }),
      prisma.pointsLedger.aggregate({ _sum: { points: true } }),
      prisma.order.count({ where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } } }),
      prisma.order.aggregate({ where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } }, _sum: { totalAmount: true } }),
      prisma.rewardRedemption.count({ where: { status: { in: ['REQUESTED', 'APPROVED'] } } }),
      prisma.competition.findFirst({ where: { status: 'ACTIVE' }, orderBy: { startDate: 'desc' } }),
    ]);

    // Signups by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSignups = await prisma.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const signupsByDay: Record<string, number> = {};
    for (const user of recentSignups) {
      const day = user.createdAt.toISOString().slice(0, 10);
      signupsByDay[day] = (signupsByDay[day] || 0) + 1;
    }

    res.json({
      overview: {
        totalUsers,
        totalAmbassadors,
        totalNormalUsers,
        totalReferrals,
        totalCountedReferrals,
        totalPoints: totalPoints._sum.points || 0,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        totalRedemptions,
      },
      activeCompetition: activeCompetition
        ? { id: activeCompetition.id, title: activeCompetition.title, status: activeCompetition.status, endDate: activeCompetition.endDate }
        : null,
      signupsByDay: Object.entries(signupsByDay).map(([date, count]) => ({ date, count })),
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdminLeaderboard(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { getLeaderboard } = await import('../../services/leaderboard.service');
    const scope = (req.query.scope as string) || 'national';
    const leaderboard = await getLeaderboard(scope as any, undefined, 100);
    res.json({ leaderboard });
  } catch (err) {
    next(err);
  }
}

export async function listOrders(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { getPagination, buildPaginationMeta } = await import('../../utils/pagination');
    const { skip, take, page, limit } = getPagination({ page: Number(req.query.page), limit: Number(req.query.limit) });
    const status = req.query.status as string | undefined;
    const where: any = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where, orderBy: { createdAt: 'desc' }, skip, take,
        include: {
          user: { select: { id: true, fullName: true, email: true } },
          product: { select: { id: true, name: true, price: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);
    res.json({ orders, pagination: buildPaginationMeta(total, page, limit) });
  } catch (err) {
    next(err);
  }
}

export async function updateOrder(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { z } = await import('zod');
    const { status } = z.object({
      status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
    }).parse(req.body);

    const order = await prisma.order.update({ where: { id: req.params.id }, data: { status: status as any } });
    res.json({ order });
  } catch (err) {
    next(err);
  }
}
