/** The Alapon mark: a lotus-leaf spray in Bengal red and gold. Decorative; the wordmark carries the name. */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <path d="M32 58C20 48 14 36 18 18c8 4 13 12 14 22 1-10 6-18 14-22 4 18-2 30-14 40Z" fill="#C62828" />
      <path d="M32 58C26 44 26 32 32 12c6 20 6 32 0 46Z" fill="#F59E0B" />
      <path
        d="M32 58c-9-4-17-4-24 0 8 2 16 2 24 0Zm0 0c9-4 17-4 24 0-8 2-16 2-24 0Z"
        fill="#8E1B1E"
        opacity=".85"
      />
    </svg>
  );
}
