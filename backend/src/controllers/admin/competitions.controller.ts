import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/error.middleware';
import { AuthRequest } from '../../middleware/auth.middleware';
import { getPagination, buildPaginationMeta } from '../../utils/pagination';

const competitionSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'GRACE_PERIOD', 'COMPLETED']).optional(),
  startDate: z.string(),
  endDate: z.string(),
  gracePeriodEndDate: z.string().nullable().optional(),
  isExtended: z.boolean().optional(),
  scoringOpen: z.boolean().optional(),
});

export async function listCompetitions(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { skip, take, page, limit } = getPagination({ page: Number(req.query.page), limit: Number(req.query.limit) });
    const [competitions, total] = await Promise.all([
      prisma.competition.findMany({ orderBy: { startDate: 'desc' }, skip, take }),
      prisma.competition.count(),
    ]);
    res.json({ competitions, pagination: buildPaginationMeta(total, page, limit) });
  } catch (err) {
    next(err);
  }
}

export async function getCompetition(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const competition = await prisma.competition.findUnique({ where: { id: req.params.id } });
    if (!competition) throw new AppError('Competition not found', 404);
    res.json({ competition });
  } catch (err) {
    next(err);
  }
}

export async function createCompetition(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = competitionSchema.parse(req.body);
    const competition = await prisma.competition.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        gracePeriodEndDate: data.gracePeriodEndDate ? new Date(data.gracePeriodEndDate) : null,
      },
    });
    res.status(201).json({ competition });
  } catch (err) {
    next(err);
  }
}

export async function updateCompetition(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = competitionSchema.partial().parse(req.body);
    const updateData: any = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    if (data.gracePeriodEndDate) updateData.gracePeriodEndDate = new Date(data.gracePeriodEndDate);

    const competition = await prisma.competition.update({ where: { id: req.params.id }, data: updateData });
    res.json({ competition });
  } catch (err) {
    next(err);
  }
}

export async function deleteCompetition(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await prisma.competition.delete({ where: { id: req.params.id } });
    res.json({ message: 'Competition deleted' });
  } catch (err) {
    next(err);
  }
}

// ── Schools Admin ─────────────────────────────

const schoolSchema = z.object({
  name: z.string().min(2),
  city: z.string().optional(),
  state: z.string().optional(),
  marketId: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export async function listSchoolsAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { skip, take, page, limit } = getPagination({ page: Number(req.query.page), limit: Number(req.query.limit) });
    const search = req.query.search as string | undefined;
    const where: any = {};
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const [schools, total] = await Promise.all([
      prisma.school.findMany({ where, orderBy: { name: 'asc' }, skip, take, include: { market: true } }),
      prisma.school.count({ where }),
    ]);
    res.json({ schools, pagination: buildPaginationMeta(total, page, limit) });
  } catch (err) {
    next(err);
  }
}

export async function createSchool(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = schoolSchema.parse(req.body);
    const school = await prisma.school.create({ data });
    res.status(201).json({ school });
  } catch (err) {
    next(err);
  }
}

export async function updateSchool(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = schoolSchema.partial().parse(req.body);
    const school = await prisma.school.update({ where: { id: req.params.id }, data });
    res.json({ school });
  } catch (err) {
    next(err);
  }
}

export async function deleteSchool(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await prisma.school.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ message: 'School deactivated' });
  } catch (err) {
    next(err);
  }
}

// ── Markets Admin ─────────────────────────────

const marketSchema = z.object({
  name: z.string().min(2),
  city: z.string().optional(),
  state: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function listMarketsAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const markets = await prisma.market.findMany({ orderBy: { name: 'asc' } });
    res.json({ markets });
  } catch (err) {
    next(err);
  }
}

export async function createMarket(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = marketSchema.parse(req.body);
    const market = await prisma.market.create({ data });
    res.status(201).json({ market });
  } catch (err) {
    next(err);
  }
}

export async function updateMarket(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = marketSchema.partial().parse(req.body);
    const market = await prisma.market.update({ where: { id: req.params.id }, data });
    res.json({ market });
  } catch (err) {
    next(err);
  }
}

export async function deleteMarket(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await prisma.market.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ message: 'Market deactivated' });
  } catch (err) {
    next(err);
  }
}
