import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { getReferralNetwork } from '../services/referral.service';
import { getLeaderboard } from '../services/leaderboard.service';
import { getUserTotalPoints } from '../services/points.service';
import { sendAmbassadorInviteEmail } from '../services/email.service';
import { env } from '../config/env';
import { v4 as uuidv4 } from 'uuid';

const inviteSchema = z.object({ email: z.string().email() });

export async function getAmbassadorDashboard(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        school: { select: { id: true, name: true } },
        market: { select: { id: true, name: true } },
        referralsGiven: true,
      },
    });

    if (!user) throw new AppError('User not found', 404);
    if (user.role !== 'AMBASSADOR' && user.role !== 'ADMIN') {
      throw new AppError('Ambassador access required', 403);
    }

    const competition = await prisma.competition.findFirst({
      where: { status: 'ACTIVE' },
      orderBy: { startDate: 'desc' },
    });

    const network = await getReferralNetwork(user.id);
    const leaderboard = await getLeaderboard('national', undefined, 10);
    const myRank = leaderboard.find((e) => e.userId === user.id)?.rank || null;
    const prizes = await prisma.reward.findMany({ where: { isActive: true, audienceType: { in: ['ALL', 'AMBASSADOR'] } } });
    const calendar = await prisma.calendarEvent.findMany({ orderBy: { date: 'asc' } });
    const recentActivity = await prisma.referralRelation.findMany({
      where: { referrerId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { referred: { select: { id: true, fullName: true, email: true } } },
    });

    const directCounted = network.totals.directCompleted;
    const directPending = network.totals.directPending;
    const referralLink = `${env.appUrl}/join?ref=${user.referralCode}`;

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        referralCode: user.referralCode,
        referralLink,
        joinedAt: user.createdAt.toISOString(),
      },
      school: user.school,
      market: user.market,
      competition: competition
        ? {
            id: competition.id,
            title: competition.title,
            startDate: competition.startDate.toISOString(),
            endDate: competition.endDate.toISOString(),
            gracePeriodEndDate: competition.gracePeriodEndDate?.toISOString() || null,
            status: competition.status,
            scoringOpen: competition.scoringOpen,
          }
        : null,
      overview: {
        directInvites: user.referralsGiven.length,
        totalReferralNetwork: network.totals.total,
        completedSignups: directCounted,
        pendingReferrals: directPending,
        rank: myRank,
        previousRank: null,
        rankMovement: 0,
        rankMovementDirection: 'SAME',
        rankMovementLabel: 'No change',
        prizeProgress: { total: prizes.length, unlocked: 0 },
      },
      recentActivity: recentActivity.map((r) => ({
        id: r.id,
        type: 'REFERRAL',
        title: 'New referral',
        description: `${r.referred.fullName || 'Someone'} joined via your link`,
        fullName: r.referred.fullName || 'Anonymous',
        maskedEmail: maskEmail(r.referred.email),
        status: r.status,
        referralDepth: r.depth,
        createdAt: r.createdAt.toISOString(),
      })),
      myRank,
      leaderboard,
      referralNetwork: network,
      prizes: prizes.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        rewardType: p.rewardType,
        unlockType: p.unlockType,
        audienceType: p.audienceType,
        requiredInvites: p.requiredInvites,
        requiredRank: p.requiredRank,
        quantity: p.quantity,
        status: p.status,
        unlockStatus: 'LOCKED',
        progress: {
          completedSignups: { current: directCounted, required: p.requiredInvites, percent: Math.min(100, (directCounted / (p.requiredInvites || 1)) * 100) },
          rank: { current: myRank, required: p.requiredRank, percent: 0 },
        },
      })),
      calendar: calendar.map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        date: e.date.toISOString(),
        type: e.type,
      })),
      rulesAndTerms: {
        title: 'Ambassador Rules & Terms',
        sections: ['Eligibility', 'Referral Rules', 'Prize Distribution', 'Code of Conduct'],
        content: 'By participating as a Bea Ambassador you agree to the terms and conditions.',
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getAmbassadorNetwork(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const network = await getReferralNetwork(req.user!.id);
    res.json(network);
  } catch (err) {
    next(err);
  }
}

export async function getAmbassadorLeaderboard(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const leaderboard = await getLeaderboard('national', undefined, 50);
    res.json({ leaderboard });
  } catch (err) {
    next(err);
  }
}

export async function getAmbassadorPrizes(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const prizes = await prisma.reward.findMany({
      where: { isActive: true, audienceType: { in: ['ALL', 'AMBASSADOR'] } },
    });
    res.json({ prizes });
  } catch (err) {
    next(err);
  }
}

export async function getAmbassadorCalendar(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const events = await prisma.calendarEvent.findMany({ orderBy: { date: 'asc' } });
    res.json({ events: events.map((e) => ({ id: e.id, title: e.title, description: e.description, date: e.date.toISOString(), type: e.type })) });
  } catch (err) {
    next(err);
  }
}

export async function sendAmbassadorInvite(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { email } = inviteSchema.parse(req.body);

    // Check if already registered
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.ambassadorInvite.create({
      data: { email: email.toLowerCase(), token, inviterId: req.user!.id, expiresAt },
    });

    const inviteLink = `${env.appUrl}/join/ambassador?token=${token}`;
    const inviterName = req.user!.fullName || 'Your friend';

    if (env.isDev) {
      console.log(`[INVITE] ${inviteLink}`);
    } else {
      await sendAmbassadorInviteEmail(email, inviterName, inviteLink);
    }

    res.json({ email, expiresAt: expiresAt.toISOString(), token });
  } catch (err) {
    next(err);
  }
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  return `${local.slice(0, 2)}${'*'.repeat(Math.max(2, local.length - 2))}@${domain}`;
}
