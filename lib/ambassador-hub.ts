/* Six banner states exist in the design. Five map onto competition.status;
   "inviteEnded" (artboard 1_13 - "Download period starts soon") is the gap
   between endDate and the download window opening, which the API cannot
   currently express - see downloadOpensAt below. */
export type HubPhase =
  | "upcoming"
  | "inviting"
  | "inviteEnded"
  | "download"
  | "finished"
  | "results";
export type HubScope = "campus" | "market" | "national";

export type HubCompetition = {
  status?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  gracePeriodEndDate?: string | null;
  /* Not sent by /ambassador/dashboard yet. The backend derives scoringOpen as
     `status === ACTIVE`, so it cannot distinguish "grace period, downloads not
     open yet" from "download period running". Once the API sends the moment
     downloads open, getHubPhase returns "inviteEnded" before it. */
  downloadOpensAt?: string | null;
} | null | undefined;

export type HubLeaderboardRow = {
  userId: string;
  fullName: string;
  school: string | null;
  market: string | null;
  totalReferralNetwork: number;
  directInvites: number;
};

export type HubDate = {
  id: string;
  title: string;
  description: string;
  date: string;
  /* Set only on the app-launch row, which the design renders as a range
     ("May 5th - 18th, 2025"). */
  endDate?: string;
};

export function getHubPhase(competition: HubCompetition, now = Date.now()): HubPhase {
  const status = (competition?.status ?? "").toUpperCase();
  if (status === "ACTIVE") return "inviting";
  if (status === "GRACE_PERIOD") {
    const opensAt = competition?.downloadOpensAt;
    if (opensAt && now < new Date(opensAt).getTime()) return "inviteEnded";
    return "download";
  }
  if (status === "ENDED") return "finished";
  if (status === "ARCHIVED") return "results";
  return "upcoming";
}

/* Both post-competition phases count as over for pages that only care whether
   the competition is done (leaderboard winners view, etc.). */
export function isCompetitionOver(phase: HubPhase) {
  return phase === "finished" || phase === "results";
}

export function countdownTarget(competition: HubCompetition, phase = getHubPhase(competition)) {
  if (phase === "upcoming") return competition?.startDate ?? null;
  if (phase === "inviting") return competition?.endDate ?? null;
  if (phase === "inviteEnded") return competition?.downloadOpensAt ?? null;
  if (phase === "download") return competition?.gracePeriodEndDate ?? competition?.endDate ?? null;
  return null;
}

export function countdownLabel(phase: HubPhase) {
  if (phase === "upcoming") return "Competition starts";
  if (phase === "inviting") return "Competition ends";
  if (phase === "inviteEnded") return "Starts in";
  if (phase === "download") return "Ends in";
  return "Competition ended";
}

export function standingScenario(phase: HubPhase): "soon" | "ranked" {
  return phase === "upcoming" ? "soon" : "ranked";
}

/* Titles and descriptions follow artboard 1_4. */
export function importantDates(competition: HubCompetition): HubDate[] {
  if (!competition) return [];
  const start = competition.startDate ?? "";
  const end = competition.endDate ?? "";
  const grace = competition.gracePeriodEndDate ?? end;
  return [
    {
      id: "start",
      title: "Competition starts",
      date: start,
      description: "Invite your friends",
    },
    {
      id: "waitlist-ends",
      title: "Invites & Waitlist Ends",
      date: end,
      description: "Prepare for launch",
    },
    {
      id: "app-launch",
      title: "App launches in select markets",
      date: end,
      endDate: grace && grace !== end ? grace : undefined,
      description: "Everyone on the waitlist is notified of launch",
    },
    {
      id: "scoring",
      title: "Competition Scoring",
      date: grace,
      description: "Final competition results are based on app downloads throughout Month 1.",
    },
  ].filter((row) => row.date);
}

export function filterLeaderboard<T extends HubLeaderboardRow>(
  rows: T[],
  scope: HubScope,
  school: string | null,
  market: string | null,
) {
  if (scope === "campus") return school ? rows.filter((row) => row.school === school) : [];
  if (scope === "market") return market ? rows.filter((row) => row.market === market) : [];
  return rows;
}

export function withScopeRanks<T extends HubLeaderboardRow>(rows: T[]) {
  return [...rows]
    .sort((a, b) => b.totalReferralNetwork - a.totalReferralNetwork || a.fullName.localeCompare(b.fullName))
    .map((row, index) => ({ ...row, scopeRank: index + 1 }));
}

export function ensureSelfOnLeaderboard<T extends HubLeaderboardRow>(rows: T[], self: T) {
  if (rows.some((row) => row.userId === self.userId)) return rows;
  return [...rows, self];
}

export function standingFor<T extends HubLeaderboardRow>(
  rows: T[],
  userId: string,
  school: string | null,
  market: string | null,
) {
  const rankIn = (list: Array<{ userId: string; scopeRank: number }>) =>
    list.find((row) => row.userId === userId)?.scopeRank ?? null;
  return {
    campus: rankIn(withScopeRanks(filterLeaderboard(rows, "campus", school, market))),
    market: rankIn(withScopeRanks(filterLeaderboard(rows, "market", school, market))),
    national: rankIn(withScopeRanks(rows)),
  };
}
