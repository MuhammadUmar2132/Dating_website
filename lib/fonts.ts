import { Caveat, DM_Serif_Display, Fraunces, Inter, Lato } from "next/font/google";

export const fontCanelaFamily =
  '"Canela Text", var(--font-fraunces), Georgia, "Times New Roman", serif';

export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  display: "swap",
  variable: "--font-fraunces",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal"],
  display: "swap",
  variable: "--font-lato",
  fallback: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "Segoe UI", "sans-serif"],
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
  variable: "--font-inter",
  fallback: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "Segoe UI", "sans-serif"],
});

/* ── Fonts taken straight from the Illustrator sources in /ui ──────────────
   Both of these appear in Bubba Website.ai and are on Google Fonts, so unlike
   Canela / Suisse Intl / SF Pro they can be self-hosted outright. next/font
   inlines them at build time: no network request to fonts.googleapis.com, no
   render-blocking @import, and an automatic size-adjusted fallback so there
   is no layout shift while they load. */

/* Caveat — the handwritten accents. The .ai uses Regular / Medium / SemiBold.
   Previously pulled from the Google CDN via an @import at the top of
   globals.css, which blocked first paint on a third-party round trip. */
export const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  display: "swap",
  variable: "--font-caveat",
  fallback: ["Segoe Script", "Bradley Hand", "cursive"],
});

/* DM Serif Display — used in Bubba Website.ai. Only ships a 400 weight. */
export const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  display: "swap",
  variable: "--font-dm-serif",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

/* ══════════════════════════════════════════════════════════════════════════
   Every typeface used in the Illustrator sources under /ui
   ──────────────────────────────────────────────────────────────────────────
   Extracted with `pdffonts` from the four .ai files. Each entry is also a
   Tailwind utility (declared in the @theme block of app/globals.css), so in
   markup prefer the class:

       <p className="font-suisse">…</p>

   Use this map only where a class will not do — inline styles, canvas/SVG
   text measurement, or passing a stack to a third-party component:

       <div style={{ fontFamily: FONT_STACKS.suisse }}>…</div>

   `source` records where each family comes from, because it determines
   whether it actually renders for a visitor or silently falls back:
     • "next/font"  — self-hosted at build time, always renders
     • "self-hosted" — .woff2/.woff in public/fonts, always renders
     • "local-only"  — no redistributable file; renders only for viewers with
                       the font installed, otherwise uses the fallback stack
   ══════════════════════════════════════════════════════════════════════════ */

export type FontSource = "next/font" | "self-hosted" | "local-only";

export const FONT_STACKS = {
  lato: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  canelaText: "var(--font-canela-text)",
  canelaDisplay: "var(--font-canela-display)",
  sfPro: "var(--font-sfpro)",
  suisse: "var(--font-suisse)",
  minion: "var(--font-minionvariable)",
  myriad: "var(--font-myriad)",
  bigCaslon: "var(--font-bigcaslon)",
  amsterdam: "var(--font-amsterdam)",
  caveat: "var(--font-script)",
  dmSerif: "var(--font-dmserif)",
  helveticaCondensed: "var(--font-helvetica-condensed)",
} as const;

/** Which .ai files each family appears in, and how it is delivered. */
export const FONT_INVENTORY: Record<
  keyof typeof FONT_STACKS,
  { family: string; weights: string[]; source: FontSource; utility: string }
> = {
  lato:               { family: "Lato",                          weights: ["400", "500", "600", "700"],        source: "next/font",   utility: "font-lato" },
  canelaText:         { family: "Canela Text",                   weights: ["400", "500", "700"],               source: "self-hosted", utility: "font-canela-text" },
  canelaDisplay:      { family: "Canela",                        weights: ["200", "400", "500", "700"],        source: "self-hosted", utility: "font-canela-display" },
  sfPro:              { family: "SF Pro Display",                weights: ["400", "500", "700"],               source: "self-hosted", utility: "font-sfpro" },
  suisse:             { family: "Suisse Intl",                   weights: ["400", "500", "600", "700"],        source: "self-hosted", utility: "font-suisse" },
  minion:             { family: "Minion Variable Concept",       weights: ["400"],                             source: "local-only",  utility: "font-minionvariable" },
  myriad:             { family: "Myriad Pro",                    weights: ["400"],                             source: "local-only",  utility: "font-myriad" },
  bigCaslon:          { family: "Big Caslon FB",                 weights: ["400"],                             source: "self-hosted", utility: "font-bigcaslon" },
  amsterdam:          { family: "Amsterdam Handwriting",         weights: ["400"],                             source: "self-hosted", utility: "font-amsterdam" },
  caveat:             { family: "Caveat",                        weights: ["400", "500", "600"],               source: "next/font",   utility: "font-script" },
  dmSerif:            { family: "DM Serif Display",              weights: ["400"],                             source: "next/font",   utility: "font-dmserif" },
  helveticaCondensed: { family: "Helvetica Neue Condensed Black", weights: ["900"],                            source: "local-only",  utility: "font-helvetica-condensed" },
};
