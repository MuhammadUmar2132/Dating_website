"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

import { BUBBA_BRAND, BUBBA_FAQS } from "@/lib/bubba-content";

import { BubbaShell } from "./BubbaShell";

// Breathing room between the opened question and the sticky nav above it.
const SCROLL_GUTTER = 16;

// Where the opened question comes to rest, as a share of the viewport below the
// nav. Pinning it to the very top scrolled further than the click warranted.
const REST_RATIO = 0.21;

export function BubbaFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  // The first item is open on load; that is not a click, so don't scroll for it.
  const skipInitialScroll = useRef(true);

  // Bring the opened question to a comfortable reading position: a short way
  // down the screen rather than pinned to the very top, never under the nav,
  // and pulled up further only if that is what it takes to fit the answer.
  useEffect(() => {
    if (skipInitialScroll.current) {
      skipInitialScroll.current = false;
      return;
    }

    if (openIndex === null) return;

    const node = itemRefs?.current?.[openIndex];

    if (!node) return;

    // Measured every time: the nav is ~68px on phones and ~119px on desktop.
    const nav = document.querySelector(".bb-nav");
    const navHeight = nav ? Math.round(nav.getBoundingClientRect().height) : 0;
    const viewportH =
      window?.innerHeight || document?.documentElement?.clientHeight;
    const rect = node.getBoundingClientRect();

    const minTop = navHeight + SCROLL_GUTTER;
    const restingTop = navHeight + Math.round(viewportH * REST_RATIO);
    const topThatFits = viewportH - SCROLL_GUTTER - rect?.height;
    const targetTop = Math.max(minTop, Math.min(restingTop, topThatFits));

    let delta = 0;

    if (rect?.top && rect.top > targetTop) {
      delta = rect?.top - targetTop;
    } else if (rect?.top && rect?.top < minTop) {
      delta = rect?.top - minTop;
    }

    if (Math.abs(delta) < 2) return;

    const reduceMotion =
      typeof window?.matchMedia === "function" &&
      window?.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollBy({
      top: delta,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [openIndex]);

  return (
    <BubbaShell active="faq" showCapture={false}>
        <div className="bb-shell">
          <header className="bb-faq-head">
            <p className="bb-eyebrow bb-eyebrow--muted">
              Frequently asked questions
            </p>
            <h1 className="bb-display bb-display--lg bb-faq-title">
              Everything you need
              <br />
              to know
            </h1>
            <p className="bb-lede bb-faq-sub">
              Answers to the most common questions
              <br />
              about dating on 24.
            </p>
          </header>

          <div className="bb-faq-list">
            {BUBBA_FAQS?.map((item, index) => {
              const open = openIndex === index;
              const panelId = `bb-faq-panel-${index}`;

              return (
                <div
                  className="bb-faq-item"
                  key={item.q}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                >
                  <h2 style={{ margin: 0 }}>
                    <button
                      type="button"
                      className="bb-faq-q"
                      onClick={() => setOpenIndex(open ? null : index)}
                      aria-expanded={open}
                      aria-controls={panelId}
                    >
                      {item.q}
                      <ChevronDown
                        size={19}
                        strokeWidth={1.9}
                        style={{
                          flex: "0 0 auto",
                          transition: "transform 0.22s ease",
                          transform: open ? "rotate(180deg)" : undefined,
                        }}
                        aria-hidden="true"
                      />
                    </button>
                  </h2>
                  {open ? (
                    <p className="bb-faq-a" id={panelId}>
                      {item.a}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="bb-faq-cta-wrap">
            <section className="bb-faq-cta" aria-label="Contact support">
              <div className="bb-faq-cta-art" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={BUBBA_BRAND.faqScene} alt="" />
              </div>
              <div className="bb-faq-cta-body">
                <h2 className="bb-faq-cta-title">Still have questions?</h2>
                <p className="bb-faq-cta-text">
                  We&apos;re here to help. Please contact our support team for
                  assistance.
                </p>
                <Link href="/contact" className="bb-faq-cta-link">
                  Contact support
                  <ArrowRight size={20} strokeWidth={2} aria-hidden="true" />
                </Link>
              </div>
            </section>
          </div>
        </div>

    </BubbaShell>
  );
}