import assert from "node:assert/strict";

import {
  countdownTarget,
  ensureSelfOnLeaderboard,
  filterLeaderboard,
  getHubPhase,
  importantDates,
  isCompetitionOver,
  standingScenario,
  withScopeRanks,
} from "./ambassador-hub";

assert.equal(standingScenario("upcoming"), "soon");
assert.equal(standingScenario("inviting"), "ranked");
assert.equal(standingScenario("download"), "ranked");
assert.equal(standingScenario("finished"), "ranked");
assert.equal(standingScenario("results"), "ranked");
assert.equal(standingScenario("inviteEnded"), "ranked");

assert.equal(getHubPhase({ status: "UPCOMING" }), "upcoming");
assert.equal(getHubPhase({ status: "ACTIVE" }), "inviting");
assert.equal(getHubPhase({ status: "GRACE_PERIOD" }), "download");
assert.equal(getHubPhase({ status: "ENDED" }), "finished");
assert.equal(getHubPhase({ status: "ARCHIVED" }), "results");
assert.equal(getHubPhase(null), "upcoming");

/* Grace period splits on downloadOpensAt: before it the design shows the
   "download period starts soon" banner, after it the active one. */
const grace = { status: "GRACE_PERIOD", downloadOpensAt: "2026-05-20T00:00:00.000Z" };
assert.equal(getHubPhase(grace, Date.parse("2026-05-19T00:00:00.000Z")), "inviteEnded");
assert.equal(getHubPhase(grace, Date.parse("2026-05-21T00:00:00.000Z")), "download");
/* Without the field the API cannot tell the two apart - stay on "download". */
assert.equal(getHubPhase({ status: "GRACE_PERIOD" }), "download");

assert.equal(isCompetitionOver("finished"), true);
assert.equal(isCompetitionOver("results"), true);
assert.equal(isCompetitionOver("inviting"), false);
assert.equal(isCompetitionOver("inviteEnded"), false);

assert.equal(countdownTarget(grace, "inviteEnded"), "2026-05-20T00:00:00.000Z");

const dates = importantDates({
  startDate: "2026-05-05T12:00:00.000Z",
  endDate: "2026-05-12T12:00:00.000Z",
  gracePeriodEndDate: "2026-06-05T12:00:00.000Z",
});
assert.equal(dates.length, 4);
assert.equal(dates[0].title, "Competition starts");
assert.equal(dates[0].description, "Invite your friends");
assert.equal(dates[1].title, "Invites & Waitlist Ends");
assert.equal(dates[2].title, "App launches in select markets");
/* The launch row spans end -> grace, so it renders as a range. */
assert.equal(dates[2].date, "2026-05-12T12:00:00.000Z");
assert.equal(dates[2].endDate, "2026-06-05T12:00:00.000Z");
assert.equal(dates[3].title, "Competition Scoring");

/* With no grace period the launch row collapses to a single date. */
const noGrace = importantDates({
  startDate: "2026-05-05T12:00:00.000Z",
  endDate: "2026-05-12T12:00:00.000Z",
});
assert.equal(noGrace[2].endDate, undefined);

const rows = [
  { userId: "a", fullName: "Ann", school: "A U", market: "Austin", totalReferralNetwork: 10, directInvites: 4 },
  { userId: "b", fullName: "Ben", school: "B U", market: "Austin", totalReferralNetwork: 30, directInvites: 8 },
  { userId: "c", fullName: "Cam", school: "A U", market: "Boston", totalReferralNetwork: 20, directInvites: 6 },
];

const campus = withScopeRanks(filterLeaderboard(rows, "campus", "A U", "Austin"));
assert.deepEqual(campus.map((r) => r.userId), ["c", "a"]);
assert.equal(campus[0].scopeRank, 1);

const self = ensureSelfOnLeaderboard([], {
  userId: "me",
  fullName: "Me",
  school: "A U",
  market: "Austin",
  totalReferralNetwork: 0,
  directInvites: 0,
});
assert.equal(self.length, 1);
assert.equal(self[0].userId, "me");

console.log(JSON.stringify({ ok: true, hubPhase: true, dates: true, ranks: true }));
