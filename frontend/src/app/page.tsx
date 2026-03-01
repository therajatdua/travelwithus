/* ============================================================
   TravelWithUs – Home Page  (v2)
   ============================================================
   MakeMyTrip-style hero with HeroSearchWidget over a full-
   screen travel background. Below: DestinationGrid.
   ============================================================ */

"use client";

import { useRef } from "react";
import { HeroSearchWidget } from "@/components/home/HeroSearchWidget";
import { DestinationGrid } from "@/components/organisms";
import { Typography } from "@/components/atoms";

export default function HomePage() {
  const destinationsRef = useRef<HTMLElement>(null);

  return (
    <main className="bg-[var(--background)] text-[var(--body)] transition-colors duration-500">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section
        className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden bg-cover bg-center px-4"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" aria-hidden />

        {/* Headline */}
        <div className="relative z-10 mb-10 text-center text-white">
          <h1 className="text-4xl font-extrabold leading-tight drop-shadow-lg md:text-5xl lg:text-6xl">
            Where do you want to go?
          </h1>
          <p className="mt-4 text-lg font-medium text-white/80 md:text-xl">
            AI-powered packages • Handpicked destinations • Best prices
          </p>
        </div>

        {/* Search Widget */}
        <div className="relative z-10 w-full max-w-3xl">
          <HeroSearchWidget />
        </div>

        {/* Scroll cue */}
        <button
          type="button"
          aria-label="Scroll to destinations"
          onClick={() => destinationsRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-white/60 hover:text-white"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 16l-6-6h12z" />
          </svg>
        </button>
      </section>

      {/* ── Destination Grid ───────────────────────────────── */}
      <section
        ref={destinationsRef}
        className="mx-auto max-w-7xl px-6 py-20"
      >
        <Typography variant="h2" className="mb-4 text-center text-[var(--heading)]">
          Select Your Vibe
        </Typography>
        <p className="mx-auto mb-12 max-w-xl text-center text-[var(--body)]">
          Click a destination to preview its theme — then dive in.
        </p>

        <DestinationGrid />
      </section>
    </main>
  );
}
