"use client";

import { updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { JoinShell } from "./JoinShell";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * First step, per artboard 7-07: first name and email together under "Join the
 * waitlist". Age moved out with the campus and ambassador steps — nothing in
 * the current flow collects it, so the field went with them.
 */
export function JoinBasics() {
  const dispatch = useAppDispatch();
  const form = useAppSelector((s) => s.waitlist.form);

  const email = form.email.trim();
  const emailOk = EMAIL_PATTERN.test(email);
  const nameOk = form.fullName.trim().length > 0;

  return (
    <JoinShell
      slug="basics"
      ctaLabel="Join the waitlist"
      canContinue={nameOk && emailOk}
    >
      <label className="jn-field" htmlFor="jn-first-name">
        <span className="jn-field-label">First name</span>
        <input
          id="jn-first-name"
          className="jn-input"
          type="text"
          autoComplete="given-name"
          placeholder="First name"
          value={form.fullName}
          onChange={(e) => dispatch(updateWaitlistForm({ fullName: e.target.value }))}
        />
      </label>

      <label className="jn-field jn-field--second" htmlFor="jn-email">
        <span className="jn-field-label">Email</span>
        <input
          id="jn-email"
          className="jn-input"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={(e) => dispatch(updateWaitlistForm({ email: e.target.value }))}
        />
      </label>

      {email !== "" && !emailOk ? (
        <p className="jn-hint">That address doesn&apos;t look right. Check it and try again.</p>
      ) : null}

      <p className="jn-reassure">
        <svg width="15" height="14" viewBox="0 0 24 22" fill="none" aria-hidden="true">
          <path
            d="M12 20.5S2.5 14.6 2.5 8.2A5.2 5.2 0 0 1 12 5.3a5.2 5.2 0 0 1 9.5 2.9c0 6.4-9.5 12.3-9.5 12.3Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        We&apos;ll never share your email.
      </p>
    </JoinShell>
  );
}
