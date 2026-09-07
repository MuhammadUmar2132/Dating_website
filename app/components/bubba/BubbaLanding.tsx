import { Clock, Zap } from "lucide-react";

import { BUBBA_BRAND, BUBBA_LAUNCH_CITIES } from "@/lib/bubba-content";

import { BubbaCapture } from "./BubbaCapture";
import { BubbaDial } from "./BubbaDial";
import { BubbaShell } from "./BubbaShell";

export function BubbaLanding() {
  return (
    <BubbaShell active="home">
        {/* ── First screen: hero + city rail, exactly one viewport ── */}
        <div className="bb-first">
        {/* ── Hero ── */}
        <section className="bb-hero">
          <div className="bb-shell">
            <h1 className="bb-display bb-display--xl bb-hero-title">
              Together, today.
            </h1>
            <p className="bb-hero-sub">24 hours to chat</p>

            {/* The two promises sit in the hero, between the sub and the
                capture — the same copy the "moment" section carries further
                down the page, surfaced here as icon pairs. */}
            <ul className="bb-hero-facts">
              <li className="bb-hero-fact">
                <span className="bb-hero-fact-icon" aria-hidden="true">
                  <Zap size={22} strokeWidth={2} />
                </span>
                <p className="bb-hero-fact-text">
                  Only see recently
                  <br />
                  active profiles.
                </p>
              </li>
              <li className="bb-hero-fact">
                <span className="bb-hero-fact-icon" aria-hidden="true">
                  <Clock size={22} strokeWidth={2} />
                </span>
                <p className="bb-hero-fact-text">
                  Every conversation
                  <br />
                  lasts 24 hours.
                </p>
              </li>
            </ul>

            <div className="bb-hero-capture">
              <BubbaCapture label="Join the waitlist" placeholder="Get early access" />
            </div>
          </div>
        </section>

        {/* ── Launching in ── */}
        <section className="bb-rail">
          <div className="bb-shell">
            <p className="bb-eyebrow">LAUNCHING THIS FALL</p>
            <div className="bb-rail-marquee">
              <div className="bb-rail-track">
                <ul className="bb-rail-cities" aria-label="Launching cities">
                  {BUBBA_LAUNCH_CITIES.map((city) => (
                    <li key={city} className="bb-rail-city">
                      {city}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        </div>

{/* ── Waiting Room ──
             Hidden from the member side. The gold "September / TBD" panel and
             its 16 dedicated min-width:1024px rules in bubba.css are intact;
             restore by re-importing WaitingRoomSection and rendering it here.
             It must stay outside .bb-hide-desktop, which is
             `display: none !important` from 820px up. */}

        {/* ── The moment: signature countdown ── */}
        <section className="bb-moment">
          <div className="bb-shell">
            <p className="bb-eyebrow">Designed for the moment</p>
            <h2
              className="bb-display bb-display--lg"
              style={{ marginTop: 14 }}
            >
              24 hours to chat
            </h2>
            <p className="bb-moment-lede">
              Bubba was created to reduce friction
              <br />
              found in modern dating apps and get you
              <br />
              a date the very same say.
            </p>

            <BubbaDial />
          </div>

          <div className="bb-scene">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BUBBA_BRAND.scene}
              alt="An illustrated street scene of people meeting up around the city"
            />
          </div>
        </section>

    </BubbaShell>
  );
}
