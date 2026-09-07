"use client";

import { Check, MapPin, Send, TrendingUp, UserRoundPlus, Gift, Building2 } from "lucide-react";
import type { ReactNode } from "react";

import { MERCH_MILESTONES } from "../_hub";

/* Sampled from artboard 1_7. */
const INK = "#000000";
const EYEBROW_INK = "#333333";
const NOTE_INK = "#7c7c7c";
const POOL_TEAL = "#08464d";
const WINNERS_GREEN = "#203f1c";
const BORDER = "#eeeeee";
const RULE = "#f1f1f1";

/* Prize tiers are competition copy, not API data - the rewards endpoint carries
   titles and unlock thresholds but no cash values.
   First-place amounts here are mirrored by TOP_PRIZE_BY_SCOPE in ../_hub.tsx,
   which the Leaderboard stats bar reads. Keep the two in step. */
const NATIONAL_PLACES = [
  { place: "1st place", amount: "$24,000", color: "#425b2b" },
  { place: "2nd place", amount: "$12,000", color: "#4e3b6b" },
  { place: "3rd place", amount: "$6,000", color: "#8a2c18" },
];

const MARKET_PLACES = [
  { place: "1st place", amount: "$2,400" },
  { place: "2nd place", amount: "$1,200" },
  { place: "3rd place", amount: "$600" },
];

const CAMPUS_PLACES = [
  { place: "1st place", amount: "$240" },
  { place: "2nd place", amount: "$120" },
  { place: "3rd place", amount: "$60" },
];

const FINE_PRINT = [
  "Final winners are determined by app downloads in the first week of launch.",
  "Invites must use the same email as waitlist to join the app to verify competition points.",
  "Prizes are non-transferrable.",
];

const HOW_IT_WORKS: Array<{ title: string; description: string; badge: string; icon: ReactNode }> = [
  {
    title: "Share your link",
    description: "Share your unique link with friends.",
    badge: "#eaeee1",
    icon: <Send className="w-5 h-5 text-[#2e7d43]" strokeWidth={1.6} aria-hidden />,
  },
  {
    title: "They sign up",
    description: "Each verified sign-up counts as one join",
    badge: "#e6eeee",
    icon: <UserRoundPlus className="w-5 h-5 text-[#2a5c93]" strokeWidth={1.6} aria-hidden />,
  },
  {
    title: "Climb the leaderboard",
    description: "Track your progress and rank on campus and overall",
    badge: "#fdeedc",
    icon: <TrendingUp className="w-5 h-5 text-[#b5722a]" strokeWidth={1.8} aria-hidden />,
  },
  {
    title: "Win amazing prizes",
    description: "Top ambassadors win cash, merch, and in-app prizes.",
    badge: "#ede7ef",
    icon: <Gift className="w-5 h-5 text-[#5b4b8a]" strokeWidth={1.6} aria-hidden />,
  },
];

const CARD = "bg-white border rounded-[12px]";

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      className="font-lato text-[12px] md:text-[13px] font-bold uppercase tracking-[0.14em]"
      style={{ color: EYEBROW_INK }}
    >
      {children}
    </p>
  );
}

export function PrizesContent({
  totalWinners = 333,
  invites = 0,
}: {
  totalWinners?: number;
  invites?: number;
}) {
  const invitesSoFar = invites;
  return (
    <>
      {/* HEADER + TOTAL PRIZE POOL. Explicit grid tracks rather than a flex row:
          a w-full + shrink-0 card in a row collapses the text column to
          min-content. */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_374px] gap-5 items-start">
        <div className="min-w-0">
          <h1 className="font-canela-display text-[30px] md:text-[42px] font-normal text-black leading-[1.05]">
            Prizes
          </h1>
          <div className="mt-3.5 font-lato text-[14px] md:text-[16px] font-normal leading-[1.75]" style={{ color: NOTE_INK }}>
            <p>Amazing rewards for the top ambassadors.</p>
            <p>Three levels of prizes, simultaneously.</p>
          </div>
          {/* The invite-anywhere note moved to the overview; Prizes now leads
              with how winners are decided. Artboard 1_07. */}
          <p className="mt-4 flex gap-3 font-lato text-[12px] md:text-[13px] font-bold" style={{ color: INK }}>
            <span aria-hidden>*</span>
            <span>Final winners are determined by verified downloads.</span>
          </p>
        </div>

        <div className={`${CARD} px-6 py-8 text-center`} style={{ borderColor: BORDER }}>
          <p
            className="font-lato text-[12px] md:text-[13px] font-bold uppercase tracking-[0.14em]"
            style={{ color: "#221f1e" }}
          >
            Total prize pool
          </p>
          <p
            className="font-canela-display text-[40px] md:text-[54px] font-normal leading-none mt-3"
            style={{ color: POOL_TEAL }}
          >
            $126,000
          </p>
          <p
            className="font-lato text-[11px] md:text-[12px] font-normal uppercase tracking-[0.12em] mt-4"
            style={{ color: "#636664" }}
          >
            Cash prizes
          </p>
          <p
            className="font-lato text-[12px] md:text-[13px] font-bold uppercase tracking-[0.1em] mt-2"
            style={{ color: WINNERS_GREEN }}
          >
            {totalWinners} winners
          </p>
        </div>
      </div>

      {/* NATIONAL WINNERS */}
      <section
        className={`${CARD} px-8 md:px-11 py-9 md:py-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] gap-8 items-center`}
        style={{ borderColor: BORDER }}
      >
        <div className="min-w-0">
          <Eyebrow>Ultimate stage</Eyebrow>
          <h2 className="font-canela-display text-[30px] md:text-[38px] font-normal text-black leading-[1.15] mt-3">
            National
            <br />
            Winners
          </h2>
          <p className="font-lato text-[15px] md:text-[17px] font-normal mt-4" style={{ color: NOTE_INK }}>
            3 total winners
          </p>
        </div>

        <div className="grid grid-cols-3">
          {NATIONAL_PLACES.map(({ place, amount, color }, index) => (
            <div
              key={place}
              className={`text-center px-3 ${index > 0 ? "border-l" : ""}`}
              style={index > 0 ? { borderColor: RULE } : undefined}
            >
              <Eyebrow>{place}</Eyebrow>
              <p
                className="font-canela-display text-[26px] md:text-[34px] font-normal leading-none mt-4"
                style={{ color }}
              >
                {amount}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MARKET + CAMPUS WINNERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-7">
        <TierCard
          title="Market winners"
          totalLabel="33 total winners"
          badge="#e6eeee"
          icon={<Building2 className="w-[22px] h-[22px] text-[#37577c]" strokeWidth={1.7} aria-hidden />}
          places={MARKET_PLACES}
          amountColor="#37577c"
        />
        <TierCard
          title="Campus winners"
          totalLabel="300 total winners"
          badge="#eaeee1"
          icon={<MapPin className="w-[22px] h-[22px] text-[#377a38]" strokeWidth={1.7} aria-hidden />}
          places={CAMPUS_PLACES}
          amountColor="#377a38"
        />
      </div>

      {/* INDIVIDUAL MILESTONES */}
      <section className={`${CARD} px-7 md:px-8 py-8`} style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-4">
          <Eyebrow>Individual milestones</Eyebrow>
          <span className="h-[1px] w-14 shrink-0" style={{ background: "#c9c9c9" }} aria-hidden />
        </div>

        {/* The redesign replaces the merch carousel with a progress track:
            reached milestones are filled, the one in play is a ring, and the
            connector is only green as far as you have got. */}
        <MilestoneTrack invites={invitesSoFar} />
      </section>

      {/* FINE PRINT */}
      <section className={`${CARD} px-8 md:px-12 py-6`} style={{ borderColor: BORDER }}>
        <div className="font-lato text-[13px] md:text-[14px] font-normal leading-[1.7]" style={{ color: "#3f3f3f" }}>
          {FINE_PRINT.map((line, index) => (
            <p key={line} className={index === FINE_PRINT.length - 1 ? "font-bold" : undefined}>
              {line}
            </p>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={`${CARD} px-8 py-8`} style={{ borderColor: BORDER }}>
        <h2 className="font-canela-display text-[22px] md:text-[27px] font-normal leading-none" style={{ color: INK }}>
          How it works
        </h2>

        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map(({ title, description, badge, icon }) => (
            <div key={title} className="flex items-start gap-3.5">
              <span
                className="grid w-11 h-11 md:w-12 md:h-12 shrink-0 place-items-center rounded-full"
                style={{ backgroundColor: badge }}
              >
                {icon}
              </span>
              <div className="min-w-0">
                <p className="font-lato text-[13px] md:text-[14px] font-bold" style={{ color: INK }}>
                  {title}
                </p>
                <p
                  className="mt-1 font-lato text-[12px] md:text-[13px] font-normal leading-[1.5]"
                  style={{ color: NOTE_INK }}
                >
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function TierCard({
  title,
  totalLabel,
  badge,
  icon,
  places,
  amountColor,
}: {
  title: string;
  totalLabel: string;
  badge: string;
  icon: ReactNode;
  places: Array<{ place: string; amount: string }>;
  amountColor: string;
}) {
  return (
    <section className={`${CARD} px-7 py-8`} style={{ borderColor: BORDER }}>
      <div className="flex items-center gap-4">
        <span
          className="grid w-11 h-11 md:w-12 md:h-12 shrink-0 place-items-center rounded-full"
          style={{ backgroundColor: badge }}
        >
          {icon}
        </span>
        <Eyebrow>{title}</Eyebrow>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3">
        {places.map(({ place, amount }) => (
          <div key={place} className="min-w-0">
            <Eyebrow>{place}</Eyebrow>
            <p
              className="font-canela-display text-[22px] md:text-[28px] font-normal leading-none mt-3"
              style={{ color: amountColor }}
            >
              {amount}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-6 font-lato text-[15px] md:text-[16px] font-normal" style={{ color: NOTE_INK }}>
        {totalLabel}
      </p>
    </section>
  );
}

/* ------------------------------------------------- individual milestones -- */

const TRACK_INK = "#293d2e";
const TRACK_DONE = "#234b2b";
const TRACK_REST = "#cdced0";

/**
 * Milestone progress, per artboard 1_7. Reached thresholds are filled and
 * ticked, the one currently in play is a ring, and the connector only runs
 * green as far as the last one reached.
 */
function MilestoneTrack({ invites }: { invites: number }) {
  const steps = MERCH_MILESTONES.map((tier) => tier.invites);
  const nextIndex = steps.findIndex((target) => invites < target);
  const remaining = nextIndex === -1 ? 0 : steps[nextIndex] - invites;

  return (
    <div className="mt-8">
      <div className="relative flex items-center justify-between px-2">
        {/* connector sits behind the nodes */}
        <span
          className="absolute left-2 right-2 top-[17px] h-[3px] rounded-full"
          style={{ background: TRACK_REST }}
          aria-hidden
        />
        <span
          className="absolute left-2 top-[17px] h-[3px] rounded-full transition-[width]"
          style={{
            background: TRACK_DONE,
            width:
              nextIndex === -1
                ? "calc(100% - 1rem)"
                : nextIndex === 0
                  ? "0%"
                  : `${(nextIndex / (steps.length - 1)) * 100}%`,
          }}
          aria-hidden
        />

        {steps.map((target, index) => {
          const done = invites >= target;
          const current = index === nextIndex;
          return (
            <span key={target} className="relative flex flex-col items-center gap-3">
              <span
                className="flex items-center justify-center rounded-full"
                style={{
                  width: index === steps.length - 1 ? 40 : 36,
                  height: index === steps.length - 1 ? 40 : 36,
                  background: current ? "#ffffff" : TRACK_INK,
                  border: current ? `3px solid ${TRACK_INK}` : "none",
                }}
              >
                {done ? (
                  <Check className="w-[18px] h-[18px] text-white" strokeWidth={2.6} aria-hidden />
                ) : current ? (
                  <span className="block size-[13px] rounded-full" style={{ background: TRACK_INK }} />
                ) : null}
              </span>
              <span
                className="font-lato text-[11px] font-bold uppercase tracking-[0.12em] whitespace-nowrap"
                style={{ color: NOTE_INK }}
              >
                {target} invites
              </span>
            </span>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <p className="font-lato text-[30px] md:text-[34px] font-normal leading-none" style={{ color: INK }}>
          {remaining}
        </p>
        <p
          className="mt-3 font-lato text-[11px] font-normal uppercase tracking-[0.14em]"
          style={{ color: NOTE_INK }}
        >
          {remaining === 0 ? "All rewards unlocked" : "Invites to next reward"}
        </p>
      </div>
    </div>
  );
}
