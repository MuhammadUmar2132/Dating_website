import {
  CalendarHeart,
  GraduationCap,
  MessageSquare,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

import { BUBBA_WAITING_ROOM_PAGE } from "@/lib/bubba-content";

const FEATURE_ICONS = {
  prompts: MessageSquare,
  leaderboard: Users,
  prizes: Trophy,
} as const;

const STAT_ICONS = {
  campuses: GraduationCap,
  ambassadors: Sparkles,
  days: CalendarHeart,
} as const;

export function BubbaWaitingRoomHero() {
  const { hero } = BUBBA_WAITING_ROOM_PAGE;

  return (
    <section
      className="bb-wrp-hero"
      aria-labelledby="bb-wrp-hero-title"
    >
      <div className="bb-shell">
        <div className="bb-wrp-hero-card">
          <div className="bb-wrp-hero-copy">
            <div className="bb-wrp-hero-head">
              <div className="bb-wrp-hero-title-wrap">
                <p className="bb-wrp-hero-tag">{hero.tag}</p>
                <h1 id="bb-wrp-hero-title" className="bb-wrp-hero-title">
                  <span className="bb-wrp-hero-title-line bb-wrp-hero-title-line--the">
                    {hero.title.the}
                  </span>
                  <span className="bb-wrp-hero-title-line bb-wrp-hero-title-line--waiting">
                    {hero.title.waiting}
                  </span>
                  <span className="bb-wrp-hero-title-line bb-wrp-hero-title-line--room">
                    {hero.title.room}
                  </span>
                </h1>
              </div>
            </div>

            <div className="bb-wrp-hero-dates-col">
              <p className="bb-wrp-hero-experience">
                {hero.experience.prefix}{" "}
                <span className="bb-wrp-hero-experience-highlight">
                  {hero.experience.highlight}
                </span>{" "}
                {hero.experience.suffix}
              </p>
              <p className="bb-wrp-hero-date">{hero.dates}</p>
              <p className="bb-wrp-hero-date-sub">
                <span className="bb-wrp-hero-date-sub-mark">{hero.datesSub}</span>
              </p>
            </div>
          </div>

          <div className="bb-wrp-hero-aside">
            <div className="bb-wrp-hero-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero.image} alt={hero.imageAlt} />
            </div>

            <div className="bb-wrp-hero-features-col">
              <ul className="bb-wrp-hero-features">
                {hero.features.map((feature) => {
                  const Icon = FEATURE_ICONS[feature.key];

                  return (
                    <li key={feature.key} className="bb-wrp-hero-feature">
                      <span className="bb-wrp-hero-feature-icon" aria-hidden="true">
                        <Icon size={18} strokeWidth={1.55} />
                      </span>
                      <span className="bb-wrp-hero-feature-text">
                        <span className="bb-wrp-hero-feature-mark">
                          {feature.label}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="bb-wrp-hero-stats">
            {hero.stats.map((stat) => {
              const Icon = STAT_ICONS[stat.key];

              return (
                <div key={stat.key} className="bb-wrp-hero-stat">
                  <span className="bb-wrp-hero-stat-icon" aria-hidden="true">
                    <Icon strokeWidth={1.35} />
                  </span>
                  <p className="bb-wrp-hero-stat-text">
                    <span className="bb-wrp-hero-stat-value">{stat.value}</span>
                    <span className="bb-wrp-hero-stat-label">{stat.label}</span>
                  </p>
                </div>
              );
            })}

            <div className="bb-wrp-hero-stat bb-wrp-hero-stat--script">
              <p className="bb-wrp-hero-script">
                <span className="bb-wrp-hero-script-line">{hero.script.line1}</span>
                <span className="bb-wrp-hero-script-line">{hero.script.line2}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
