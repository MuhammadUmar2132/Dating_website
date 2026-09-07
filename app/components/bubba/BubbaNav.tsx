"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Instagram, Music2, X } from "lucide-react";

import {
  BUBBA_BRAND,
  BUBBA_DRAWER_LEGAL,
  BUBBA_DRAWER_LINKS,
  BUBBA_NAV_LINKS,
  BUBBA_NAV_LINKS_V2,
  BUBBA_NAV_LINKS_V3,
  BUBBA_SOCIALS,
  type BubbaNavKey,
  type BubbaNavVariant,
} from "@/lib/bubba-content";

const SOCIAL_ICONS = { instagram: Instagram, tiktok: Music2 } as const;

type NavLink = {
  key: string;
  label: string;
  href: string;
};

type Props = {
  active?: BubbaNavKey;
  variant?: BubbaNavVariant;
};

function NavLinks({
  links,
  active,
  className = "bb-nav-links",
}: {
  links: readonly NavLink[];
  active: BubbaNavKey;
  className?: string;
}) {
  return (
    <div className={className}>
      {links.map((link) => (
        <Link
          key={link.key}
          href={link.href}
          className={`bb-nav-link${active === link.key ? " bb-nav-link--active" : ""}`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

function NavCta() {
  return (
    <Link href="/waitlist/start" className="bb-btn bb-btn--ink bb-nav-cta">
      <span className="bb-nav-cta-desktop">Join waitlist</span>
      <span className="bb-nav-cta-mobile">Join</span>
    </Link>
  );
}

export function BubbaNav({ active = "home", variant = "default" }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navClassName = [
    "bb-nav",
    scrolled ? "bb-nav--scrolled" : "",
    variant !== "default" ? `bb-nav--${variant}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <nav className={navClassName}>
        <div className="bb-nav-inner bb-nav-inner--default">
          <div className="bb-nav-left">
            <button
              type="button"
              className="bb-nav-burger"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
            >
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
            </button>

            <NavLinks links={BUBBA_NAV_LINKS} active={active} />
          </div>

          <Link href="/" className="bb-nav-brand" aria-label="Bubba — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BUBBA_BRAND.wordmark} alt="Bubba" />
          </Link>

          <div className="bb-nav-right">
            <NavCta />
          </div>
        </div>

        {variant === "v2" ? (
          <div className="bb-nav-inner bb-nav-inner--v2">
            <Link href="/" className="bb-nav-brand" aria-label="Bubba — home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BUBBA_BRAND.wordmark} alt="Bubba" />
            </Link>

            <div className="bb-nav-right">
              <NavLinks links={BUBBA_NAV_LINKS_V2} active={active} />
              <NavCta />
            </div>
          </div>
        ) : null}

        {variant === "v3" ? (
          <div className="bb-nav-inner bb-nav-inner--v3">
            <div className="bb-nav-v3-center">
              <Link href="/" className="bb-nav-brand" aria-label="Bubba — home">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={BUBBA_BRAND.wordmark} alt="Bubba" />
              </Link>
              <NavLinks
                links={BUBBA_NAV_LINKS_V3}
                active={active}
                className="bb-nav-links bb-nav-links--v3"
              />
            </div>
            <div className="bb-nav-v3-cta">
              <NavCta />
            </div>
          </div>
        ) : null}
      </nav>

      {open ? (
        <>
          <div
            className="bb-drawer-scrim"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="bb-drawer" role="dialog" aria-modal="true" aria-label="Menu">
            <div className="bb-drawer-head">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BUBBA_BRAND.wordmark} alt="Bubba" />
              <button
                type="button"
                className="bb-drawer-close"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} strokeWidth={1.8} />
              </button>
            </div>

            <nav className="bb-drawer-links">
              {BUBBA_DRAWER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="bb-drawer-link"
                  onClick={() => setOpen(false)}
                >
                  <span>{link.label}</span>
                  <svg
                    className="bb-drawer-link-arrow"
                    width="20"
                    height="10"
                    viewBox="0 0 20 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M18.97 4.1174L15.05 0.2175C14.76 -0.0725 14.28 -0.0725 13.99 0.2175C13.7 0.5075 13.7 0.987559 13.99 1.27756L16.62 3.89768H0.75C0.34 3.89768 0 4.23768 0 4.64768C0 5.05768 0.34 5.39768 0.75 5.39768H16.62L13.99 8.0173C13.7 8.3073 13.7 8.78736 13.99 9.07736C14.28 9.36736 14.76 9.36736 15.05 9.07736L18.97 5.17746C19.26 4.88746 19.26 4.4074 18.97 4.1174Z"
                      fill="black"
                    />
                  </svg>
                </Link>
              ))}
            </nav>

            <Link
              href="/waitlist/start"
              className="bb-drawer-card"
              onClick={() => setOpen(false)}
            >
              <span>
                <span className="bb-drawer-card-title">Be the first to know</span>
                <span className="bb-drawer-card-body">
                  Join the waitlist for early access to Bubba
                </span>
              </span>
              <span className="bb-drawer-card-go" aria-hidden="true">
                <svg
                  width="18"
                  height="10"
                  viewBox="0 0 20 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.97 4.1174L15.05 0.2175C14.76 -0.0725 14.28 -0.0725 13.99 0.2175C13.7 0.5075 13.7 0.987559 13.99 1.27756L16.62 3.89768H0.75C0.34 3.89768 0 4.23768 0 4.64768C0 5.05768 0.34 5.39768 0.75 5.39768H16.62L13.99 8.0173C13.7 8.3073 13.7 8.78736 13.99 9.07736C14.28 9.36736 14.76 9.36736 15.05 9.07736L18.97 5.17746C19.26 4.88746 19.26 4.4074 18.97 4.1174Z"
                    fill="white"
                  />
                </svg>
              </span>
            </Link>

            <div className="bb-drawer-social">
              {BUBBA_SOCIALS.map((social) => {
                const Icon = SOCIAL_ICONS[social.key];
                return (
                  <a
                    key={social.key}
                    href={social.href}
                    className="bb-drawer-social-link"
                  >
                    <Icon size={18} strokeWidth={1.6} />
                    <span>{social.label}</span>
                  </a>
                );
              })}
            </div>

            <div className="bb-drawer-legal">
              {BUBBA_DRAWER_LEGAL.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <p className="bb-drawer-year">24 Dates {new Date().getFullYear()}</p>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
