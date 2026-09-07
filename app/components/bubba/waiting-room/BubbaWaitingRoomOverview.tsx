"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { BUBBA_WAITING_ROOM_PAGE } from "@/lib/bubba-content";

const CARDS = [
  { id: "snap", src: "/images/4x/wr-card-3.png", alt: "Snap prompt card" },
  { id: "game", src: "/images/4x/wr-card-2.png", alt: "Game prompt card" },
  { id: "prompt", src: "/images/4x/wr-card-1.png", alt: "Prompt card" },
];

// Slot order runs back to front, so index 0 starts at the back of the deck.
const SLOTS = ["back", "mid", "front"];

// How long each card holds the front slot, and how long the deal-in runs
// before the rotation starts (last card's 300ms stagger + its 720ms travel).
const CYCLE_MS = 3000;
const DEAL_MS = 1100;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function BubbaWaitingRoomOverview() {
  const { overview } = BUBBA_WAITING_ROOM_PAGE;
  const stackRef = useRef<HTMLDivElement>(null);
  const [dealt, setDealt] = useState(false);
  const [step, setStep] = useState(0);

  // Deal the cards in once the stack scrolls into view, then stop watching.
  useEffect(() => {
    const node = stackRef?.current ?? null;

    if (!node) return;

    const teardown = () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };

    function check() {
      const rect = node?.getBoundingClientRect();
      const viewportH =
        window.innerHeight || document.documentElement.clientHeight;

      if (!rect) return;

      if (rect.top < viewportH * 0.9 && rect.bottom > 0) {
        setDealt(true);
        teardown();
      }
    }

    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    check();

    return teardown;
  }, []);

  // Once the deck has landed, advance it so every card takes a turn in front.
  useEffect(() => {
    if (!dealt || prefersReducedMotion()) return;

    let cycle: ReturnType<typeof setInterval> | undefined;

    const start = setTimeout(() => {
      cycle = setInterval(() => {
        setStep((prev) => (prev + 1) % SLOTS.length);
      }, CYCLE_MS);
    }, DEAL_MS);

    return () => {
      clearTimeout(start);
      if (cycle) clearInterval(cycle);
    };
  }, [dealt]);

  return (
    <section
      className="bb-wrp-overview"
      aria-labelledby="bb-wrp-overview-title"
    >
      <div className="bb-shell">
        <div className="bb-wrp-overview-grid">
          <div className="bb-wrp-overview-copy">
            <p className="bb-eyebrow">{overview.eyebrow}</p>

            <h2 id="bb-wrp-overview-title" className="bb-display">
              <span className="bb-wrp-overview-title-line">
                {overview.title.line1}
              </span>
              <span className="bb-wrp-overview-title-line bb-wrp-overview-title-line--accent">
                {overview.title.line2}
              </span>
            </h2>

            <div className="bb-wrp-overview-body">
              {overview.body.map((paragraph) => (
                <p key={paragraph} className="bb-lede bb-wrp-overview-lede">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="bb-wrp-overview-art">
            <div
              ref={stackRef}
              className={`bb-wrp-card-stack${dealt ? " is-dealt" : ""}`}
              aria-label="Stacked waiting room prompt cards"
            >
              {CARDS.map((card, i) => (
                <img
                  key={card.id}
                  src={card.src}
                  alt={card.alt}
                  className={`bb-wrp-card-img bb-wrp-card--${
                    SLOTS[(i + step) % SLOTS.length]
                  }`}
                  style={{ "--bb-wrp-card-i": i } as CSSProperties}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
