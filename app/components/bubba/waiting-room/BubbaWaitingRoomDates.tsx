import { Camera, Quote, Sparkles } from "lucide-react";

import { BUBBA_WAITING_ROOM_PAGE } from "@/lib/bubba-content";

const DAY_ICONS = {
  prompt: Quote,
  game: Sparkles,
  snap: Camera,
} as const;

const DAY_LABELS = {
  prompt: "Prompt",
  game: "Game",
  snap: "Snap",
} as const;

export function BubbaWaitingRoomDates() {
  const { dates } = BUBBA_WAITING_ROOM_PAGE;

  return (
    <section className="bb-wrp-dates" aria-labelledby="bb-wrp-dates-title">
      <div className="bb-shell">
        <div className="bb-wrp-dates-card">
          <div className="bb-wrp-dates-copy">
            <p className="bb-wrp-dates-eyebrow">{dates.eyebrow}</p>
            <h2 id="bb-wrp-dates-title" className="bb-wrp-dates-title">
              {dates.title}
            </h2>
            <p className="bb-wrp-dates-lede">{dates.description}</p>
          </div>

          <div className="bb-wrp-dates-schedule" role="list">
            {dates.days.map((day) => {
              const isMystery = day.type === "mystery";
              const Icon = isMystery ? null : DAY_ICONS[day.type];

              return (
                <article
                  key={day.number}
                  className="bb-wrp-dates-day"
                  role="listitem"
                  aria-label={
                    isMystery
                      ? `Day ${day.number}, ${day.weekday} ${day.date}, surprise activity`
                      : `Day ${day.number}, ${day.weekday} ${day.date}, ${DAY_LABELS[day.type]}`
                  }
                >
                  <header className="bb-wrp-dates-day-head">
                    <p className="bb-wrp-dates-day-num">Day {day.number}</p>
                    <p className="bb-wrp-dates-day-meta">
                      {day.weekday} {day.date}
                    </p>
                  </header>

                  <div className="bb-wrp-dates-day-center">
                    {isMystery ? (
                      <span className="bb-wrp-dates-mystery" aria-hidden="true">
                        ???
                      </span>
                    ) : (
                      <span
                        className={`bb-wrp-dates-icon bb-wrp-dates-icon--${day.type}`}
                        aria-hidden="true"
                      >
                        {Icon ? <Icon size={22} strokeWidth={2} /> : null}
                      </span>
                    )}
                  </div>

                  <footer className="bb-wrp-dates-day-foot">
                    {!isMystery && (
                      <p className="bb-wrp-dates-day-type">
                        {DAY_LABELS[day.type]}
                      </p>
                    )}
                  </footer>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
