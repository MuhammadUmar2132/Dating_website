"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Crown } from "lucide-react";

import { BUBBA_AMBASSADORS_PRIZES } from "@/lib/bubba-content";

import {
  BuildingsIcon,
  EducationIcon,
  GlobeIcon,
  GroupUserIcon,
  IndividualIcon,
  LocationIcon,
} from "./BubbaAmbIcons";

const TIER_ICON = {
  user: IndividualIcon,
  building: BuildingsIcon,
  globe: GlobeIcon,
} as const;

const STAT_ICON = {
  "map-pin": LocationIcon,
  "graduation-cap": EducationIcon,
  users: GroupUserIcon,
} as const;

/** Copy the carousel layout needs that the content object does not carry. */
const TIER_LEDE: Record<string, string> = {
  INDIVIDUAL: "Invite friends. Unlock all three.",
  MARKET: "Win your city.",
  NATIONAL: "Win the country.",
};

/**
 * The prizes block, rebuilt to the reference's carousel: a left-aligned
 * headline with the premium badge opposite it, a prize-pool line with the
 * carousel arrows opposite it, numbered tabs, then a sliding track of tier
 * cards with the next card peeking in from the right.
 */
export function BubbaAmbassadorPrizes() {
  const { leftContent, tiers, bottomStats } = BUBBA_AMBASSADORS_PRIZES;
  const [active, setActive] = useState(0);

  const go = (next: number) =>
    setActive(Math.min(tiers.length - 1, Math.max(0, next)));

  return (
    <section className="bb-amb-prizes-section">
      <div className="bb-shell">
        <div className="bb-amb-prizes-head">
          <div className="bb-amb-prizes-headline">
            <p className="bb-amb-prizes-heading">{leftContent.heading}</p>
            <p className="bb-amb-prizes-amount">{leftContent.amount}</p>
            <p className="bb-amb-prizes-sub-amount">{leftContent.subAmount}</p>
          </div>

          <div className="bb-amb-prizes-promo">
            <span className="bb-amb-prizes-promo-icon" aria-hidden="true">
              {/* 30 in a 67px disc — the reference's crown fills roughly
                  45% of it, where 18 in 52 read as a speck. */}
              <Crown size={30} color="#fff" strokeWidth={1.6} />
            </span>
            <span className="bb-amb-prizes-promo-text">
              <span className="bb-amb-prizes-promo-badge">
                {leftContent.premiumPromo.badge}
              </span>
              <strong className="bb-amb-prizes-promo-offer">
                {leftContent.premiumPromo.offer}
              </strong>
              <span className="bb-amb-prizes-promo-subtext">
                {leftContent.premiumPromo.subtext}
              </span>
            </span>
          </div>
        </div>

        <div className="bb-amb-prizes-poolrow">
          <p className="bb-amb-prizes-total-pool">
            <strong className="bb-amb-prizes-pool-amount">
              {leftContent.totalPoolAmount}
            </strong>{" "}
            <span className="bb-amb-prizes-pool-label">
              {leftContent.totalPoolLabel}
            </span>
          </p>
          <div className="bb-amb-prizes-nav">
            <button
              type="button"
              className="bb-amb-prizes-arrow"
              onClick={() => go(active - 1)}
              disabled={active === 0}
              aria-label="Previous prize tier"
            >
              <ArrowLeft size={18} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              className="bb-amb-prizes-arrow bb-amb-prizes-arrow--filled"
              onClick={() => go(active + 1)}
              disabled={active === tiers.length - 1}
              aria-label="Next prize tier"
            >
              <ArrowRight size={18} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <div className="bb-amb-prizes-tabs" role="tablist">
          {tiers.map((tier, i) => (
            <button
              key={tier.level}
              type="button"
              role="tab"
              aria-selected={active === i}
              className={`bb-amb-prizes-tab${active === i ? " is-active" : ""}`}
              onClick={() => setActive(i)}
            >
              <span className="bb-amb-prizes-tab-num">{`0${i + 1}`}</span>
              <span className="bb-amb-prizes-tab-label">{tier.level}</span>
            </button>
          ))}
        </div>

        <div className="bb-amb-prizes-carousel">
          <div
            className="bb-amb-prizes-track"
            style={{
              transform: `translateX(calc(${-active} * (var(--bb-amb-card) + 24px)))`,
            }}
          >
            {tiers.map((tier) => {
              const Icon = TIER_ICON[tier.icon as keyof typeof TIER_ICON];
              const isIndividual = tier.level === "INDIVIDUAL";
              return (
                <article key={tier.level} className="bb-amb-prizes-card">
                  <header className="bb-amb-prizes-card-head">
                    <Icon className="bb-amb-tier-icon" />
                    <h3 className="bb-amb-tier-level">{tier.level}</h3>
                  </header>
                  <p className="bb-amb-prizes-card-lede">{TIER_LEDE[tier.level]}</p>

                  {isIndividual ? (
                    <ul className="bb-amb-prizes-merch">
                      {tier.items.map((item) => (
                        <li key={item.label} className="bb-amb-prizes-merch-item">
                          <span className="bb-amb-prizes-merch-num">{item.label}</span>
                          <span className="bb-amb-prizes-merch-unit">
                            {"subLabel" in item ? item.subLabel : "invites"}
                          </span>
                          {/* Product photography cropped out of the design export
                              (ui/1x/Asset am4.png) — 1x sources, so soft on
                              retina until the originals are supplied. */}
                          {"image" in item && item.image ? (
                            <img
                              className="bb-amb-prizes-merch-shot"
                              src={item.image}
                              alt=""
                              aria-hidden="true"
                            />
                          ) : (
                            <span className="bb-amb-prizes-merch-shot" aria-hidden="true" />
                          )}
                          <span className="bb-amb-prizes-merch-rule" aria-hidden="true" />
                          <span className="bb-amb-prizes-merch-name">{item.reward}</span>
                          {"caption" in item && (
                            <span className="bb-amb-prizes-merch-caption">
                              {item.caption}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <>
                      <ul className="bb-amb-prizes-places">
                        {tier.items.map((item) => (
                          <li key={item.label} className="bb-amb-prizes-place">
                            {/* The export stacks the place over its prize and
                                rules off each row, rather than setting them on
                                one line. */}
                            <span className="bb-amb-prizes-place-pos">{item.label}</span>
                            <span className="bb-amb-prizes-place-prize">{item.reward}</span>
                          </li>
                        ))}
                      </ul>
                      {"footnote" in tier && (
                        <p className="bb-amb-prizes-places-note">{tier.footnote}</p>
                      )}
                    </>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        <div className="bb-amb-prizes-dots">
          {tiers.map((tier, i) => (
            <button
              key={tier.level}
              type="button"
              className={`bb-amb-prizes-dot${active === i ? " is-active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Show ${tier.level} prizes`}
            />
          ))}
        </div>

        <div className="bb-amb-prizes-bottom">
          <Link href={leftContent.actionHref} className="bb-amb-prizes-action">
            {/* The rule under the label is its own border, not text-decoration:
                the reference runs it 18px past the last glyph and stops it well
                short of the arrow. */}
            <span className="bb-amb-prizes-action-text">{leftContent.actionText}</span>
            {/* Drawn rather than taken from lucide: the reference arrow inks
                20x15 with a 9.5-wide head, where ArrowRight is square and
                MoveRight's head is far too flat. */}
            <svg
              className="bb-amb-prizes-action-arrow"
              width="20"
              height="15"
              viewBox="0 0 20 15"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M0 7.5H19M11.5 1L19 7.5L11.5 14"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <div className="bb-amb-prizes-stats">
            {bottomStats.stats.map((stat) => {
              const Icon = STAT_ICON[stat.icon as keyof typeof STAT_ICON];
              return (
                <span key={stat.label} className="bb-amb-prizes-stat-item">
                  <Icon className="bb-amb-prizes-stat-icon" />
                  <strong>{stat.value}</strong> {stat.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
