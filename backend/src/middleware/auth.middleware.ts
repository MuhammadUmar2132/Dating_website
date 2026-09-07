import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../config/prisma';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    fullName: string | null;
  };
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : req.cookies?.token;

    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const decoded = jwt.verify(token, env.jwtSecret) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, fullName: true, isActive: true },
    });

    if (!user || !user.isActive) {
      res.status(401).json({ message: 'User not found or account disabled' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as { userId: string };
    prisma.user
      .findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, role: true, fullName: true, isActive: true },
      })
      .then((user) => {
        if (user && user.isActive) req.user = user;
        next();
      })
      .catch(() => next());
  } catch {
    next();
  }
}
