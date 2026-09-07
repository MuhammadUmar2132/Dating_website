"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import {
  BUBBA_CAMPUS_SCHOOL_COLORS,
  BUBBA_WAITING_ROOM_PAGE,
  type BubbaCampusMarket,
} from "@/lib/bubba-content";

const CARDS_PER_SLIDE = 3;

function chunkMarkets<T>(items: T[], size: number): T[][] {
  const slides: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    slides.push(items.slice(index, index + size));
  }

  return slides;
}

function CampusMarketCard({
  market,
  viewAllLabel,
  viewAllHref,
}: {
  market: BubbaCampusMarket;
  viewAllLabel: string;
  viewAllHref: string;
}) {
  return (
    <article className="bb-wrp-cp-market">
      <div className="bb-wrp-cp-market-top">
        <div className="bb-wrp-cp-market-art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={market.image} alt="" aria-hidden="true" />
        </div>

        <div className="bb-wrp-cp-market-copy">
          <h3 className="bb-wrp-cp-market-city">{market.city}</h3>
          <p className="bb-wrp-cp-market-count">
            {market.schoolCount} participating schools
          </p>
        </div>

        <a href={viewAllHref} className="bb-wrp-cp-market-link">
          {viewAllLabel}
          <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" />
        </a>
      </div>

      <div className="bb-wrp-cp-market-schools">
        {market.schools.map((school) => {
          const palette = BUBBA_CAMPUS_SCHOOL_COLORS[school.colorIndex];

          return (
            <div key={school.initials} className="bb-wrp-cp-school">
              <span
                className="bb-wrp-cp-school-badge"
                style={{
                  backgroundColor: palette.bg,
                  color: palette.text,
                }}
              >
                {school.initials}
              </span>
              <span className="bb-wrp-cp-school-name">{school.name}</span>
            </div>
          );
        })}

        <div className="bb-wrp-cp-school bb-wrp-cp-school--more">
          <span className="bb-wrp-cp-school-badge bb-wrp-cp-school-badge--more">
            +{market.moreCount}
          </span>
        </div>
      </div>
    </article>
  );
}

export function BubbaWaitingRoomCampusPrize() {
  const { campusPrize } = BUBBA_WAITING_ROOM_PAGE;
  const slides = useMemo(
    () => chunkMarkets(campusPrize.markets, CARDS_PER_SLIDE),
    [campusPrize.markets],
  );
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section
      className="bb-wrp-campus-prize"
      aria-labelledby="bb-wrp-campus-prize-title"
    >
      <div className="bb-shell">
        <div className="bb-wrp-cp-grid">
          <div className="bb-wrp-cp-copy">
            <p className="bb-wrp-cp-eyebrow">{campusPrize.eyebrow}</p>

            <h2 id="bb-wrp-campus-prize-title" className="bb-wrp-cp-title">
              <span className="bb-wrp-cp-title-line">{campusPrize.title.line1}</span>
              <span className="bb-wrp-cp-title-line bb-wrp-cp-title-line--accent">
                {campusPrize.title.line2}
              </span>
            </h2>

            <p className="bb-wrp-cp-lede">{campusPrize.description}</p>

            <div className="bb-wrp-cp-card-art">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={campusPrize.cardImage}
                alt={campusPrize.cardImageAlt}
              />
            </div>
          </div>

          <div className="bb-wrp-cp-panel">
            <div className="bb-wrp-cp-panel-head">
              <div className="bb-wrp-cp-panel-stats">
                <p className="bb-wrp-cp-stat-line">{campusPrize.statsLabel}</p>
                <p className="bb-wrp-cp-stat-line bb-wrp-cp-stat-line--accent">
                  {campusPrize.statsValue}
                </p>
              </div>

              <div className="bb-wrp-cp-pill" aria-label={campusPrize.pillLabel}>
                <span className="bb-wrp-cp-pill-dot" aria-hidden="true">
                  <span className="bb-wrp-cp-pill-dot-core" />
                </span>
                <span className="bb-wrp-cp-pill-label">
                  {campusPrize.pillLabel}
                </span>
              </div>
            </div>

            <div
              className="bb-wrp-cp-carousel"
              aria-live="polite"
              aria-atomic="true"
            >
              <div
                key={activeSlide}
                className="bb-wrp-cp-carousel-slide"
                id={`bb-wrp-cp-slide-${activeSlide}`}
              >
                {slides[activeSlide]?.map((market) => (
                  <CampusMarketCard
                    key={market.id}
                    market={market}
                    viewAllLabel={campusPrize.viewAllLabel}
                    viewAllHref={campusPrize.viewAllHref}
                  />
                ))}
              </div>
            </div>

            <div
              className="bb-wrp-cp-dots"
              role="tablist"
              aria-label="Market slides"
            >
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  className="bb-wrp-cp-dot"
                  aria-label={`Slide ${index + 1}`}
                  aria-selected={activeSlide === index}
                  aria-controls={`bb-wrp-cp-slide-${index}`}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
