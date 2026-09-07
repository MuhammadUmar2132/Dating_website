const STORAGE_KEY = "bea_referral_code";

/**
 * How long a clicked referral link keeps earning its owner credit. Referral
 * links get pasted into group chats and opened days later, so the code has to
 * outlive the tab it was opened in — but not forever, or a link clicked last
 * year still pays out.
 */
const ATTRIBUTION_WINDOW_DAYS = 30;

type StoredReferral = {
  code: string;
  savedAt: number;
};

/** Records the code that brought this visitor in. Last click wins. */
export function persistReferralCode(code: string) {
  if (typeof window === "undefined") {
    return;
  }

  const trimmed = code.trim();
  if (!trimmed) {
    return;
  }

  const entry: StoredReferral = { code: trimmed, savedAt: Date.now() };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
  } catch {
    // Private browsing and blocked site data both throw here. Attribution
    // falls back to whatever is already in the redux form for this session.
  }
}

/** Returns the stored code, or null if there is none or it has expired. */
export function readReferralCode(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredReferral;
    if (typeof parsed.code !== "string" || !parsed.code) {
      return null;
    }
    if (typeof parsed.savedAt !== "number") {
      return null;
    }

    const ageMs = Date.now() - parsed.savedAt;
    if (ageMs > ATTRIBUTION_WINDOW_DAYS * 24 * 60 * 60 * 1000) {
      clearReferralCode();
      return null;
    }

    return parsed.code;
  } catch {
    return null;
  }
}

/**
 * Called once the referral has been spent on a successful join, so a second
 * signup from the same browser is not credited to the same referrer twice.
 */
export function clearReferralCode() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do — the entry expires on its own.
  }
}
