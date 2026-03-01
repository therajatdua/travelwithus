/* ============================================================
   Atom: Card
   ============================================================
   A themed card container — surface + border + shadow.
   ============================================================ */

import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return <div className={`card-theme ${className}`}>{children}</div>;
}
