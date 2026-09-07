import { Calendar, Gift, Star, Sun, Users } from "lucide-react";

import { BUBBA_WAITING_ROOM_PAGE } from "@/lib/bubba-content";

const STEP_ICONS = {
  prompts: Sun,
  invite: Users,
  points: Star,
  prizes: Gift,
  launch: Calendar,
} as const;

export function BubbaWaitingRoomHowItWorks() {
  const { howItWorks } = BUBBA_WAITING_ROOM_PAGE;

  return (
    <section
      className="bb-wrp-how"
      aria-labelledby="bb-wrp-how-title"
    >
      <div className="bb-shell">
        <h2 id="bb-wrp-how-title" className="bb-wrp-how-eyebrow">
          {howItWorks.eyebrow}
        </h2>

        <ul className="bb-wrp-how-grid">
          {howItWorks.steps.map((step) => {
            const Icon = STEP_ICONS[step.key];

            return (
              <li key={step.key} className="bb-wrp-how-step">
                <span className="bb-wrp-how-step-icon" aria-hidden="true">
                  <Icon size={28} strokeWidth={1.5} />
                </span>
                <h3 className="bb-wrp-how-step-title">{step.title}</h3>
                <p className="bb-wrp-how-step-body">
                  {step.body.map((line) => (
                    <span key={line} className="bb-wrp-how-step-line">
                      {line}
                    </span>
                  ))}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
