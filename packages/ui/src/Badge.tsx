import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export type BadgeTone = "default" | "festival" | "gold" | "muted";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children: ReactNode;
}

const toneClasses: Record<BadgeTone, string> = {
  default: "bg-alpona-100 text-alpona-800",
  festival: "bg-sindoor-500/10 text-sindoor-600",
  gold: "bg-marigold-100 text-marigold-800",
  muted: "bg-ink-100 text-ink-600"
};

export function Badge({ tone = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
