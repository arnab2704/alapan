import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div className={clsx("mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8", className)} {...props}>
      {children}
    </div>
  );
}
