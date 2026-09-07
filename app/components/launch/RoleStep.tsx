"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Banknote, Gem } from "lucide-react";

import { SCHOOL_STEP, type SchoolIcon } from "@/lib/launch";
import { useResendAmbassadorInviteMutation } from "@/features/api/apiSlice";
import { markStepReached } from "@/lib/onboarding-progress";

/* ui/SVG/community_1.svg, inlined. The source bakes in fill #1f3c29; it is
   drawn with currentColor here so it takes its colour from .launch-role-icon
   like the two lucide glyphs beside it. Rendered at 19px to match them — the
   >=769 rule in launch.css scales all three to 26px. */
function CommunityGlyph() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 26 26"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M.4,12.8c.44.33,1.07.24,1.4-.2h0c2.15-2.87,6.23-3.45,9.1-1.3.49.37.93.81,1.3,1.3.33.44.96.53,1.4.2.08-.06.14-.12.2-.2h0c2.15-2.87,6.23-3.45,9.1-1.3.49.37.93.81,1.3,1.3.33.44.96.53,1.4.2s.53-.96.2-1.4c-.89-1.19-2.07-2.12-3.42-2.71,2.04-1.86,2.18-5.02.32-7.06-1.86-2.04-5.02-2.18-7.06-.32-2.04,1.86-2.18,5.02-.32,7.06.1.11.21.22.32.32-.98.42-1.87,1.03-2.62,1.79-.75-.76-1.64-1.36-2.62-1.79,2.04-1.86,2.18-5.02.32-7.06C8.84-.41,5.68-.55,3.64,1.31c-2.04,1.86-2.18,5.02-.32,7.06.1.11.21.22.32.32-1.36.59-2.55,1.52-3.44,2.71-.33.44-.24,1.07.2,1.4h0ZM19,2c1.66,0,3,1.34,3,3s-1.34,3-3,3-3-1.34-3-3,1.34-3,3-3ZM7,2c1.66,0,3,1.34,3,3s-1.34,3-3,3-3-1.34-3-3,1.34-3,3-3ZM22.38,21.69c2.04-1.86,2.18-5.02.32-7.06-1.86-2.04-5.02-2.18-7.06-.32-2.04,1.86-2.18,5.02-.32,7.06.1.11.21.22.32.32-.98.42-1.87,1.03-2.62,1.79-.75-.76-1.64-1.36-2.62-1.79,2.04-1.86,2.18-5.02.32-7.06-1.86-2.04-5.02-2.18-7.06-.32-2.04,1.86-2.18,5.02-.32,7.06.1.11.21.22.32.32-1.36.59-2.55,1.52-3.44,2.71-.33.44-.24,1.07.2,1.4.44.33,1.07.24,1.4-.2,2.15-2.87,6.23-3.45,9.1-1.3.49.37.93.81,1.3,1.3.33.44.96.53,1.4.2.08-.06.14-.12.2-.2h0c2.15-2.87,6.23-3.45,9.1-1.3.49.37.93.81,1.3,1.3.33.44.96.53,1.4.2s.53-.96.2-1.4c-.89-1.19-2.07-2.12-3.42-2.71ZM7,15c1.66,0,3,1.34,3,3s-1.34,3-3,3-3-1.34-3-3,1.34-3,3-3ZM19,15c1.66,0,3,1.34,3,3s-1.34,3-3,3-3-1.34-3-3,1.34-3,3-3Z" />
    </svg>
  );
}

function SchoolIconGlyph({ icon }: { icon: SchoolIcon }) {
  switch (icon) {
    case "early-access":
      return <Gem size={19} strokeWidth={1.6} />;
    case "rewards":
      return <Banknote size={19} strokeWidth={1.6} />;
    case "community":
      return <CommunityGlyph />;
  }
}

export function RoleStep() {
  const router = useRouter();
  const { eyebrow, titleLines, subtitle, items, cta, footnote } = SCHOOL_STEP;
  const [resendInvite] = useResendAmbassadorInviteMutation();
  const [navigating, setNavigating] = useState(false);

  // Continue sends the verification email (link carries next=account, so
  // clicking it drops the person on Account), then moves to Verify Email.
  // Wait for the new token so this tab stays in sync with the email.
  const handleContinue = () => {
    if (navigating) return;
    setNavigating(true);

    markStepReached("verify-email");

    const token = sessionStorage.getItem("ambassador_onboarding_token") ?? "";
    void (async () => {
      if (token) {
        try {
          const resent = await resendInvite(token).unwrap();
          if (resent.token) sessionStorage.setItem("ambassador_onboarding_token", resent.token);
        } catch {
          // Swallow — Verify Email's own "Resend" link covers a failed send.
        }
      }
      router.push(cta.href);
    })();
  };

  return (
    <section className="launch-step launch-step--role">
      <div className="launch-step-inner">
        <p className="launch-eyebrow">{eyebrow}</p>
        <h1 className="launch-title font-canela onboarding-heading">
          {titleLines.map((line, i) => (
            <span key={line}>
              {line}
              {i < titleLines.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p className="launch-subtitle">{subtitle}</p>

        <div className="launch-role-items">
          {items.map((item) => (
            <div key={item.title} className="launch-role-item">
              <span className="launch-role-icon">
                <SchoolIconGlyph icon={item.icon} />
              </span>
              <div>
                <p className="launch-role-title">{item.title}</p>
                <p className="launch-role-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button type="button" className="launch-cta cursor-pointer" onClick={handleContinue} disabled={navigating}>
          <span>{cta.label}</span>
          <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
        </button>

        <p className="launch-footnote">
          <Link href={footnote.href}>{footnote.label}</Link>
        </p>
      </div>
    </section>
  );
}