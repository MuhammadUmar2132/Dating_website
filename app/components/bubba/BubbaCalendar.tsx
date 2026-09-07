"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { BUBBA_MARKETS } from "@/lib/bubba-content";

import { BubbaShell } from "./BubbaShell";

export function BubbaCalendar() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <BubbaShell active="calendar" showCapture={false}>
        <div className="bb-shell bb-shell--wide">
        <header className="bb-cal-head">
            <p className="bb-eyebrow">Launch Calendar</p>
            <h1 className="bb-display bb-display--xl">
              See when Bubba arrives.
            </h1>
            <p className="bb-cal-sub">
              We&apos;re launching in select markets this fall with a full
              rollout shortly after.
            </p>
          </header>

          <ul className="bb-cal-list">
            {BUBBA_MARKETS.map((market, index) => {
              const open = openId === market.id;
              const panelId = `bb-cal-panel-${market.id}`;

              return (
                <li key={market.id} className="bb-cal-row">
                  <button
                    type="button"
                    className="bb-cal-btn"
                    onClick={() => setOpenId(open ? null : market.id)}
                    aria-expanded={open}
                    aria-controls={panelId}
                  >
                    <span className="bb-cal-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span>
                      <span className="bb-cal-city">{market.city}</span>
                      <span className="bb-cal-state">{market.state}</span>
                    </span>

                    <span className="bb-cal-status bb-cal-mobile-hide">
                      <span className="bb-cal-track">
                        <span
                          className="bb-cal-fill"
                          style={{ width: `${market.progress}%` }}
                        />
                      </span>
                      <span className="bb-cal-status-text">
                        Almost there!
                        <span className="bb-cal-early">You&apos;re early.</span>
                      </span>
                    </span>

                    <span className="bb-cal-date">
                      <span className="bb-cal-month">{market.month}</span>
                      <span className="bb-cal-day">{market.day}</span>
                    </span>

                    <span
                      className={`bb-cal-chev${open ? " bb-cal-chev--open" : ""}`}
                      aria-hidden="true"
                    >
                      <ChevronDown size={16} strokeWidth={1.8} />
                    </span>
                  </button>

                  {open ? (
                    <div className="bb-cal-panel" id={panelId}>
                      <div className="bb-cal-panel-img">
                        <img
                          src={market.image}
                          alt={`${market.city} illustration`}
                          loading="lazy"
                        />
                      </div>
                      <div className="bb-cal-panel-stats">
                        <div className="bb-cal-stat">
                          <p className="bb-cal-stat-title">ON THE LIST</p>
                          <p className="bb-cal-stat-value">
                            {market.stats.waitlistCount}
                          </p>
                          <p className="bb-cal-stat-desc">waiting to join</p>
                        </div>
                        {/* WAITING ROOM DATES stat hidden with the rest of
                            the Waiting Room on the member side. The panel grid
                            sizes itself to the stats present. */}
                        <div className="bb-cal-stat">
                          <p className="bb-cal-stat-title">BUBBA LAUNCHES</p>
                          <p className="bb-cal-stat-value">
                            {market.stats.launchDate}
                          </p>
                          <p className="bb-cal-stat-desc">
                            {market.stats.launchYear}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
    </BubbaShell>
  );
}
