/**
 * Copy + data for the public marketing pages.
 * Transcribed from the approved design screenshots so the pages stay
 * content-driven rather than hard-coding strings into JSX.
 */

export const BUBBA_BRAND = {
  /** The "24" mark is the logo in the top nav and the drawer head; the black
   * Bubba wordmark is still the cut used in the footer and the join flow. */
  wordmark: "/bubba/mark-24.svg",
  wordmarkBlack: "/bubba/wordmark-black.png",
  /** Circular "B" seal used in the footer baseline. The @4x cut is the same
   * mark as mark-bb.png but 727px wide instead of 54px — at 24px on a 3x
   * screen the small one was being upscaled, which read as pixelated. */
  mark: "/bubba/b-logo-green@4x.png",
  /** Single-stroke "B" mark used in product UI. */
  markSingle: "/bubba/mark-b.png",
  scene: "/images/assets/park.svg",
  faqScene: "/images/4x/faq-cycling.png",
  /** Campus line art — reserved for the Competition Rules page. */
  campus: "/bubba/campus.png",
  bolt: "/bubba/bolt.png",
  tagline: "Together, today.",
  supportEmail: "support@joinbubba.co",
  partnershipsEmail: "partnerships@joinbubba.co",
  pressEmail: "press@joinbubba.co",
  legalEmail: "legal@joinbubba.co",
} as const;

/**
 * Nav — left links; the wordmark sits centred and the CTA sits right.
 *
 * Ambassadors / Calendar / FAQ only, per the website artboards. Waiting Room
 * and Log in were both dropped on request. Returning members can still reach
 * sign-in from either login page, which cross-link to each other.
 */
export const BUBBA_NAV_LINKS = [
  { key: "ambassadors", label: "Ambassadors", href: "/ambassadors" },
  { key: "calendar", label: "Calendar", href: "/calendar" },
  { key: "faq", label: "FAQ", href: "/faq" },
] as const;

/** Nav v2 — logo left; FAQ, Ambassadors, Calendar + CTA on the right (desktop). */
export const BUBBA_NAV_LINKS_V2 = [
  { key: "faq", label: "FAQ", href: "/faq" },
  { key: "ambassadors", label: "Ambassadors", href: "/ambassadors" },
  { key: "calendar", label: "Calendar", href: "/calendar" },
] as const;

/** Nav v3 — centered logo + links; CTA pinned right (desktop, FAQ page). */
export const BUBBA_NAV_LINKS_V3 = [
  { key: "ambassadors", label: "Ambassadors", href: "/ambassadors" },
  { key: "calendar", label: "Calendar", href: "/calendar" },
  { key: "faq", label: "FAQ", href: "/faq" },
] as const;

export type BubbaNavVariant = "default" | "v2" | "v3";

export type BubbaNavKey =
  | (typeof BUBBA_NAV_LINKS)[number]["key"]
  | (typeof BUBBA_NAV_LINKS_V2)[number]["key"]
  | (typeof BUBBA_NAV_LINKS_V3)[number]["key"]
  | "home";

/** Hero city rail. */
export const BUBBA_LAUNCH_CITIES = [
  "NYC",
  "Boston",
  "Miami",
  "Los Angeles",
  "Chicago",
] as const;

/** Waiting Room prompt cards. */
export const BUBBA_PROMPT_CARDS = [
  {
    id: "prompt",
    chip: "Prompt",
    tone: "green",
    prompt: "If I had one last first date ever it would be…",
    art: null,
    likes: 184,
    action: "View top responses",
  },
  {
    id: "snap",
    chip: "Snap",
    tone: "blue",
    prompt: null,
    art: "camera",
    likes: null,
    action: "See what's next",
  },
  {
    id: "this-or-that",
    chip: "This or that",
    tone: "clay",
    prompt: null,
    art: "signpost",
    likes: null,
    action: "Pick your side",
  },
] as const;

/**
 * Launch calendar.
 *
 * NOTE: the design screenshot lists Washington DC under "NEW YORK" — that is a
 * copy-paste slip in the mock, corrected to District of Columbia here.
 * Dates are placeholders until the real launch schedule is confirmed.
 */
export type BubbaMarket = {
  id: string;
  city: string;
  state: string;
  progress: number;
  month: string;
  day: string;
  image: string;
  stats: {
    waitlistCount: string;
    waitingRoomDates: string;
    launchDate: string;
    launchYear: string;
  };
};

export const BUBBA_MARKETS: BubbaMarket[] = [
  {
    id: "nyc",
    city: "New York",
    state: "New York",
    progress: 82,
    month: "Jul",
    day: "24",
    image: "/bubba/city-new-york.png",
    stats: {
      waitlistCount: "12,854",
      waitingRoomDates: "July 18-23",
      launchDate: "July 24",
      launchYear: "2026",
    },
  },
  {
    id: "la",
    city: "Los Angeles",
    state: "California",
    progress: 78,
    month: "Jul",
    day: "24",
    image: "/bubba/city-los-angeles.png",
    stats: {
      waitlistCount: "11,240",
      waitingRoomDates: "July 18-23",
      launchDate: "July 24",
      launchYear: "2026",
    },
  },
  {
    id: "boston",
    city: "Boston",
    state: "Massachusetts",
    progress: 74,
    month: "Jul",
    day: "24",
    image: "/bubba/city-boston.png",
    stats: {
      waitlistCount: "9,842",
      waitingRoomDates: "July 18-23",
      launchDate: "July 24",
      launchYear: "2026",
    },
  },
  {
    id: "miami",
    city: "Miami",
    state: "Florida",
    progress: 66,
    month: "Jul",
    day: "24",
    image: "/bubba/city-miami.png",
    stats: {
      waitlistCount: "8,110",
      waitingRoomDates: "July 18-23",
      launchDate: "July 24",
      launchYear: "2026",
    },
  },
  {
    id: "chicago",
    city: "Chicago",
    state: "Illinois",
    progress: 71,
    month: "Jul",
    day: "24",
    image: "/bubba/city-chicago.png",
    stats: {
      waitlistCount: "7,930",
      waitingRoomDates: "July 18-23",
      launchDate: "July 24",
      launchYear: "2026",
    },
  },
  {
    id: "dc",
    city: "Washington DC",
    state: "District of Columbia",
    progress: 63,
    month: "Jul",
    day: "24",
    image: "/bubba/city-washington-dc.png",
    stats: {
      waitlistCount: "6,420",
      waitingRoomDates: "July 18-23",
      launchDate: "July 24",
      launchYear: "2026",
    },
  },
  {
    id: "austin",
    city: "Austin",
    state: "Texas",
    progress: 58,
    month: "Jul",
    day: "24",
    image: "/bubba/city-austin.png",
    stats: {
      waitlistCount: "5,800",
      waitingRoomDates: "July 18-23",
      launchDate: "July 24",
      launchYear: "2026",
    },
  },
  {
    id: "phoenix",
    city: "Phoenix",
    state: "Arizona",
    progress: 52,
    month: "Jul",
    day: "24",
    image: "/bubba/city-phoenix.png",
    stats: {
      waitlistCount: "4,150",
      waitingRoomDates: "July 18-23",
      launchDate: "July 24",
      launchYear: "2026",
    },
  },
  {
    id: "denver",
    city: "Denver",
    state: "Colorado",
    progress: 48,
    month: "Jul",
    day: "24",
    image: "/bubba/city-denver.png",
    stats: {
      waitlistCount: "3,780",
      waitingRoomDates: "July 18-23",
      launchDate: "July 24",
      launchYear: "2026",
    },
  },
  {
    id: "columbus",
    city: "Columbus",
    state: "Ohio",
    progress: 44,
    month: "Jul",
    day: "24",
    image: "/bubba/city-columbus.png",
    stats: {
      waitlistCount: "3,215",
      waitingRoomDates: "July 18-23",
      launchDate: "July 24",
      launchYear: "2026",
    },
  },
];

/** FAQ accordion. */
export const BUBBA_FAQS = [
  {
    q: "What's different about Bubba?",
    a: "Bubba limits conversations to 24 hours and only displays recently active profiles. It's designed to get you meeting people as soon as possible — less texting, more dating.",
  },
  {
    q: "How much does it cost to join?",
    a: "Bubba is free to join, so you can test the waters. Premium memberships are $24 a month and you can cancel anytime.",
  },
  {
    q: "Is this better than other dating apps?",
    a: "The experience on Bubba is different. We felt other dating apps simply take too long. Bubba is for the days when you just want to meet someone new and do something fun.",
  },
] as const;

/** Footer. */
export const BUBBA_FOOTER_EXPLORE = [
  /* Waiting Room is hidden from the member side; the page and its copy are
     kept, so restoring it is putting this entry back. */
  { label: "Ambassadors", href: "/ambassadors" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Join Waitlist", href: "/waitlist/start" },
  { label: "Press Room", href: "/press-room" },
] as const;

export const BUBBA_FOOTER_LEGAL = [
  { label: "Terms of Use", href: "/legal/terms" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Community Guidelines", href: "/legal/community-guidelines" },
  { label: "Official Rules", href: "/legal/official-rules" },
  {
    label: "Consumer Health Data Privacy Policy",
    href: "/legal/consumer-health-data",
  },
  {
    label: "Colorado Safety Policy Information",
    href: "/legal/colorado-safety",
  },
  { label: "Accessibility Statement", href: "/legal/accessibility" },
] as const;

export const BUBBA_FOOTER_ABOUT =
  "Bubba was created to make dating feel more immediate. 24-hour conversations, recently active people, and more reasons to meet in real life.";

/** Site-wide announcement strip above the nav. */
export const BUBBA_ANNOUNCEMENT =
  "Launching this fall in select markets.";

export const BUBBA_COOKIE_NOTICE = {
  body: "We use cookies to improve your experience, remember your settings, and help us build a better Bubba.",
  accept: "Continue",
  preferences: "Preferences",
} as const;

/** Mobile drawer — a longer list than the desktop nav rail. */
export const BUBBA_DRAWER_LINKS = [
  /* Matches the desktop rail — no Waiting Room on the member side. */
  { label: "Ambassadors", href: "/ambassadors" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

export const BUBBA_DRAWER_LEGAL = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Use", href: "/legal/terms" },
  { label: "Cookies", href: "/legal/cookies" },
] as const;

export const BUBBA_SOCIALS = [
  { key: "instagram", label: "Instagram", href: "https://instagram.com" },
  { key: "tiktok", label: "TikTok", href: "https://tiktok.com" },
] as const;

/**
 * The Waiting Room announcement card. Dates are deliberately unset — the
 * design calls for "TBD" until ambassador onboarding closes.
 */
export const BUBBA_WAITING_ROOM = {
  month: "September",
  day: "TBD",
  note: "We\u2019ll announce dates after ambassador onboarding is complete",
  title: "The Waiting Room",
  lede: "One week of daily prompts at selected schools across the country.",
  items: [
    {
      key: "prompt",
      title: "One daily prompt",
      body: "See, like, & contribute responses to a sample of our icebreakers",
    },
    {
      key: "compete",
      title: "Compete across campus",
      body: "Earn points for your responses, and have a few laughs",
    },
    {
      key: "prizes",
      title: "Redeem prizes",
      body: "Use your points for exclusive Bubba merch & app perks",
    },
  ],
  footnote:
    "Cities will launch one at a time shortly after the waiting room ends",
  cta: { label: "Learn more", href: "/waiting-room" },
} as const;

/** School circle palette — nine legible pairings for campus prize cards. */
export const BUBBA_CAMPUS_SCHOOL_COLORS = [
  { bg: "#c41230", text: "#ffffff" },
  { bg: "#a51c30", text: "#ffffff" },
  { bg: "#2f50b3", text: "#ffffff" },
  { bg: "#20452f", text: "#ffffff" },
  { bg: "#edc236", text: "#111111" },
  { bg: "#7a4548", text: "#ffffff" },
  { bg: "#d16a58", text: "#ffffff" },
  { bg: "#5c4d7a", text: "#ffffff" },
  { bg: "#2d6a6a", text: "#ffffff" },
] as const;

export type BubbaCampusSchool = {
  initials: string;
  name: string;
  colorIndex: number;
};

export type BubbaCampusMarket = {
  id: string;
  city: string;
  image: string;
  schoolCount: number;
  schools: BubbaCampusSchool[];
  moreCount: number;
};

/** Campus prize carousel — twelve markets, shown three at a time. */
export const BUBBA_CAMPUS_PRIZE_MARKETS: BubbaCampusMarket[] = [
  {
    id: "boston",
    city: "Boston",
    image: "/bubba/city-boston.png",
    schoolCount: 10,
    moreCount: 7,
    schools: [
      { initials: "BU", name: "Boston University", colorIndex: 0 },
      { initials: "HU", name: "Harvard University", colorIndex: 1 },
      { initials: "TU", name: "Tufts University", colorIndex: 2 },
    ],
  },
  {
    id: "new-york",
    city: "New York",
    image: "/bubba/city-new-york.png",
    schoolCount: 10,
    moreCount: 7,
    schools: [
      { initials: "NY", name: "NYU", colorIndex: 2 },
      { initials: "CU", name: "Columbia University", colorIndex: 4 },
      { initials: "FD", name: "Fordham University", colorIndex: 0 },
    ],
  },
  {
    id: "miami",
    city: "Miami",
    image: "/bubba/city-miami.png",
    schoolCount: 10,
    moreCount: 7,
    schools: [
      { initials: "UM", name: "University of Miami", colorIndex: 3 },
      { initials: "FI", name: "Florida International", colorIndex: 6 },
      { initials: "FA", name: "Florida Atlantic", colorIndex: 2 },
    ],
  },
  {
    id: "los-angeles",
    city: "Los Angeles",
    image: "/bubba/city-los-angeles.png",
    schoolCount: 10,
    moreCount: 7,
    schools: [
      { initials: "UC", name: "UCLA", colorIndex: 2 },
      { initials: "SC", name: "USC", colorIndex: 0 },
      { initials: "PP", name: "Pepperdine", colorIndex: 4 },
    ],
  },
  {
    id: "chicago",
    city: "Chicago",
    image: "/bubba/city-chicago.png",
    schoolCount: 10,
    moreCount: 7,
    schools: [
      { initials: "UC", name: "UChicago", colorIndex: 0 },
      { initials: "NU", name: "Northwestern", colorIndex: 4 },
      { initials: "DP", name: "DePaul University", colorIndex: 2 },
    ],
  },
  {
    id: "washington-dc",
    city: "Washington DC",
    image: "/bubba/city-washington-dc.png",
    schoolCount: 10,
    moreCount: 7,
    schools: [
      { initials: "GT", name: "Georgetown University", colorIndex: 3 },
      { initials: "GW", name: "George Washington", colorIndex: 0 },
      { initials: "HU", name: "Howard University", colorIndex: 1 },
    ],
  },
  {
    id: "austin",
    city: "Austin",
    image: "/bubba/city-austin.png",
    schoolCount: 10,
    moreCount: 7,
    schools: [
      { initials: "UT", name: "UT Austin", colorIndex: 4 },
      { initials: "SE", name: "St. Edward's", colorIndex: 3 },
      { initials: "TS", name: "Texas State", colorIndex: 0 },
    ],
  },
  {
    id: "phoenix",
    city: "Phoenix",
    image: "/bubba/city-phoenix.png",
    schoolCount: 10,
    moreCount: 7,
    schools: [
      { initials: "AS", name: "Arizona State", colorIndex: 0 },
      { initials: "UA", name: "U of Arizona", colorIndex: 2 },
      { initials: "GC", name: "Grand Canyon U", colorIndex: 6 },
    ],
  },
  {
    id: "atlanta",
    city: "Atlanta",
    image: "/bubba/city-atlanta.png",
    schoolCount: 10,
    moreCount: 7,
    schools: [
      { initials: "GT", name: "Georgia Tech", colorIndex: 4 },
      { initials: "EM", name: "Emory University", colorIndex: 2 },
      { initials: "GS", name: "Georgia State", colorIndex: 0 },
    ],
  },
  {
    id: "denver",
    city: "Denver",
    image: "/bubba/city-denver.png",
    schoolCount: 10,
    moreCount: 7,
    schools: [
      { initials: "CU", name: "CU Boulder", colorIndex: 0 },
      { initials: "DU", name: "University of Denver", colorIndex: 2 },
      { initials: "CS", name: "Colorado State", colorIndex: 4 },
    ],
  },
  {
    id: "columbus",
    city: "Columbus",
    image: "/bubba/city-columbus.png",
    schoolCount: 10,
    moreCount: 7,
    schools: [
      { initials: "OS", name: "Ohio State", colorIndex: 0 },
      { initials: "OU", name: "Ohio University", colorIndex: 3 },
      { initials: "MU", name: "Miami University", colorIndex: 2 },
    ],
  },
  {
    id: "charlotte",
    city: "Charlotte",
    image: "/bubba/city-charlotte.png",
    schoolCount: 10,
    moreCount: 7,
    schools: [
      { initials: "UN", name: "UNC Charlotte", colorIndex: 2 },
      { initials: "DV", name: "Davidson College", colorIndex: 0 },
      { initials: "QU", name: "Queens University", colorIndex: 3 },
    ],
  },
];

/** Waiting Room page — section copy (placeholders until each section is built). */

export type BubbaSneakPeekFeaturedPrize = {
  id: string;
  label: string;
  image: string;
  imageAlt: string;
  points: number;
  featured: true;
  badge: string;
  redeemLabel: string;
};

export type BubbaSneakPeekPrize = {
  id: string;
  label: string;
  image: string;
  imageAlt: string;
  points: number;
  name: string;
  description: string;
};

export type BubbaSneakPeekPrizeItem =
  | BubbaSneakPeekFeaturedPrize
  | BubbaSneakPeekPrize;

export const BUBBA_SNEAK_PEEK_PRIZES: BubbaSneakPeekPrizeItem[] = [
  {
    id: "vespa",
    label: "Vespa",
    image: "/images/4x/vespa.png",
    imageAlt: "Cream Vespa scooter with Bubba branding",
    points: 30000,
    featured: true,
    badge: "Grand Prize",
    redeemLabel: "Redeem for 30,000 pts",
  },
  {
    id: "picnic-set",
    label: "picnic set",
    image: "/images/4x/bubba-picnic.png",
    imageAlt: "Bubba picnic set with bag, mats, and thermos",
    points: 30000,
    name: "Picnic set",
    description: "Everything you need",
  },
  {
    id: "crewneck",
    label: "crewneck",
    image: "/images/4x/bubba-shirt.png",
    imageAlt: "Cream Bubba crewneck sweatshirt",
    points: 8000,
    name: "Bubba crewneck",
    description: "Cloud soft",
  },
  {
    id: "hat",
    label: "hat",
    image: "/images/4x/bubba-cap.png",
    imageAlt: "Forest green Bubba baseball cap",
    points: 3500,
    name: "Bubba hat",
    description: "Classic everyday",
  },
  {
    id: "beach-chair",
    label: "beach chair",
    image: "/images/4x/bubba-chair.png",
    imageAlt: "Striped wooden Bubba beach chair",
    points: 6000,
    name: "Beach chair",
    description: "Take it easy",
  },
];

export const BUBBA_WAITING_ROOM_PAGE = {
  hero: {
    tag: "By Bubba",
    title: {
      the: "The",
      waiting: "Waiting",
      room: "Room",
    },
    image: "/images/4x/girl-laughing.png",
    imageAlt: "Student laughing while looking at their phone",
    experience: {
      prefix: "The experience starts",
      highlight: "before",
      suffix: "the app does.",
    },
    dates: "August 18 – 24",
    datesSub: "Seven days. 100 schools. Many winners.",
    features: [
      {
        key: "prompts",
        label: "Daily prompts & challenges",
      },
      {
        key: "leaderboard",
        label: "Climb the leaderboard",
      },
      {
        key: "prizes",
        label: "Earn points & win prizes",
      },
    ],
    stats: [
      {
        key: "campuses",
        value: "100+",
        label: "Campuses",
      },
      {
        key: "ambassadors",
        value: "500+",
        label: "Ambassadors",
      },
      {
        key: "days",
        value: "7",
        label: "Days",
      },
    ],
    script: {
      line1: "Let's have a",
      line2: "good laugh",
    },
  },
  overview: {
    eyebrow: "The waiting room",
    title: {
      line1: "One daily prompt.",
      line2: "Every campus.",
    },
    body: [
      "Over 100 participating schools across the country. Each school receives the same prompt.",
      "Submit your response daily, like, and earn points. See responses from your school and around the country.",
    ],
    image: "/images/4x/overview-cards.png",
    imageAlt: "Stacked Waiting Room prompt cards",
  },
  dates: {
    eyebrow: "Only 7 days",
    title: "August 18 - 24",
    description:
      "Get a sneak peak at some of our icebreakers and contribute your best response. Top responses earn the most points, redeemable for prizes.",
    days: [
      { number: 1, weekday: "Mon", date: "8/18", type: "prompt" },
      { number: 2, weekday: "Tue", date: "8/19", type: "game" },
      { number: 3, weekday: "Wed", date: "8/20", type: "snap" },
      { number: 4, weekday: "Thu", date: "8/21", type: "prompt" },
      { number: 5, weekday: "Fri", date: "8/22", type: "game" },
      { number: 6, weekday: "Sat", date: "8/23", type: "snap" },
      { number: 7, weekday: "Sun", date: "8/24", type: "mystery" },
    ],
  },
  campusPrize: {
    eyebrow: "The campus prize",
    title: {
      line1: "Win free Premium",
      line2: "for your school.",
    },
    description:
      "In every market, the school with the most points wins one month of Bubba Premium for everyone on campus.",
    cardImage: "/images/4x/bubba-premium-card.png",
    cardImageAlt: "Bubba Premium unlocked for your whole campus",
    statsLabel: "10 active markets",
    statsValue: "1 month of Premium",
    pillLabel: "Schools announced",
    viewAllLabel: "View all schools",
    viewAllHref: "/calendar",
    markets: BUBBA_CAMPUS_PRIZE_MARKETS,
  },
  howItWorks: {
    eyebrow: "How it works",
    steps: [
      {
        key: "prompts",
        title: "Daily prompts",
        body: [
          "One new icebreaker each day, across all campuses.",
        ],
      },
      {
        key: "invite",
        title: "Invite friends",
        body: [
          "Earn in-app perks & free premium membership for inviting friends.",
        ],
      },
      {
        key: "points",
        title: "Earn points",
        body: [
          "Best performing responses earn the most points.",
        ],
      },
      {
        key: "prizes",
        title: "Redeem prizes",
        body: [
          "We\u2019ve designed special launch merch! Limited time only.",
        ],
      },
      {
        key: "launch",
        title: "City launch!!!",
        body: [
          "Move out of the waiting room together. We\u2019ll launch one city at a time.",
        ],
      },
    ],
  },
  sneakPeek: {
    eyebrow: "Sneak peak the prizes",
    title: "Redeem your points",
    prizes: BUBBA_SNEAK_PEEK_PRIZES,
  },
  cta: {
    title: "Seven-day competition, then we launch",
    subtitle: "Let's have a good laugh.",
    script: {
      line1: "See you in",
      line2: "the waiting room",
    },
    button: {
      label: "Join the waitlist",
      href: "/waitlist/start",
    },
  },
} as const;

/** Ambassadors Page */
export const BUBBA_AMBASSADORS_HERO = {
  eyebrow: "Founding 500",
  title: "Lead the campus launch",
  description: "Invite friends into your campus Waiting Room and unlock prizes before launch.",
  status: "Interested? Message @joinbubba",
  loginPrompt: "Already have an invite?",
  loginAction: "Log in →",
  loginHref: "/login",
};

export const BUBBA_AMBASSADORS_STATS = [
  {
    topLabel: "Top Prize",
    isTopLabelGreen: true,
    valueMain: "$24,000",
    bottomLabel: "One national winner",
  },
  {
    valueMain: "100",
    valueSub: "Schools",
    bottomLabel: "participating",
  },
  {
    valueMain: "August 12",
    bottomLabel: "competition starts",
  },
  {
    valueMain: "~500",
    valueSub: "Ambassadors",
    bottomLabel: "total",
  },
  {
    valueMain: "7",
    valueSub: "Days",
    bottomLabel: "invite duration",
  }
];

export const BUBBA_AMBASSADORS_PRIZES = {
  leftContent: {
    heading: "EARN UP TO",
    amount: "$24,000",
    subAmount: "in cash, plus merch & perks",
    // Split: the reference sets the amount larger and in brand green, with
    // the rest smaller and grey beside it.
    totalPoolAmount: "$84,000",
    totalPoolLabel: "in total cash prizes",
    premiumPromo: {
      badge: "Every participant gets",
      offer: "1 year of Bubba Premium",
      subtext: "on us",
    },
    actionText: "Official Rules",
    actionHref: "/legal/official-rules",
  },
  tiers: [
    {
      level: "INDIVIDUAL",
      icon: "user",
      items: [
        {
          label: "50",
          subLabel: "invites",
          reward: "Merch Pack",
          caption: "Tote, hat, bottle",
          image: "/waitlist/prizes/merch-pack.png",
        },
        {
          label: "100",
          subLabel: "invites",
          reward: "Game Set",
          caption: "Backgammon set",
          image: "/waitlist/prizes/game-set.png",
        },
        {
          label: "200",
          subLabel: "invites",
          reward: "Beach Bundle",
          caption: "Towel, bottle",
          image: "/waitlist/prizes/beach-bundle.png",
        },
      ],
    },
    {
      level: "MARKET",
      icon: "building",
      // The export puts the winner count once under the list, not on each row.
      footnote: "10 winners at each place",
      items: [
        { label: "1st", reward: "$2,400" },
        { label: "2nd", reward: "$1,200" },
        { label: "3rd", reward: "$600" },
      ],
    },
    {
      level: "NATIONAL",
      icon: "globe",
      footnote: "1 winner at each place",
      items: [
        { label: "1st", reward: "$24,000" },
        { label: "2nd", reward: "$12,000" },
        { label: "3rd", reward: "$6,000" },
      ],
    },
  ],
  bottomStats: {
    summary: "Three levels. Multiple ways to win.",
    stats: [
      { value: "10", label: "markets", icon: "map-pin" },
      { value: "100", label: "schools", icon: "graduation-cap" },
      { value: "~500", label: "ambassadors", icon: "users" },
    ],
  },
};

export const BUBBA_AMBASSADORS_TIMELINE = {
  eyebrow: "YOUR PARTICIPATION",
  daysLarge: "7",
  daysScript: "days",
  title: "One week to invite your friends. That's it.",
  subtitle: "Then the Waiting Room begins.",
  steps: [
    {
      title: "INVITE PERIOD",
      description: "Invite your friends\nfor seven days.",
      icon: "send-participation.png",
      colorClass: "bb-amb-timeline-circle--green",
    },
    {
      title: "WAITING ROOM",
      description: "Your campus experiences the\ninteractive waiting room.",
      icon: "people-participation.png",
      colorClass: "bb-amb-timeline-circle--blue",
    },
    {
      title: "LAUNCH",
      description: "Bubba goes live in\nyour market.",
      icon: "sun-participation.png",
      colorClass: "bb-amb-timeline-circle--yellow",
    },
    {
      title: "WINNERS ANNOUNCED",
      description: "Rankings are finalized and winners\nare announced after launch.",
      icon: "trophy-participation.png",
      colorClass: "bb-amb-timeline-circle--pink",
    },
  ],
};

export const BUBBA_AMBASSADORS_FINAL = {
  accordions: [
    {
      title: "How points work",
      subtitle: "Learn how points are earned and what counts towards your score.",
      icon: "people",
      color: "default",
    },
    {
      title: "Why we're doing this",
      subtitle: "Learn about our mission with Bubba and why we're so excited.",
      icon: "people",
      color: "blue",
    },
  ],
  feature: {
    eyebrow: "WHAT YOU'RE BUILDING",
    // The export breaks after "gets"; rendered with white-space: pre-line.
    heading: "Your campus gets\nits own",
    headingHighlight: "Waiting Room.",
    subtitle: "Seven days of prompts, voting, and friendly competition – across your campus, city, and country",
    pillars: [
      { icon: "people", label: "ONE COMMUNITY", desc: "Everyone on\ncampus in one room." },
      { icon: "prompts", label: "DAILY PROMPTS", desc: "Share, vote, and see\nthe best every day." },
      { icon: "leaderboard", label: "LIVE LEADERBOARD", desc: "Climb the ranks and\nearn merch and perks" },
    ],
  },
  mockCard: {
    campus: "YOUR CAMPUS",
    roomLabel: "WAITING ROOM",
    day: "DAY 1 OF 7",
    promptLabel: "TODAY'S PROMPT",
    prompt: "If I had one last first date ever it would be..",
    topResponsesLabel: "TOP RESPONSES",
    responses: [
      { name: "Emma S.", likes: 73, avatar: "/waitlist/avatars/response-1.png" },
      { name: "Jason A.", likes: 48, avatar: "/waitlist/avatars/response-2.png" },
    ],
    stats: [
      { value: "2,424", label: "people waiting" },
      { value: "24", label: "responses" },
    ],
    cta: "Explore the waiting room",
  },

  /* The panel "How points work" opens to, drawn in ui/1x/Asset am2.png as one
     full-width block below both cards rather than inside the left one. */
  points: {
    sectionTitle: "HOW YOU EARN POINTS",
    rule: {
      eyebrow: "THE SIMPLE RULE",
      heading: "One download =\none point.",
      body:
        "Every download through your ambassador\nnetwork counts toward your score—\nwhether someone joins directly from your\nlink or through someone you invited.",
    },
    window: {
      eyebrow: "THE WINDOW",
      heading: "Invite for 7 days.\nEarn points for 1 month.",
      // The export reads "after Bubba launchs"; kept correct here.
      body:
        "Only people who enter your network during the 7-day\ncompetition can generate points. Their downloads\ncount for the first month after Bubba launches",
      startLabel: "DAYS 1-7",
      startSub: "Invite your people",
      endLabel: "1 MONTH",
      endSub: "Points start counting",
      launchLabel: "BUBBA LAUNCH",
    },
    important: {
      eyebrow: "IMPORTANT",
      headline: "Points are based on downloads, not waitlist signups",
      body: "Track your potential points in the ambassador dashboard\nas people join the waiting room.",
    },
  },

  /* The closing call-to-action panel from ui/1x/Asset am2.png. */
  invite: {
    eyebrow: "INVITED AMBASSADORS",
    headingLead: "A new dating experience, ",
    headingBold: "built together.",
    title: "Ready to lead your campus?",
    body:
      "Ambassadors are invited by our team to lead their campus. If you've\naccepted your invitation, a link will be emailed to get started. Or, you can\nstart here.",
    ctaLabel: "Ambassador start",
    /* The existing ambassador entry route: it already handles the invited and
       blocked cases and falls through to /auth/login. */
    ctaHref: "/ambassador/onboarding",
    orLabel: "or",
    altPrompt: "Interested but haven't been invited?",
    altLabel: "Reach out on Instagram",
    altHref: "https://instagram.com",
  },
};
