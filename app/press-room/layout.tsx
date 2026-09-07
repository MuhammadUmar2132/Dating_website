"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import {
  PRESS_ROOM_NAV_LINKS,
  PRESS_ROOM_ASSETS,
  PRESS_ROOM_COLORS,
} from "@/lib/press-room-content";

type PressRoomLayoutProps = {
  children: React.ReactNode;
};

export default function PressRoomLayout({ children }: PressRoomLayoutProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/press-room";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      /* min-h-screen so the grey wash reaches the foot of short pages instead
         of stopping and letting the body colour show through. */
      className="min-h-screen pb-8 font-lato"
      style={{ backgroundColor: PRESS_ROOM_COLORS.pageBg }}
    >
      <header style={{ backgroundColor: PRESS_ROOM_COLORS.headerBg }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-5 md:py-6">
          {/* Outer cells size to the toggle and the pill, so the middle cell
              spans exactly the space between them and the wordmark centres
              optically there rather than on the viewport's centre line. From
              md up this collapses to the original flex row. */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center md:flex md:items-center md:justify-between">
            {/* Mobile menu toggle — leads the row on phones only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              /* 44x44 tap target around a 22x16 mark. The negative inline
                 margins cancel the extra width again so the grid track — and
                 with it the wordmark's optical centring — is unchanged. */
              className="md:hidden justify-self-start text-black flex h-11 w-11 items-center justify-center -mx-[11px]"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg
                  width="22"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  width="22"
                  height="16"
                  viewBox="0 0 22 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M1 2.5H16M1 13.5H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>

            {/* Logo — centred on phones, flush left on desktop */}
            <Link
              href="/press-room"
              className="flex flex-col items-center justify-self-center md:justify-self-start"
              aria-label="Bubba Press Room Home"
            >
              <Image
                src={PRESS_ROOM_ASSETS.logo}
                alt="Bubba"
                width={112}
                height={28}
                className="h-[16px] sm:h-[19px] md:h-[22px] w-auto"
                priority
              />
              {isHomePage && (
                <span className="text-[12px] sm:text-[13px] text-gray-600 mt-0.5 font-normal text-center">
                  Press Room
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-12 lg:gap-[92px]" aria-label="Main navigation">
              {PRESS_ROOM_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[15px] text-black hover:opacity-70 transition-opacity font-lato font-bold"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Subscribe Button */}
            <button
              className="justify-self-end px-3 sm:px-5 border-2 border-black rounded-[20px] text-[12px] sm:text-[14px] font-lato font-bold hover:bg-black hover:text-white transition-all min-w-[80px] sm:min-w-[112px] h-[30px] sm:h-[34px] flex items-center justify-center shrink-0"
              aria-label="Subscribe to press updates"
            >
              Subscribe
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <div className="flex flex-col gap-3">
                {PRESS_ROOM_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[16px] text-black hover:opacity-70 transition-opacity font-lato font-medium py-2"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
