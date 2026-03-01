/* ============================================================
   Atom: Typography
   ============================================================
   Reusable heading & body text components using theme vars.
   ============================================================ */

import type { ReactNode, ElementType } from "react";

interface TypographyProps {
  as?: ElementType;
  variant?: "h1" | "h2" | "h3" | "body" | "caption";
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<string, string> = {
  h1: "text-4xl md:text-5xl font-bold tracking-tight text-[var(--heading)]",
  h2: "text-2xl md:text-3xl font-semibold text-[var(--heading)]",
  h3: "text-xl font-semibold text-[var(--body)]",
  body: "text-base text-[var(--body)] leading-relaxed",
  caption: "text-sm text-[var(--muted)]",
};

export default function Typography({
  as,
  variant = "body",
  children,
  className = "",
}: TypographyProps) {
  const Tag: ElementType =
    as ?? (variant.startsWith("h") ? (variant as ElementType) : "p");

  return <Tag className={`${variantStyles[variant]} ${className}`}>{children}</Tag>;
}
