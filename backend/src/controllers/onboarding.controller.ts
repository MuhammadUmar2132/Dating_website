import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { hashPassword } from '../utils/hash';
import { countReferral } from '../services/referral.service';
import { awardPoints } from '../services/points.service';
import { PointCategory } from '@prisma/client';
import { signToken } from '../utils/jwt';
import { env } from '../config/env';

const completeOnboardingSchema = z.object({
  token: z.string(),
  fullName: z.string().min(2),
  password: z.string().min(8),
  schoolId: z.string(),
  marketId: z.string(),
  graduationYear: z.number().int().optional(),
  instagram: z.string().optional(),
});

const checkEmailSchema = z.object({ email: z.string().email() });

export async function checkEmail(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { email } = checkEmailSchema.parse(req.query);
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    res.json({ email, registered: !!user });
  } catch (err) {
    next(err);
  }
}

export async function validateInvite(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { token } = req.query as { token: string };
    if (!token) throw new AppError('Token is required', 400);

    const invite = await prisma.ambassadorInvite.findUnique({
      where: { token },
      include: { inviter: { select: { fullName: true } } },
    });

    if (!invite) throw new AppError('Invalid invitation token', 404);
    if (invite.expiresAt < new Date()) throw new AppError('Invitation has expired', 400);

    const alreadyRegistered = await prisma.user.findUnique({
      where: { email: invite.email },
    });

    res.json({
      email: invite.email,
      expiresAt: invite.expiresAt.toISOString(),
      alreadyRegistered: !!alreadyRegistered,
      inviterName: invite.inviter.fullName,
    });
  } catch (err) {
    next(err);
  }
}

export async function completeOnboarding(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = completeOnboardingSchema.parse(req.body);

    // Validate invite token
    const invite = await prisma.ambassadorInvite.findUnique({ where: { token: data.token } });
    if (!invite) throw new AppError('Invalid invitation token', 400);
    if (invite.acceptedAt) throw new AppError('Invitation already accepted', 400);
    if (invite.expiresAt < new Date()) throw new AppError('Invitation has expired', 400);

    // Check school and market exist
    const school = await prisma.school.findUnique({ where: { id: data.schoolId } });
    if (!school) throw new AppError('School not found', 404);

    const market = await prisma.market.findUnique({ where: { id: data.marketId } });
    if (!market) throw new AppError('Market not found', 404);

    const passwordHash = await hashPassword(data.password);

    // Create or update the user
    let user = await prisma.user.findUnique({ where: { email: invite.email } });

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          fullName: data.fullName,
          passwordHash,
          role: 'AMBASSADOR',
          schoolId: data.schoolId,
          marketId: data.marketId,
          graduationYear: data.graduationYear,
          instagram: data.instagram,
          onboardingCompletedAt: new Date(),
          emailVerifiedAt: new Date(),
        },
      });
    } else {
      const { generateReferralCode } = await import('../utils/hash');
      let referralCode = generateReferralCode();
      while (await prisma.user.findFirst({ where: { referralCode } })) {
        referralCode = generateReferralCode();
      }

      user = await prisma.user.create({
        data: {
          email: invite.email,
          fullName: data.fullName,
          passwordHash,
          role: 'AMBASSADOR',
          referralCode,
          schoolId: data.schoolId,
          marketId: data.marketId,
          graduationYear: data.graduationYear,
          instagram: data.instagram,
          onboardingCompletedAt: new Date(),
          emailVerifiedAt: new Date(),
        },
      });
    }

    // Mark invite as accepted
    await prisma.ambassadorInvite.update({
      where: { token: data.token },
      data: { acceptedAt: new Date(), invitedId: user.id },
    });

    // Award onboarding points
    await awardPoints(user.id, 25, 'ONBOARDING', undefined, PointCategory.PARTICIPATION, 'Completed onboarding');

    // Count referral from invite
    await countReferral(user.id);

    const referralLink = `${env.appUrl}/join?ref=${user.referralCode}`;
    const token = signToken(user.id);

    res.json({
      token,
      referralLink,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        referralCode: user.referralCode,
      },
    });
  } catch (err) {
    next(err);
  }
}
