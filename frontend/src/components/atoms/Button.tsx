/* ============================================================
   Atom: Button
   ============================================================
   Reusable button with variant & size props.
   Variants: primary · secondary · outline
   Sizes:    sm · md · lg
   ============================================================ */

import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button */
  variant?: "primary" | "secondary" | "outline";
  /** Size preset */
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:
    "bg-[var(--primary)] text-[var(--text-inverse)] hover:bg-[var(--primary-hover)] focus:ring-[var(--accent)]",
  secondary:
    "bg-[var(--surface-alt)] text-[var(--heading)] hover:bg-[var(--border)] focus:ring-[var(--accent)]",
  outline:
    "bg-transparent border border-[var(--border)] text-[var(--heading)] hover:bg-[var(--surface-alt)] focus:ring-[var(--accent)]",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm rounded-[var(--radius-sm)]",
  md: "px-5 py-2.5 text-sm rounded-[var(--radius-md)]",
  lg: "px-7 py-3 text-base rounded-[var(--radius-lg)]",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  return (
    <button
      className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
