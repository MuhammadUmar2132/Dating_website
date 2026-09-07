import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BUBBA_WAITING_ROOM_PAGE } from "@/lib/bubba-content";

export function BubbaWaitingRoomCtaBanner() {
  const { cta } = BUBBA_WAITING_ROOM_PAGE;

  return (
    <div className="bb-wrp-cta-banner" aria-labelledby="bb-wrp-cta-title">
      <div className="bb-wrp-cta-copy">
        <h2 id="bb-wrp-cta-title" className="bb-wrp-cta-title">
          {cta.title}
        </h2>
        <p className="bb-wrp-cta-subtitle">{cta.subtitle}</p>
      </div>

      <p className="bb-wrp-cta-script" aria-hidden="true">
        <span className="bb-wrp-cta-script-line">{cta.script.line1}</span>
        <span className="bb-wrp-cta-script-line">{cta.script.line2}</span>
      </p>

      <div className="bb-wrp-cta-btn-wrap">
        <Link href={cta.button.href} className="bb-wrp-cta-btn">
          {cta.button.label}
          <ArrowRight size={20} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
