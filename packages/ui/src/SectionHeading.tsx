import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface SectionHeadingProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
}

export function SectionHeading({ eyebrow, title, description, className, ...props }: SectionHeadingProps) {
  return (
    <div className={clsx("mb-6 max-w-2xl", className)} {...props}>
      {eyebrow ? (
        <p className="mb-1 font-bengali text-sm font-semibold uppercase tracking-wide text-alpona-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-bengaliDisplay text-2xl font-bold text-ink-900 dark:text-ink-50 sm:text-3xl">
        {title}
      </h2>
      {description ? <p className="mt-2 text-ink-600 dark:text-ink-100">{description}</p> : null}
    </div>
  );
}
