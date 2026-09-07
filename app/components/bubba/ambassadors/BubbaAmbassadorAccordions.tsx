import { ChevronDown, Info, Target } from "lucide-react";

import { BUBBA_AMBASSADORS_FINAL } from "@/lib/bubba-content";

/**
 * The two summary cards and the HOW YOU EARN POINTS panel below them.
 *
 * ui/1x/Asset am2.png draws the panel as a full-width block *below both cards*,
 * not a dropdown inside the left one, carrying both halves of the explanation
 * — the simple rule and the window — plus the IMPORTANT callout.
 *
 * The panel is always rendered, so neither card toggles anything and both are
 * plain headers. Their chevrons are kept purely as decoration, in the
 * directions am2 draws them: up on the left (its opened state), down on the
 * right. Nothing here needs state, so this stays a server component.
 */
export function BubbaAmbassadorAccordions() {
  const { points } = BUBBA_AMBASSADORS_FINAL;

  return (
    <div className="bb-amb-accordion-wrapper">
      <div className="bb-amb-acc-grid">
        <div className="bb-amb-acc-box">
          <div className="bb-amb-acc-box-header">
            <div className="bb-amb-acc-card-left">
              <div className="bb-amb-acc-icon-wrap">
                {/* The export draws a 27px outline mark here, not a filled
                    two-person glyph: an info circle on the left card and a
                    target on the right. */}
                <Info className="bb-amb-acc-icon" size={27} strokeWidth={1.5} />
              </div>
              <div className="bb-amb-acc-box-text">
                <h3 className="bb-amb-acc-title">How points work</h3>
                <p className="bb-amb-acc-subtitle">
                  Learn how points are earned and
                  <br />
                  what counts towards your score.
                </p>
              </div>
            </div>
            <ChevronDown
              className="bb-amb-acc-chevron bb-amb-acc-chevron--open"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* No panel yet: the export never draws this card open, and there is no
            mission copy to put behind it. It stays as the pair's second card,
            and becomes a real control again the day that copy exists. */}
        <div className="bb-amb-acc-box">
          <div className="bb-amb-acc-box-header">
            <div className="bb-amb-acc-card-left">
              <div className="bb-amb-acc-icon-wrap">
                <Target className="bb-amb-acc-icon" size={27} strokeWidth={1.5} />
              </div>
              <div className="bb-amb-acc-box-text">
                <h3 className="bb-amb-acc-title">Why we&apos;re doing this</h3>
                <p className="bb-amb-acc-subtitle">
                  Learn about our mission
                  <br />
                  and why we&apos;re so excited.
                </p>
              </div>
            </div>
            <ChevronDown className="bb-amb-acc-chevron" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="bb-amb-points">
        <div className="bb-amb-points-head">
          <span className="bb-amb-points-rule" aria-hidden="true" />
          <h3 className="bb-amb-points-title">{points.sectionTitle}</h3>
          <span className="bb-amb-points-rule" aria-hidden="true" />
        </div>

        <div className="bb-amb-points-grid">
          <section className="bb-amb-points-col bb-amb-points-col--rule">
            <p className="bb-amb-detail-eyebrow">{points.rule.eyebrow}</p>
            <div className="bb-amb-points-split">
              {/* Cropped out of ui/1x/Asset am2.png — the hand-drawn peak has
                  no equivalent in public/. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="bb-amb-mountain-art"
                src="/waitlist/amb-mountain.png"
                alt=""
                aria-hidden="true"
              />
              <div className="bb-amb-detail-copy">
                <h4 className="bb-amb-detail-title">{points.rule.heading}</h4>
                <span className="bb-amb-detail-line" aria-hidden="true" />
                <p className="bb-amb-detail-desc">{points.rule.body}</p>
              </div>
            </div>
          </section>

          <section className="bb-amb-points-col bb-amb-points-col--window">
            <p className="bb-amb-detail-eyebrow">{points.window.eyebrow}</p>
            <h4 className="bb-amb-detail-title">{points.window.heading}</h4>
            <span className="bb-amb-detail-line" aria-hidden="true" />
            <p className="bb-amb-detail-desc">{points.window.body}</p>

            <div className="bb-amb-comp">
              <div className="bb-amb-comp-legend">
                <span className="bb-amb-comp-leg bb-amb-comp-leg--start">
                  <strong>{points.window.startLabel}</strong>
                  <span>{points.window.startSub}</span>
                </span>
                <span className="bb-amb-comp-leg bb-amb-comp-leg--end">
                  <strong>{points.window.endLabel}</strong>
                  <span>{points.window.endSub}</span>
                </span>
              </div>

              {/* Three tracks, each closing on a dot of its own colour, with
                  the flag on the launch dot at 50.9% of the bar. */}
              <div className="bb-amb-comp-bar" aria-hidden="true">
                <span className="bb-amb-comp-track bb-amb-comp-track--green" />
                <span className="bb-amb-comp-track bb-amb-comp-track--black" />
                <span className="bb-amb-comp-track bb-amb-comp-track--blue" />
                <span className="bb-amb-comp-dot bb-amb-comp-dot--start" />
                <span className="bb-amb-comp-dot bb-amb-comp-dot--green-end" />
                <span className="bb-amb-comp-dot bb-amb-comp-dot--launch" />
                <span className="bb-amb-comp-dot bb-amb-comp-dot--blue-end" />
                <span className="bb-amb-comp-flag" />
              </div>

              <p className="bb-amb-comp-launch">{points.window.launchLabel}</p>
            </div>
          </section>
        </div>

        <aside className="bb-amb-important">
          {/* The export's dashed frame is 12-on/12-off with 12px rounded
              corners. A CSS dashed border picks its own ~3px dash, and the
              four gradient edges it replaced could not round a corner, so the
              frame is a stroked rect. No viewBox, so its user units are CSS
              pixels and nothing scales. */}
          <svg className="bb-amb-important-frame" aria-hidden="true">
            <rect />
          </svg>
          <div className="bb-amb-important-copy">
            <p className="bb-amb-important-eyebrow">{points.important.eyebrow}</p>
            <p className="bb-amb-important-head">{points.important.headline}</p>
            <p className="bb-amb-important-body">{points.important.body}</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="bb-amb-important-art"
            src="/waitlist/amb-important.png"
            alt=""
            aria-hidden="true"
          />
        </aside>
      </div>
    </div>
  );
}
