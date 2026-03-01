/* ============================================================
   Molecule: Card
   ============================================================
   Travel-package card with an image slot, title, and
   description area. Composes the base Card atom with
   structured content zones.
   ============================================================ */

import { Card as CardBase, Typography } from "@/components/atoms";
import type { ReactNode } from "react";

export interface CardProps {
  /** URL or path for the card's hero image */
  imageSrc?: string;
  /** Alt text for the image */
  imageAlt?: string;
  /** Card title (destination / package name) */
  title: string;
  /** Short description text */
  description: string;
  /** Optional footer slot (e.g. price + CTA button) */
  footer?: ReactNode;
  /** Additional Tailwind classes */
  className?: string;
}

export default function Card({
  imageSrc,
  imageAlt = "",
  title,
  description,
  footer,
  className = "",
}: CardProps) {
  return (
    <CardBase className={`flex flex-col gap-4 overflow-hidden ${className}`}>
      {/* ── Image Slot ────────────────────────────────────── */}
      {imageSrc ? (
        <div
          className="h-48 w-full rounded-[var(--radius-md)] bg-[var(--surface-alt)] bg-cover bg-center"
          style={{ backgroundImage: `url(${imageSrc})` }}
          role="img"
          aria-label={imageAlt}
        />
      ) : (
        <div className="flex h-48 w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-alt)]">
          <span className="text-3xl">🌍</span>
        </div>
      )}

      {/* ── Title ─────────────────────────────────────────── */}
      <Typography variant="h3">{title}</Typography>

      {/* ── Description ───────────────────────────────────── */}
      <Typography variant="body" className="line-clamp-3">
        {description}
      </Typography>

      {/* ── Footer Slot ───────────────────────────────────── */}
      {footer && <div className="mt-auto pt-2">{footer}</div>}
    </CardBase>
  );
}
