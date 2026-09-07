import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { awardPoints } from '../services/points.service';
import { processReferral } from '../services/referral.service';
import { sendWelcomeEmail } from '../services/email.service';
import { generateReferralCode } from '../utils/hash';
import { env } from '../config/env';
import { PointCategory } from '@prisma/client';

const joinSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  age: z.number().int().min(16).optional(),
  marketId: z.string().optional(),
  schoolId: z.string().optional(),
  notInSchool: z.boolean().optional(),
  referralCode: z.string().optional(),
});

export async function joinWaitlist(req: Request, res: Response, next: NextFunction) {
  try {
    const data = joinSchema.parse(req.body);
    const email = data.email.toLowerCase();

    // Check if already on waitlist
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError('This email is already on the waitlist', 409);
    }

    // Find referrer
    let referrer = null;
    if (data.referralCode) {
      referrer = await prisma.user.findFirst({ where: { referralCode: data.referralCode } });
    }

    // Count waitlist position
    const count = await prisma.user.count();
    const waitlistPosition = count + 1;

    // Generate unique referral code
    let referralCode = generateReferralCode();
    while (await prisma.user.findFirst({ where: { referralCode } })) {
      referralCode = generateReferralCode();
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        fullName: data.fullName,
        role: 'NORMAL_USER',
        referralCode,
        waitlistPosition,
        schoolId: data.schoolId || null,
        marketId: data.marketId || null,
      },
    });

    // Award join points
    await awardPoints(user.id, 10, 'WAITLIST_JOIN', undefined, PointCategory.PARTICIPATION, 'Joined waitlist');

    // Process referral
    if (referrer) {
      await processReferral(referrer.id, user.id);
    }

    const referralLink = `${env.appUrl}/join?ref=${referralCode}`;

    // Send welcome email
    try {
      await sendWelcomeEmail(email, data.fullName, referralLink);
    } catch (e) {
      console.warn('[EMAIL] Failed to send welcome email:', e);
    }

    res.status(201).json({
      message: 'Successfully joined the waitlist!',
      waitlistPosition,
      referralCode,
      referralLink,
    });
  } catch (err) {
    next(err);
  }
}

export async function getWaitlistStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        school: { select: { id: true, name: true, city: true, state: true } },
        market: { select: { id: true, name: true, city: true, state: true } },
      },
    });

    if (!user) throw new AppError('User not found', 404);

    const referralLink = `${env.appUrl}/join?ref=${user.referralCode}`;

    res.json({
      onWaitlist: true,
      waitlistPosition: user.waitlistPosition,
      joinedAt: user.createdAt.toISOString(),
      emailVerified: !!user.emailVerifiedAt,
      referralLink,
      school: user.school,
      market: user.market,
    });
  } catch (err) {
    next(err);
  }
}

export async function getWaitlistDashboard(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        school: { select: { id: true, name: true, city: true, state: true } },
        market: { select: { id: true, name: true, city: true, state: true } },
        referralsGiven: { where: { status: 'COUNTED' } },
      },
    });

    if (!user) throw new AppError('User not found', 404);

    const competition = await prisma.competition.findFirst({
      where: { status: 'ACTIVE' },
      orderBy: { startDate: 'desc' },
    });

    const referralLink = `${env.appUrl}/join?ref=${user.referralCode}`;

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        waitlistPosition: user.waitlistPosition,
        referralCode: user.referralCode,
        referralLink,
        joinedAt: user.createdAt.toISOString(),
      },
      school: user.school,
      market: user.market,
      referrals: { directInvites: user.referralsGiven.length },
      competition: competition
        ? {
            id: competition.id,
            title: competition.title,
            status: competition.status,
            startDate: competition.startDate.toISOString(),
            endDate: competition.endDate.toISOString(),
            gracePeriodEndDate: competition.gracePeriodEndDate?.toISOString() || null,
            isExtended: competition.isExtended,
            scoringOpen: competition.scoringOpen,
          }
        : null,
    });
  } catch (err) {
    next(err);
  }
}
