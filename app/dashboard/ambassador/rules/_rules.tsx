"use client";

import Link from "next/link";
import {
  Calendar,
  ChevronRight,
  FileText,
  Flag,
  Network,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { BUBBA_BRAND } from "@/lib/bubba-content";

const RULES = [
  {
    title: "Eligibility",
    description:
      "The Bubba Ambassador Competition is open to current students at participating campuses who are officially invited and selected as ambassadors.",
    icon: Flag,
  },
  {
    title: "How it works",
    description:
      "Ambassadors share their unique referral link to invite new users to join the Bubba waitlist. Every verified sign-up through their link counts as one (1) invite.",
    icon: Users,
  },
  {
    title: "Scoring & Leaderboard",
    description:
      "Invites are counted in real time and reflected on the leaderboard. Rankings are based on the total number of verified sign-ups during the competition period.",
    icon: Network,
  },
  {
    title: "Prizes",
    description:
      "The ambassador with the most verified sign-ups at the end of the competition wins the grand prize. Additional prizes are available at the campus, market, and national levels.",
    icon: Trophy,
  },
  {
    title: "Competition Period",
    description:
      "The competition period is displayed in the Overview and Calendar pages. All invites must be received before the competition end date and time.",
    icon: Calendar,
  },
  {
    title: "Fair Use",
    description:
      "Spam, misleading referrals, fraudulent activity, fake accounts, or any attempt to manipulate rankings may result in immediate disqualification. Bubba reserves the right to remove invalid invites.",
    icon: ShieldCheck,
  },
  {
    title: "General",
    description:
      "Bubba reserves the right to modify, suspend, or cancel the competition at any time. By participating, ambassadors agree to these official rules and Bubba's Terms of Use.",
    icon: FileText,
  },
];

const SUMMARY_HIGHLIGHTS = [
  {
    label: "Competition Period",
    subtitle: "See Calendar",
    icon: Calendar,
  },
  {
    label: "Who Can Participate",
    subtitle: "5–10 selected ambassadors per campus",
    icon: Flag,
  },
  {
    label: "How to Win",
    subtitle: "Get the most verified sign-ups. Direct + indirect invites.",
    icon: Users,
  },
  {
    label: "Top Prize",
    subtitle: "$24,000 + merch bundle",
    icon: Trophy,
  },
  {
    label: "Fair Play",
    subtitle: "No spam or fraudulent activity",
    icon: ShieldCheck,
  },
];

/* Sampled from artboard 1_1. The rule list is set in the sans, not the serif -
   only the page title stays in Canela. */
const RULE_TITLE = "#0d2229";
const RULE_BODY = "#4a4e4e";
const PANEL_HEADING = "#3d3d3d";
const SUMMARY_SUB = "#636664";
const LINK_TEAL = "#225a66";

/* The artboards alternate two tints only - the rule list starts on the green
   grey, the quick-summary list starts on the blue grey. */
const TINT_GREEN = "#eaeee1";
const TINT_BLUE = "#e6eeee";
const tint = (index: number, startBlue = false) =>
  (index % 2 === 0) === startBlue ? TINT_BLUE : TINT_GREEN;

export function periodLabel(start?: string | null, end?: string | null) {
  if (!start || !end) return "See Calendar";
  const fmt = (iso: string) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function RulesContent({ period }: { period: string }) {
  return (
    <>
        <div className="min-w-0">
          <h1 className="font-canela-display text-[24px] md:text-[30px] font-normal text-black leading-[1.1]">
            Rules &amp; Terms
          </h1>
          <p className="mt-2.5 font-lato text-[13px] md:text-[14px] font-normal" style={{ color: RULE_BODY }}>
            Please read the official rules and terms for the Bubba Ambassador Competition.
          </p>
        </div>

        <div className="mt-8 md:mt-10 grid items-start gap-4 md:gap-5 lg:grid-cols-[1fr_290px]">
          <section className="rounded-[12px] border border-[#e6dbd4] bg-[#fbfbf9] p-5 md:p-6">
            {/*<h2 className="font-sfpro text-[13px] md:text-[16px] font-bold uppercase tracking-[0.14em] text-[#402b23]">
              Official Rules
            </h2>*/}

            <div className="divide-y divide-neutral-200/70">
              {RULES.map((rule, index) => {
                const Icon = rule.icon;
                return (
                  <div key={rule.title} className="flex items-start gap-4 py-6 first:pt-0 last:pb-0">
                    <span
                      className="grid size-11 shrink-0 place-items-center rounded-full"
                      style={{ backgroundColor: tint(index) }}
                    >
                      <Icon className="size-5 text-[#1c1c1c]" strokeWidth={1.6} />
                    </span>
                    <div className="min-w-0">
                      <p
                        className="font-lato text-[16px] md:text-[18px] font-bold leading-[1.3]"
                        style={{ color: RULE_TITLE }}
                      >
                        {index + 1}. {rule.title}
                      </p>
                      <p
                        className="mt-2 font-lato text-[14px] md:text-[15px] font-normal leading-[1.55]"
                        style={{ color: RULE_BODY }}
                      >
                        {rule.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-[12px] border border-[#e6dbd4] bg-[#fbfbf9] p-5">
              <h3
                className="font-lato text-[14px] md:text-[15px] font-bold uppercase tracking-[0.14em]"
                style={{ color: PANEL_HEADING }}
              >
                Quick Summary
              </h3>
              <div className="mt-4 space-y-3.5">
                {SUMMARY_HIGHLIGHTS.map(({ icon: Icon, label, subtitle }, index) => (
                  <div key={label} className="flex items-start gap-3">
                    <span
                      className="grid size-9 shrink-0 place-items-center rounded-full"
                      style={{ backgroundColor: tint(index, true) }}
                    >
                      <Icon className="size-4 text-[#1c1c1c]" strokeWidth={1.6} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-lato text-[14px] font-bold text-black">{label}</p>
                      <p
                        className="mt-1 font-lato text-[13px] font-normal leading-[1.45]"
                        style={{ color: SUMMARY_SUB }}
                      >
                        {label === "Competition Period" ? period : subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[12px] border border-[#e6dbd4] bg-[#fbfbf9] p-5">
              <h3
                className="font-lato text-[14px] md:text-[15px] font-bold uppercase tracking-[0.14em]"
                style={{ color: PANEL_HEADING }}
              >
                Questions
              </h3>
              <p
                className="mt-3.5 font-lato text-[13px] font-normal leading-[1.5]"
                style={{ color: RULE_BODY }}
              >
                Reach out to our team if you have any questions about the competition.
              </p>
              <a
                href={`mailto:${BUBBA_BRAND.supportEmail}`}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-[#e4e4e4] px-4 py-3.5 font-lato text-[14px] font-bold transition-colors hover:bg-[#f7faf9]"
                style={{ color: LINK_TEAL }}
              >
                Contact Support
              </a>
            </section>

            <section className="rounded-[12px] border border-[#e6dbd4] bg-[#fbfbf9] p-5">
              <h3
                className="font-lato text-[14px] md:text-[15px] font-bold uppercase tracking-[0.14em]"
                style={{ color: PANEL_HEADING }}
              >
                Legal
              </h3>
              <div className="mt-3 flex flex-col">
                <Link
                  href="/legal/terms"
                  className="flex items-center justify-between py-3.5 font-lato text-[14px] font-bold"
                  style={{ color: LINK_TEAL }}
                >
                  Terms of Service
                  <ChevronRight className="size-4 shrink-0 text-black" strokeWidth={2.6} />
                </Link>
                <Link
                  href="/legal/privacy"
                  className="flex items-center justify-between border-t border-[#ededed] py-3.5 font-lato text-[14px] font-bold"
                  style={{ color: LINK_TEAL }}
                >
                  Privacy Policy
                  <ChevronRight className="size-4 shrink-0 text-black" strokeWidth={2.6} />
                </Link>
              </div>
            </section>
          </aside>
        </div>
    </>
  );
}
