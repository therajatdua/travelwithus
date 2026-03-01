/* ============================================================
   /packages/[city]/book – Booking Page  (Day 5 · Task 1)
   ============================================================
   • Extracts the city param via App Router dynamic routing.
   • Validates against mockData; calls notFound() if invalid.
   • Initialises ThemeContext to the active city.
   • Renders <BookingForm /> inside a themed wrapper.
   ============================================================ */

"use client";

import { useParams, notFound } from "next/navigation";
import { useEffect } from "react";
import { travelPackages } from "@/lib/mockData";
import { useTheme } from "@/context/ThemeContext";
import { BookingForm } from "@/components/organisms";
import { Typography } from "@/components/atoms";
import type { ThemeKey } from "@/types";

export default function BookingPage() {
  const params = useParams<{ city: string }>();
  const { setTheme } = useTheme();

  /* ── Validate city against mock dataset ────────────────── */
  const pkg = travelPackages.find((p) => p.themeKey === params.city);

  if (!pkg) {
    notFound();
  }

  /* ── Initialise ThemeContext to the active city ─────────── */
  useEffect(() => {
    setTheme(pkg.themeKey as ThemeKey);
    return () => setTheme(null);
  }, [pkg.themeKey, setTheme]);

  return (
    <main className="min-h-screen bg-theme-bg text-theme-body transition-colors duration-500 ease-in-out">
      {/* ── Hero gradient header strip ─────────────────────── */}
      <div
        className="px-6 py-12 md:px-12 md:py-16"
        style={{ background: "var(--hero-gradient)" }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <Typography
            variant="h1"
            className="!text-white drop-shadow-lg"
          >
            Book Your {pkg.destinationName} Escape
          </Typography>
          <p className="mx-auto mt-3 max-w-xl text-base text-white/80">
            Complete the steps below to lock in your 5-day adventure.
          </p>
        </div>
      </div>

      {/* ── Booking Form ───────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <BookingForm
          destinationName={pkg.destinationName}
          citySlug={pkg.themeKey}
          transportOptions={pkg.transportOptions}
          priceUSD={pkg.priceUSD}
          accommodationName={pkg.accommodation.name}
        />
      </section>
    </main>
  );
}
