import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/error.middleware';
import { AuthRequest } from '../../middleware/auth.middleware';
import { getPagination, buildPaginationMeta } from '../../utils/pagination';
import { hashPassword } from '../../utils/hash';

const updateUserSchema = z.object({
  fullName: z.string().optional(),
  role: z.enum(['NORMAL_USER', 'AMBASSADOR', 'ADMIN']).optional(),
  schoolId: z.string().nullable().optional(),
  marketId: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  waitlistPosition: z.number().int().nullable().optional(),
  password: z.string().min(8).optional(),
});

export async function listUsers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { skip, take, page, limit } = getPagination({ page: Number(req.query.page), limit: Number(req.query.limit) });
    const search = req.query.search as string | undefined;
    const role = req.query.role as string | undefined;

    const where: any = {};
    if (search) where.OR = [{ email: { contains: search, mode: 'insensitive' } }, { fullName: { contains: search, mode: 'insensitive' } }];
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        select: {
          id: true, email: true, fullName: true, role: true,
          referralCode: true, waitlistPosition: true, isActive: true,
          emailVerifiedAt: true, onboardingCompletedAt: true,
          school: { select: { id: true, name: true } },
          market: { select: { id: true, name: true } },
          createdAt: true,
          _count: { select: { referralsGiven: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ users, pagination: buildPaginationMeta(total, page, limit) });
  } catch (err) {
    next(err);
  }
}

export async function getUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        school: true, market: true,
        pointsLedger: { orderBy: { createdAt: 'desc' }, take: 20 },
        referralsGiven: { include: { referred: { select: { id: true, fullName: true, email: true } } }, take: 20 },
        rewardRedemptions: { include: { reward: true } },
      },
    });
    if (!user) throw new AppError('User not found', 404);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = updateUserSchema.parse(req.body);
    const updateData: any = { ...data };

    if (data.password) {
      updateData.passwordHash = await hashPassword(data.password);
      delete updateData.password;
    }

    const user = await prisma.user.update({ where: { id: req.params.id }, data: updateData });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await prisma.user.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ message: 'User deactivated' });
  } catch (err) {
    next(err);
  }
}
