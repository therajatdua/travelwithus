/* ============================================================
   Atom: ScrollReveal
   ============================================================
   Wraps any children and reveals them with a CSS animation
   when they scroll into view using IntersectionObserver.
   No external library required.
   ============================================================ */

"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Direction = "up" | "left" | "right" | "scale" | "fade";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Direction the element animates FROM */
  direction?: Direction;
  /** IntersectionObserver threshold (0-1) */
  threshold?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  threshold = 0.12,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const style: CSSProperties =
    delay > 0 ? { transitionDelay: `${delay}ms` } : {};

  return (
    <div
      ref={ref}
      className={`reveal reveal-${direction} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
