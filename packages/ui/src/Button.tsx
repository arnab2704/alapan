import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export type ButtonVariant = "primary" | "secondary" | "gold" | "ghost" | "text";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * The shared button look. The `.btn*` classes are defined once in the app's global CSS
 * (see docs/ALAPON_DESIGN_SYSTEM.md); use this helper on links (`<Link className={buttonClasses()}>`)
 * so links and buttons never drift apart.
 */
export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra?: string) {
  return clsx("btn", `btn-${variant}`, size !== "md" && `btn-${size}`, extra);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </button>
  );
}
