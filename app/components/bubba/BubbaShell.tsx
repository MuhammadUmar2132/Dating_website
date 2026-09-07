import type { ReactNode } from "react";

import { type BubbaNavKey, type BubbaNavVariant } from "@/lib/bubba-content";

import { BubbaAnnouncement } from "./BubbaAnnouncement";
import { BubbaCookieBar } from "./BubbaCookieBar";
import { BubbaFooter } from "./BubbaFooter";
import { BubbaNav } from "./BubbaNav";

type Props = {
  children: ReactNode;
  active?: BubbaNavKey;
  /** Legal and contact pages aren't selling, so they skip the capture card. */
  showCapture?: boolean;
  /** FAQ uses the closing wordmark instead of the site footer. */
  showFooter?: boolean;
  /** Optional modifier class on the page shell (e.g. bb-page--ambassadors). */
  pageClassName?: string;
  /** Nav layout variant — v2/v3 are page-specific; mobile keeps the default bar. */
  navVariant?: BubbaNavVariant;
};

/**
 * Every page wears the same chrome: announcement strip, nav (with the mobile
 * drawer), footer and cookie sheet. Pages supply only their main content.
 */
export function BubbaShell({
  children,
  active = "home",
  showCapture = true,
  showFooter = true,
  pageClassName,
  navVariant = "default",
}: Props) {
  return (
    <div className={pageClassName ? `bb-page ${pageClassName}` : "bb-page"}>
      {/* Back with the copy the "24 website" artboards carry — the strip was
          only hidden because its old text announced the Waiting Room. */}
      <BubbaAnnouncement />
      <BubbaNav active={active} variant={navVariant} />

      <main className="bb-main">{children}</main>

      {showFooter ? <BubbaFooter showCapture={showCapture} /> : null}
      <BubbaCookieBar />
    </div>
  );
}
