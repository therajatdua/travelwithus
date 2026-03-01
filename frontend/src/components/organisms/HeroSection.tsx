/* ============================================================
   Organism: HeroSection
   ============================================================
   Full-viewport hero with dynamic background image,
   --hero-gradient overlay, editorial headline, and CTA.
   ============================================================ */

"use client";

import { Button } from "@/components/atoms";

interface HeroSectionProps {
  /** Background image URL (falls back to a default Unsplash travel shot) */
  backgroundImage?: string;
  /** Main headline text */
  headline?: string;
  /** Sub-headline / tagline */
  tagline?: string;
  /** CTA button label */
  ctaLabel?: string;
  /** CTA click handler (e.g. scroll to destinations) */
  onCtaClick?: () => void;
}

export default function HeroSection({
  backgroundImage = "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=2400&q=80",
  headline = "Shift Your Reality.\nRoam Free.",
  tagline = "Curated 5-day escapes that match your vibe — from Mumbai's golden chaos to Tokyo's neon dreams. Pick a destination and watch the page come alive.",
  ctaLabel = "Explore Destinations ↓",
  onCtaClick,
}: HeroSectionProps) {
  return (
    <section className="relative isolate min-h-screen flex items-center justify-center overflow-hidden">
      {/* ── Background image ─────────────────────────────── */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden="true"
      />

      {/* ── Hero gradient overlay (--hero-gradient) ──────── */}
      <div
        className="absolute inset-0 -z-10 opacity-85"
        style={{ background: "var(--hero-gradient)" }}
        aria-hidden="true"
      />

      {/* ── Content ──────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-5xl font-bold leading-tight tracking-tight text-white drop-shadow-lg md:text-7xl whitespace-pre-line">
          {headline}
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
          {tagline}
        </p>

        <div className="mt-10">
          <Button
            variant="secondary"
            size="lg"
            onClick={onCtaClick}
            className="!bg-theme-primary !text-white hover:!bg-theme-hover transition-colors duration-500 ease-in-out font-bold shadow-lg"
          >
            {ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
