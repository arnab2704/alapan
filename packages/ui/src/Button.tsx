import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-sindoor-500 text-white shadow-sm shadow-sindoor-900/20 hover:bg-sindoor-600 focus-visible:outline-sindoor-600",
  secondary:
    "bg-marigold-500 text-white shadow-sm shadow-marigold-900/20 hover:bg-marigold-600 focus-visible:outline-marigold-600",
  ghost:
    "bg-transparent text-ink-800 hover:bg-ink-100 focus-visible:outline-ink-400 dark:text-ink-100 dark:hover:bg-ink-800"
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 text-sm px-3 py-1.5",
  md: "min-h-11 text-base px-4 py-2",
  lg: "min-h-12 text-lg px-6 py-3"
};

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
