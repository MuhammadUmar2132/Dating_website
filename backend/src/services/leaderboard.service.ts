import { prisma } from '../config/prisma';

export type LeaderboardScope = 'campus' | 'market' | 'national' | 'participation';

/**
 * Build a leaderboard for a given scope.
 * Rankings are based on total points.
 */
export async function getLeaderboard(
  scope: LeaderboardScope,
  scopeId?: string,
  limit = 50
) {
  // Build the where clause for user filter
  const userWhere: Record<string, any> = { isActive: true, onboardingCompletedAt: { not: null } };

  if (scope === 'campus' && scopeId) userWhere.schoolId = scopeId;
  if (scope === 'market' && scopeId) userWhere.marketId = scopeId;

  // Get all eligible users with points aggregated
  const users = await prisma.user.findMany({
    where: userWhere,
    select: {
      id: true,
      fullName: true,
      school: { select: { name: true } },
      market: { select: { name: true } },
      pointsLedger: {
        select: { points: true, pointCategory: true },
      },
      referralsGiven: {
        where: { status: 'COUNTED' },
        select: { id: true },
      },
    },
  });

  // Compute totals and sort
  const ranked = users
    .map((u) => {
      const invitePoints = u.pointsLedger
        .filter((p) => p.pointCategory === 'INVITE')
        .reduce((s, p) => s + p.points, 0);
      const promptPoints = u.pointsLedger
        .filter((p) => p.pointCategory === 'PROMPT')
        .reduce((s, p) => s + p.points, 0);
      const participationPoints = u.pointsLedger
        .filter((p) => p.pointCategory === 'PARTICIPATION')
        .reduce((s, p) => s + p.points, 0);
      const totalPoints = u.pointsLedger.reduce((s, p) => s + p.points, 0);

      return {
        userId: u.id,
        fullName: u.fullName || 'Anonymous',
        school: u.school?.name || null,
        market: u.market?.name || null,
        invitePoints,
        promptPoints,
        participationPoints,
        totalPoints,
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, limit)
    .map((entry, idx) => ({
      rank: idx + 1,
      ...entry,
      rankMovement: 0,
      rankMovementDirection: 'SAME' as const,
      rankMovementLabel: 'No change',
    }));

  return ranked;
}

/**
 * Get a specific user's rank and leaderboard context.
 */
export async function getUserLeaderboardData(
  userId: string,
  scope: LeaderboardScope,
  scopeId?: string
) {
  const leaderboard = await getLeaderboard(scope, scopeId);
  const userEntry = leaderboard.find((e) => e.userId === userId);
  const userRank = userEntry?.rank || null;

  const competition = await prisma.competition.findFirst({
    where: { status: 'ACTIVE' },
    orderBy: { startDate: 'desc' },
  });

  const userPoints = userEntry
    ? {
        invitePoints: userEntry.invitePoints,
        promptPoints: userEntry.promptPoints,
        participationPoints: userEntry.participationPoints,
      }
    : { invitePoints: 0, promptPoints: 0, participationPoints: 0 };

  return {
    meta: {
      scopeName: scopeId || null,
      scopeLabel: scope,
      competition: competition
        ? {
            id: competition.id,
            title: competition.title,
            startDate: competition.startDate.toISOString(),
            endDate: competition.endDate.toISOString(),
            gracePeriodEndDate: competition.gracePeriodEndDate?.toISOString() || null,
            status: competition.status,
            isExtended: competition.isExtended,
            scoringOpen: competition.scoringOpen,
          }
        : null,
      totalParticipants: leaderboard.length,
      userRank,
      previousRank: null,
      rankMovement: 0,
      rankMovementDirection: 'SAME',
      totalPoints: (userEntry?.totalPoints || 0),
      breakdown: userPoints,
    },
    leaderboard,
  };
}
