import { prisma } from '../config/prisma';
import { ReferralStatus, PointCategory } from '@prisma/client';
import { awardPoints } from './points.service';

/**
 * Process a referral when a user joins via referral code.
 * Awards points to referrer and creates a PENDING referral relation.
 */
export async function processReferral(
  referrerId: string,
  referredId: string
): Promise<void> {
  // Create referral relation
  await prisma.referralRelation.upsert({
    where: { referrerId_referredId: { referrerId, referredId } },
    update: {},
    create: { referrerId, referredId, depth: 1, status: ReferralStatus.PENDING },
  });
}

/**
 * Count a referral (when the referred user completes onboarding).
 * Updates status to COUNTED and awards invite points to referrer.
 */
export async function countReferral(referredId: string): Promise<void> {
  const relation = await prisma.referralRelation.findFirst({
    where: { referredId, status: ReferralStatus.PENDING },
  });

  if (!relation) return;

  await prisma.referralRelation.update({
    where: { id: relation.id },
    data: { status: ReferralStatus.COUNTED, countedAt: new Date() },
  });

  // Award 50 points to referrer
  await awardPoints(
    relation.referrerId,
    50,
    'REFERRAL',
    referredId,
    PointCategory.INVITE,
    'Direct referral counted'
  );
}

/**
 * Get referral network for a user (direct + downstream).
 */
export async function getReferralNetwork(userId: string) {
  const directReferrals = await prisma.referralRelation.findMany({
    where: { referrerId: userId },
    include: { referred: { select: { id: true, fullName: true, email: true, createdAt: true } } },
  });

  return {
    directReferrals: directReferrals.map((r) => ({
      id: r.referred.id,
      fullName: r.referred.fullName,
      status: r.status,
      depth: r.depth,
      referredByUserId: r.referrerId,
      referrerName: '',
      maskedEmail: maskEmail(r.referred.email),
      isPending: r.status === ReferralStatus.PENDING,
      isCompleted: r.status === ReferralStatus.COUNTED,
      joinedAt: r.referred.createdAt.toISOString(),
      countedAt: r.countedAt?.toISOString() || null,
    })),
    downstreamNetwork: [],
    depthTotals: [],
    totals: {
      direct: directReferrals.length,
      directCompleted: directReferrals.filter((r) => r.status === ReferralStatus.COUNTED).length,
      directPending: directReferrals.filter((r) => r.status === ReferralStatus.PENDING).length,
      total: directReferrals.length,
      completed: directReferrals.filter((r) => r.status === ReferralStatus.COUNTED).length,
      pending: directReferrals.filter((r) => r.status === ReferralStatus.PENDING).length,
    },
  };
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  return `${local.slice(0, 2)}${'*'.repeat(Math.max(2, local.length - 2))}@${domain}`;
}
