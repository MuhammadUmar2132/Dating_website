"use client";

import { useState } from "react";
import Link from "next/link";

import {
  AMB_CLOSER,
  AMB_HERO,
  AMB_PARTICIPATION,
  AMB_PRIZES,
  AMB_TIERS,
} from "@/lib/ambassadors-content";
import { BubbaShell } from "./BubbaShell";

/** The long arrow used by every "→" affordance on the page. */
function ArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg
      className="amb-arrow"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 10h13M11.5 5.5 16.5 10l-5 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Hand-drawn connector between the participation steps. Mirrored for the 2nd. */
function StepConnector({ flip }: { flip?: boolean }) {
  return (
    <svg
      className={"amb-step-link" + (flip ? " amb-step-link--down" : "")}
      viewBox="0 0 40 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 15c8-9 22-11 33-5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M29 3.5 35.5 10 28.5 13"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PanelIcon({ kind }: { kind: string }) {
  return (
    <span className="amb-panel-icon" aria-hidden="true">
      {kind === "info" ? (
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.3" />
          <path d="M12 10.5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="7.6" r="1" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="12" cy="12" r="5.4" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      )}
    </span>
  );
}

export function AmbassadorsPage() {
  /* 03 MARKET is the state drawn on the reference artboard, but the page
     opens on the first tab. */
  const [active, setActive] = useState(0);
  const tier = AMB_TIERS[active];
  const step = (dir: -1 | 1) =>
    setActive((i) => (i + dir + AMB_TIERS.length) % AMB_TIERS.length);

  return (
    /* The artboards end this page at the dark closing panel — no
       "Meet you there." capture card, which the shell shows by default
       everywhere else. */
    <BubbaShell active="ambassadors" showCapture={false} pageClassName="amb-page">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="amb-hero">
        <div className="amb-wrap">
          <p className="amb-eyebrow">{AMB_HERO.eyebrow}</p>
          <h1 className="amb-h1">{AMB_HERO.heading}</h1>
          <p className="amb-hero-sub">
            {AMB_HERO.sub.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>

          <div className="amb-stats">
            {AMB_HERO.stats.map((s) => (
              <div
                key={s.label + s.value}
                className={"amb-stat" + (s.lead ? " amb-stat--lead" : "")}
              >
                {s.lead ? (
                  <>
                    <p className="amb-stat-kicker">{s.label}</p>
                    <p className="amb-stat-value">{s.value}</p>
                    <p className="amb-stat-note">{s.note}</p>
                  </>
                ) : (
                  <>
                    <p className="amb-stat-value">{s.value}</p>
                    <p className="amb-stat-label">{s.label}</p>
                    <p className="amb-stat-note">{s.note}</p>
                  </>
                )}
              </div>
            ))}
          </div>

          <p className="amb-hero-contact">
            {AMB_HERO.contact.lead} {AMB_HERO.contact.handle}
            <svg className="amb-heart" viewBox="0 0 20 18" fill="none" aria-hidden="true">
              <path
                d="M10 16.5S1.8 11.6 1.8 6.3A4.3 4.3 0 0 1 10 4.4a4.3 4.3 0 0 1 8.2 1.9c0 5.3-8.2 10.2-8.2 10.2Z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>
          </p>
          <p className="amb-hero-invite">
            {AMB_HERO.invite.lead}{" "}
            <Link href={AMB_HERO.invite.href} className="amb-hero-login">
              {AMB_HERO.invite.cta}
              <ArrowRight size={15} />
            </Link>
          </p>
        </div>
      </section>

      {/* ── Prizes ─────────────────────────────────────────── */}
      <section className="amb-prizes">
        <div className="amb-wrap">
          <div className="amb-prizes-head">
            <div className="amb-prizes-lead">
              <p className="amb-eyebrow amb-eyebrow--ink">{AMB_PRIZES.eyebrow}</p>
              <p className="amb-amount">{AMB_PRIZES.amount}</p>
              <p className="amb-amount-note">{AMB_PRIZES.note}</p>
            </div>

            <div className="amb-perk">
              <span className="amb-perk-badge" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 16.5 3 7l5 3.5L12 5l4 5.5L21 7l-1 9.5H4Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="amb-perk-text">
                <span className="amb-perk-lead">{AMB_PRIZES.perk.lead}</span>
                <span className="amb-perk-line">{AMB_PRIZES.perk.line}</span>
              </span>
            </div>
          </div>

          <div className="amb-tabs-row">
            <div className="amb-tabs" role="tablist" aria-label="Prize tiers">
              {AMB_TIERS.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  className={"amb-tab" + (i === active ? " amb-tab--on" : "")}
                  style={i === active ? { ["--amb-underline" as string]: t.underline } : undefined}
                  onClick={() => setActive(i)}
                >
                  <span className="amb-tab-index">{t.index}</span>
                  <span className="amb-tab-label">{t.label}</span>
                </button>
              ))}
            </div>

            <div className="amb-tabs-nav">
              <button type="button" onClick={() => step(-1)} aria-label="Previous tier">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M17 10H4M8.5 5.5 3.5 10l5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Next tier">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M3 10h13M11.5 5.5 16.5 10l-5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="amb-cards" role="tabpanel">
            {tier.kind === "merch"
              ? tier.items.map((item, i) => (
                  <article
                    key={item.name}
                    className={"amb-card amb-card--merch" + (i === 0 ? " amb-card--wide" : "")}
                  >
                    <p className="amb-merch-invites">{item.invites}</p>
                    <span className="amb-merch-shot">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.img} alt="" />
                    </span>
                    <p className="amb-merch-name">{item.name}</p>
                  </article>
                ))
              : tier.places.map((place, i) => (
                  <article
                    key={place.rank}
                    className={
                      "amb-card amb-card--cash" + (i === 0 ? " amb-card--wide amb-card--champ" : "")
                    }
                    style={i === 0 ? { background: tier.accent } : undefined}
                  >
                    <div className="amb-card-top">
                      <p className="amb-card-rank">{place.rank}</p>
                      {i === 0 ? <p className="amb-card-champ">{tier.championLabel}</p> : null}
                    </div>
                    <p
                      className="amb-card-amount"
                      style={i === 0 ? undefined : { color: tier.accent }}
                    >
                      {place.amount}
                    </p>
                    <p className="amb-card-where">{place.where}</p>
                  </article>
                ))}
          </div>

          <div className="amb-prizes-foot">
            <p>{AMB_PRIZES.foot}</p>
            <Link href={AMB_PRIZES.rules.href} className="amb-rules">
              {AMB_PRIZES.rules.label}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Participation ──────────────────────────────────── */}
      <section className="amb-part">
        <div className="amb-wrap">
          <p className="amb-eyebrow">{AMB_PARTICIPATION.eyebrow}</p>

          <div className="amb-part-row">
            <p className="amb-days">
              <span className="amb-days-num">{AMB_PARTICIPATION.daysLarge}</span>
              <span className="amb-days-word">{AMB_PARTICIPATION.daysWord}</span>
            </p>

            <div className="amb-part-main">
              <h2 className="amb-part-heading">{AMB_PARTICIPATION.heading}</h2>
              <ol className="amb-steps">
                {AMB_PARTICIPATION.steps.map((s, i) => (
                  <li key={s.title} className="amb-step">
                    {i > 0 ? <StepConnector flip={i === 2} /> : null}
                    <div className="amb-step-body">
                      <span className="amb-step-icon">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={s.icon}
                          alt=""
                          width={s.iconW}
                          height={s.iconH}
                          style={{ width: s.iconW, height: s.iconH }}
                        />
                      </span>
                      <p className="amb-step-title">{s.title}</p>
                      <p className="amb-step-text">
                        {s.body.map((line) => (
                          <span key={line}>{line}</span>
                        ))}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="amb-panels">
            {AMB_PARTICIPATION.panels.map((p) => (
              <details key={p.title} className="amb-panel">
                <summary>
                  <PanelIcon kind={p.icon} />
                  <span className="amb-panel-copy">
                    <span className="amb-panel-title">{p.title}</span>
                    <span className="amb-panel-sub">
                      {p.body.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </span>
                  </span>
                  <svg className="amb-chev" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                      d="m5 7.5 5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </summary>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing panel ──────────────────────────────────── */}
      <section className="amb-closer">
        <div className="amb-closer-wrap">
          <div className="amb-closer-panel">
            <div className="amb-closer-left">
              <p className="amb-closer-eyebrow">{AMB_CLOSER.eyebrow}</p>
              <p className="amb-closer-heading">
                {AMB_CLOSER.headingLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
            </div>

            <div className="amb-closer-right">
              <h2 className="amb-closer-title">{AMB_CLOSER.title}</h2>
              <p className="amb-closer-body">{AMB_CLOSER.body}</p>
              <Link href={AMB_CLOSER.cta.href} className="amb-closer-cta">
                {AMB_CLOSER.cta.label}
                <ArrowRight size={16} />
              </Link>
              <p className="amb-closer-or">
                <span>{AMB_CLOSER.orLabel}</span>
              </p>
              <p className="amb-closer-alt">{AMB_CLOSER.altLead}</p>
              <a
                href={AMB_CLOSER.altCta.href}
                target="_blank"
                rel="noreferrer"
                className="amb-closer-alt-link"
              >
                {AMB_CLOSER.altCta.label}
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </BubbaShell>
  );
}
