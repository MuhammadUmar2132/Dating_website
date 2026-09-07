import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export function adminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }

  next();
}

export function ambassadorMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  if (req.user.role !== 'AMBASSADOR' && req.user.role !== 'ADMIN') {
    res.status(403).json({ message: 'Ambassador access required' });
    return;
  }

  next();
}
