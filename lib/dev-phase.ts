"use client";

import { useEffect, useState } from "react";

import { getHubPhase, type HubCompetition, type HubPhase } from "@/lib/ambassador-hub";

/**
 * Development-only phase override for the ambassador hub.
 *
 * The competition's real phase is derived from dates the API controls, and
 * three of the designed states cannot currently be produced at all — the
 * backend has no `downloadOpensAt` column, archived competitions are filtered
 * out of every query, and there is no pre-announcement phase. Overriding on the
 * client is the only way to review those designs, and it touches no data.
 *
 * Driven by `?devPhase=` so a state can be linked to and survives a refresh.
 */

export const DEV_PHASES: HubPhase[] = [
  "upcoming",
  "inviting",
  "inviteEnded",
  "download",
  "finished",
  "results",
];

export const DEV_PHASE_LABELS: Record<HubPhase, string> = {
  upcoming: "Competition starts",
  inviting: "Competition ends (active)",
  inviteEnded: "Invitation period ended",
  download: "Download period active",
  finished: "You finished",
  results: "Final results / winners",
};

export const devToolsEnabled = process.env.NODE_ENV !== "production";

const PARAM = "devPhase";

const STORE_KEY = "bea_dev_phase";

function isPhase(value: string | null): value is HubPhase {
  return Boolean(value) && (DEV_PHASES as string[]).includes(value as string);
}

/**
 * The URL wins, but the choice is mirrored into sessionStorage so it survives
 * navigation — the sidebar links carry no query string, and losing the preview
 * every time you moved between pages made the switcher useless in practice.
 */
function readOverride(): HubPhase | null {
  if (!devToolsEnabled || typeof window === "undefined") return null;

  const fromUrl = new URLSearchParams(window.location.search).get(PARAM);
  if (isPhase(fromUrl)) return fromUrl;

  try {
    const stored = window.sessionStorage.getItem(STORE_KEY);
    if (isPhase(stored)) return stored;
  } catch {
    // Private browsing and blocked site data both throw; the URL still works.
  }

  return null;
}

/** Null when no override is set, so callers can tell "real" from "forced". */
export function useDevPhase(): HubPhase | null {
  const [override, setOverride] = useState<HubPhase | null>(null);

  useEffect(() => {
    // Read after mount: the server render has no access to the query string,
    // and reading during render would desync hydration.
    setOverride(readOverride());

    const sync = () => setOverride(readOverride());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  return override;
}

/** The phase the hub should render — the override when one is set. */
export function useHubPhase(competition: HubCompetition, now?: number): HubPhase {
  const override = useDevPhase();
  return override ?? getHubPhase(competition, now);
}

export function setDevPhase(phase: HubPhase | null) {
  if (typeof window === "undefined") return;

  try {
    if (phase) {
      window.sessionStorage.setItem(STORE_KEY, phase);
    } else {
      window.sessionStorage.removeItem(STORE_KEY);
    }
  } catch {
    // Storage unavailable — the URL below still carries the choice.
  }

  const url = new URL(window.location.href);
  if (phase) {
    url.searchParams.set(PARAM, phase);
  } else {
    url.searchParams.delete(PARAM);
  }
  window.history.pushState({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
