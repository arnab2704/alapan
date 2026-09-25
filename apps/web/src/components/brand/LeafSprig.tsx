/** Soft botanical corner used as page ornament. Purely decorative. */
export function LeafSprig({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 200"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M150 0c-30 40-20 90-70 130" fill="none" stroke="#A15C2F" strokeWidth="2" opacity=".5" />
      <g opacity=".55">
        <path d="M120 30c-24-4-36-20-38-38 24 2 40 14 38 38Z" fill="#C62828" />
        <path d="M100 70c-26 0-40-14-44-32 26-2 44 8 44 32Z" fill="#F59E0B" />
        <path d="M86 108c-22 4-38-4-46-20 22-6 42-2 46 20Z" fill="#C62828" />
        <path d="M136 60c14-18 12-38 2-52-14 18-14 38-2 52Z" fill="#8E1B1E" />
        <path d="M104 112c16-14 20-32 14-48-16 12-22 30-14 48Z" fill="#F59E0B" />
      </g>
    </svg>
  );
}
