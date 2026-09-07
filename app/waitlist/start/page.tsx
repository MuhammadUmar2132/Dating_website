import { redirect } from "next/navigation";

import { joinStepHref } from "@/lib/join";

/**
 * The intro screen is out of the flow — signup opens straight on the first
 * collecting step. Kept as a redirect rather than deleted so the "Join
 * waitlist" links scattered across the marketing pages keep working.
 */
export default function JoinStartPage() {
  redirect(joinStepHref(0));
}
