export const LAUNCH_BRAND = "Bubba";

export const LAUNCH_STEP_ROUTES = [
  "/onboarding",
  "/the-role",
  "/verify-email",
  "/account",
  "/your-school",
  "/youre-in",
] as const;

export const LAUNCH_TOTAL_STEPS = LAUNCH_STEP_ROUTES.length;

export const WELCOME_STEP = {
  eyebrow: "You're invited",
  // The closing line is set in bold so "Bubba Ambassador" carries the weight
  // of the invitation, per the reference design.
  titleLines: [
    { text: "You've been" },
    { text: "chosen to be a" },
    { text: "Bubba Ambassador", strong: true },
  ],
  subtitle: "Help launch something meaningful.\nBuild your community. Earn cash and merch.",
  cta: { label: "Accept your invitation", href: "/the-role" },
  loginPrompt: "Already have an account? ",
  loginLabel: "Log in",
  loginHref: "/auth/login",
};

export type SchoolIcon = "early-access" | "rewards" | "community";

export const SCHOOL_STEP = {
  eyebrow: "The role",
  titleLines: ["Bring eligible singles", "into our community"],
  subtitle:
    "As an Ambassador, you'll be the first to experience Bubba and invite your friends into our ecosystem.",
  items: [
    {
      icon: "early-access" as SchoolIcon,
      title: "Early access",
      desc: "Be the first to try Bubba along with your friends and campus",
    },
    {
      icon: "rewards" as SchoolIcon,
      title: "Earn cash and merch",
      desc: "Compete with other ambassadors at your campus, market, and across the country",
    },
    {
      icon: "community" as SchoolIcon,
      title: "Build community",
      desc: "Help shape the way people meet as an integral member of your community",
    },
  ],
  cta: { label: "Continue", href: "/verify-email" },
  footnote: { label: "Learn more about the 7 day program", href: "#" },
};

export const WAYS_STEP = {
  eyebrow: "Verify your email",
  titleLines: ["Let's confirm", "it's you."],
  bodyPrefix: "We sent a verification link to",
  continuePrompt: "Click the link in your email to continue",
  resend: { label: "Resend email" },
  // NOTE: this link has no destination wired yet — the invite fixes the
  // address, so changing it needs a flow that does not exist. Placeholder
  // href, same as the footnote on screen 2.
  useDifferentEmail: { label: "Use a different email", href: "#" },
  cta: { label: "Continue", href: "/account" },
};

export const ACCOUNT_STEP = {
  eyebrow: "Create account",
  titleLines: ["Let's get you", "set up."],
  fields: [
    { name: "fullName", label: "Full name", type: "text" },
    { name: "email", label: "Email", type: "email" },
  ],
  alreadyRegisteredNote: "Email registered — you already have a Bea account. Continuing will sign you into it.",
  availableNote: "Email available.",
  lockedEmailNote: "This is the email your invite was sent to, so it can't be changed here.",
  legal: {
    prefix: "By continuing, you agree to Bubba's ",
    termsLabel: "Terms of Service",
    termsHref: "#",
    conjunction: " and ",
    privacyLabel: "Privacy Policy",
    privacyHref: "#",
  },
  cta: { label: "Continue", href: "/your-school" },
  loginPrompt: "Already have an account? ",
  loginLabel: "Log in",
  loginHref: "/auth/login",
};

const CURRENT_YEAR = new Date().getFullYear();
export const GRADUATION_YEARS = Array.from({ length: 8 }, (_, i) => String(CURRENT_YEAR + i));

export const AMBASSADOR_ROLE_OPTIONS = ["Ambassador"];

export const INVITE_STEP = {
  eyebrow: "Create account",
  titleLines: ["Confirm your", "community"],
  fields: [
    { name: "school", label: "School" },
    { name: "market", label: "Market" },
    { name: "instagram", label: "Instagram (optional)" },
  ],
  agreement: "I agree to represent Bubba with integrity and follow the program guidelines.",
  cta: { label: "Join Ambassador Program", href: "/youre-in" },
};

export const SHARE_MESSAGE = "I'm a Bubba ambassador — join me:";

export const YOUREIN_STEP = {
  eyebrow: "Welcome, ambassador",
  title: "You're in.",
  subtitleLines: ["Thanks for being part of the", "Bubba Community"],
  linkLabel: "Your invite link",
  shareHeading: "Share your link",
  nextUp: {
    label: "Next up",
    text: "Explore the ambassador hub and track everyone’s performance.",
    cta: { label: "Go to dashboard", href: "/dashboard/ambassador" },
  },
  // Closes out the flow. Points at the same place as the card link above it —
  // there is nowhere else for a finished onboarding to go.
  done: { label: "Done", href: "/dashboard/ambassador" },
};
