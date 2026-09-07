"use client";

import { CircleChevronRight, CircleDot, Trophy, Zap } from "lucide-react";
import type { ReactNode } from "react";

import { importantDates, type HubCompetition } from "@/lib/ambassador-hub";

/* Sampled from artboard 1_4. */
const INK = "#000000";
const INK_DESC = "#7f7f7f";
const BORDER = "#eeeeee";
const RULE = "#f1f1f1";

const ICONS: Record<string, { badge: string; icon: ReactNode }> = {
  start: {
    badge: "#eaeee1",
    icon: <CircleChevronRight className="w-[22px] h-[22px] text-[#111111]" strokeWidth={1.7} aria-hidden />,
  },
  "waitlist-ends": {
    badge: "#fdeedc",
    icon: (
      <CircleDot
        className="w-[22px] h-[22px] text-[#111111] [&>circle:last-child]:fill-current"
        strokeWidth={1.7}
        aria-hidden
      />
    ),
  },
  "app-launch": {
    badge: "#ede7ef",
    icon: <Zap className="w-[22px] h-[22px] text-[#111111] fill-current" strokeWidth={1.7} aria-hidden />,
  },
  scoring: {
    badge: "#ede2ea",
    icon: <Trophy className="w-[22px] h-[22px] text-[#111111]" strokeWidth={1.7} aria-hidden />,
  },
};

function ordinal(day: number) {
  if (day % 10 === 1 && day !== 11) return "st";
  if (day % 10 === 2 && day !== 12) return "nd";
  if (day % 10 === 3 && day !== 13) return "rd";
  return "th";
}

/* "May 5th, 2025", or "May 5th - 18th, 2025" for a range inside one month. */
export function formatDateRange(date: string, endDate?: string) {
  const from = new Date(date);
  if (Number.isNaN(from.getTime())) return "";

  const month = from.toLocaleString("en-US", { month: "long" });
  const head = `${month} ${from.getDate()}${ordinal(from.getDate())}`;
  if (!endDate) return `${head}, ${from.getFullYear()}`;

  const to = new Date(endDate);
  if (Number.isNaN(to.getTime())) return `${head}, ${from.getFullYear()}`;

  const tail = `${to.getDate()}${ordinal(to.getDate())}`;
  if (to.getMonth() === from.getMonth() && to.getFullYear() === from.getFullYear()) {
    return `${head} - ${tail}, ${from.getFullYear()}`;
  }
  const toMonth = to.toLocaleString("en-US", { month: "long" });
  return `${head} - ${toMonth} ${tail}, ${to.getFullYear()}`;
}

export function CalendarContent({ competition }: { competition: HubCompetition }) {
  const rows = importantDates(competition);
  if (!rows.length) return null;

  return (
    <section
      className="mt-9 md:mt-11 bg-white border rounded-[12px] px-5 md:px-8"
      style={{ borderColor: BORDER }}
    >
      {rows.map((event, index) => {
        const visual = ICONS[event.id] ?? ICONS.start;
        return (
          <div key={event.id} className="flex items-center gap-5 md:gap-8">
            {/* Icon sits outside the divider, which starts at the date column. */}
            <span
              className="grid w-11 h-11 md:w-12 md:h-12 shrink-0 place-items-center rounded-full"
              style={{ backgroundColor: visual.badge }}
            >
              {visual.icon}
            </span>
            <div
              className={`flex-1 min-w-0 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.2fr)] gap-1.5 md:gap-7 py-7 md:py-8 ${
                index > 0 ? "border-t" : ""
              }`}
              style={index > 0 ? { borderColor: RULE } : undefined}
            >
              <p className="font-lato text-[15px] md:text-[17px] font-bold" style={{ color: INK }}>
                {formatDateRange(event.date, event.endDate)}
              </p>
              <p className="font-lato text-[15px] md:text-[17px] font-normal" style={{ color: INK }}>
                {event.title}
              </p>
              <p
                className="font-lato text-[14px] md:text-[16px] font-normal leading-[1.5]"
                style={{ color: INK_DESC }}
              >
                {event.description}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
