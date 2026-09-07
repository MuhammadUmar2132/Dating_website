import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { hashPassword, comparePassword, generateReferralCode } from '../utils/hash';
import { signToken } from '../utils/jwt';
import { AppError } from '../middleware/error.middleware';
import { sendMagicLinkEmail, sendPasswordResetEmail } from '../services/email.service';
import { env } from '../config/env';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/auth.middleware';

// ── Schemas ────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  remember: z.boolean().optional(),
});

const magicLinkSchema = z.object({ email: z.string().email() });
const forgotPasswordSchema = z.object({ email: z.string().email() });
const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

// ── Controllers ────────────────────────────────

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !user.passwordHash) {
      throw new AppError('Invalid email or password', 401);
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) throw new AppError('Invalid email or password', 401);

    if (!user.isActive) throw new AppError('Account has been disabled', 403);

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const token = signToken(user.id);

    res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        referralCode: user.referralCode,
      },
      redirectTo: user.role === 'ADMIN' ? '/admin' : user.role === 'AMBASSADOR' ? '/ambassador' : '/dashboard',
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(_req: Request, res: Response) {
  res.json({ ok: true, message: 'Logged out' });
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, email: true, fullName: true, role: true,
        referralCode: true, waitlistPosition: true, schoolId: true,
        marketId: true, emailVerifiedAt: true, onboardingCompletedAt: true,
        lastLoginAt: true, createdAt: true,
      },
    });
    if (!user) throw new AppError('User not found', 404);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function requestMagicLink(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = magicLinkSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (user) {
      const token = uuidv4();
      const expiresAt = new Date(Date.now() + env.magicLinkExpiresMinutes * 60 * 1000);

      await prisma.magicLinkToken.create({
        data: { token, userId: user.id, expiresAt },
      });

      const magicLink = `${env.appUrl}/auth/verify?token=${token}`;

      if (env.isDev) {
        console.log(`[MAGIC LINK] ${magicLink}`);
      } else {
        await sendMagicLinkEmail(email, magicLink);
      }
    }

    // Always return 200 to prevent email enumeration
    res.json({ message: 'If an account exists, a magic link has been sent' });
  } catch (err) {
    next(err);
  }
}

export async function verifyMagicLink(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.query as { token: string };
    if (!token) throw new AppError('Token is required', 400);

    const record = await prisma.magicLinkToken.findUnique({ where: { token } });
    if (!record) throw new AppError('Invalid or expired magic link', 400);
    if (record.usedAt) throw new AppError('Magic link already used', 400);
    if (record.expiresAt < new Date()) throw new AppError('Magic link has expired', 400);

    await prisma.magicLinkToken.update({ where: { id: record.id }, data: { usedAt: new Date() } });

    const user = await prisma.user.findUnique({ where: { id: record.userId } });
    if (!user) throw new AppError('User not found', 404);

    if (!user.emailVerifiedAt) {
      await prisma.user.update({ where: { id: user.id }, data: { emailVerifiedAt: new Date() } });
    }

    const jwtToken = signToken(user.id);
    res.json({
      token: jwtToken,
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, referralCode: user.referralCode },
    });
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (user) {
      const token = uuidv4();
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

      await prisma.passwordResetToken.create({ data: { token, userId: user.id, expiresAt } });

      const resetLink = `${env.appUrl}/reset-password?token=${token}`;
      if (env.isDev) {
        console.log(`[RESET LINK] ${resetLink}`);
      } else {
        await sendPasswordResetEmail(email, resetLink);
      }
    }

    res.json({ message: 'If an account exists, a reset link has been sent' });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);

    const record = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!record) throw new AppError('Invalid or expired reset token', 400);
    if (record.usedAt) throw new AppError('Reset token already used', 400);
    if (record.expiresAt < new Date()) throw new AppError('Reset token has expired', 400);

    const passwordHash = await hashPassword(password);
    await prisma.user.update({ where: { id: record.userId }, data: { passwordHash } });
    await prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } });

    res.json({ ok: true, message: 'Password reset successfully' });
  } catch (err) {
    next(err);
  }
}
