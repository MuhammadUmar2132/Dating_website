"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/* Sidebar row for both the desktop rail and the mobile drawer.
   Ambassadors get the treatment from the ambassador artboards: a cool-green
   pill with a green rail on its left edge, sentence-case regular labels and
   22px thin-stroke icons. Waitlist members keep the existing warm uppercase
   styling - the designs in scope only cover the ambassador side. */
export function SidebarNavItem({
  href,
  label,
  icon,
  active,
  ambassador,
  compact = false,
  onClick,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  active: boolean;
  ambassador: boolean;
  compact?: boolean;
  onClick?: () => void;
}) {
  if (ambassador) {
    return (
      <Link
        href={href}
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        className={`relative w-full text-left rounded-[10px] flex items-center font-lato font-normal transition-colors duration-200 cursor-pointer ${
          /* pl-9 puts the icons at ~44px from the viewport edge, matching the
             artboards now that the rail itself sits at an 8px gutter. */
          compact ? "py-3 pl-4 pr-3 gap-3.5 text-[14px]" : "py-4 pl-9 pr-4 gap-5 text-[15px]"
        } ${active ? "bg-[#EBF0EC] text-black" : "text-[#1c1c1c] hover:bg-[#EBF0EC]/55"}`}
      >
        {active ? (
          <span aria-hidden className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-[#41772B]" />
        ) : null}
        <span
          className={`flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full ${
            compact ? "w-[19px] h-[19px]" : "w-[22px] h-[22px]"
          }`}
        >
          {icon}
        </span>
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`w-full text-left rounded-[8px] flex items-center transition-all duration-200 cursor-pointer subpixel-antialiased font-lato ${
        compact
          ? "py-2 px-3 gap-2.5 text-[13px] font-semibold"
          : "py-3 px-4 gap-3.5 text-[14px] font-bold tracking-wider uppercase"
      } ${
        active
          ? "bg-[#f1eee7] text-black shadow-sm"
          : "text-[#444444] hover:text-neutral-950 hover:bg-[#f1eee7]/50"
      }`}
    >
      <span
        className={`flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full ${
          compact ? "w-4 h-4" : "w-4.5 h-4.5"
        }`}
      >
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}
