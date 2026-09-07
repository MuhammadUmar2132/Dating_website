"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ChevronDown, Clock, Gift, Trophy, Users } from "lucide-react";

import type { AmbassadorDashboardResponse, AmbassadorLeaderboardEntry } from "@/lib/api/ambassador.types";
import {
  countdownTarget,
  ensureSelfOnLeaderboard,
  filterLeaderboard,
  isCompetitionOver,
  withScopeRanks,
  type HubScope,
} from "@/lib/ambassador-hub";
import { ScopeTabs, TOP_PRIZE_BY_SCOPE, useNow } from "../_hub";
import { useHubPhase } from "@/lib/dev-phase";

/* Sampled from artboard 1. */
const INK = "#000000";
const INK_LABEL = "#4d4d4d";
const INK_NOTE = "#7c7c7c";
const BORDER = "#f1f1f1";
const STAT_GREEN = "#335b38";
const LINK_OLIVE = "#2f4227";
const UP_GREEN = "#4b9e57";
const DOWN_RED = "#dc443e";
const BADGE = ["#faeabd", "#d2d2d5", "#142c1c"] as const;

/* The podium is themed per scope — maroon for campus, navy for market, green
   for national. Sampled from artboards 1_01, 1_17 and 1_18 respectively. */
const PODIUM_THEME: Record<HubScope, { band: string; tint: string; ink: string }> = {
  campus: { band: "#673033", tint: "#f2ebeb", ink: "#6b3135" },
  market: { band: "#1a367c", tint: "#e9f0fa", ink: "#1a367c" },
  national: { band: "#293d2e", tint: "#eaece7", ink: "#335b38" },
};

const WINNER_PILL_LABEL: Record<HubScope, string> = {
  campus: "Campus winner",
  market: "Market winner",
  national: "National winner",
};
const WINNER_BANNER_BG = "#fbf4f4";
const WINNER_BANNER_CIRCLE = "#faeae9";
const WINNER_BANNER_RED = "#a22217";
const NEXT_PANEL_BG = "#f9faf8";

const DAY_MS = 86_400_000;

function initials(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatCountdown(target: string | null | undefined, now: number | null) {
  if (!target || now === null) return null;
  const end = new Date(target).getTime();
  if (Number.isNaN(end)) return null;
  const diff = Math.max(0, end - now);
  const days = Math.floor(diff / DAY_MS);
  const hours = Math.floor((diff % DAY_MS) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  return `${days}d ${hours}h ${minutes}m`;
}

export function LeaderboardContent({
  dashboard,
  remote,
}: {
  dashboard: AmbassadorDashboardResponse | undefined;
  remote: AmbassadorLeaderboardEntry[];
}) {
  const now = useNow();
  const [scope, setScope] = useState<HubScope>("campus");
  const [schoolFilter, setSchoolFilter] = useState("");
  const [showAll, setShowAll] = useState(false);

  const school = dashboard?.school?.name ?? null;
  const market = dashboard?.market?.name ?? null;
  const phase = useHubPhase(dashboard?.competition, now ?? undefined);
  const finished = isCompetitionOver(phase);

  const rows = useMemo(() => {
    const base = remote.length ? remote : dashboard?.leaderboard ?? [];
    if (!dashboard) return base;
    return ensureSelfOnLeaderboard(base, {
      userId: dashboard.user.id,
      fullName: dashboard.user.fullName ?? "You",
      school,
      market,
      totalReferralNetwork: dashboard.overview.totalReferralNetwork,
      directInvites: dashboard.overview.directInvites,
      appDownloads: 0,
      appDownloadsEnabled: false,
    } as AmbassadorLeaderboardEntry);
  }, [remote, dashboard, school, market]);

  const schools = useMemo(
    () => [...new Set(rows.map((row) => row.school).filter((name): name is string => Boolean(name)))].sort(),
    [rows]
  );

  const activeSchool = scope === "campus" ? schoolFilter || school : school;
  const ranked = useMemo(
    () => withScopeRanks(filterLeaderboard(rows, scope, activeSchool, market)),
    [rows, scope, activeSchool, market]
  );

  const me = dashboard ? ranked.find((row) => row.userId === dashboard.user.id) ?? null : null;
  const leaderTotal = ranked.length ? ranked[0].totalReferralNetwork : 0;
  const behindLeader = me ? Math.max(0, leaderTotal - me.totalReferralNetwork) : null;

  /* Last 24h movement, split the way the design labels it. */
  const last24h = useMemo(() => {
    if (!dashboard || now === null) return { direct: 0, network: 0 };
    const net = dashboard.referralNetwork ?? { directReferrals: [], downstreamNetwork: [] };
    const within = (iso: string | null) => iso !== null && now - new Date(iso).getTime() <= DAY_MS;
    const count = (list: typeof net.directReferrals) =>
      list.filter((node) => node.isCompleted && within(node.countedAt ?? node.joinedAt)).length;
    return { direct: count(net.directReferrals), network: count(net.downstreamNetwork) };
  }, [dashboard, now]);

  const visible = showAll ? ranked : ranked.slice(0, 5);

  /* Artboard 1_18 drops the stats bar and the "your rank" card once winners are
     out — the podium and the what's-next panel take their place. */
  const podium = finished ? ranked.slice(0, 3) : [];
  const rest = finished ? ranked.slice(3) : ranked;
  const visibleRest = finished ? rest : visible;

  return (
      <>
        {finished ? <WinnersBanner /> : null}

        <h1
          className={`font-canela-display text-[28px] md:text-[48pt] font-normal leading-[1.1] tracking-[0.04em] ${
            finished ? "sr-only" : ""
          }`}
          style={{ color: INK }}
        >
          {finished ? "Top winners" : "Ambassador leaderboard"}
        </h1>

        {finished ? (
          <p className="font-lato text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: INK_LABEL }}>
            Top winners
          </p>
        ) : null}

        {/* SCOPE TABS + SCHOOL PICKER */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <ScopeTabs value={scope} onChange={setScope} variant="segmented" />
          {scope === "campus" && schools.length > 1 ? (
            <label className="relative block lg:w-[430px]">
              <span className="sr-only">Filter by school</span>
              <select
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-[#E9E9E9] rounded-[10px] pl-5 pr-11 py-3.5 font-lato text-[15px] font-normal text-[#1c1c1c] focus:outline-none focus:border-neutral-400 cursor-pointer"
              >
                <option value="">{school ?? "All schools"}</option>
                {schools.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#1c1c1c]"
                strokeWidth={1.8}
                aria-hidden
              />
            </label>
          ) : null}
        </div>

        {finished ? <Podium rows={podium} meId={dashboard?.user.id} scope={scope} /> : null}

        {/* STATS BAR */}
        <section
          className={`rounded-[12px] border bg-white grid-cols-1 sm:grid-cols-3 ${finished ? "hidden" : "grid"}`}
          style={{ borderColor: BORDER }}
        >
          <StatCell
            icon={<Users className="size-[22px] text-[#1c1c1c]" strokeWidth={1.7} aria-hidden />}
            strong={ranked.length.toLocaleString()}
            label="Total ambassadors"
          />
          <StatCell
            icon={<Gift className="size-[22px] text-[#1c1c1c]" strokeWidth={1.7} aria-hidden />}
            label="Top Prize"
            strong={TOP_PRIZE_BY_SCOPE[scope]}
            strongLast
            divided
          />
          <StatCell
            icon={<Clock className="size-[22px] text-[#1c1c1c]" strokeWidth={1.7} aria-hidden />}
            label={finished ? "Competition ended" : "Competition ends"}
            strong={finished ? "" : formatCountdown(countdownTarget(dashboard?.competition, phase), now) ?? "--"}
            strongLast
            divided
          />
        </section>

        {/* YOUR RANK */}
        {me && !finished ? (
          <section
            className="rounded-[12px] border bg-white px-6 md:px-8 py-6 flex flex-col xl:flex-row xl:items-center gap-6 xl:gap-0"
            style={{ borderColor: BORDER }}
          >
            <div className="flex items-center gap-6 shrink-0">
              <span className="size-[86px] rounded-full bg-[#f2eee7] border border-[#e6dfd4] flex items-center justify-center shrink-0 font-lato text-[26px] font-bold text-[#584939] select-none">
                {initials(me.fullName)}
              </span>
              <div>
                <p
                  className="font-lato text-[13px] font-bold uppercase tracking-[0.1em]"
                  style={{ color: INK }}
                >
                  Your rank
                </p>
                <p className="mt-1 font-lato text-[46px] md:text-[54px] font-bold leading-none" style={{ color: INK }}>
                  #{me.scopeRank}
                </p>
              </div>
            </div>

            <div className="xl:border-l xl:px-8 text-center shrink-0" style={{ borderColor: BORDER }}>
              <p className="font-lato text-[22px] font-normal" style={{ color: INK_LABEL }}>
                {behindLeader === null ? "--" : behindLeader.toLocaleString()}
              </p>
              <p className="mt-1 font-lato text-[13px] font-normal" style={{ color: INK_NOTE }}>
                behind #1
              </p>
            </div>

            <div className="xl:border-l xl:pl-8 flex-1 min-w-0" style={{ borderColor: BORDER }}>
              <p className="font-lato text-[13px] font-bold uppercase tracking-[0.08em]" style={{ color: INK }}>
                In the last 24h
              </p>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Delta value={`+${last24h.direct + last24h.network}`} label="net impact" />
                <Delta value={`+${last24h.direct}`} label="direct invites" />
                <Delta value={`+${last24h.network}`} label="network invites" />
                {/* The user's own movement comes from overview, not from their
                    leaderboard row's scope-relative figure. /ambassador/dashboard
                    does not compute rank history yet, so this reads "--" rather
                    than a misleading 0 until it does. */}
                <Delta
                  value={
                    dashboard?.overview.rankMovementDirection ? (
                      <>
                        <Movement direction={dashboard.overview.rankMovementDirection} bare />
                        {Math.abs(dashboard.overview.rankMovement ?? 0)}
                      </>
                    ) : (
                      "--"
                    )
                  }
                  label="position"
                />
              </div>
            </div>
          </section>
        ) : null}

        {/* RANKINGS TABLE — paired with the what's-next panel once winners are out */}
        <div className={finished ? "grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-5 items-start" : ""}>
        <section className="rounded-[12px] border bg-white px-5 md:px-7 py-6" style={{ borderColor: BORDER }}>
          {/* Desktop table */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-[64px_minmax(0,1fr)_repeat(4,96px)_56px] items-end gap-2 pb-4">
              <Th>Rank</Th>
              <Th>Ambassador</Th>
              <Th center>
                Direct
                <br />
                Invites
              </Th>
              <Th center>
                Network
                <br />
                Invites
              </Th>
              <Th center>
                Total
                <br />
                Impact
              </Th>
              <Th center>
                Verified
                <br />
                Downloads
              </Th>
              <Th />
            </div>

            {visibleRest.length ? (
              visibleRest.map((row, index) => {
                const isMe = row.userId === dashboard?.user.id;
                const network = Math.max(0, row.totalReferralNetwork - row.directInvites);
                return (
                  <div
                    key={row.userId}
                    className={`grid grid-cols-[64px_minmax(0,1fr)_repeat(4,96px)_56px] items-center gap-2 py-4 ${
                      index < visibleRest.length - 1 ? "border-b" : ""
                    }`}
                    style={{ borderColor: BORDER }}
                  >
                    <RankBadge rank={row.scopeRank} />
                    <span className="flex items-center gap-3.5 min-w-0">
                      <span className="size-[42px] rounded-full bg-[#f2eee7] border border-[#e6dfd4] flex items-center justify-center shrink-0 font-lato text-[13px] font-bold text-[#584939] select-none">
                        {initials(row.fullName)}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-lato text-[15px] font-bold truncate" style={{ color: INK }}>
                          {row.fullName}
                          {isMe ? " (You)" : ""}
                        </span>
                        <span
                          className="block font-lato text-[13px] font-normal truncate mt-0.5"
                          style={{ color: INK_NOTE }}
                        >
                          {row.school ?? "—"}
                        </span>
                      </span>
                    </span>
                    <Td>{row.directInvites.toLocaleString()}</Td>
                    <Td>{network.toLocaleString()}</Td>
                    <Td>{row.totalReferralNetwork.toLocaleString()}</Td>
                    <Td>{row.appDownloadsEnabled ? row.appDownloads.toLocaleString() : "--"}</Td>
                    <span className="text-right pr-1">
                      <Movement direction={row.rankMovementDirection} value={row.rankMovement} />
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="py-6 font-lato text-[14px] text-neutral-500">No ambassador leaderboard rows yet.</p>
            )}
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden flex flex-col">
            {visibleRest.length ? (
              visibleRest.map((row, index) => {
                const isMe = row.userId === dashboard?.user.id;
                const network = Math.max(0, row.totalReferralNetwork - row.directInvites);
                return (
                  <div
                    key={row.userId}
                    className={`py-4 ${index < visibleRest.length - 1 ? "border-b" : ""}`}
                    style={{ borderColor: BORDER }}
                  >
                    <div className="flex items-center gap-3">
                      <RankBadge rank={row.scopeRank} />
                      <span className="min-w-0 flex-1">
                        <span className="block font-lato text-[15px] font-bold truncate" style={{ color: INK }}>
                          {row.fullName}
                          {isMe ? " (You)" : ""}
                        </span>
                        <span className="block font-lato text-[12px] truncate" style={{ color: INK_NOTE }}>
                          {row.school ?? "—"}
                        </span>
                      </span>
                      <Movement direction={row.rankMovementDirection} value={row.rankMovement} />
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                      <MobileStat label="Direct" value={row.directInvites.toLocaleString()} />
                      <MobileStat label="Network" value={network.toLocaleString()} />
                      <MobileStat label="Impact" value={row.totalReferralNetwork.toLocaleString()} />
                      <MobileStat
                        label="Downloads"
                        value={row.appDownloadsEnabled ? row.appDownloads.toLocaleString() : "--"}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-4 font-lato text-[14px] text-neutral-500">No ambassador leaderboard rows yet.</p>
            )}
          </div>

          {ranked.length > 5 ? (
            <div className="pt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="font-lato text-[15px] font-bold hover:underline underline-offset-4 cursor-pointer"
                style={{ color: LINK_OLIVE }}
              >
                {showAll ? "Show top 5" : "View full leaderboard"}
              </button>
            </div>
          ) : null}
        </section>

        {finished ? <WhatsNext /> : null}
        </div>
      </>
  );
}

/* ------------------------------------------------------ winners state -- */

/* Confetti is drawn rather than imported: the artboard's party popper is a
   placed illustration with no exported asset. Shapes are scattered on a fixed
   seed so the banner renders identically on every load. */
function Confetti() {
  const bits = [
    { x: 6, y: 22, s: 9, r: 20, o: 0.9, shape: "star" },
    { x: 15, y: 8, s: 6, r: 0, o: 0.75, shape: "diamond" },
    { x: 24, y: 30, s: 11, r: -14, o: 1, shape: "star" },
    { x: 33, y: 12, s: 5, r: 0, o: 0.7, shape: "dot" },
    { x: 41, y: 44, s: 8, r: 32, o: 0.85, shape: "diamond" },
    { x: 52, y: 18, s: 7, r: 0, o: 0.8, shape: "dot" },
    { x: 61, y: 38, s: 12, r: 8, o: 0.95, shape: "star" },
    { x: 72, y: 10, s: 6, r: 0, o: 0.7, shape: "diamond" },
    { x: 80, y: 52, s: 9, r: -22, o: 0.9, shape: "star" },
    { x: 88, y: 26, s: 5, r: 0, o: 0.65, shape: "dot" },
  ];

  return (
    <svg
      viewBox="0 0 100 70"
      className="h-full w-[220px] lg:w-[300px] shrink-0"
      aria-hidden="true"
      focusable="false"
    >
      {bits.map((b, i) => {
        const fill = i % 3 === 0 ? "#d8514b" : i % 3 === 1 ? "#ef8f8a" : "#c0342c";
        if (b.shape === "dot") {
          return <circle key={i} cx={b.x} cy={b.y} r={b.s / 3} fill={fill} opacity={b.o} />;
        }
        if (b.shape === "diamond") {
          return (
            <rect
              key={i}
              x={b.x}
              y={b.y}
              width={b.s / 1.6}
              height={b.s / 1.6}
              fill={fill}
              opacity={b.o}
              transform={`rotate(45 ${b.x + b.s / 3} ${b.y + b.s / 3})`}
            />
          );
        }
        const r = b.s / 2;
        const pts = Array.from({ length: 10 }, (_, k) => {
          const ang = (Math.PI / 5) * k - Math.PI / 2;
          const rad = k % 2 === 0 ? r : r / 2.4;
          return `${(b.x + Math.cos(ang) * rad).toFixed(2)},${(b.y + Math.sin(ang) * rad).toFixed(2)}`;
        }).join(" ");
        return <polygon key={i} points={pts} fill={fill} opacity={b.o} transform={`rotate(${b.r} ${b.x} ${b.y})`} />;
      })}
      {/* popper cone */}
      <path d="M97 66 L70 47 L79 40 Z" fill="#b32b23" />
      <path d="M97 66 L79 40 L86 38 Z" fill="#e8837d" />
    </svg>
  );
}

function WinnersBanner() {
  return (
    <section
      className="rounded-[12px] px-7 md:px-10 py-7 flex items-center gap-6 overflow-hidden"
      style={{ background: WINNER_BANNER_BG }}
    >
      <span
        className="size-[72px] rounded-full hidden sm:flex items-center justify-center shrink-0"
        style={{ background: WINNER_BANNER_CIRCLE }}
      >
        <Trophy className="size-8" strokeWidth={1.7} style={{ color: WINNER_BANNER_RED }} aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <p
          className="font-lato text-[12px] font-bold uppercase tracking-[0.13em]"
          style={{ color: WINNER_BANNER_RED }}
        >
          Winners announced
        </p>
        <h2 className="mt-3 font-lato text-[22px] md:text-[26px] font-normal" style={{ color: INK }}>
          Congratulations to our winners!
        </h2>
        <p className="mt-3 font-lato text-[14px] md:text-[15px] leading-[1.7]" style={{ color: INK_LABEL }}>
          Thank you to everyone who participated.
          <br />
          You made this competition amazing!
        </p>
      </div>

      <Confetti />
    </section>
  );
}

/* Laurel sprig flanking the winner's "1ST". Mirrored for the right side. */
function Laurel({ flip }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 44 60"
      className="w-[34px] h-[46px] shrink-0"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <path d="M34 6 C20 16, 13 32, 15 54" />
      </g>
      <g fill="currentColor">
        {[
          { x: 30, y: 11, r: -34 },
          { x: 25, y: 19, r: -26 },
          { x: 21, y: 27, r: -18 },
          { x: 18, y: 35, r: -10 },
          { x: 16, y: 43, r: -2 },
        ].map((leaf, i) => (
          <ellipse
            key={i}
            cx={leaf.x - 6}
            cy={leaf.y}
            rx="6.4"
            ry="3.1"
            transform={`rotate(${leaf.r} ${leaf.x - 6} ${leaf.y})`}
          />
        ))}
      </g>
    </svg>
  );
}

/* Rendered 2 - 1 - 3 with the winner raised. Each card is a coloured header
   band over a white body; the winner's band wraps top and bottom. Artboards
   1_01 / 1_17 / 1_18. */
function Podium({
  rows,
  meId,
  scope,
}: {
  rows: AmbassadorLeaderboardEntry[];
  meId?: string;
  scope: HubScope;
}) {
  if (!rows.length) return null;
  const order = [rows[1], rows[0], rows[2]].filter(Boolean);
  const theme = PODIUM_THEME[scope];
  const ordinal = ["st", "nd", "rd"];

  return (
    /* A campus can have fewer than three ambassadors — Northeastern currently
       has one. Sizing the grid to what is actually there keeps a lone winner
       centred instead of stranded in the left column. */
    <div
      className="grid grid-cols-1 gap-5 items-end mx-auto w-full"
      style={{
        gridTemplateColumns: `repeat(${order.length}, minmax(0, 1fr))`,
        maxWidth: order.length < 3 ? `${order.length * 22}rem` : undefined,
      }}
    >
      {order.map((row) => {
        const place = rows.indexOf(row); // 0-based
        const winner = place === 0;

        return (
          <div
            key={row.userId}
            className={`rounded-[14px] overflow-hidden ${winner ? "pb-4 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]" : ""}`}
            style={{ background: winner ? theme.band : theme.tint }}
          >
            {/* place band */}
            <div
              className={`flex items-center justify-center gap-3 ${winner ? "py-5" : "py-6"}`}
              style={{ color: winner ? "#ffffff" : theme.ink }}
            >
              {winner ? <Laurel /> : <span className="h-px w-9 opacity-30" style={{ background: "currentColor" }} />}
              <span className="font-lato leading-none">
                <span className="text-[30px] font-normal">{place + 1}</span>
                <span className="text-[15px] font-normal uppercase ml-0.5">{ordinal[place]}</span>
              </span>
              {winner ? (
                <Laurel flip />
              ) : (
                <span className="h-px w-9 opacity-30" style={{ background: "currentColor" }} />
              )}
            </div>

            {/* white body */}
            <div className="bg-white rounded-[12px] mx-2 px-6 pt-6 pb-7 text-center">
              <span className="mx-auto size-[58px] rounded-full bg-[#f2eee7] border border-[#e6dfd4] flex items-center justify-center font-lato text-[17px] font-bold text-[#584939] select-none">
                {initials(row.fullName)}
              </span>

              <p className="mt-4 font-lato text-[15px] font-bold" style={{ color: INK }}>
                {row.fullName}
                {row.userId === meId ? " (You)" : ""}
              </p>
              <p className="mt-1 font-lato text-[13px]" style={{ color: INK_NOTE }}>
                {row.school ?? "—"}
              </p>

              {winner ? (
                <span
                  className="inline-block mt-3 rounded-full px-4 py-1.5 font-lato text-[11px] font-semibold uppercase tracking-[0.06em]"
                  style={{ background: theme.tint, color: theme.ink }}
                >
                  {WINNER_PILL_LABEL[scope]}
                </span>
              ) : null}

              <div className="mt-5 border-t" style={{ borderColor: BORDER }} />

              <p
                className={`mt-5 font-lato font-normal leading-none ${winner ? "text-[34px]" : "text-[30px]"}`}
                style={{ color: theme.ink }}
              >
                {/* Same rule as the table below: downloads only once the API
                    says they are being counted, otherwise an explicit dash
                    rather than a network figure wearing a downloads label. */}
                {row.appDownloadsEnabled ? row.appDownloads.toLocaleString() : "--"}
              </p>
              <p className="mt-2 font-lato text-[13px]" style={{ color: INK_NOTE }}>
                Verified Downloads
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WhatsNext() {
  return (
    <aside className="rounded-[12px] px-7 py-7" style={{ background: NEXT_PANEL_BG }}>
      <p className="font-lato text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: STAT_GREEN }}>
        What&apos;s next
      </p>
      <h3 className="mt-4 font-lato text-[17px] font-bold" style={{ color: INK }}>
        Claim your prize
      </h3>
      <p className="mt-3 font-lato text-[14px] leading-[1.65]" style={{ color: INK_LABEL }}>
        Winners will receive an email with details on how to claim their prize.
      </p>

      <div className="my-6 border-t" style={{ borderColor: "#e6e9e4" }} />

      <p className="font-lato text-[14px] font-bold" style={{ color: INK }}>
        Questions?
      </p>
      <p className="mt-2 font-lato text-[14px]" style={{ color: INK_LABEL }}>
        Contact{" "}
        <a href="mailto:support@joinbubba.com" className="underline underline-offset-2 hover:opacity-80">
          support@joinbubba.com
        </a>
      </p>
    </aside>
  );
}

function StatCell({
  icon,
  strong,
  label,
  strongLast = false,
  divided = false,
}: {
  icon: ReactNode;
  strong: string;
  label: string;
  strongLast?: boolean;
  divided?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center gap-3 px-5 py-5 ${divided ? "sm:border-l" : ""}`}
      style={divided ? { borderColor: BORDER } : undefined}
    >
      {icon}
      {strongLast ? (
        <>
          <span className="font-lato text-[16px] font-normal" style={{ color: INK_NOTE }}>
            {label}
          </span>
          {strong ? (
            <span className="font-lato text-[16px] font-bold" style={{ color: INK }}>
              {strong}
            </span>
          ) : null}
        </>
      ) : (
        <>
          <span className="font-lato text-[16px] font-bold" style={{ color: INK }}>
            {strong}
          </span>
          <span className="font-lato text-[16px] font-normal" style={{ color: INK_NOTE }}>
            {label}
          </span>
        </>
      )}
    </div>
  );
}

function Delta({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div>
      <p
        className="font-lato text-[26px] md:text-[30px] font-normal leading-none flex items-center gap-1"
        style={{ color: STAT_GREEN }}
      >
        {value}
      </p>
      <p className="mt-2 font-lato text-[13px] font-normal" style={{ color: INK_NOTE }}>
        {label}
      </p>
    </div>
  );
}

/* 1st, 2nd and 3rd sit in tinted discs; 4th onward are bare numerals. */
function RankBadge({ rank }: { rank: number }) {
  if (rank > 3) {
    return (
      <span className="font-lato text-[17px] font-normal pl-3.5 shrink-0" style={{ color: INK }}>
        {rank}
      </span>
    );
  }
  const bg = BADGE[rank - 1];
  return (
    <span
      className="size-[38px] rounded-full flex items-center justify-center shrink-0 font-lato text-[16px] font-normal"
      style={{ background: bg, color: rank === 3 ? "#ffffff" : INK }}
    >
      {rank}
    </span>
  );
}

function Movement({
  direction,
  value,
  bare = false,
}: {
  direction?: AmbassadorLeaderboardEntry["rankMovementDirection"];
  value?: number;
  bare?: boolean;
}) {
  if (direction === "UP") {
    return (
      <span className="font-lato text-[17px] font-normal" style={{ color: bare ? STAT_GREEN : UP_GREEN }}>
        &uarr;{bare ? "" : ` ${Math.abs(value ?? 0)}`}
      </span>
    );
  }
  if (direction === "DOWN") {
    return (
      <span className="font-lato text-[17px] font-normal" style={{ color: bare ? STAT_GREEN : DOWN_RED }}>
        &darr;{bare ? "" : ` ${Math.abs(value ?? 0)}`}
      </span>
    );
  }
  if (bare) return null;
  return (
    <span className="font-lato text-[17px]" style={{ color: "#9a9a9a" }} aria-label="No change">
      &mdash;
    </span>
  );
}

function Th({ children, center = false }: { children?: ReactNode; center?: boolean }) {
  return (
    <span
      className={`font-lato text-[14px] font-bold leading-[1.25] ${center ? "text-center" : ""}`}
      style={{ color: INK_LABEL }}
    >
      {children}
    </span>
  );
}

function Td({ children }: { children: ReactNode }) {
  return (
    <span className="text-center font-lato text-[17px] font-normal" style={{ color: INK }}>
      {children}
    </span>
  );
}

function MobileStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-lato text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: INK_NOTE }}>
        {label}
      </p>
      <p className="mt-0.5 font-lato text-[15px] font-normal" style={{ color: INK }}>
        {value}
      </p>
    </div>
  );
}
