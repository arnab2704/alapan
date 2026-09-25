const PATHS: Record<string, string> = {
  word: "M12 3c-4 4-6 8-5 13 2-1 4-3 5-6 1 3 3 5 5 6 1-5-1-9-5-13Z",
  game: "M4 4h16v16H4zM4 12h16M12 4v16",
  question: "M9 9a3 3 0 1 1 4.5 2.6c-1 .6-1.5 1.2-1.5 2.4M12 17.5v.5",
  discover: "M3 20h18M5 20V10l7-6 7 6v10M9 20v-6h6v6",
  learn: "M5 19c0-8 5-13 14-14-1 9-6 14-14 14ZM5 19c3-5 6-8 10-10"
};

/** Small line icon for a Daily 5 item. Decorative. */
export function ItemIcon({ id, className = "h-6 w-6" }: { id: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[id] ?? PATHS.word} />
    </svg>
  );
}
