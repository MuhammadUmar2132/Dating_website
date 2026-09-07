"use client";

import { useCallback, useRef, useState } from "react";

import {
  BUBBA_WAITING_ROOM_PAGE,
  type BubbaSneakPeekFeaturedPrize,
  type BubbaSneakPeekPrize,
} from "@/lib/bubba-content";

import { BubbaWaitingRoomCtaBanner } from "./BubbaWaitingRoomCta";

function formatPoints(points: number) {
  return `${points.toLocaleString()} pts`;
}

function SneakPeekFeaturedCard({ prize }: { prize: BubbaSneakPeekFeaturedPrize }) {
  return (
    <article className="bb-wrp-sneak-card bb-wrp-sneak-card--featured">
      <h3 className="bb-wrp-sneak-card-label">{prize.label}</h3>
      <span className="bb-wrp-sneak-card-badge">{prize.badge}</span>

      <div className="bb-wrp-sneak-card-art">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={prize.image} alt={prize.imageAlt} />
      </div>

      <button type="button" className="bb-wrp-sneak-card-redeem">
        {prize.redeemLabel}
      </button>
    </article>
  );
}

function SneakPeekPrizeCard({ prize }: { prize: BubbaSneakPeekPrize }) {
  return (
    <article className="bb-wrp-sneak-card">
      <h3 className="bb-wrp-sneak-card-label">{prize.label}</h3>

      <div className="bb-wrp-sneak-card-art">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={prize.image} alt={prize.imageAlt} />
      </div>

      <div className="bb-wrp-sneak-card-meta">
        <p className="bb-wrp-sneak-card-points">{formatPoints(prize.points)}</p>
        <p className="bb-wrp-sneak-card-name">{prize.name}</p>
        <p className="bb-wrp-sneak-card-desc">{prize.description}</p>
      </div>
    </article>
  );
}

function isFeaturedPrize(
  prize: BubbaSneakPeekFeaturedPrize | BubbaSneakPeekPrize,
): prize is BubbaSneakPeekFeaturedPrize {
  return "featured" in prize;
}

export function BubbaWaitingRoomSneakPeek() {
  const { sneakPeek } = BUBBA_WAITING_ROOM_PAGE;
  const trackRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(
      track.querySelectorAll<HTMLElement>("[data-sneak-card]"),
    );
    if (!cards.length) return;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - trackCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  const scrollToCard = (index: number) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>(
      `[data-sneak-card="${index}"]`,
    );
    if (!card) return;

    track.scrollTo({
      left: card.offsetLeft - track.offsetLeft,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  return (
    <section
      className="bb-wrp-sneak"
      aria-labelledby="bb-wrp-sneak-title"
    >
      <div className="bb-shell">
        <div className="bb-wrp-sneak-inner">
          <div className="bb-wrp-sneak-head">
            <p className="bb-wrp-sneak-eyebrow">{sneakPeek.eyebrow}</p>
            <h2 id="bb-wrp-sneak-title" className="bb-wrp-sneak-title">
              {sneakPeek.title}
            </h2>
          </div>

          <div className="bb-wrp-sneak-carousel-wrap">
            <ul
              ref={trackRef}
              className="bb-wrp-sneak-track"
              aria-label="Prize preview cards"
              onScroll={updateActiveIndex}
            >
              {sneakPeek.prizes.map((prize, index) => (
                <li
                  key={prize.id}
                  className="bb-wrp-sneak-slide"
                  data-sneak-card={index}
                >
                  {isFeaturedPrize(prize) ? (
                    <SneakPeekFeaturedCard prize={prize} />
                  ) : (
                    <SneakPeekPrizeCard prize={prize} />
                  )}
                </li>
              ))}
            </ul>

            <div
              className="bb-wrp-sneak-dots"
              role="tablist"
              aria-label="Prize cards"
            >
              {sneakPeek.prizes.map((prize, index) => (
                <button
                  key={prize.id}
                  type="button"
                  role="tab"
                  className="bb-wrp-sneak-dot"
                  aria-label={`${prize.label} prize`}
                  aria-selected={activeIndex === index}
                  onClick={() => scrollToCard(index)}
                />
              ))}
            </div>
          </div>
        </div>

        <BubbaWaitingRoomCtaBanner />
      </div>
    </section>
  );
}
