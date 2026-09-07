"use client";

import { useMemo, useSyncExternalStore, type ReactNode } from "react";

import { useGetAmbassadorDashboardQuery } from "@/features/api/apiSlice";
import {
  ensureSelfOnLeaderboard,
  getHubPhase,
  standingFor,
  standingScenario,
  type HubLeaderboardRow,
  type HubPhase,
  type HubScope,
} from "@/lib/ambassador-hub";

function formatRank(rank: number | null) {
  return rank ? `#${rank}` : "—";
}

/* ---------------------------------------------------------------- clock --
   One shared 1s tick for every ambassador surface. Runs on the client only so
   SSR and the first client render agree; snapshots are rounded to the second
   so repeated reads inside one render stay stable. */

function subscribeToClock(onTick: () => void) {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
}

export function useNow() {
  return useSyncExternalStore<number | null>(
    subscribeToClock,
    () => Math.floor(Date.now() / 1000) * 1000,
    () => null
  );
}

/* Two treatments in the designs: the Overview's Leaderboard Summary uses a
   filled dark-green pill (artboard 1_9), the Leaderboard page uses a light
   segmented control (artboard 1). */
export function ScopeTabs({
  value,
  onChange,
  variant = "solid",
}: {
  value: HubScope;
  onChange: (scope: HubScope) => void;
  variant?: "solid" | "segmented";
}) {
  const tabs = ["campus", "market", "national"] as const;
  const label = (t: HubScope) => (t === "campus" ? "Campus" : t === "market" ? "Market" : "National");

  if (variant === "segmented") {
    /* Measured off artboard 1: 435x56 card at radius 12, three 145px cells,
       and 18px Lato Medium on every label - the active cell is distinguished by
       its fill alone, not by a heavier weight. overflow-hidden lets the active
       cell's square fill pick up the card's rounded corners. */
    return (
      <div className="flex items-stretch w-full sm:w-auto rounded-[12px] border border-[#E9E9E9] bg-white overflow-hidden">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            aria-pressed={value === tab}
            className={`flex-1 sm:flex-none sm:min-w-[145px] text-center font-lato font-medium text-[16px] md:text-[18px] leading-none py-[18px] transition-colors duration-150 cursor-pointer ${
              i > 0 ? "border-l border-[#E9E9E9]" : ""
            } ${
              value === tab ? "bg-[#F6F8F5] text-black" : "bg-white text-[#1c1c1c] hover:bg-[#fafbfa]"
            }`}
          >
            {label(tab)}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center w-full sm:max-w-[420px] rounded-[6px] border border-[#E4E2DE] bg-white overflow-hidden">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          aria-pressed={value === tab}
          className={`flex-1 text-center font-lato text-[12px] md:text-[13px] py-2.5 transition-colors duration-150 cursor-pointer ${
            value === tab
              ? "bg-[#173D2A] text-white font-bold rounded-[6px]"
              : "bg-transparent text-[#3d3d3d] font-normal hover:bg-[#f4f4f2]"
          }`}
        >
          {label(tab)}
        </button>
      ))}
    </div>
  );
}

/* First-place cash prize per scope, shown in the Leaderboard stats bar.
   NOTE: prizes/page.tsx keeps its own full three-place tables; if the amounts
   change, update both. */
export const TOP_PRIZE_BY_SCOPE: Record<HubScope, string> = {
  campus: "$240",
  market: "$2,400",
  national: "$24,000",
};

export function welcomeBody(phase: HubPhase) {
  if (phase === "upcoming") {
    return "You're officially in. The competition hasn't begun. Check your email or come back here anytime.";
  }
  return "You're officially in. Start sharing your link, grow your network, and climb the leaderboard.";
}

/* -------------------------------------------------------------- standing --
   Sidebar "Your Standing" card. Geometry, colours and icon paths come from the
   243x506 design export; icon viewBoxes are sub-rects of that original
   coordinate space so the vectors stay bit-exact. */

const STAND_GREEN = "#214028"; // numerals + tier icons
const STAND_DOT = "#336828"; // "YOUR STANDING" label and its dot
const STAND_MUTED = "#636363"; // "on campus" / "in market" suffixes
const STAND_FOOTER = "#898989"; // last-updated row
const STAND_RULE = "#EFEDEB"; // section dividers

export function AmbassadorStanding() {
  const { data, fulfilledTimeStamp } = useGetAmbassadorDashboardQuery();
  const now = useNow();

  const standing = useMemo(() => {
    if (!data) return { campus: null, market: null, national: null };
    const rows = ensureSelfOnLeaderboard<HubLeaderboardRow>(data.leaderboard ?? [], {
      userId: data.user.id,
      fullName: data.user.fullName ?? "You",
      school: data.school?.name ?? null,
      market: data.market?.name ?? null,
      totalReferralNetwork: data.overview.totalReferralNetwork,
      directInvites: data.overview.directInvites,
    });
    return standingFor(rows, data.user.id, data.school?.name ?? null, data.market?.name ?? null);
  }, [data]);

  if (!data) return null;

  return (
    <StandingCard
      soon={standingScenario(getHubPhase(data.competition)) === "soon"}
      school={data.school?.name ?? "Campus"}
      market={data.market?.name ?? "Market"}
      standing={standing}
      updatedLabel={lastUpdatedLabel(fulfilledTimeStamp, now)}
    />
  );
}

/* Pure presentation half - takes everything it renders as props so it can be
   exercised without a live dashboard response. */
export function StandingCard({
  soon,
  school,
  market,
  standing,
  updatedLabel,
}: {
  soon: boolean;
  school: string;
  market: string;
  standing: { campus: number | null; market: number | null; national: number | null };
  updatedLabel: string;
}) {
  return (
    <section className="flex flex-col rounded-[12px] border border-[#E0E0E0] bg-[#F8F9F7] px-[18px] pt-5 pb-4">
      <p
        className="flex items-center gap-2 font-sfpro text-[11px] font-bold uppercase tracking-[0.06em]"
        style={{ color: STAND_DOT }}
      >
        <span
          className="w-[5px] h-[5px] rounded-full shrink-0"
          style={{ background: STAND_DOT }}
          aria-hidden
        />
        Your Standing
      </p>

      {soon ? <StandingSoon /> : <StandingRanked school={school} market={market} standing={standing} />}

      <div className="border-t pt-5 flex items-center gap-3" style={{ borderColor: STAND_RULE }}>
        <HistoryMark />
        <span className="font-lato text-[12px] font-normal" style={{ color: STAND_FOOTER }}>
          {soon ? "Competition begins soon" : `Last updated ${updatedLabel}`}
        </span>
      </div>
    </section>
  );
}

/* "Last updated 2 min ago". fulfilledTimeStamp is when RTK Query last landed a
   dashboard response, which is exactly what this row reports. */
export function lastUpdatedLabel(fulfilledAt: number | undefined, now: number | null) {
  if (!fulfilledAt || now === null) return "just now";
  const minutes = Math.floor(Math.max(0, now - fulfilledAt) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function StandingRanked({
  school,
  market,
  standing,
}: {
  school: string;
  market: string;
  standing: { campus: number | null; market: number | null; national: number | null };
}) {
  return (
    <>
      {/* Campus tier carries no icon in the design - it is the headline rank. */}
      <div className="mt-9 pb-6">
        <p className="font-canela-display text-[21px] font-medium text-black leading-tight">{school}</p>
        <p className="mt-2 flex items-baseline gap-2">
          <span
            className="font-minionvariable text-[50px] font-bold leading-none"
            style={{ color: STAND_GREEN }}
          >
            {formatRank(standing.campus)}
          </span>
          <span className="font-lato text-[13px]" style={{ color: STAND_MUTED }}>
            on campus
          </span>
        </p>
      </div>

      <StandingTier icon={<CityMark />} name={market} rank={formatRank(standing.market)} suffix="in market" />
      <StandingTier icon={<GlobeMark />} name="National" rank={formatRank(standing.national)} suffix="in nation" />
    </>
  );
}

/* Market and national tiers: icon vertically centred against the two-line
   name+rank block, matching the design. */
function StandingTier({
  icon,
  name,
  rank,
  suffix,
}: {
  icon: ReactNode;
  name: string;
  rank: string;
  suffix: string;
}) {
  return (
    <div className="border-t py-9 flex items-center gap-3.5" style={{ borderColor: STAND_RULE }}>
      {icon}
      <div className="min-w-0">
        <p className="font-canela-display text-[19px] font-medium text-black leading-tight truncate">{name}</p>
        <p className="mt-1.5 flex items-baseline gap-2">
          <span
            className="font-minionvariable text-[39px] font-bold leading-none"
            style={{ color: STAND_GREEN }}
          >
            {rank}
          </span>
          <span className="font-lato text-[13px]" style={{ color: STAND_MUTED }}>
            {suffix}
          </span>
        </p>
      </div>
    </div>
  );
}

function StandingSoon() {
  return (
    <>
      <div className="flex flex-col items-center justify-center text-center px-1 pt-7 pb-8">
        <SoonFlag />
        <p
          className="mt-5 font-canela-display text-[22px] font-medium leading-[1.15]"
          style={{ color: STAND_GREEN }}
        >
          Competition
          <br />
          starts soon
        </p>
        <p className="mt-3 font-lato text-[12px] leading-[1.45]" style={{ color: STAND_MUTED }}>
          The leaderboard will update once the competition begins.
        </p>
      </div>

      <SoonTier icon={<PinMark />} label="On campus" />
      <SoonTier icon={<CityMark />} label="In market" />
      <SoonTier icon={<GlobeMark />} label="In nation" />
    </>
  );
}

function SoonTier({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="border-t py-3.5 flex items-center gap-3.5" style={{ borderColor: STAND_RULE }}>
      {icon}
      <span className="font-lato text-[13px] font-normal text-[#3d3d3d]">{label}</span>
      <span className="ml-auto font-lato text-[15px]" style={{ color: STAND_MUTED }}>
        —
      </span>
    </div>
  );
}

/* ----------------------------------------------------------------- icons --
   Paths lifted verbatim from the design export. Each viewBox is the sub-rect
   the shape occupies in the original 243x506 artboard, so nothing is redrawn. */

function CityMark() {
  return (
    <svg width="30" height="24" viewBox="17.75 218.96 30 24" fill="none" aria-hidden className="shrink-0">
      <path
        d="M46.75 240.96H45.75V225.96C45.75 225.41 45.3 224.96 44.75 224.96H36.75C36.2 224.96 35.75 225.41 35.75 225.96V230.96H29.75V219.96C29.75 219.41 29.3 218.96 28.75 218.96H20.75C20.2 218.96 19.75 219.41 19.75 219.96V240.96H18.75C18.2 240.96 17.75 241.41 17.75 241.96C17.75 242.51 18.2 242.96 18.75 242.96H46.75C47.3 242.96 47.75 242.51 47.75 241.96C47.75 241.41 47.3 240.96 46.75 240.96ZM37.75 226.96H43.75V240.96H37.75V226.96ZM35.75 232.96V240.96H29.75V232.96H35.75ZM21.75 220.96H27.75V240.96H21.75V220.96ZM25.75 223.96V225.96C25.75 226.51 25.3 226.96 24.75 226.96C24.2 226.96 23.75 226.51 23.75 225.96V223.96C23.75 223.41 24.2 222.96 24.75 222.96C25.3 222.96 25.75 223.41 25.75 223.96ZM25.75 229.96V231.96C25.75 232.51 25.3 232.96 24.75 232.96C24.2 232.96 23.75 232.51 23.75 231.96V229.96C23.75 229.41 24.2 228.96 24.75 228.96C25.3 228.96 25.75 229.41 25.75 229.96ZM25.75 235.96V237.96C25.75 238.51 25.3 238.96 24.75 238.96C24.2 238.96 23.75 238.51 23.75 237.96V235.96C23.75 235.41 24.2 234.96 24.75 234.96C25.3 234.96 25.75 235.41 25.75 235.96ZM31.75 237.96V235.96C31.75 235.41 32.2 234.96 32.75 234.96C33.3 234.96 33.75 235.41 33.75 235.96V237.96C33.75 238.51 33.3 238.96 32.75 238.96C32.2 238.96 31.75 238.51 31.75 237.96ZM39.75 237.96V235.96C39.75 235.41 40.2 234.96 40.75 234.96C41.3 234.96 41.75 235.41 41.75 235.96V237.96C41.75 238.51 41.3 238.96 40.75 238.96C40.2 238.96 39.75 238.51 39.75 237.96ZM39.75 231.96V229.96C39.75 229.41 40.2 228.96 40.75 228.96C41.3 228.96 41.75 229.41 41.75 229.96V231.96C41.75 232.51 41.3 232.96 40.75 232.96C40.2 232.96 39.75 232.51 39.75 231.96Z"
        fill={STAND_GREEN}
      />
    </svg>
  );
}

function GlobeMark() {
  return (
    <svg width="26" height="26" viewBox="20.75 346.85 26 26" fill="none" aria-hidden className="shrink-0">
      <path
        d="M33.75 346.85C26.57 346.85 20.75 352.67 20.75 359.85C20.75 367.03 26.57 372.85 33.75 372.85C40.93 372.85 46.75 367.03 46.75 359.85C46.75 352.67 40.93 346.86 33.75 346.85ZM44.7 358.85H39.72C39.5 354.29 37.74 351.06 36.3 349.15C40.89 350.25 44.27 354.15 44.7 358.85ZM29.78 360.85H37.72C37.43 366.05 34.94 369.24 33.75 370.47C32.56 369.23 30.07 366.05 29.78 360.85ZM29.78 358.85C30.07 353.65 32.56 350.46 33.75 349.23C34.94 350.47 37.43 353.66 37.72 358.85H29.78ZM31.2 349.15C29.76 351.06 28 354.29 27.78 358.85H22.8C23.24 354.15 26.61 350.25 31.2 349.15ZM22.79 360.85H27.77C28 365.41 29.75 368.64 31.19 370.55C26.6 369.45 23.22 365.55 22.79 360.85ZM36.29 370.55C37.73 368.64 39.48 365.41 39.71 360.85H44.69C44.25 365.55 40.88 369.45 36.29 370.55Z"
        fill={STAND_GREEN}
      />
    </svg>
  );
}

function HistoryMark() {
  return (
    <svg width="15.5" height="14.5" viewBox="29.6 446.6 15.5 14.5" fill="none" aria-hidden className="shrink-0">
      <path
        d="M37.9106 450.17V453.4L40.5906 455.01C40.8706 455.18 40.9606 455.54 40.7906 455.82C40.6206 456.1 40.2606 456.19 39.9806 456.02L37.0106 454.24C36.8306 454.13 36.7206 453.94 36.7206 453.73V450.17C36.7206 449.84 36.9906 449.58 37.3106 449.58C37.6306 449.58 37.9006 449.85 37.9006 450.17H37.9106ZM37.3106 446.6C35.4206 446.6 33.6006 447.35 32.2706 448.69C31.7306 449.24 31.2506 449.76 30.7806 450.31V448.97C30.7806 448.64 30.5106 448.38 30.1906 448.38C29.8706 448.38 29.6006 448.65 29.6006 448.97V451.94C29.6006 452.27 29.8706 452.53 30.1906 452.53H33.1606C33.4906 452.53 33.7506 452.26 33.7506 451.94C33.7506 451.62 33.4806 451.35 33.1606 451.35H31.4506C31.9806 450.73 32.5106 450.14 33.1106 449.53C35.4306 447.21 39.1906 447.21 41.5106 449.53C43.8306 451.85 43.8306 455.61 41.5106 457.93C39.2406 460.2 35.5706 460.25 33.2406 458.05C33.0006 457.82 32.6306 457.84 32.4006 458.07C32.1706 458.31 32.1906 458.68 32.4206 458.91C35.2806 461.61 39.7906 461.48 42.4906 458.62C45.1906 455.76 45.0606 451.25 42.2006 448.55C40.8806 447.3 39.1306 446.61 37.3106 446.61V446.6Z"
        fill={STAND_FOOTER}
      />
    </svg>
  );
}

function PinMark() {
  return (
    <svg width="22" height="24" viewBox="0 0 22 24" fill="none" aria-hidden className="shrink-0">
      <path
        d="M11 2.2c-4 0-7.2 3.2-7.2 7.2 0 5.2 6.4 11.4 6.7 11.7a.7.7 0 0 0 1 0c.3-.3 6.7-6.5 6.7-11.7 0-4-3.2-7.2-7.2-7.2Zm0 17.3C9.4 17.8 5.4 13.2 5.4 9.4A5.6 5.6 0 1 1 16.6 9.4c0 3.8-4 8.4-5.6 10.1Z"
        fill={STAND_GREEN}
      />
      <path
        d="M11 6a3.4 3.4 0 1 0 0 6.8A3.4 3.4 0 0 0 11 6Zm0 5.2a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6Z"
        fill={STAND_GREEN}
      />
    </svg>
  );
}

/* ponytail: hand-traced from the artboard. Swap for the exported vector when
   the Figma illustration lands - the only approximated mark in this file. */
function SoonFlag() {
  return (
    <svg width="52" height="58" viewBox="0 0 52 58" fill="none" aria-hidden>
      <ellipse cx="26" cy="50" rx="13" ry="4" fill={STAND_DOT} opacity="0.16" />
      <path d="M18 8v42" stroke={STAND_GREEN} strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M18.9 9.4h17.4c.6 0 .9.7.5 1.1l-4.4 5.4a.7.7 0 0 0 0 .9l4.4 5.4c.4.5.1 1.1-.5 1.1H18.9V9.4Z"
        fill="#fff"
        stroke={STAND_GREEN}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="7.4" r="2.2" fill={STAND_GREEN} />
    </svg>
  );
}

export const MERCH_MILESTONES = [
  {
    invites: 50,
    title: "Merch Pack",
    note: "Hat + crewneck",
    images: [
      { src: "/images/4x/bubba-cap.png", alt: "Bubba hat" },
      { src: "/images/4x/bubba-shirt.png", alt: "Bubba crewneck" },
    ],
  },
  {
    invites: 100,
    title: "Picnic Set",
    note: "Everything you need",
    images: [{ src: "/images/4x/bubba-picnic.png", alt: "Bubba picnic set" }],
  },
  {
    invites: 200,
    title: "Beach Bundle",
    note: "Chair + extras",
    images: [{ src: "/images/4x/bubba-chair.png", alt: "Bubba beach chair" }],
  },
] as const;
