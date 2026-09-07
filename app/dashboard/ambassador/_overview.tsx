"use client";

import Link from "next/link";
import { Check, Copy } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import type { AmbassadorDashboardResponse, AmbassadorLeaderboardEntry } from "@/lib/api/ambassador.types";
import {
  countdownLabel,
  countdownTarget,
  ensureSelfOnLeaderboard,
  filterLeaderboard,
  standingFor,
  withScopeRanks,
  type HubPhase,
  type HubScope,
} from "@/lib/ambassador-hub";
import { ScopeTabs, welcomeBody } from "./_hub";
import { useHubPhase } from "@/lib/dev-phase";

/* Palette sampled directly from the artboards rather than eyeballed. */
const INK = "#000000";
const INK_SUB = "#515151"; // welcome subtitle
const INK_LABEL = "#4d4d4d"; // section labels (YOUR PROGRESS, CAMPUS RANK)
const INK_VALUE = "#282828"; // big numerals in the rank strip / progress split
const INK_NOTE = "#7c7c7c"; // "44 invites behind 1st"
const INK_HEADING = "#181818"; // LEADERBOARD SUMMARY / RECENT ACTIVITY
const TEAL = "#054d5a"; // total impact, "View all activity"
const DEEP_GREEN = "#14312b"; // share button
const TAB_GREEN = "#17371b"; // active tab, You badge, highlighted row bar
const OLIVE = "#2f4227"; // "View leaderboard"
const BORDER = "#eeeeee";
const ROW_TINT = "#f8f9f6";

function formatCountdown(endDate: string | null | undefined, now: number | null) {
  if (!endDate || now === null) return null;
  const end = new Date(endDate).getTime();
  if (Number.isNaN(end)) return null;

  const diff = Math.max(0, end - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  /* Two non-breaking spaces between units - plain double spaces collapse in HTML. */
  const gap = "  ";
  return [`${days}d`, `${hours}h`, `${minutes}m`, `${seconds}s`].join(gap);
}

function formatTimeAgo(iso: string, now: number | null) {
  if (now === null) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  const seconds = Math.max(0, Math.floor((now - then) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

/* "Emma Rodriguez" -> "Emma R." */
function shortName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "Someone";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

function initials(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/* The design spells the join path out per row. referralDepth is 1 for someone
   who used your link, 2 for their invite, 3+ for anything deeper. */
function joinPhrase(referralDepth: number) {
  if (referralDepth <= 1) return "joined using your link";
  if (referralDepth === 2) return "joined through your invite";
  return "joined through your network";
}

function isSameDay(iso: string, now: number) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date(now);
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/* Gap between this ambassador and the top of a given ranking scope. */
function invitesBehindLeader(rows: AmbassadorLeaderboardEntry[], myTotal: number) {
  if (!rows.length) return null;
  const leaderTotal = rows.reduce((best, row) => Math.max(best, row.totalReferralNetwork), 0);
  return Math.max(0, leaderTotal - myTotal);
}

function behindLabel(gap: number | null) {
  if (gap === null) return "Not ranked yet";
  if (gap <= 0) return "Currently in 1st";
  return `${gap.toLocaleString()} invite${gap === 1 ? "" : "s"} behind 1st`;
}

export function AmbassadorOverviewContent({
  data,
  now,
  copied,
  onCopy,
}: {
  data: AmbassadorDashboardResponse;
  now: number | null;
  copied: boolean;
  onCopy: () => void;
}) {
  const [scope, setScope] = useState<HubScope>("campus");
  const firstName = data.user.fullName?.trim().split(/\s+/)[0] ?? "Ambassador";
  const referralLink = data.user.referralLink ?? "";
  const displayLink = referralLink.replace(/^https?:\/\//, "");
  const phase = useHubPhase(data.competition, now ?? undefined);
  const countdown = formatCountdown(countdownTarget(data.competition, phase), now);
  const over = phase === "finished" || phase === "results";

  const personalInvites = data.overview.directInvites;
  const totalImpact = data.overview.totalReferralNetwork;
  const networkInvites = Math.max(0, totalImpact - personalInvites);
  const leaderboard = data.leaderboard ?? [];
  const referralNetwork = data.referralNetwork ?? { directReferrals: [], downstreamNetwork: [] };
  const school = data.school?.name ?? null;
  const market = data.market?.name ?? null;

  const rows = useMemo(
    () =>
      ensureSelfOnLeaderboard(leaderboard, {
        userId: data.user.id,
        fullName: data.user.fullName ?? "You",
        school,
        market,
        totalReferralNetwork: totalImpact,
        directInvites: personalInvites,
        appDownloads: 0,
        appDownloadsEnabled: false,
      } as AmbassadorLeaderboardEntry),
    [leaderboard, data.user.id, data.user.fullName, school, market, totalImpact, personalInvites]
  );

  const standing = useMemo(
    () => standingFor(rows, data.user.id, school, market),
    [rows, data.user.id, school, market]
  );

  const scopedTop = useMemo(
    () => withScopeRanks(filterLeaderboard(rows, scope, school, market)).slice(0, 5),
    [rows, scope, school, market]
  );

  const campusRows = useMemo(() => filterLeaderboard(rows, "campus", school, market), [rows, school, market]);
  const marketRows = useMemo(() => filterLeaderboard(rows, "market", school, market), [rows, school, market]);

  /* Referrals counted today, deduped across direct + downstream. */
  const joinedToday = useMemo(() => {
    if (now === null) return 0;
    const seen = new Set<string>();
    return [...referralNetwork.directReferrals, ...referralNetwork.downstreamNetwork].filter((node) => {
      if (seen.has(node.id) || !node.isCompleted) return false;
      seen.add(node.id);
      return isSameDay(node.countedAt ?? node.joinedAt, now);
    }).length;
  }, [referralNetwork, now]);

  const campusRank = standing.campus;
  const marketRank = standing.market;
  const nationalRank = standing.national;

  /* Once the competition is over the design swaps the "behind 1st" notes for
     final-placement copy, which the cohort sizes already give us. */
  const percentile =
    nationalRank && rows.length ? Math.max(1, Math.round((nationalRank / rows.length) * 100)) : null;
  const pending = phase === "upcoming"; // ranks aren't meaningful until it starts
  const impactNote =
    pending && joinedToday === 0
      ? "-- today"
      : over
        ? percentile
          ? `Top ${percentile}% of ambassadors`
          : "Final impact"
        : `+${joinedToday} today`;
  const pendingNote = "-- invites behind 1st";
  return (
    <>
      {/* HEADER + PHASE BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-4 md:gap-6 items-start">
        <div className="min-w-0">
          <h1
            className="font-canela-display text-[28px] md:text-[38px] font-normal leading-[1.1]"
            style={{ color: INK }}
          >
            Welcome, {firstName}.
          </h1>
          <p
            className="mt-3 font-lato text-[13px] md:text-[15px] font-normal leading-[1.6] max-w-[30rem]"
            style={{ color: INK_SUB }}
          >
            {welcomeBody(phase)}
          </p>

          {/* Artboards 1_06 and 1_10 carry this note, the running and download
              states do not — it answers the question people have before the
              competition opens, not during it. */}
          {phase === "upcoming" ? (
            <p className="mt-4 flex gap-3 font-lato text-[12px] md:text-[13px] font-bold" style={{ color: INK }}>
              <span aria-hidden>*</span>
              <span>Ambassadors can invite friends outside their campus, all count.</span>
            </p>
          ) : null}
        </div>

        <PhaseBanner phase={phase} countdown={countdown} />
      </div>

      {/* PROGRESS + AMBASSADOR LINK */}
      <div className="grid grid-cols-1 lg:grid-cols-[0.44fr_0.56fr] gap-4 md:gap-5">
        <Card className="px-8 md:px-10 pt-7 pb-6 flex flex-col">
          <SectionLabel>Your Progress</SectionLabel>

          {/* Sans here, serif in the rank strip below: artboards 10 and 15 set
              the progress numerals in Lato and only the rank numerals in the
              Minion cut. There is no caption under this number in either. */}
          <div className="flex flex-col items-center mt-7">
            <span className="font-lato text-[46px] md:text-[56px] font-bold leading-none" style={{ color: TEAL }}>
              {totalImpact.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 mt-8">
            <ProgressSplit value={personalInvites} label="Personal Invites" note="People who joined using your link" />
            <div className="border-l" style={{ borderColor: BORDER }}>
              <ProgressSplit
                value={networkInvites}
                label="Network Invites"
                note="People who joined through your invites"
              />
            </div>
          </div>
        </Card>

        <Card className="px-7 pt-7 pb-7 flex flex-col">
          <SectionLabel>Your Ambassador Link</SectionLabel>
          <LinkBody
            phase={phase}
            displayLink={displayLink}
            referralLink={referralLink}
            copied={copied}
            onCopy={onCopy}
          />
        </Card>
      </div>

      {/* IMPACT + RANK STRIP */}
      <section
        className="rounded-[12px] border px-5 md:px-6 py-6 grid grid-cols-2 xl:grid-cols-4"
        style={{ borderColor: BORDER, background: over ? "#f4f7f3" : "#ffffff" }}
      >
        <RankTile
          label="Your Impact"
          value={pending && totalImpact === 0 ? "000" : totalImpact.toLocaleString()}
          note={impactNote}
          divided={over}
          first
        />
        <RankTile
          label="Campus Rank"
          value={pending || !campusRank ? "--" : `#${campusRank}`}
          note={
            pending
              ? pendingNote
              : over
                ? finalNote(campusRows.length, school ? `at ${school}` : null)
                : behindLabel(invitesBehindLeader(campusRows, totalImpact))
          }
          divided={over}
        />
        <RankTile
          label="Market Rank"
          value={pending || !marketRank ? "--" : `#${marketRank}`}
          note={
            pending
              ? pendingNote
              : over
                ? finalNote(marketRows.length, market ? `in ${market}` : null)
                : behindLabel(invitesBehindLeader(marketRows, totalImpact))
          }
          divided={over}
        />
        <RankTile
          label="National Rank"
          value={pending || !nationalRank ? "--" : `#${nationalRank}`}
          note={
            pending
              ? pendingNote
              : over
                ? finalNote(rows.length, "nationwide")
                : behindLabel(invitesBehindLeader(rows, totalImpact))
          }
          divided={over}
        />
      </section>

      {/* LEADERBOARD SUMMARY + RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4 md:gap-5 items-stretch">
        <Card className="px-6 py-5 flex flex-col">
          <div className="flex items-center justify-between gap-3">
            <PanelHeading>Leaderboard Summary</PanelHeading>
            <Link
              href="/dashboard/ambassador/leaderboard"
              className="font-lato text-[13px] font-bold hover:underline underline-offset-4 whitespace-nowrap"
              style={{ color: OLIVE }}
            >
              View leaderboard <span aria-hidden>&rarr;</span>
            </Link>
          </div>

          {phase === "upcoming" ? (
            <EmptyState
              art={<TrophyArt />}
              title={
                <>
                  The leaderboard will appear
                  <br />
                  when the competition begins.
                </>
              }
              body="Be the first to make your mark."
            />
          ) : (
            <>
              <div className="mt-4">
                <ScopeTabs value={scope} onChange={setScope} />
              </div>
              <LeaderboardTable rows={scopedTop} meId={data.user.id} scope={scope} />
            </>
          )}
        </Card>

        <Card className="px-6 py-5 flex flex-col">
          <PanelHeading>Recent Activity</PanelHeading>
          <ActivityBody phase={phase} activity={data.recentActivity} now={now} />
        </Card>
      </div>
    </>
  );
}

function finalNote(count: number, where: string | null) {
  if (!count || !where) return "Final placement";
  return `Out of ${count} ${where}`;
}

/* ---------------------------------------------------------------- shells -- */

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[12px] border bg-white ${className}`} style={{ borderColor: BORDER }}>
      {children}
    </section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      className="font-sfpro text-[11px] md:text-[12px] font-bold uppercase tracking-[0.12em]"
      style={{ color: INK_LABEL }}
    >
      {children}
    </p>
  );
}

function PanelHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      className="font-sfpro text-[13px] md:text-[15px] font-bold uppercase tracking-[0.08em]"
      style={{ color: INK_HEADING }}
    >
      {children}
    </h2>
  );
}

/* ---------------------------------------------------------- phase banner --
   Six states in the design; see HubPhase for how each maps onto the API. */

const BANNER: Record<HubPhase, { bg: string; ink: string }> = {
  upcoming: { bg: "#fcfbfb", ink: "#054d5a" },
  inviting: { bg: "#fcfbfb", ink: "#3b842c" },
  inviteEnded: { bg: "#fdfbf9", ink: "#ae772a" },
  download: { bg: "#f9faf8", ink: "#245531" },
  finished: { bg: "#fcf6f7", ink: "#8c3a3f" },
  results: { bg: "#f1f5f0", ink: "#173320" },
};

function PhaseBanner({ phase, countdown }: { phase: HubPhase; countdown: string | null }) {
  const { bg, ink } = BANNER[phase];
  const shell =
    "rounded-[12px] px-7 py-6 flex items-center gap-6 min-h-[114px] lg:min-w-[495px] lg:max-w-[660px]";

  if (phase === "finished") {
    return (
      <div className={shell} style={{ background: bg }}>
        <TrophyBadge circle="#f5dad9" ink={ink} />
        <div className="min-w-0">
          <p className="font-sfpro text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: INK_LABEL }}>
            You finished
          </p>
          <p className="mt-1.5 font-canela-display text-[19px] md:text-[21px] font-normal leading-[1.25]" style={{ color: INK }}>
            Waiting for all markets
            <br />
            to finish.
          </p>
        </div>
        <p className="ml-auto text-right font-canela-display text-[16px] md:text-[18px] font-normal leading-[1.35]" style={{ color: INK_SUB }}>
          Thanks for participating.
          <br />
          Winners will be announced soon.
        </p>
      </div>
    );
  }

  if (phase === "results") {
    return (
      <div className={shell} style={{ background: bg }}>
        <TrophyBadge circle="#dde8de" ink={ink} />
        <div className="min-w-0">
          <p className="font-sfpro text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: INK_LABEL }}>
            Competition over
          </p>
          <p className="mt-1.5 font-canela-display text-[20px] md:text-[23px] font-normal leading-[1.2]" style={{ color: INK }}>
            Final results are in!
          </p>
        </div>
        <Link
          href="/dashboard/ambassador/leaderboard"
          className="ml-auto shrink-0 rounded-full px-7 py-3 font-lato text-[13px] font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: "#173320" }}
        >
          See winners
        </Link>
      </div>
    );
  }

  if (phase === "inviteEnded" || phase === "download") {
    const heading =
      phase === "inviteEnded" ? "Invitation period ended" : "Download period active";
    const body =
      phase === "inviteEnded" ? (
        "Download period starts soon"
      ) : (
        <>
          Verified downloads are used
          <br />
          to determine final impact
        </>
      );
    return (
      <div className={shell} style={{ background: bg }}>
        <div className="min-w-0">
          <p className="font-sfpro text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: INK_LABEL }}>
            {heading}
          </p>
          <p className="mt-1.5 font-canela-display text-[18px] md:text-[20px] font-normal leading-[1.3]" style={{ color: INK }}>
            {body}
          </p>
        </div>
        <div className="ml-auto text-right shrink-0">
          <p className="font-sfpro text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: INK_LABEL }}>
            {countdownLabel(phase)}
          </p>
          <p
            className="mt-1.5 font-canela-display text-[24px] md:text-[30px] font-normal leading-none whitespace-nowrap"
            style={{ color: ink }}
          >
            {countdown ?? "--"}
          </p>
        </div>
      </div>
    );
  }

  /* upcoming + inviting: label on the left, countdown on the right. */
  return (
    <div className={`${shell} justify-between`} style={{ background: bg }}>
      <p className="font-sfpro text-[11px] md:text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: INK_LABEL }}>
        {countdownLabel(phase)}
      </p>
      <p
        className="font-canela-display text-[26px] md:text-[32px] font-normal leading-none whitespace-nowrap"
        style={{ color: ink }}
      >
        {countdown ?? "--"}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------ link card -- */

function LinkBody({
  phase,
  displayLink,
  referralLink,
  copied,
  onCopy,
}: {
  phase: HubPhase;
  displayLink: string;
  referralLink: string;
  copied: boolean;
  onCopy: () => void;
}) {
  const locked = phase === "upcoming";

  const handleShare = async () => {
    if (!referralLink) return;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Bubba",
          text: "Join me on Bubba and unlock perks together!",
          url: referralLink,
        });
        return;
      } catch {
        /* share sheet dismissed - fall through to copying */
      }
    }
    onCopy();
  };

  if (locked) {
    return (
      <>
        <p
          className="mt-8 text-center font-lato text-[15px] md:text-[17px] font-bold leading-[1.5]"
          style={{ color: INK_VALUE }}
        >
          Your link will be available
          <br />
          when the competition begins.
        </p>
        <div className="flex-1 min-h-6" />
        <button
          type="button"
          disabled
          className="w-full rounded-[8px] py-3.5 font-lato text-[13px] font-bold text-white/90 cursor-not-allowed"
          style={{ background: "#93a29b" }}
        >
          Share your link
        </button>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 mt-3 pb-5 border-b" style={{ borderColor: BORDER }}>
        <span
          className="font-canela-display text-[22px] md:text-[28px] font-medium truncate select-all"
          style={{ color: INK }}
        >
          {displayLink || "Link unavailable"}
        </span>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? "Ambassador link copied" : "Copy ambassador link"}
          className="shrink-0 text-[#2b1d16] hover:text-black transition-colors cursor-pointer"
        >
          {copied ? (
            <Check className="w-5 h-5 text-[#3b9347]" strokeWidth={1.8} aria-hidden />
          ) : (
            <Copy className="w-5 h-5" strokeWidth={1.6} aria-hidden />
          )}
        </button>
      </div>

      <div className="flex-1 min-h-6" />

      <button
        type="button"
        onClick={handleShare}
        className="w-full rounded-[8px] py-3.5 font-lato text-[13px] font-bold text-white transition-opacity hover:opacity-90 cursor-pointer"
        style={{ background: DEEP_GREEN }}
      >
        Share your link
      </button>
    </>
  );
}

/* ------------------------------------------------------------- fragments -- */

function ProgressSplit({ value, label, note }: { value: number; label: string; note: string }) {
  return (
    <div className="flex flex-col items-center text-center px-3">
      <span className="font-lato text-[28px] md:text-[34px] font-bold leading-none" style={{ color: INK_VALUE }}>
        {value.toLocaleString()}
      </span>
      <span className="font-lato text-[12px] md:text-[13px] font-black mt-3.5" style={{ color: INK_VALUE }}>
        {label}
      </span>
      <span className="font-lato text-[12px] md:text-[13px] font-normal mt-1.5 leading-[1.35] max-w-[135px]" style={{ color: INK_NOTE }}>
        {note}
      </span>
    </div>
  );
}

function RankTile({
  label,
  value,
  note,
  divided,
  first = false,
}: {
  label: string;
  value: string;
  note: string;
  divided: boolean;
  first?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center text-center px-3 py-2 ${divided && !first ? "xl:border-l" : ""}`}
      style={divided && !first ? { borderColor: "#dfe6dd" } : undefined}
    >
      <p className="font-sfpro text-[10px] md:text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: INK_LABEL }}>
        {label}
      </p>
      <p className="font-minionvariable text-[26px] md:text-[32px] font-bold leading-none mt-2.5" style={{ color: INK_VALUE }}>
        {value}
      </p>
      <p className="font-lato text-[11px] md:text-[12px] font-normal mt-2" style={{ color: INK_NOTE }}>
        {note}
      </p>
    </div>
  );
}

function LeaderboardTable({
  rows,
  meId,
  scope,
}: {
  rows: Array<AmbassadorLeaderboardEntry & { scopeRank: number }>;
  meId: string;
  scope: HubScope;
}) {
  if (!rows.length) {
    return (
      <p className="font-lato text-[13px] font-semibold text-neutral-500 py-6">
        No {scope} rankings published yet.
      </p>
    );
  }

  return (
    <div className="mt-5 flex flex-col">
      <div className="grid grid-cols-[36px_minmax(0,1fr)_78px_88px] items-center gap-2 pb-3">
        <Th>Rank</Th>
        <Th>Ambassador</Th>
        <Th className="text-right">Impact</Th>
        <Th className="text-right">Downloads</Th>
      </div>

      {rows.map((row, index) => {
        const isMe = row.userId === meId;
        return (
          <div
            key={row.userId}
            className={`relative grid grid-cols-[36px_minmax(0,1fr)_78px_88px] items-center gap-2 py-3.5 ${
              index < rows.length - 1 ? "border-b" : ""
            }`}
            style={{
              borderColor: BORDER,
              background: isMe ? ROW_TINT : undefined,
            }}
          >
            {isMe ? (
              <span
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r"
                style={{ background: TAB_GREEN }}
                aria-hidden
              />
            ) : null}

            <span className="font-lato text-[14px] font-normal pl-2" style={{ color: INK_VALUE }}>
              {row.scopeRank}
            </span>

            <span className="flex items-center gap-3 min-w-0">
              <Avatar name={row.fullName} />
              <span className="min-w-0">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="font-lato text-[13px] md:text-[14px] font-bold truncate" style={{ color: INK }}>
                    {row.fullName}
                  </span>
                  {isMe ? (
                    <span
                      className="shrink-0 rounded-[4px] border px-1.5 py-0.5 font-lato text-[10px] font-bold leading-none"
                      style={{ borderColor: TAB_GREEN, color: TAB_GREEN }}
                    >
                      You
                    </span>
                  ) : null}
                </span>
                {scope !== "campus" && row.school ? (
                  <span className="block font-lato text-[11px] font-normal truncate mt-0.5" style={{ color: INK_NOTE }}>
                    {row.school}
                  </span>
                ) : null}
              </span>
            </span>

            <span className="text-right font-lato text-[13px] md:text-[14px] font-normal" style={{ color: INK_VALUE }}>
              {row.totalReferralNetwork.toLocaleString()}
            </span>

            <span className="text-right font-lato text-[13px] md:text-[14px] font-normal" style={{ color: INK_NOTE }}>
              {row.appDownloadsEnabled ? row.appDownloads.toLocaleString() : "--"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Th({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`font-sfpro text-[10px] font-bold uppercase tracking-[0.1em] ${className}`}
      style={{ color: INK_LABEL }}
    >
      {children}
    </span>
  );
}

function ActivityBody({
  phase,
  activity,
  now,
}: {
  phase: HubPhase;
  activity: AmbassadorDashboardResponse["recentActivity"];
  now: number | null;
}) {
  if (phase === "upcoming") {
    return (
      <>
        <EmptyState
          art={<ClockArt />}
          title="No activity yet."
          body="Direct and indirect joins, milestones, and downloads will show up here when the competition starts."
        />
        <ViewAllActivity />
      </>
    );
  }

  if (phase === "results") {
    return (
      <>
        <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
          <TrophyBadge circle="#dde8de" ink="#173320" size={56} />
          <p className="mt-5 font-lato text-[15px] font-bold" style={{ color: INK }}>
            Competition complete
          </p>
          <p className="mt-3 font-lato text-[13px] leading-[1.55] max-w-[19rem]" style={{ color: INK_SUB }}>
            All activity has been recorded. Thanks for being part of the Bubba launch.
          </p>
          <Link
            href="/dashboard/ambassador/leaderboard"
            className="mt-6 rounded-full px-7 py-3 font-lato text-[13px] font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "#173320" }}
          >
            See winners
          </Link>
        </div>
        <ViewAllActivity />
      </>
    );
  }

  if (!activity.length) {
    return (
      <>
        <p className="font-lato text-[13px] font-semibold text-neutral-500 py-6">No referral activity yet.</p>
        <ViewAllActivity />
      </>
    );
  }

  return (
    <>
      <div className="mt-4 flex flex-col flex-1">
        {activity.slice(0, 5).map((row) => (
          <div key={row.id} className="flex items-center gap-3 py-3.5 border-b" style={{ borderColor: BORDER }}>
            <JoinMark />
            <span className="font-lato text-[13px] font-bold shrink-0" style={{ color: INK }}>
              {shortName(row.fullName)}
            </span>
            <span className="font-lato text-[13px] font-normal truncate" style={{ color: INK_SUB }}>
              {joinPhrase(row.referralDepth)}
            </span>
            <span className="ml-auto font-lato text-[12px] font-normal shrink-0" style={{ color: INK_NOTE }}>
              {formatTimeAgo(row.createdAt, now)}
            </span>
          </div>
        ))}
      </div>
      <ViewAllActivity />
    </>
  );
}

function ViewAllActivity() {
  return (
    <div className="pt-6 flex justify-center">
      <Link
        href="/dashboard/ambassador/network"
        className="font-lato text-[13px] font-bold hover:underline underline-offset-4"
        style={{ color: TEAL }}
      >
        View all activity
      </Link>
    </div>
  );
}

function EmptyState({ art, title, body }: { art: ReactNode; title: ReactNode; body: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
      {art}
      <p className="mt-7 font-lato text-[15px] md:text-[17px] font-bold leading-[1.45]" style={{ color: INK }}>
        {title}
      </p>
      <p className="mt-4 font-lato text-[13px] leading-[1.55] max-w-[21rem]" style={{ color: INK_SUB }}>
        {body}
      </p>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="w-8 h-8 rounded-full bg-[#f2eee7] border border-[#e6dfd4] flex items-center justify-center shrink-0 font-lato text-[11px] font-bold text-[#584939] select-none">
      {initials(name)}
    </span>
  );
}

function JoinMark() {
  return (
    <span className="w-7 h-7 rounded-full bg-[#eef2ec] flex items-center justify-center shrink-0" aria-hidden>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <circle cx="6.4" cy="5" r="2.6" stroke="#3b6b45" strokeWidth="1.2" />
        <path d="M1.9 13.4c0-2.3 2-4 4.5-4s4.5 1.7 4.5 4" stroke="#3b6b45" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M12.4 5.2v3.2M14 6.8h-3.2" stroke="#3b6b45" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function TrophyBadge({ circle, ink, size = 52 }: { circle: string; ink: string; size?: number }) {
  return (
    <span
      className="rounded-full flex items-center justify-center shrink-0"
      style={{ background: circle, width: size, height: size }}
      aria-hidden
    >
      <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24" fill="none">
        <path
          d="M7 3h10v5a5 5 0 0 1-10 0V3Z"
          stroke={ink}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M7 4.5H4.5A2.5 2.5 0 0 0 7 9M17 4.5h2.5A2.5 2.5 0 0 1 17 9" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 13v4M8.5 21h7M9.5 21c0-1.7 1-2.6 2.5-2.6s2.5.9 2.5 2.6" stroke={ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/* ponytail: hand-traced line art standing in for the exported illustrations.
   Both are single-component swaps once the Figma vectors land. */

function TrophyArt() {
  return (
    <svg width="104" height="92" viewBox="0 0 104 92" fill="none" aria-hidden>
      <g stroke="#2b2b2b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M36 20h32v14a16 16 0 0 1-32 0V20Z" />
        <path d="M36 24H26a10 10 0 0 0 10 14M68 24h10a10 10 0 0 1-10 14" />
        <path d="M52 50v10" />
        <path d="M41 74h22M43 74c0-6 4-9 9-9s9 3 9 9" />
        <path d="M34 74h36v5H34z" />
      </g>
      <Sparkle x={20} y={26} r={6} />
      <Sparkle x={84} y={38} r={5} />
      <Sparkle x={77} y={19} r={3.5} />
    </svg>
  );
}

function ClockArt() {
  return (
    <svg width="104" height="92" viewBox="0 0 104 92" fill="none" aria-hidden>
      <circle cx="52" cy="46" r="26" stroke="#2b2b2b" strokeWidth="1.5" />
      <circle cx="52" cy="46" r="1.7" fill="#2b2b2b" />
      <path d="M52 30v16l10 6" stroke="#2b2b2b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Sparkle x={17} y={34} r={6} />
      <Sparkle x={88} y={55} r={5} />
      <Sparkle x={82} y={24} r={3.5} />
      <Sparkle x={22} y={68} r={4} />
    </svg>
  );
}

/* Concave four-point star - the sparkle the artboards scatter around both
   empty-state illustrations. */
function Sparkle({ x, y, r }: { x: number; y: number; r: number }) {
  const c = r * 0.34;
  return (
    <path
      d={`M${x} ${y - r} C${x + c} ${y - c} ${x + c} ${y - c} ${x + r} ${y} C${x + c} ${y + c} ${x + c} ${y + c} ${x} ${y + r} C${x - c} ${y + c} ${x - c} ${y + c} ${x - r} ${y} C${x - c} ${y - c} ${x - c} ${y - c} ${x} ${y - r}Z`}
      fill="#2b2b2b"
    />
  );
}
