import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { getPagination, buildPaginationMeta } from '../utils/pagination';

export async function getSchools(req: Request, res: Response, next: NextFunction) {
  try {
    const search = (req.query.search as string) || '';
    const marketId = req.query.marketId as string | undefined;
    const { skip, take, page, limit } = getPagination({ page: Number(req.query.page), limit: Number(req.query.limit) || 20 });

    const where: any = { isActive: true };
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (marketId) where.marketId = marketId;

    const [schools, total] = await Promise.all([
      prisma.school.findMany({ where, orderBy: { name: 'asc' }, skip, take, include: { market: { select: { id: true, name: true, city: true, state: true } } } }),
      prisma.school.count({ where }),
    ]);

    res.json({
      schools: schools.map((s) => ({ id: s.id, name: s.name, city: s.city, state: s.state, market: s.market })),
      pagination: buildPaginationMeta(total, page, limit),
    });
  } catch (err) {
    next(err);
  }
}

export async function getMarkets(req: Request, res: Response, next: NextFunction) {
  try {
    const markets = await prisma.market.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
    res.json({ markets: markets.map((m) => ({ id: m.id, name: m.name, city: m.city, state: m.state })) });
  } catch (err) {
    next(err);
  }
}
