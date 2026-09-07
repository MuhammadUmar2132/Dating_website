# Bubba Website — UI Guidelines & Source of Truth

> **⚠️ MANDATORY READ:** Before creating any new page, section, or component, you must read this document in full. All new UI must strictly conform to every rule below. No exceptions.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Folder Structure](#2-folder-structure)
3. [Page Creation Pattern](#3-page-creation-pattern)
4. [Component Hierarchy & Decomposition](#4-component-hierarchy--decomposition)
5. [Layout Wrappers (Shell System)](#5-layout-wrappers-shell-system)
6. [Styling Methodology](#6-styling-methodology)
7. [Design Tokens (CSS Custom Properties)](#7-design-tokens-css-custom-properties)
8. [Typography System](#8-typography-system)
9. [Content & Copy Pattern](#9-content--copy-pattern)
10. [Asset Conventions](#10-asset-conventions)
11. [Responsive Design Rules](#11-responsive-design-rules)
12. [Naming Conventions](#12-naming-conventions)
13. [Do's and Don'ts](#13-dos-and-donts)

---

## 1. Project Overview

This is a **Next.js App Router** project (`/app` directory). The public marketing site is the "Bubba" design system, fully namespaced under `bb-` CSS classes. It is a content-driven marketing website, not a dashboard — design must reflect that premium, editorial quality.

**Tech stack:**
- Framework: Next.js (App Router)
- Language: TypeScript (`.tsx` / `.ts`)
- Styling: Vanilla CSS (a single namespaced stylesheet per feature area)
- State: Zustand (`/store`)
- Icons: `lucide-react`
- Fonts: Google Fonts via `next/font/google` (Lato, Fraunces, Inter, Playfair Display)

---

## 2. Folder Structure

This is the **exact structure** you must follow. Never invent new top-level directories.

```
bea-website-main/
├── app/                          ← Next.js App Router root
│   ├── layout.tsx                ← Global root layout (fonts, providers)
│   ├── page.tsx                  ← Home page (renders BubbaLanding)
│   ├── globals.css               ← Minimal global resets only
│   ├── components/               ← ALL components live here
│   │   ├── bubba/                ← Bubba marketing site components
│   │   │   ├── BubbaShell.tsx    ← Master layout wrapper (ALWAYS use this)
│   │   │   ├── BubbaNav.tsx      ← Navigation + mobile drawer
│   │   │   ├── BubbaFooter.tsx   ← Footer + optional capture card
│   │   │   ├── BubbaAnnouncement.tsx
│   │   │   ├── BubbaCookieBar.tsx
│   │   │   ├── BubbaCapture.tsx  ← Email capture form (reusable)
│   │   │   ├── BubbaLanding.tsx  ← Home page content
│   │   │   ├── BubbaCalendar.tsx ← Calendar page content
│   │   │   ├── BubbaFaq.tsx      ← FAQ page content
│   │   │   ├── BubbaDial.tsx     ← Countdown dial widget
│   │   │   └── WaitingRoomSection.tsx
│   │   ├── join/                 ← Join/onboarding flow components
│   │   ├── login/                ← Auth flow components
│   │   ├── dashboard/            ← Dashboard components
│   │   └── [feature]/            ← Other feature-specific components
│   ├── [route-segment]/          ← One folder per URL route
│   │   └── page.tsx              ← Thin page file — renders one component
│   └── ...
├── lib/                          ← Pure logic, content, utilities
│   ├── bubba-content.ts          ← ALL Bubba copy/data (single source of truth)
│   ├── bubba-legal.ts            ← Legal copy
│   ├── fonts.ts                  ← Font definitions
│   └── ...
├── styles/                       ← ALL stylesheets live here
│   ├── bubba.css                 ← Bubba marketing site styles (primary)
│   ├── join.css                  ← Join/waitlist flow styles
│   ├── login.css                 ← Auth flow styles
│   └── ...
├── public/                       ← Static assets
│   ├── bubba/                    ← Bubba marketing images
│   │   ├── wordmark-green.png
│   │   ├── wordmark-black.png
│   │   ├── mark-bb.png
│   │   ├── hero-scene.png
│   │   ├── city-*.png            ← City images follow this pattern
│   │   └── ...
│   └── fonts/                    ← Self-hosted fonts (if any)
├── store/                        ← Zustand state management
├── config/                       ← App configuration
└── features/                     ← Feature flags / complex feature logic
```

### Rules for folder structure:
- **Route pages are thin.** `app/[route]/page.tsx` must only: import `Metadata`, import the page component, import `@/styles/bubba.css`, and return `<PageComponent />`.
- **One component folder per feature area.** New Bubba pages get a component in `app/components/bubba/`. Other feature areas get their own subfolder.
- **No styles in component files.** No `style={{}}` inline overrides unless there is no CSS alternative (e.g., dynamic grid rows from data). No CSS Modules. No Tailwind (unless pre-existing feature uses it).
- **All copy lives in `lib/`.** Never hard-code strings directly in TSX files when they can be constants.

---

## 3. Page Creation Pattern

Every new Bubba marketing page follows this **exact three-file pattern**:

### Step 1 — Route file: `app/[route]/page.tsx`
```tsx
import type { Metadata } from "next";

import { BubbaMyNewPage } from "@/app/components/bubba/BubbaMyNewPage";

import "@/styles/bubba.css";

export const metadata: Metadata = {
  title: "Page Title — Bubba",
  description: "Concise, keyword-rich description under 160 chars.",
};

export default function MyNewPage() {
  return <BubbaMyNewPage />;
}
```

### Step 2 — Page component: `app/components/bubba/BubbaMyNewPage.tsx`
```tsx
import { BUBBA_SOME_CONTENT } from "@/lib/bubba-content";

import { BubbaShell } from "./BubbaShell";
// import other sub-components as needed

export function BubbaMyNewPage() {
  return (
    <BubbaShell active="home"> {/* set correct active key */}
      <section className="bb-[section-name]">
        <div className="bb-shell">
          {/* section content */}
        </div>
      </section>
    </BubbaShell>
  );
}
```

### Step 3 — Add content to `lib/bubba-content.ts`
Add all new strings, links, and data arrays as named exports. Never hard-code copy in TSX.

---

## 4. Component Hierarchy & Decomposition

### The hierarchy (top → bottom):

```
app/[route]/page.tsx              (Next.js route — thin shell)
  └── BubbaShell                  (universal layout chrome)
        ├── BubbaAnnouncement     (announcement strip — always present)
        ├── BubbaNav              (nav + mobile drawer — always present)
        ├── <main class="bb-main">
        │     └── BubbaXxxPage    (page content component)
        │           ├── <section class="bb-yyy"> (semantic HTML sections)
        │           │     └── <div class="bb-shell"> (width constraint)
        │           │           └── ... (content primitives)
        │           └── SubComponent (if section is complex enough)
        └── BubbaFooter           (footer + optional closer capture — always present)
              └── BubbaCapture    (email input — reusable)
```

### Decomposition rules:
1. **BubbaShell wraps everything.** Without exception. Do not replicate nav/footer code.
2. **Sections are semantic HTML `<section>` elements**, not `<div>` elements.
3. **Every section content is wrapped in `<div className="bb-shell">`** (or `bb-shell--wide` / `bb-shell--narrow`) to constrain max-width and add gutters.
4. **Break into a sub-component when** a section has more than ~40 lines of JSX, requires its own `useState`/`useEffect`, or is reused across pages.
5. **"use client"** directive: Only add to components that use React hooks or browser events. Page components and purely presentational components must be Server Components (no directive).
6. **Props are typed inline** using a `type Props = { ... }` declaration at the top of the file.

### The `active` prop on BubbaShell:
The `active` prop controls which nav link is highlighted. Always pass the correct key:
- `"home"` — home page
- `"waiting-room"` — waiting room sections
- `"calendar"` — calendar page
- `"ambassadors"` — ambassadors/login

---

## 5. Layout Wrappers (Shell System)

### `BubbaShell` — **Always use this. Never bypass it.**

```tsx
<BubbaShell active="home" showCapture={true}>
  {/* page content */}
</BubbaShell>
```

Props:
- `active?: BubbaNavKey` — highlighted nav item (default: `"home"`)
- `showCapture?: boolean` — whether the footer closer card appears (default: `true`); set to `false` for legal/contact pages

### Width constraint classes — **Always use these inside sections:**

| Class | Max-width | Usage |
|---|---|---|
| `.bb-shell` | `1180px` | Standard content (default for all sections) |
| `.bb-shell--wide` | `1360px` | Footer, wide editorial layouts |
| `.bb-shell--narrow` | `780px` | Legal, contact, text-heavy pages |

All shell classes include `margin-inline: auto` and `padding-inline: var(--bb-gutter)` automatically. Never add manual horizontal padding to sections — use a shell class instead.

---

## 6. Styling Methodology

### The rules:

1. **One CSS file per feature area.** Bubba marketing styles go in `styles/bubba.css`. New feature areas get their own file. Import the stylesheet in the route's `page.tsx`.
2. **Everything is namespaced `bb-`.** All CSS classes for the Bubba marketing site must be prefixed `bb-`.
3. **No Tailwind utility classes on Bubba marketing pages.**
4. **No CSS Modules.** Use the flat `bb-` namespaced stylesheet.
5. **No inline `style={{}}` except for dynamic values** computed from JS at runtime.
6. **CSS is mobile-first.** Base styles target mobile, then `@media (min-width: N)` scales up.

### Breakpoints in use:

| Breakpoint | Usage |
|---|---|
| `420px` | Small mobile adjustments |
| `768px` | Tablet / desktop nav switch |
| `900px` | Mid-range layout columns |
| `1024px` | Full desktop layout |
| `1200px` | Wide screens / gutter increase |

7. **Use `clamp()` for fluid typography and spacing.**
8. **Do not override design tokens with raw hex values.**

### CSS file structure:
```css
/* ============================================================
   Section Name
   ============================================================ */

/* Comment every rule with its design spec: font, size, weight */
.bb-component {
  /* properties */
}
```

---

## 7. Design Tokens (CSS Custom Properties)

These are defined in `:root` in `styles/bubba.css`. **Always use these — never raw values.**

### Colour tokens:

| Token | Value | Usage |
|---|---|---|
| `--bb-green` | `#20452f` | Primary brand green |
| `--bb-ink` | `#16181a` | Primary text / headings |
| `--bb-body` | `#3c4340` | Body copy |
| `--bb-muted` | `#6b6f6d` | Muted / secondary text |
| `--bb-paper` | `#ffffff` | Page background |
| `--bb-mist` | `#f8f8f6` | Subtle section backgrounds |
| `--bb-line` | `#e6e6e2` | Borders, dividers |
| `--bb-announce` | `#edf5fa` | Announcement bar background |
| `--bb-closer-bg` | `#f2f1ec` | Closing CTA card background |
| `--bb-ai-announce` | `#214c37` | Announcement bar text |
| `--bb-ai-eyebrow-sub` | `#7c7c7c` | Eyebrow text |
| `--bb-ai-lede` | `#7a7a7a` | Body lede grey |
| `--bb-ai-social` | `#111111` | City rail / social names |
| `--bb-ai-placeholder` | `#999999` | Placeholder text |

### Typography tokens:

| Token | Usage |
|---|---|
| `--bb-display` | Hero & section display headings (Canela/Fraunces serif) |
| `--bb-sans` | All body text, footer, UI (Lato) |
| `--bb-ui` | Eyebrows, labels, tracked elements (SF Pro / system UI) |
| `--bb-numeral` | Countdown digits (Big Caslon / Fraunces) |

### Spacing tokens:

| Token | Value |
|---|---|
| `--bb-gutter` | `20px` (mobile) / `40px` (768+) / `64px` (1200+) |
| `--bb-max` | `1180px` |
| `--bb-radius` | `14px` |
| `--bb-radius-lg` | `22px` |

---

## 8. Typography System

### Type scale — always use these classes:

| Class | Font | Size (clamp) | Weight | Usage |
|---|---|---|---|---|
| `.bb-display.bb-display--xl` | Canela | `clamp(34px, 10.5vw, 48px)` | 500 | Hero headline |
| `.bb-display.bb-display--lg` | Canela | `clamp(32px, 12.8vw, 48px)` | 400 | Section headings |
| `.bb-display.bb-display--md` | Canela | `clamp(26px, 3.6vw, 38px)` | 400 | Sub-section headings |
| `.bb-eyebrow` | SF Pro / system UI | `12px`, `letter-spacing: 0.17em`, uppercase | 500 | Section labels |
| `.bb-hero-sub` | SF Pro / system UI | `clamp(12px, 2.5vw, 22.5px)` | 500 | "24 HOURS TO CHAT" |
| `.bb-lede` | Lato | `16px` / `17px` (768+) | 400 | Body lede paragraphs |

### Rules:
- Use `<h1>` once per page only.
- Use `<h2>` for section headings.
- Always compose heading classes: `<h1 className="bb-display bb-display--xl bb-hero-title">`.
- Never set raw font sizes on headings; extend existing type classes in `bubba.css`.

---

## 9. Content & Copy Pattern

**All strings, links, arrays, and data for the Bubba marketing site are centralised in `lib/bubba-content.ts`.**

Key exports to know:
- `BUBBA_BRAND` — asset paths, tagline, email addresses
- `BUBBA_NAV_LINKS` / `BUBBA_DRAWER_LINKS` — navigation links
- `BUBBA_LAUNCH_CITIES` — hero city rail
- `BUBBA_MARKETS` — calendar market data
- `BUBBA_FOOTER_EXPLORE` / `BUBBA_FOOTER_LEGAL` — footer links
- `BUBBA_ANNOUNCEMENT` — announcement bar copy
- `BUBBA_FAQS` — FAQ data
- `BUBBA_WAITING_ROOM` — Waiting Room section data

---

## 10. Asset Conventions

- **All Bubba marketing images live in `public/bubba/`.** Reference as `/bubba/filename.png`.
- Use `<img>` tags with `{/* eslint-disable-next-line @next/next/no-img-element */}` comment.
- City images follow the pattern: `city-[kebab-name].png` (e.g., `city-los-angeles.png`).
- Always provide a meaningful `alt` attribute.
- Use **`lucide-react` icons only.** Set `size` and `strokeWidth` consistently.
- Custom SVGs are inlined directly in JSX.

---

## 11. Responsive Design Rules

1. **Mobile-first.** Base styles target 360px+.
2. **Never use `max-width` media queries** for layout changes.
3. **Use `clamp()` for all fluid values:**
   ```css
   /* ✅ Correct */
   font-size: clamp(14px, 2.5vw, 22px);

   /* ❌ Wrong */
   font-size: 14px;
   @media (min-width: 768px) { font-size: 22px; }
   ```
4. **Single-line text constraints.** Key elements (announcement bar, hero heading, city rail) must stay on one line. Use `white-space: nowrap` with fluid font sizing.
5. **Test at 360×740 (Galaxy S8) as minimum mobile viewport.**
6. **Desktop overrides** go inside `@media (min-width: 1024px)` or `@media (min-width: 900px)` blocks, grouped at the bottom of the stylesheet section.

---

## 12. Naming Conventions

### CSS classes:
- Base: `bb-[component]` → `bb-hero`, `bb-rail`, `bb-footer`
- Modifiers: `bb-[component]--[modifier]` → `bb-display--xl`, `bb-nav--scrolled`
- Elements: `bb-[component]-[element]` → `bb-nav-link`, `bb-rail-city`
- State: `bb-[component]--[state]` → `bb-nav-link--active`, `bb-cal-chev--open`

### TypeScript / React:
- Components: `PascalCase`, `Bubba` prefix for marketing (e.g., `BubbaLanding`)
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `BUBBA_LAUNCH_CITIES`)
- Types: `PascalCase` (e.g., `BubbaNavKey`, `BubbaMarket`)
- Props: Always `type Props = { ... }` local to the file

### Files:
- React components: `PascalCase.tsx`
- Utilities / content: `kebab-case.ts`
- Stylesheets: `kebab-case.css`

---

## 13. Do's and Don'ts

### ✅ DO:
- Read this document before writing any new UI.
- Wrap every page in `<BubbaShell>`.
- Use `<div className="bb-shell">` inside every section.
- Centralise all copy in `lib/bubba-content.ts`.
- Use `clamp()` for all fluid type and spacing values.
- Follow the exact file/folder structure.
- Use `"use client"` only when the component uses hooks or browser APIs.
- Keep page files thin (4–5 lines max).
- Comment every CSS rule with its design spec source.
- Test on 360px-wide viewport for all mobile changes.

### ❌ DON'T:
- Don't duplicate nav, footer, announcement bar, or cookie bar — `BubbaShell` handles all of these.
- Don't add styles inside component files.
- Don't use Tailwind on Bubba marketing pages.
- Don't use raw hex colour values — use CSS custom properties.
- Don't hard-code copy strings in JSX.
- Don't create a new CSS file for Bubba marketing styles — add to `styles/bubba.css`.
- Don't set fixed `px` font sizes on elements that appear across screen sizes.
- Don't use `max-width` media queries for layout changes.
- Don't use any icon library other than `lucide-react`.
- Don't use `<div>` for semantic sections — use `<section>`, `<header>`, `<footer>`, `<nav>`, `<main>`.

---

*Last updated: August 2026. Branch: `ui-improvements`.*
