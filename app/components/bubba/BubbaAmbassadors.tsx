import Link from "next/link";
import { Heart, UsersRound, ArrowRight, Crown } from "lucide-react";
import { 
  BUBBA_AMBASSADORS_HERO, 
  BUBBA_AMBASSADORS_STATS,
  BUBBA_AMBASSADORS_PRIZES,
  BUBBA_AMBASSADORS_TIMELINE,
  BUBBA_AMBASSADORS_FINAL 
} from "@/lib/bubba-content";
import { BubbaShell } from "./BubbaShell";
import { BubbaAmbassadorAccordions } from "./ambassadors/BubbaAmbassadorAccordions";
import { BubbaAmbassadorPrizes } from "./ambassadors/BubbaAmbassadorPrizes";
import {
  Building01Icon,
  BuildingsIcon,
  DualUserIcon,
  EditIcon,
  EducationIcon,
  GlobeIcon,
  GroupUserIcon,
  IndividualIcon,
  LocationIcon,
  MessageIcon,
  SparkIcon,
} from "./ambassadors/BubbaAmbIcons";

type Props = {
  pageClassName?: string;
};

export function BubbaAmbassadors({ pageClassName }: Props) {
  return (
    // Asset am2.png ends this page at the footer: no "Meet you there." capture
    // card, which the shell shows by default everywhere else.
    <BubbaShell active="ambassadors" showCapture={false} pageClassName={pageClassName}>
      {/* Section 1 */}
      <section className="bb-amb-hero">
        <div className="bb-shell">
          <div className="bb-amb-hero-content">
            <p className="bb-eyebrow bb-amb-hero-eyebrow">
              {BUBBA_AMBASSADORS_HERO.eyebrow}
            </p>
            <h1 className="bb-display bb-display--xl bb-amb-hero-title">
              {BUBBA_AMBASSADORS_HERO.title}
            </h1>
            <p className="bb-amb-hero-desc">
              {BUBBA_AMBASSADORS_HERO.description}
            </p>
            <div className="bb-amb-hero-status">
              {/* The export draws this in the line's own colour at 14x11, not
                  as the plum PNG mark — so it is stroked, and inherits. */}
              <Heart className="bb-amb-heart" size={14} strokeWidth={2} aria-hidden="true" />
              <span>{BUBBA_AMBASSADORS_HERO.status}</span>
            </div>
            <p className="bb-amb-hero-login">
              {BUBBA_AMBASSADORS_HERO.loginPrompt}{" "}
              <Link href={BUBBA_AMBASSADORS_HERO.loginHref}>
                {BUBBA_AMBASSADORS_HERO.loginAction}
              </Link>
            </p>
          </div>

          <div className="bb-amb-stats">
            {BUBBA_AMBASSADORS_STATS.map((stat, i) => (
              <div key={i} className="bb-amb-stat-col">
                <div className="bb-amb-stat-inner">
                  {stat.topLabel && (
                    <span
                      className={`bb-amb-stat-top ${
                        stat.isTopLabelGreen ? "bb-amb-stat-top--green" : ""
                      }`}
                    >
                      {stat.topLabel}
                    </span>
                  )}
                  {/* A stat with neither a sub-label nor a top label is a lone
                      line in a box sized by its two-line neighbours, so it
                      needs centring to sit level with them. Currently only
                      "August 12". */}
                  <div
                    className={`bb-amb-stat-value${
                      !stat.valueSub && !stat.topLabel
                        ? " bb-amb-stat-value--centered"
                        : ""
                    }`}
                  >
                    <span className="bb-amb-stat-main">{stat.valueMain}</span>
                    {stat.valueSub && (
                      <span className="bb-amb-stat-sub">{stat.valueSub}</span>
                    )}
                  </div>
                  <p className="bb-amb-stat-bottom">{stat.bottomLabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bb-shell">
        <div className="bb-amb-section-divider"></div>
      </div>

      {/* Section 2 */}
      <BubbaAmbassadorPrizes />

      <section className="bb-amb-timeline-section">
        <div className="bb-shell">
          <h2 className="bb-amb-timeline-eyebrow">{BUBBA_AMBASSADORS_TIMELINE.eyebrow}</h2>
          <div className="bb-amb-timeline-container">
            <div className="bb-amb-timeline-left">
              <div className="bb-amb-timeline-days-lockup">
                <span className="bb-amb-timeline-days-num">{BUBBA_AMBASSADORS_TIMELINE.daysLarge}</span>
                <span className="bb-amb-timeline-days-text">{BUBBA_AMBASSADORS_TIMELINE.daysScript}</span>
              </div>
            </div>
            <div className="bb-amb-timeline-right">
              <h3 className="bb-amb-timeline-title">{BUBBA_AMBASSADORS_TIMELINE.title}</h3>
              <p className="bb-amb-timeline-subtitle">{BUBBA_AMBASSADORS_TIMELINE.subtitle}</p>
              
              <div className="bb-amb-timeline-steps">
                {BUBBA_AMBASSADORS_TIMELINE.steps.map((step, i) => (
                  <div key={i} className="bb-amb-timeline-step">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/images/assets/${step.icon}`} alt="" className="bb-amb-timeline-icon" />
                    {/* Text */}
                    <div className="bb-amb-timeline-step-text">
                      <h4 className="bb-amb-timeline-step-title">{step.title}</h4>
                      <p className="bb-amb-timeline-step-desc">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Final Section: Accordions + Feature + Mock Card --- */}
      <section className="bb-amb-final-section">
        <div className="bb-shell">
          {/* Row 1: Interactive Accordion Cards + Expandable Panels */}
          <BubbaAmbassadorAccordions />

          {/* Row 2: Feature Left + Mock Card Right */}
          <div className="bb-amb-feature-row">

            {/* Left: Copy + Pillars */}
            <div className="bb-amb-feature-left">
              <p className="bb-amb-feature-eyebrow">{BUBBA_AMBASSADORS_FINAL.feature.eyebrow}</p>
              <h2 className="bb-amb-feature-heading">
                {BUBBA_AMBASSADORS_FINAL.feature.heading}{' '}
                <span className="bb-amb-feature-heading--blue">{BUBBA_AMBASSADORS_FINAL.feature.headingHighlight}</span>
              </h2>
              <p className="bb-amb-feature-subtitle">{BUBBA_AMBASSADORS_FINAL.feature.subtitle}</p>

              <div className="bb-amb-pillars">
                {BUBBA_AMBASSADORS_FINAL.feature.pillars.map((p, i) => (
                  <div key={i} className="bb-amb-pillar">
                    <div className={`bb-amb-pillar-icon${i === 1 ? " bb-amb-pillar-icon--highlight" : ""}`}>
                      {p.icon === 'people' && <DualUserIcon className="bb-amb-pillar-svg" />}
                      {p.icon === 'prompts' && <MessageIcon className="bb-amb-pillar-svg" />}
                      {p.icon === 'leaderboard' && <Building01Icon className="bb-amb-pillar-svg" />}
                    </div>
                    <p className="bb-amb-pillar-label">{p.label}</p>
                    <p className="bb-amb-pillar-desc">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Waiting Room Mock Card */}
            <div className="bb-amb-mock-card">
              <div className="bb-amb-mock-header">
                {/* The export's header is the campus label alone — no
                    "WAITING ROOM" line under it. */}
                <p className="bb-amb-mock-campus">{BUBBA_AMBASSADORS_FINAL.mockCard.campus}</p>
                <span className="bb-amb-mock-day">{BUBBA_AMBASSADORS_FINAL.mockCard.day}</span>
              </div>

              {/* Full-bleed in the export (x735..1304 of a card at x729..1308),
                  unlike the inset rule above the CTA. */}
              <div className="bb-amb-mock-divider bb-amb-mock-divider--head" />

              <div className="bb-amb-mock-body">
                <div className="bb-amb-mock-prompt-block">
                  <p className="bb-amb-mock-prompt-label">{BUBBA_AMBASSADORS_FINAL.mockCard.promptLabel}</p>
                  <div className="bb-amb-mock-prompt-row">
                    <p className="bb-amb-mock-prompt-text">{BUBBA_AMBASSADORS_FINAL.mockCard.prompt}</p>
                    {/* Sunset line drawing, cropped out of ui/1x/Asset am1.png
                        — the export does not use the floral table here. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/waitlist/mock-sunset.png" alt="" className="bb-amb-mock-floral" />
                  </div>
                </div>

                <p className="bb-amb-mock-top-label">{BUBBA_AMBASSADORS_FINAL.mockCard.topResponsesLabel}</p>
                <div className="bb-amb-mock-responses">
                  {BUBBA_AMBASSADORS_FINAL.mockCard.responses.map((r, i) => (
                    <div key={i} className="bb-amb-mock-response-row">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="bb-amb-mock-avatar" src={r.avatar} alt="" />
                      <div className="bb-amb-mock-resp-info">
                        <span className="bb-amb-mock-resp-name">{r.name}</span>
                        <div className="bb-amb-mock-resp-bar"/>
                      </div>
                      <div className="bb-amb-mock-resp-likes">
                        <Heart size={14} color="rgba(0,0,0,0.4)" />
                        <span>{r.likes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bb-amb-mock-stats">
                {BUBBA_AMBASSADORS_FINAL.mockCard.stats.map((s, i) => (
                  <div key={i} className="bb-amb-mock-stat">
                    <div className="bb-amb-mock-stat-row">
                      <span className={`bb-amb-mock-stat-value ${i === 0 ? 'bb-amb-mock-stat-value--green' : 'bb-amb-mock-stat-value--blue'}`}>{s.value}</span>
                      {i === 0 && <SparkIcon className="bb-amb-mock-stat-icon" />}
                      {i === 1 && <EditIcon className="bb-amb-mock-stat-icon" />}
                    </div>
                    <span className="bb-amb-mock-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Inset rule at y3387, x773..1264 — the CTA sits on the card's
                  own white below it, not on a tinted band. */}
              <div className="bb-amb-mock-divider bb-amb-mock-divider--foot" />

              <div className="bb-amb-mock-cta">
                <span>{BUBBA_AMBASSADORS_FINAL.mockCard.cta}</span>
                <ArrowRight size={30} color="#111" strokeWidth={1.6} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- Invited ambassadors call to action (ui/1x/Asset am2.png) --- */}
      <section className="bb-amb-invite-section">
        <div className="bb-amb-invite">
          <div className="bb-amb-invite-lead">
            <p className="bb-amb-invite-eyebrow">
              {BUBBA_AMBASSADORS_FINAL.invite.eyebrow}
            </p>
            <h2 className="bb-amb-invite-heading">
              {BUBBA_AMBASSADORS_FINAL.invite.headingLead}
              <strong>{BUBBA_AMBASSADORS_FINAL.invite.headingBold}</strong>
            </h2>
          </div>

          <div className="bb-amb-invite-action">
            <h3 className="bb-amb-invite-title">
              {BUBBA_AMBASSADORS_FINAL.invite.title}
            </h3>
            <p className="bb-amb-invite-body">
              {BUBBA_AMBASSADORS_FINAL.invite.body}
            </p>

            <Link
              href={BUBBA_AMBASSADORS_FINAL.invite.ctaHref}
              className="bb-amb-invite-cta"
            >
              {BUBBA_AMBASSADORS_FINAL.invite.ctaLabel}
              <ArrowRight size={17} strokeWidth={1.9} aria-hidden="true" />
            </Link>

            <p className="bb-amb-invite-or">
              <span>{BUBBA_AMBASSADORS_FINAL.invite.orLabel}</span>
            </p>

            <p className="bb-amb-invite-alt">
              {BUBBA_AMBASSADORS_FINAL.invite.altPrompt}
            </p>
            <a
              className="bb-amb-invite-alt-link"
              href={BUBBA_AMBASSADORS_FINAL.invite.altHref}
              target="_blank"
              rel="noreferrer"
            >
              {BUBBA_AMBASSADORS_FINAL.invite.altLabel}
              <ArrowRight size={19} strokeWidth={1.9} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

    </BubbaShell>
  );
}
