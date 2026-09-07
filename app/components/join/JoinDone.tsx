"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Check } from "lucide-react";

import { BUBBA_BRAND } from "@/lib/bubba-content";
import { useAppSelector } from "@/store/hooks";

/**
 * Confirmation screen, per artboards 7-24 and 7-25. The two differ only in
 * whether a market was chosen: the subtitle says "in your city" against
 * "nationally", and the card footer names the city against "Overall".
 *
 * The three unlock tiers are presentational — nothing in the API models them
 * yet, so the thresholds live here until they do.
 */
const UNLOCK_TIERS = [
  {
    title: "Time Pack",
    detail: "Extra 24 hours for 10 conversations",
    friends: "1 friend",
    tint: "#e6eae5",
    ink: "#385432",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l2.5 1.5" />
      </>
    ),
  },
  {
    title: "Shine Pack",
    detail: "Stand out for a day.",
    friends: "2 friends",
    tint: "#e9ebf2",
    ink: "#374a75",
    icon: (
      <>
        <path d="M4 17h16" />
        <path d="M12 5v3M6.5 8 8 9.5M17.5 8 16 9.5" />
        <path d="M7.5 17a4.5 4.5 0 0 1 9 0" />
      </>
    ),
  },
  {
    title: "1 Month Premium",
    detail: "1 month of all access membership",
    friends: "3 friends",
    tint: "#ede8ee",
    ink: "#5b3377",
    icon: (
      <>
        <path d="m12 4 1.7 4.3L18 10l-4.3 1.7L12 16l-1.7-4.3L6 10l4.3-1.7L12 4Z" />
        <path d="M18 15.5 18.8 17.2 20.5 18l-1.7.8L18 20.5l-.8-1.7L15.5 18l1.7-.8L18 15.5Z" />
      </>
    ),
  },
];

export function JoinDone() {
  const { form, joinResult, waitlistPosition } = useAppSelector((s) => s.waitlist);
  const [copied, setCopied] = useState(false);

  const link = joinResult?.referralLink ?? "";
  const place = waitlistPosition ?? joinResult?.waitlistPosition ?? null;
  const city = form.marketPlace || form.marketName;

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      /* Clipboard blocked — the link is selectable in the field regardless. */
    }
  };

  return (
    <div className="jn-page jn-page--done">
      <header className="jn-top jn-top--intro">
        <Link href="/" className="jn-brand" aria-label="Bubba — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BUBBA_BRAND.wordmarkBlack} alt="Bubba" />
        </Link>
      </header>

      <main className="jn-main jn-main--done">
        <h1 className="jn-done-title">You&apos;re on the list.</h1>

        <p className="jn-done-sub">
          We&apos;ll notify you when you&apos;re off the list
          <br />
          and Bubba launches {city ? "in your city." : "nationally."}
        </p>

        <section className="jn-place" aria-label="Your place in line">
          <p className="jn-place-label">Your place in line</p>
          <p className="jn-place-number">
            {place === null ? "—" : `#${place.toLocaleString()}`}
          </p>
          <p className="jn-place-where">{city ? `in ${city}` : "Overall"}</p>
        </section>

        <p className="jn-rule">
          <span>Unlock with invites</span>
        </p>

        <ul className="jn-unlocks">
          {UNLOCK_TIERS.map((tier) => (
            <li key={tier.title} className="jn-unlock">
              <span
                className="jn-unlock-icon"
                style={{ background: tier.tint, color: tier.ink }}
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {tier.icon}
                </svg>
              </span>
              <span className="jn-unlock-body">
                <span className="jn-unlock-title">{tier.title}</span>
                <span className="jn-unlock-detail">{tier.detail}</span>
              </span>
              <span className="jn-unlock-friends" style={{ color: tier.ink }}>
                {tier.friends}
              </span>
            </li>
          ))}
        </ul>

        <p className="jn-rule">
          <span>Your link</span>
        </p>

        <div className="jn-linkfield">
          <span className="jn-linkfield-url">{link.replace(/^https?:\/\//, "")}</span>
          <button
            type="button"
            className="jn-linkfield-copy"
            onClick={copy}
            aria-label={copied ? "Link copied" : "Copy your invite link"}
          >
            {copied ? <Check size={20} strokeWidth={2} /> : <Copy size={20} strokeWidth={1.7} />}
          </button>
        </div>

        <Link href="/" className="jn-done-exit">
          Exit
        </Link>
      </main>
    </div>
  );
}
