import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export type CardVariant = "default" | "editorial" | "game" | "discovery" | "learning" | "result";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** `default` is the plain bordered card; the others come from the card family in the global CSS. */
  variant?: CardVariant;
}

export function Card({ className, children, variant = "default", ...props }: CardProps) {
  return (
    <div
      className={clsx(
        variant === "default"
          ? "rounded-alpona border border-ink-100 bg-cream-50 p-5 shadow-sm shadow-ink-900/5 dark:border-ink-700 dark:bg-ink-800"
          : `card-${variant}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
