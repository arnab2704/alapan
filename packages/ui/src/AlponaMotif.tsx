export interface AlponaDividerProps {
  className?: string;
}

/**
 * A thin repeating wave-and-dot line motif, evoking the flowing curves and
 * dots of traditional আলপনা (alpona) floor art without literally
 * reproducing a specific motif. Purely decorative (aria-hidden), colored
 * via `currentColor` so it inherits a text-* color class, and tiles at any
 * width via an SVG <pattern> rather than a fixed-size image asset.
 */
export function AlponaDivider({ className }: AlponaDividerProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 16"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id="alpona-motif" width="24" height="16" patternUnits="userSpaceOnUse">
          <path
            d="M0 8 C 3 2, 9 2, 12 8 C 15 14, 21 14, 24 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="8" r="1.4" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="120" height="16" fill="url(#alpona-motif)" />
    </svg>
  );
}
