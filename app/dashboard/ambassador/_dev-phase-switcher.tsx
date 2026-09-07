"use client";

import { FlaskConical, X } from "lucide-react";

import {
  DEV_PHASES,
  DEV_PHASE_LABELS,
  devToolsEnabled,
  setDevPhase,
  useDevPhase,
} from "@/lib/dev-phase";

/**
 * Development-only control for previewing every ambassador dashboard state.
 * Renders nothing in a production build.
 */
export function DevPhaseSwitcher() {
  const override = useDevPhase();
  if (!devToolsEnabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] print:hidden">
      <div className="flex items-center gap-2 rounded-full bg-[#14312b] pl-3 pr-2 py-2 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)]">
        <FlaskConical className="size-4 text-white/70 shrink-0" strokeWidth={1.8} aria-hidden />

        <label className="sr-only" htmlFor="dev-phase">
          Preview competition state
        </label>
        <select
          id="dev-phase"
          value={override ?? ""}
          onChange={(event) => setDevPhase((event.target.value || null) as never)}
          className="bg-transparent text-white font-lato text-[12px] font-semibold pr-1 focus:outline-none cursor-pointer"
        >
          <option value="" className="text-black">
            Live state
          </option>
          {DEV_PHASES.map((phase) => (
            <option key={phase} value={phase} className="text-black">
              {DEV_PHASE_LABELS[phase]}
            </option>
          ))}
        </select>

        {override ? (
          <button
            type="button"
            onClick={() => setDevPhase(null)}
            aria-label="Clear preview state"
            className="rounded-full p-1 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="size-3.5" strokeWidth={2.2} aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  );
}
