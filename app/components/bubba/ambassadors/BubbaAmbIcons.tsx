/**
 * Icons extracted from the Illustrator source, stored in
 * public/images/icons/ and inlined here as components.
 *
 * Inlined rather than <img src="/images/icons/*.svg"> because these are tinted
 * per-context (green, blue, ink) — fill="currentColor" lets CSS `color` drive
 * them, which an <img> cannot do. It also avoids a network request each.
 *
 * Two things are normalised from the raw exports:
 *   - class="cls-1" is dropped. It pointed at an empty <defs>, so the paths
 *     would have rendered solid black and ignored `color`.
 *   - fill="currentColor" is added; the exports declare no fill at all.
 *
 * Each viewBox is preserved exactly as exported, so proportions are identical
 * to the design. They are NOT uniform — see the ratios noted per icon — so
 * size these by height (or width) and let the other axis stay `auto`. Setting
 * both distorts them. SparkIcon is the extreme case at 0.73:1.
 */

type IconProps = { className?: string };

/** INDIVIDUAL prize tier. viewBox 0 0 26.03 25.03 — 1.04:1 */
export function IndividualIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 26.03 25.03"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M25.88,23.5a14.92,14.92,0,0,0-8.26-6.77,9,9,0,1,0-9.21,0A14.88,14.88,0,0,0,.15,23.5a1,1,0,1,0,1.7,1.05l0-.05a12.79,12.79,0,0,1,22.27,0,1,1,0,1,0,1.75-.95S25.89,23.52,25.88,23.5ZM6,9a7,7,0,1,1,7,7A7,7,0,0,1,6,9Z" />
    </svg>
  );
}

/** MARKET prize tier. viewBox 0 0 30 24 — 1.25:1 */
export function BuildingsIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 30 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M29,22H28V7a1,1,0,0,0-1-1H19a1,1,0,0,0-1,1v5H12V1a1,1,0,0,0-1-1H3A1,1,0,0,0,2,1V22H1a1,1,0,0,0,0,2H29a1,1,0,0,0,0-2ZM20,8h6V22H20Zm-2,6v8H12V14ZM4,2h6V22H4ZM8,5V7A1,1,0,0,1,6,7V5A1,1,0,0,1,8,5Zm0,6v2a1,1,0,0,1-2,0V11a1,1,0,0,1,2,0Zm0,6v2a1,1,0,0,1-2,0V17a1,1,0,0,1,2,0Zm6,2V17a1,1,0,0,1,2,0v2a1,1,0,0,1-2,0Zm8,0V17a1,1,0,0,1,2,0v2a1,1,0,0,1-2,0Zm0-6V11a1,1,0,0,1,2,0v2a1,1,0,0,1-2,0Z" />
    </svg>
  );
}

/** LIVE LEADERBOARD pillar (podium). viewBox 0 0 30 22 — 1.36:1 */
export function Building01Icon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 30 22"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M13.05,7.82a1,1,0,0,1,.63-1.27h0l1.5-.5a1,1,0,0,1,1.27.63A1.19,1.19,0,0,1,16.5,7v5a1,1,0,0,1-2,0V8.39l-.18.06a1,1,0,0,1-1.27-.63ZM30,21a1,1,0,0,1-1,1H1a1,1,0,0,1,0-2H2V8A2,2,0,0,1,4,6H9V2a2,2,0,0,1,2-2h8a2,2,0,0,1,2,2v9h5a2,2,0,0,1,2,2v7h1A1,1,0,0,1,30,21Zm-9-8v7h5V13ZM11,20h8V2H11ZM4,20H9V8H4Z" />
    </svg>
  );
}

/** NATIONAL prize tier. viewBox 0 0 26 26 — 1.00:1 */
export function GlobeIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 26 26"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M13,0A13,13,0,1,0,26,13,13,13,0,0,0,13,0ZM24,13a11,11,0,0,1-.8,4.12l-5.59-3.44a2,2,0,0,0-.78-.28L14,13a2,2,0,0,0-2,1H10.89l-.48-1A2,2,0,0,0,9,11.93l-1-.21L9,10h2.09a2,2,0,0,0,1-.25L13.6,8.9A2,2,0,0,0,14,8.64l3.36-3.05a2,2,0,0,0,.41-2.45l-.05-.08A11,11,0,0,1,24,13ZM14.91,2.17,16,4.11l-3.36,3L11.11,8H9A2,2,0,0,0,7.28,9L6.19,10.9,4.92,7.52,6.29,4.29a11,11,0,0,1,8.63-2.13ZM2,13A10.94,10.94,0,0,1,3.07,8.27l1.42,3.79a2,2,0,0,0,1.45,1.25l2.68.58.47,1A2,2,0,0,0,10.89,16h.19l-.91,2a2,2,0,0,0,.36,2.17l0,0L13,22.74,12.76,24A11,11,0,0,1,2,13ZM14.82,23.85l.14-.73a2,2,0,0,0-.5-1.74h0L12,18.84,13.71,15l2.85.39,5.72,3.51A11,11,0,0,1,14.82,23.85Z" />
    </svg>
  );
}

/** “10 markets” stat. viewBox 0 0 17.2 21.89 — 0.79:1 */
export function LocationIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 17.2 21.89"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8.6,4.69A3.91,3.91,0,1,0,12.51,8.6,3.91,3.91,0,0,0,8.6,4.69Zm0,6.25A2.35,2.35,0,1,1,10.94,8.6,2.35,2.35,0,0,1,8.6,10.94ZM8.6,0A8.61,8.61,0,0,0,0,8.6C0,11.67,1.42,14.92,4.1,18a25.64,25.64,0,0,0,4.05,3.74.78.78,0,0,0,.9,0,25.14,25.14,0,0,0,4-3.74c2.69-3.09,4.11-6.34,4.11-9.41A8.61,8.61,0,0,0,8.6,0Zm0,20.13c-1.62-1.27-7-5.94-7-11.53a7,7,0,0,1,14.08,0C15.64,14.19,10.21,18.86,8.6,20.13Z" />
    </svg>
  );
}

/** “100 schools” stat. viewBox 0 0 25.02 21.89 — 1.14:1 */
export function EducationIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 25.02 21.89"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M24.6,6.35,12.88.09a.81.81,0,0,0-.74,0L.41,6.35A.78.78,0,0,0,.09,7.4a.92.92,0,0,0,.32.33L3.13,9.17V13.9a1.6,1.6,0,0,0,.39,1,11.82,11.82,0,0,0,9,3.81,12.56,12.56,0,0,0,4.69-.85v3.2a.78.78,0,0,0,1.56,0v-4A11.38,11.38,0,0,0,21.49,15a1.56,1.56,0,0,0,.4-1V9.17L24.6,7.73a.78.78,0,0,0,.32-1.06A.71.71,0,0,0,24.6,6.35ZM12.51,17.2a10.24,10.24,0,0,1-7.82-3.3V10l7.45,4a.81.81,0,0,0,.74,0l4.32-2.31V16.2A10.87,10.87,0,0,1,12.51,17.2Zm7.82-3.3a9.42,9.42,0,0,1-1.57,1.39V10.84L20.33,10Zm-2-4.62,0,0L12.88,6.35a.78.78,0,0,0-.74,1.38l4.57,2.43-4.2,2.24L2.44,7,12.51,1.67,22.57,7Z" />
    </svg>
  );
}

/** “~500 ambassadors” stat. viewBox 0 0 23.46 17.23 — 1.36:1 */
export function GroupUserIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 23.46 17.23"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M23.14,10a.77.77,0,0,1-1.09-.16,5.06,5.06,0,0,0-4.07-2,.78.78,0,0,1-.72-.48.81.81,0,0,1,0-.61A.78.78,0,0,1,18,6.25a2.35,2.35,0,1,0-2.27-2.93.78.78,0,1,1-1.51-.39,3.9,3.9,0,1,1,7.56,2,3.81,3.81,0,0,1-1.14,1.9A6.62,6.62,0,0,1,23.3,8.91a.78.78,0,0,1-.16,1.1Zm-5.26,6a.78.78,0,0,1-1.32.84.21.21,0,0,1,0-.06,5.56,5.56,0,0,0-9.59,0,.78.78,0,1,1-1.38-.73l0,0a7,7,0,0,1,3.3-2.93,4.69,4.69,0,1,1,6.57-.87,4.48,4.48,0,0,1-.87.87A7.06,7.06,0,0,1,17.88,16Zm-6.15-3.52A3.13,3.13,0,1,0,8.6,9.38,3.13,3.13,0,0,0,11.73,12.51ZM6.25,7a.78.78,0,0,0-.78-.79A2.35,2.35,0,1,1,7.74,3.32a.78.78,0,0,0,1.52-.39h0a3.91,3.91,0,0,0-7.57,2,4,4,0,0,0,1.14,1.9A6.59,6.59,0,0,0,.16,8.91.79.79,0,0,0,.31,10a.78.78,0,0,0,1.1-.16,5,5,0,0,1,4.06-2A.78.78,0,0,0,6.25,7Z" />
    </svg>
  );
}

/** accordion card headers, and the ONE COMMUNITY pillar. viewBox 0 0 69.8 46.05 — 1.52:1 */
export function DualUserIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 69.8 46.05"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M31.93,31.62A17.66,17.66,0,0,0,36.56,7.69a16.29,16.29,0,0,0-23.08-4.8A17.65,17.65,0,0,0,8.85,26.82a16.94,16.94,0,0,0,4.63,4.8A26.75,26.75,0,0,0,.38,42.46a2.35,2.35,0,0,0,.6,3.2A2.17,2.17,0,0,0,4.06,45l0-.05a21.71,21.71,0,0,1,30.7-6.75A22.55,22.55,0,0,1,41.31,45a2.17,2.17,0,0,0,3.08.62A2.35,2.35,0,0,0,45,42.46,26.8,26.8,0,0,0,31.93,31.62ZM10.5,17.26A12.43,12.43,0,0,1,22.7,4.61,12.44,12.44,0,0,1,34.91,17.26,12.44,12.44,0,0,1,22.7,29.92,12.44,12.44,0,0,1,10.5,17.26ZM68.79,45.65A2.18,2.18,0,0,1,65.72,45a21.94,21.94,0,0,0-18.6-10.46,2.3,2.3,0,0,1,0-4.6A12.44,12.44,0,0,0,59.31,17.25,12.44,12.44,0,0,0,47.09,4.61a11.9,11.9,0,0,0-4.51.9,2.2,2.2,0,0,1-2.92-1.2,2.34,2.34,0,0,1,1.16-3l.11-.05a16.46,16.46,0,0,1,21.63,9.63,17.62,17.62,0,0,1-6.22,20.75,26.75,26.75,0,0,1,13.1,10.84A2.36,2.36,0,0,1,68.79,45.65Z" />
    </svg>
  );
}

/** DAILY PROMPTS pillar. viewBox 0 0 26 24 — 1.08:1 */
export function MessageIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 26 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M24,0H2A2,2,0,0,0,0,2V22a2,2,0,0,0,1.16,1.81A1.88,1.88,0,0,0,2,24a2,2,0,0,0,1.28-.47h0L7.38,20H24a2,2,0,0,0,2-2V2A2,2,0,0,0,24,0Zm0,18H7a1,1,0,0,0-.65.24L2,22V2H24ZM8,8A1,1,0,0,1,9,7h8a1,1,0,0,1,0,2H9A1,1,0,0,1,8,8Zm0,4a1,1,0,0,1,1-1h8a1,1,0,0,1,0,2H9A1,1,0,0,1,8,12Z" />
    </svg>
  );
}

/** mock card “students waiting” stat. viewBox 0 0 22.01 29.99 — 0.73:1 */
export function SparkIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 22.01 29.99"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M22,13.77a1,1,0,0,0-.63-.71l-7.2-2.7L16,1.19A1,1,0,0,0,15.2,0a1,1,0,0,0-.93.3l-14,15a1,1,0,0,0,0,1.41,1.08,1.08,0,0,0,.34.21l7.2,2.7L6,28.8A1,1,0,0,0,6.82,30a1,1,0,0,0,.92-.3l14-15A1,1,0,0,0,22,13.77Zm-13.3,12L10,19.2a1,1,0,0,0-.63-1.13l-6.6-2.49L13.33,4.25,12,10.8a1,1,0,0,0,.62,1.13l6.6,2.48Z" />
    </svg>
  );
}

/** mock card “responses” stat. viewBox 0 0 25 25 — 1.00:1 */
export function EditIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 25 25"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M24.71,4.29l-4-4a1,1,0,0,0-1.42,0h0l-12,12A1.05,1.05,0,0,0,7,13v4a1,1,0,0,0,1,1h4a1,1,0,0,0,.71-.29l12-12a1,1,0,0,0,0-1.42ZM11.59,16H9V13.41l8-8L19.59,8ZM21,6.59,18.41,4,20,2.41,22.59,5ZM24,13V23a2,2,0,0,1-2,2H2a2,2,0,0,1-2-2V3A2,2,0,0,1,2,1H12a1,1,0,0,1,0,2H2V23H22V13a1,1,0,0,1,2,0Z" />
    </svg>
  );
}
