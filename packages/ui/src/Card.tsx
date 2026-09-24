import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-alpona border border-ink-100 bg-cream-50 p-5 shadow-sm shadow-ink-900/5",
        "dark:border-ink-700 dark:bg-ink-800",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
