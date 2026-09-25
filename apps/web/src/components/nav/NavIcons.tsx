import type { NavId } from "./navConfig";

const common = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true
};

/** Simple line icons for the five sections (decorative; the label carries the meaning). */
export function NavIcon({ id }: { id: NavId }) {
  switch (id) {
    case "today":
      return (
        <svg {...common}>
          <path d="M3 18h18M6 18a6 6 0 0 1 12 0M12 5v3M4.5 9.5l2 2M19.5 9.5l-2 2" />
        </svg>
      );
    case "play":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M9 9h.01M15 9h.01M9 15h.01M15 15h.01M12 12h.01" />
        </svg>
      );
    case "learn":
      return (
        <svg {...common}>
          <path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V18c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z" />
          <path d="M12 6v12.5" />
        </svg>
      );
    case "discover":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="m15.5 8.5-2 5-5 2 2-5z" />
        </svg>
      );
    case "adda":
      return (
        <svg {...common}>
          <path d="M5 9h11v4a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10h1.5a2 2 0 0 1 0 4H16M8 3.5c0 1 .8 1.2.8 2.2M11.5 3.5c0 1 .8 1.2.8 2.2" />
        </svg>
      );
  }
}

export function SearchIcon() {
  return (
    <svg {...common}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function ProfileIcon() {
  return (
    <svg {...common}>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.5 20c.8-4 3.7-6 7.5-6s6.7 2 7.5 6" />
    </svg>
  );
}
