import type { WaitlistFormState } from "@/features/waitlist/waitlist.types";
import { schoolRequired } from "@/lib/join";
import type { WaitlistStepArtboardId } from "@/lib/waitlist";

export function validateWaitlistStep(
  step: WaitlistStepArtboardId,
  form: WaitlistFormState,
): string | null {
  switch (step) {
    case "3":
      if (form.skippedMarket) {
        return null;
      }
      if (!form.marketId || !form.marketName) {
        return "Please select a market to continue.";
      }
      return null;
    case "4":
      if (!form.fullName.trim()) {
        return "First name is required.";
      }
      /* Age is optional — no step collects it since the flow reduced to name,
         email and city. Still validated when something does supply it. */
      if (form.age.trim()) {
        const age = Number(form.age);
        if (Number.isNaN(age) || age < 16 || age > 100) {
          return "Enter a valid age between 16 and 100.";
        }
      }
      return null;
    case "5":
      if (!schoolRequired(form)) {
        return null;
      }
      if (!form.schoolId || !form.schoolName) {
        return "Select a school, choose “My school isn't listed”, or tap “None of these schools”.";
      }
      return null;
    case "7": {
      if (!form.email.trim()) {
        return "Email is required.";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        return "Enter a valid email address.";
      }
      return null;
    }
    default:
      return null;
  }
}

/* Market, name/age, email. "5" is the school step, which is out of the flow —
   leaving it here made the city step demand a school nobody can pick. */
const JOIN_STEPS: WaitlistStepArtboardId[] = ["3", "4", "7"];

export function validateWaitlistFormForJoin(
  form: WaitlistFormState,
): string | null {
  for (const step of JOIN_STEPS) {
    const error = validateWaitlistStep(step, form);
    if (error) {
      return error;
    }
  }

  if (!form.marketId && !form.skippedMarket) {
    return "Please select a market to continue.";
  }

  return null;
}

export function buildJoinWaitlistPayload(form: WaitlistFormState) {
  return {
    email: form.email.trim(),
    fullName: form.fullName.trim(),
    /* Omitted rather than sent as 0 — the API takes age as optional but
       rejects anything under 13. */
    ...(form.age.trim() ? { age: Number(form.age) } : {}),
    ...(form.marketId ? { marketId: form.marketId } : {}),
    schoolId: form.notInSchool ? undefined : (form.schoolId ?? undefined),
    referralCode: form.referralCode ?? undefined,
  };
}
