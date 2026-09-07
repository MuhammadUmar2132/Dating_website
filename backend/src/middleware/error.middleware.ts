import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Validation error',
      errors: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    });
    return;
  }

  // Custom app errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message, code: err.code });
    return;
  }

  // Prisma errors
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    if (prismaError.code === 'P2002') {
      res.status(409).json({ message: 'A record with this value already exists' });
      return;
    }
    if (prismaError.code === 'P2025') {
      res.status(404).json({ message: 'Record not found' });
      return;
    }
  }

  // Generic
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
}
