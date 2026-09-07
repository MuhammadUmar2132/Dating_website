/**
 * Waitlist join flow — mobile.
 *
 * Type, colour and size values are taken from Join_waitlist.ai (562pt
 * artboards). Point sizes scale to a 390px viewport by 390/562 = 0.694,
 * which is why a 36pt heading lands at 25px and 24pt body at 16.5px.
 *
 * The dot indicator carries one dot per collecting step, so JOIN_STEPS is
 * the single source for both the route order and the indicator length.
 */

/**
 * Two collecting steps, per the current artboards: name and email together,
 * then the city. Campus and ambassador credit are drawn in the file but are
 * out of the flow for now — their slugs stay in the union so the routes and
 * components keep compiling, and HIDDEN_JOIN_STEPS is what takes them out.
 */
export type JoinStepSlug =
  | "city"
  | "campus"
  | "ambassador"
  | "basics"
  | "email";

/** Steps drawn but not currently in the flow. Re-add by emptying this. */
export const HIDDEN_JOIN_STEPS: JoinStepSlug[] = ["campus", "ambassador", "email"];

export type JoinStep = {
  slug: JoinStepSlug;
  eyebrow: string;
  heading: string[];
  sub: string[];
};

const ALL_JOIN_STEPS: JoinStep[] = [
  {
    slug: "basics",
    eyebrow: "",
    heading: ["Join the waitlist"],
    sub: ["Be first when Bubba comes to your city."],
  },
  {
    slug: "city",
    eyebrow: "",
    heading: ["Where do you want", "to date?"],
    sub: [
      "We're launching in 10 cities first.",
      "Select your city for early access.",
    ],
  },
  {
    slug: "campus",
    eyebrow: "Waiting room",
    heading: ["Are you at a", "participating school?"],
    sub: [
      "The waitlist is open to everyone. At select schools, students get access to the Waiting Room — a pre-launch competition with points and prizes.",
    ],
  },
  {
    slug: "ambassador",
    eyebrow: "Ambassador credit",
    heading: ["Did an ambassador", "bring you here"],
    sub: [
      "If you heard about us through an ambassador",
      "please give them credit!",
    ],
  },
  {
    slug: "email",
    eyebrow: "Confirm email",
    heading: ["Where should we", "send your invite?"],
    sub: ["We'll let you know the", "moment Bubba opens up."],
  },
];

export const JOIN_STEPS: JoinStep[] = ALL_JOIN_STEPS.filter(
  (step) => !HIDDEN_JOIN_STEPS.includes(step.slug)
);

export const JOIN_STEP_SLUGS = JOIN_STEPS.map((s) => s.slug);

export function getJoinStep(slug: string): JoinStep | undefined {
  return JOIN_STEPS.find((s) => s.slug === slug);
}

export function joinStepIndex(slug: string): number {
  return JOIN_STEPS.findIndex((s) => s.slug === slug);
}

export function joinStepHref(index: number): string {
  const step = JOIN_STEPS[index];
  return step ? `/waitlist/${step.slug}` : "/waitlist/done";
}

export const UNLISTED_SCHOOL_VALUE = "__unlisted__";

export type JoinConfirmationKind = "national" | "city" | "waiting-room";

export type JoinRoutingForm = {
  marketId: string | null;
  skippedMarket: boolean;
  schoolId: string | null;
  notInSchool: boolean;
};

/** National waitlist if they skipped launch cities; city waitlist if they
 *  picked a city but not a participating school; waiting room only when both
 *  a launch city and a school are set. */
export function joinConfirmationKind(
  form: JoinRoutingForm,
): JoinConfirmationKind {
  if (form.skippedMarket || !form.marketId) return "national";
  if (form.notInSchool || !form.schoolId) return "city";
  return "waiting-room";
}

export function schoolRequired(form: JoinRoutingForm): boolean {
  return Boolean(form.marketId) && !form.skippedMarket && !form.notInSchool;
}

/** City continue without a card skips the school/waiting-room step. */
export function nextJoinHref(from: JoinStepSlug, form: JoinRoutingForm): string {
  if (from === "city" && (form.skippedMarket || !form.marketId)) {
    return joinStepHref(joinStepIndex("campus") + 1);
  }
  return joinStepHref(joinStepIndex(from) + 1);
}

/**
 * Featured rail order from the join artboard: NY, Boston, Miami, Chicago
 * in the first four slots, then the rest. API `/markets/all` is A–Z.
 */
export const FEATURED_CITY_ORDER = [
  "New York",
  "Boston",
  "Miami",
  "Chicago",
  "Los Angeles",
  "Austin",
  "Phoenix",
  "Atlanta",
  "Charlotte",
  "Denver",
  "Columbus",
  "Washington DC",
] as const;

/** Artboard placeholders for the ambassador-credit step when the API is empty. */
export const DUMMY_AMBASSADORS = [
  {
    id: "dummy-maya",
    fullName: "Maya Chen",
    referralCode: "maya01",
    schoolName: "Boston University",
    marketName: "Boston",
  },
  {
    id: "dummy-jordan",
    fullName: "Jordan Lee",
    referralCode: "jord02",
    schoolName: "New York University",
    marketName: "New York",
  },
  {
    id: "dummy-sam",
    fullName: "Sam Okonkwo",
    referralCode: "samok3",
    schoolName: "University of Texas at Austin",
    marketName: "Austin",
  },
  {
    id: "dummy-riley",
    fullName: "Riley Park",
    referralCode: "riley4",
    schoolName: "UCLA",
    marketName: "Los Angeles",
  },
] as const;

export function featuredCityRank(marketName: string): number {
  const needle = marketName.toLowerCase().trim();
  const i = FEATURED_CITY_ORDER.findIndex(
    (name) => name.toLowerCase() === needle,
  );
  return i === -1 ? FEATURED_CITY_ORDER.length : i;
}

/**
 * City card artwork, keyed by a slug derived from the market name so it
 * survives the API returning "New York" vs "New York, NY". Markets without
 * art fall through to a plain tinted card rather than a broken image.
 */
const CITY_ART_SLUGS = new Set([
  "new-york",
  "boston",
  "miami",
  "los-angeles",
  "chicago",
  "austin",
  "phoenix",
  "atlanta",
  "charlotte",
  "denver",
  "columbus",
  "washington-dc",
]);

export function cityArt(marketName: string): string | null {
  const slug = marketName
    .toLowerCase()
    .replace(/[.,]/g, "")
    .replace(/\bdc\b/, "dc")
    .trim()
    .replace(/\s+/g, "-");

  const direct = slug.split("-").slice(0, 3).join("-");
  for (const candidate of [slug, direct, slug.replace(/-[a-z]{2}$/, "")]) {
    if (CITY_ART_SLUGS.has(candidate)) {
      return `/bubba/city-${candidate}.png`;
    }
  }
  return null;
}
