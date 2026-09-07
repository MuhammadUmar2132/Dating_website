/**
 * Legal document registry.
 *
 * The design supplies the *layout* for these pages (summary callout at the top,
 * long-form numbered sections below) but not the operative text — the mock
 * itself shows lorem ipsum in the summary boxes. Every document below therefore
 * ships with its structure in place and a visible placeholder where counsel's
 * copy needs to be dropped in. Nothing here should be treated as legal wording.
 */

export type LegalSummaryItem = { term: string; detail: string };

export type LegalSection = {
  heading: string;
  /** Paragraphs of real, non-operative descriptive copy, if any. */
  body?: string[];
  /** When true the section renders the "copy needed" placeholder block. */
  awaitingCopy?: boolean;
};

export type RuleColumn = {
  title: string;
  body: string;
};

export type CompetitionRule = {
  id: string;
  number: number;
  title: string;
  preview: string;
  icon: "user" | "star" | "chart" | "gift" | "badge" | "shield" | "scale" | "file";
  columns: RuleColumn[];
  note?: string;
};

export type LegalSimpleVersion = {
  text: string;
  note: string;
};

export type LegalDoc = {
  slug: string;
  title: string;
  eyebrow?: string;
  updated: string;
  intro: string;
  illustration?: string;
  simpleVersion?: LegalSimpleVersion;
  summary?: { heading: string; items: LegalSummaryItem[] };
  sections: LegalSection[];
};

const AWAITING: LegalSection[] = [
  { heading: "1. Introduction", awaitingCopy: true },
  { heading: "2. Scope", awaitingCopy: true },
  { heading: "3. Your rights", awaitingCopy: true },
  { heading: "4. Contact", awaitingCopy: true },
];

export const BUBBA_LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "terms",
    title: "Terms of Use",
    updated: "Not yet published",
    intro:
      "These Terms govern your access to and use of the Bubba website, mobile application, and any related products, features, content, or services.",
    summary: {
      heading: "Here is a short summary of our Terms of Use",
      items: [
        {
          term: "California subscribers",
          detail:
            "Summary of the California-specific subscription and cancellation rights.",
        },
        {
          term: "Automatic renewal",
          detail:
            "Summary of how subscriptions renew and how to turn renewal off.",
        },
        {
          term: "App store refunds",
          detail:
            "Summary of how refunds are handled when you purchase through an app store.",
        },
      ],
    },
    sections: [
      {
        heading: "1. Introduction",
        body: [
          "Welcome to Bubba, operated by Bubba Operating Company, LLC (\u201cBubba\u201d, \u201cwe\u201d, \u201cus\u201d, \u201cour\u201d, or the \u201cCompany\u201d).",
          "By creating an account, accessing, or using our services, you agree to be bound by these Terms, our Privacy Policy, our Community Guidelines, our Cookie Policy where applicable, and any additional terms presented to you when you purchase premium features or other services. If you do not agree to these Terms, you may not access or use our services.",
        ],
      },
      { heading: "2. Eligibility and your account", awaitingCopy: true },
      { heading: "3. Subscriptions, billing and renewal", awaitingCopy: true },
      { heading: "4. Acceptable use", awaitingCopy: true },
      { heading: "5. Content and licence", awaitingCopy: true },
      { heading: "6. Termination", awaitingCopy: true },
      { heading: "7. Disclaimers and limitation of liability", awaitingCopy: true },
      { heading: "8. Governing law and disputes", awaitingCopy: true },
      {
        heading: "9. Company information",
        body: [
          "Bubba Operating Company, LLC, 580 Farmington Avenue, Hartford, CT 06105, United States.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    updated: "Not yet published",
    intro:
      "How Bubba collects, uses, shares and protects your personal information, and the choices you have.",
    sections: AWAITING,
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    updated: "Not yet published",
    intro:
      "What cookies and similar technologies Bubba uses, what they do, and how to manage them.",
    sections: AWAITING,
  },
  {
    slug: "community-guidelines",
    title: "Community Guidelines",
    updated: "Not yet published",
    intro:
      "What we expect from everyone on Bubba, what isn't allowed, and what happens when someone crosses the line.",
    sections: AWAITING,
  },
  {
    slug: "official-rules",
    title: "Official Competition Rules",
    eyebrow: "BUBBA AMBASSADOR PROGRAM",
    updated: "May 19, 2025",
    intro:
      "Everything you need to know about how the competition works, how points are earned, and how prizes are awarded.",
    illustration: "/bubba/campus.png",
    simpleVersion: {
      text: "You get a private invite link. People who join through you count toward your total. If your invite leads to more eligible people joining, some of those referrals may count toward your network total too. Rankings and prizes are based on verified eligible participation.",
      note: "The rules below are the official version.",
    },
    sections: [
      { heading: "1. How invites work", awaitingCopy: true },
      { heading: "2. How points are counted", awaitingCopy: true },
      { heading: "3. Competition structure", awaitingCopy: true },
      { heading: "4. Prizes and payouts", awaitingCopy: true },
      { heading: "5. Eligibility", awaitingCopy: true },
      { heading: "6. Fair play", awaitingCopy: true },
      { heading: "7. Ties and disputes", awaitingCopy: true },
      { heading: "8. Official terms", awaitingCopy: true },
    ],
  },
  {
    slug: "consumer-health-data",
    title: "Consumer Health Data Privacy Policy",
    updated: "Not yet published",
    intro:
      "Additional disclosures for consumer health data under applicable state privacy laws.",
    sections: AWAITING,
  },
  {
    slug: "colorado-safety",
    title: "Colorado Safety Policy Information",
    updated: "Not yet published",
    intro:
      "Safety information and disclosures required for Colorado users of dating platforms.",
    sections: AWAITING,
  },
  {
    slug: "accessibility",
    title: "Accessibility Statement",
    updated: "Not yet published",
    intro:
      "Our commitment to making Bubba usable by everyone, and how to tell us when we fall short.",
    sections: AWAITING,
  },
];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return BUBBA_LEGAL_DOCS.find((doc) => doc.slug === slug);
}

export const BUBBA_COMPETITION_RULES: CompetitionRule[] = [
  {
    id: "how-invites-work",
    number: 1,
    title: "1. How invites work",
    preview:
      "How your invite link works, how direct and network invites are credited, and when attribution is locked.",
    icon: "user",
    columns: [
      {
        title: "YOUR UNIQUE LINK",
        body: "Every ambassador receives a personal invite link. Share it however you'd like. When someone signs up and verifies through your link, you'll receive credit.",
      },
      {
        title: "DIRECT INVITES (FULL CREDIT)",
        body: "People who join and verify through your personal link count as your direct invites and earn you full point value.",
      },
      {
        title: "NETWORK INVITES (FULL CREDIT)",
        body: "If someone you directly invited later invites another eligible person, you'll also receive credit. Only one downstream level is counted.",
      },
    ],
    note: "Attribution is permanently locked to the first verified invite path.",
  },
  {
    id: "how-points-are-counted",
    number: 2,
    title: "2. How points are counted",
    preview:
      "When points are awarded, how long invites count, and what qualifies for credit.",
    icon: "star",
    columns: [
      {
        title: "VERIFICATION REQUIRED",
        body: "Points are awarded only after an invited user completes account verification.",
      },
      {
        title: "COMPETITION PERIOD",
        body: "Only invite links first opened during the 7-day competition period are eligible. Once an eligible invite has been initiated, points may continue to be earned from verified app downloads for up to one month after Bubba launches.",
      },
      {
        title: "EXTENDED COUNTING PERIOD",
        body: "Eligible invites continue earning points through the first month after Bubba launches, provided the original invite occurred during the competition.",
      },
      {
        title: "POINT VALUES",
        body: "Direct invites receive full credit. Network invites receive full credit. Current point values are shown in your dashboard.",
      },
    ],
    note: "Points are awarded only after an invited person downloads the Bubba app, creates an account, and successfully completes account verification during the 1st month of Bubba launch in each respective market. Invitations that do not result in a verified Bubba account do not earn points.",
  },
  {
    id: "competition-structure",
    number: 3,
    title: "3. Competition Structure",
    preview:
      "Campus, market, and national leaderboards, milestone prizes, and the grand prize competition.",
    icon: "chart",
    columns: [
      {
        title: "THREE LEADERBOARDS",
        body: "Every ambassador competes simultaneously in three: individual, market, and national.",
      },
      {
        title: "MILESTONE REWARDS",
        body: "Earn guaranteed rewards when you reach invite milestones: 24 invites, 100 invites, and 240 invites.",
      },
      {
        title: "GRAND PRIZE",
        body: "The highest-performing ambassador nationwide wins the $24,000 Grand Prize.",
      },
      {
        title: "RANKINGS",
        body: "Leaderboards update throughout the competition. Final rankings are determined after all eligible invite activity has been verified.",
      },
    ],
  },
  {
    id: "prizes-and-payouts",
    number: 4,
    title: "4. Prizes and Payouts",
    preview:
      "Milestone rewards, payment timing, eligibility requirements, and prize fulfillment.",
    icon: "gift",
    columns: [
      {
        title: "MILESTONE PRIZES",
        body: "Milestone rewards are distributed after eligibility has been verified.",
      },
      {
        title: "GRAND PRIZE",
        body: "The national winner receives $24,000.",
      },
      {
        title: "VERIFICATION",
        body: "Identity verification may be required before prizes are awarded.",
      },
      {
        title: "TAXES",
        body: "Recipients are responsible for any applicable taxes required by law.",
      },
      {
        title: "SUBSTITUTIONS",
        body: "Bubba may substitute prizes with items of equal or greater value if necessary.",
      },
    ],
    note: "All prizes are subject to verification of eligibility and compliance with these Official Rules.",
  },
  {
    id: "eligibility",
    number: 5,
    title: "5. Eligibility",
    preview:
      "Who can participate, age requirements, account rules, and eligible schools and markets.",
    icon: "badge",
    columns: [
      {
        title: "PARTICIPATION",
        body: "The Ambassador Program is currently available by invitation only.",
      },
      {
        title: "AGE",
        body: "Participants must meet the minimum legal age required in their jurisdiction.",
      },
      {
        title: "ONE ACCOUNT",
        body: "Only one ambassador account is permitted per person.",
      },
      {
        title: "ELIGIBLE MARKETS",
        body: "Only approved schools and launch markets qualify for competition prizes.",
      },
    ],
  },
  {
    id: "fair-play",
    number: 6,
    title: "6. Fair Play",
    preview:
      "Rules that keep the competition fair and prevent abuse or fraudulent activity.",
    icon: "shield",
    columns: [
      {
        title: "PROHIBITED ACTIVITY",
        body: "The following may result in disqualification: fake accounts, self-referrals, purchased invites, spam, automated signups, misrepresentation, and attempts to manipulate rankings.",
      },
      {
        title: "REVIEW",
        body: "Bubba reserves the right to investigate suspicious activity at any time.",
      },
      {
        title: "ENFORCEMENT",
        body: "Points may be removed and prizes forfeited if violations are confirmed.",
      },
    ],
  },
  {
    id: "ties-and-disputes",
    number: 7,
    title: "7. Ties & Disputes",
    preview:
      "How ties are resolved and how competition questions are reviewed.",
    icon: "scale",
    columns: [
      {
        title: "TIE BREAKING",
        body: "If two ambassadors finish with identical qualifying points, Bubba may use invite quality, verification timing, or additional review to determine final placement.",
      },
      {
        title: "QUESTIONS",
        body: "If you believe an error has occurred, contact Bubba Support through your ambassador dashboard.",
      },
      {
        title: "FINAL DECISIONS",
        body: "All competition decisions made by Bubba are final.",
      },
    ],
  },
  {
    id: "official-terms",
    number: 8,
    title: "8. Official Terms",
    preview:
      "Legal terms, privacy, liability, program changes, and contact information.",
    icon: "file",
    columns: [
      {
        title: "CHANGES",
        body: "Bubba reserves the right to modify, suspend, or cancel the Ambassador Program due to fraud, technical failures, legal requirements, or other circumstances beyond its reasonable control.",
      },
      {
        title: "PRIVACY",
        body: "Participation is subject to Bubba's Privacy Policy and Terms of Service.",
      },
      {
        title: "LIABILITY",
        body: "Bubba is not responsible for technical issues, delays, or circumstances beyond its reasonable control.",
      },
      {
        title: "CONTACT",
        body: "Questions regarding the Ambassador Program can be submitted through Ambassador Support.",
      },
    ],
  },
];
