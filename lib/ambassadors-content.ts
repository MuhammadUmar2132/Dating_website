/**
 * Ambassadors page content — measured off design/membersAmbassador
 * ("24 website" artboards 08, 15, 16, 17).
 *
 * The artboards are 1440px wide and export at 3.9535 image px per CSS px,
 * so every geometry note in styles/ambassadors.css is `image px / 3.9535`.
 *
 * Two things in the artboards are deliberately NOT reproduced:
 *  - the tab label reads "01 INDIVDUAL" (missing an I) in all four states;
 *  - the artboards use three slightly different content widths in the same
 *    page (1267 / 1298 / 1320). The 1268 measure carries the tabs, the rule
 *    and the cards, so it is the one used throughout; only the dark closing
 *    panel keeps its own 1320.
 */

/** Cream strip above the nav. */
export const AMB_ANNOUNCEMENT = "Launching this fall in select markets.";

type AmbStat = {
  value: string;
  label: string;
  note: string;
  /** The first cell is the wide, left-aligned "Top Prize" one. */
  lead?: boolean;
};

export const AMB_HERO: {
  eyebrow: string;
  heading: string;
  sub: string[];
  stats: AmbStat[];
  contact: { lead: string; handle: string };
  invite: { lead: string; cta: string; href: string };
} = {
  eyebrow: "Founding 500",
  heading: "Lead the campus launch",
  /* Two lines in the artboard, broken as drawn. */
  sub: ["Invite friends to join 24", "and unlock prizes before launch."],
  stats: [
    { label: "Top Prize", value: "$24,000", note: "One national winner", lead: true },
    { value: "100", label: "Schools", note: "participating" },
    { value: "24th", label: "September", note: "competition starts" },
    { value: "500", label: "Ambassadors", note: "total" },
    { value: "7", label: "Days", note: "invite duration" },
  ],
  contact: { lead: "Interested? Message", handle: "@24togethertoday" },
  invite: { lead: "Already have an invite?", cta: "Log in", href: "/login" },
};

export type AmbTier = {
  id: string;
  index: string;
  label: string;
  /** Underline under the active tab. Green on 01, ink on the rest — as drawn. */
  underline: string;
} & (
  | { kind: "merch"; items: { invites: string; name: string; img: string }[] }
  | {
      kind: "cash";
      accent: string;
      championLabel: string;
      places: { rank: string; amount: string; where: string }[];
    }
);

export const AMB_TIERS: AmbTier[] = [
  {
    id: "individual",
    index: "01",
    label: "Individual",
    underline: "#203D2C",
    kind: "merch",
    items: [
      { invites: "200 invites", name: "24 hoodie", img: "/ambassadors/hoodie.png" },
      { invites: "100 invites", name: "24 tee", img: "/ambassadors/tee.png" },
      { invites: "50 invites", name: "24 hat", img: "/ambassadors/hat.png" },
    ],
  },
  {
    id: "campus",
    index: "02",
    label: "Campus",
    underline: "#070707",
    kind: "cash",
    accent: "#6A3236",
    championLabel: "Campus champion",
    places: [
      { rank: "01 / FIRST", amount: "$240", where: "#1 at your school" },
      { rank: "02 / SECOND", amount: "$120", where: "#2 at your school" },
      { rank: "03 / THIRD", amount: "$60", where: "#3 at your school" },
    ],
  },
  {
    id: "market",
    index: "03",
    label: "Market",
    underline: "#070707",
    kind: "cash",
    accent: "#617EAA",
    championLabel: "Market champion",
    places: [
      { rank: "01 / FIRST", amount: "$2,400", where: "#1 in your region" },
      { rank: "02 / SECOND", amount: "$1,200", where: "#2 in your region" },
      { rank: "03 / THIRD", amount: "$600", where: "#3 in your region" },
    ],
  },
  {
    id: "national",
    index: "04",
    label: "National",
    underline: "#070707",
    kind: "cash",
    accent: "#203D2C",
    championLabel: "National champion",
    places: [
      { rank: "01 / FIRST", amount: "$24,000", where: "#1 in the country" },
      { rank: "02 / SECOND", amount: "$12,000", where: "#2 in the country" },
      { rank: "03 / THIRD", amount: "$6,000", where: "#3 in the country" },
    ],
  },
];

export const AMB_PRIZES = {
  eyebrow: "Earn up to",
  amount: "$24,000",
  note: "in cash, plus merch & perks",
  perk: { lead: "Every participant gets", line: "1 year of 24 Premium" },
  foot: "Ranked by verified app downloads",
  rules: { label: "Official Rules", href: "/legal/official-rules" },
} as const;

export const AMB_PARTICIPATION = {
  eyebrow: "Your participation",
  daysLarge: "7",
  daysWord: "days",
  heading: "One week to invite your friends. That’s it.",
  /* Icons are cut from artboard 17 — the /images/assets ones sit on a beige
     circle that the new design does not use. Each has its own measured size
     (they are not a uniform square) and they bottom-align in the row. */
  steps: [
    {
      icon: "/ambassadors/step-invite.png",
      iconW: 91,
      iconH: 75,
      title: "Invite period",
      body: ["Invite your friends", "for seven days."],
    },
    {
      icon: "/ambassadors/step-launch.png",
      iconW: 104,
      iconH: 64,
      title: "Launch",
      /* The artboard still says "Bubba" here while the rest of the page says
         "24" — kept as drawn rather than silently renamed. */
      body: ["Bubba goes live in", "your market."],
    },
    {
      icon: "/ambassadors/step-winners.png",
      iconW: 71,
      iconH: 66,
      title: "Winners announced",
      body: ["Rankings are finalized and winners", "are announced after launch."],
    },
  ],
  panels: [
    {
      icon: "info",
      title: "How points work",
      body: ["Learn how points are earned and", "what counts towards your score."],
    },
    {
      icon: "target",
      title: "Why we’re doing this",
      body: ["Learn about our mission", "and why we’re so excited."],
    },
  ],
} as const;

export const AMB_CLOSER = {
  eyebrow: "Invited ambassadors",
  headingLines: ["A new dating experience,", "built together."],
  title: "Ready to lead your campus?",
  body:
    "Ambassadors are invited by our team to lead their campus. If you’ve accepted your invitation, a link will be emailed to get started. Or, you can start here.",
  cta: { label: "Ambassador start", href: "/ambassador/onboarding" },
  orLabel: "or",
  altLead: "Interested but haven’t been invited?",
  altCta: { label: "Reach out on Instagram", href: "https://instagram.com/24togethertoday" },
} as const;
