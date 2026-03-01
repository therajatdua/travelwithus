/* ============================================================
   /packages/[city] – Dynamic Destination Page  (Day 4 → Day 6)
   ============================================================
   Freemium Content Gate:
     • Guest → PackageHero + Itinerary Preview (Days 1-2) +
               AuthWallOverlay (blur + "Login to Unlock" CTA)
     • Logged-in → Full Itinerary + Accommodation + Booking CTA
   ============================================================ */

"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { travelPackages } from "@/lib/mockData";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { PackageHero } from "@/components/organisms";
import { ItineraryTimeline, AccommodationCard, AuthWallOverlay } from "@/components/molecules";
import { Typography, Button } from "@/components/atoms";
import Link from "next/link";
import type { ThemeKey } from "@/types";

export default function CityPage() {
  const params = useParams<{ city: string }>();
  const { setTheme } = useTheme();
  const { isAuthenticated } = useAuth();

  /* ── Retrieve city data ────────────────────────────────── */
  const pkg = travelPackages.find((p) => p.themeKey === params.city);

  /* Trigger Next.js 404 if the city slug doesn't match any package */
  if (!pkg) {
    notFound();
  }

  /* ── Initialise ThemeContext to the active city ─────────── */
  useEffect(() => {
    setTheme(pkg.themeKey as ThemeKey);
    return () => setTheme(null);
  }, [pkg.themeKey, setTheme]);

  /* ── Preview itinerary for guests (first 2 days) ───────── */
  const previewItinerary = pkg.itinerary.slice(0, 2) as typeof pkg.itinerary;

  return (
    <main className="bg-theme-bg text-theme-body transition-colors duration-500 ease-in-out">
      {/* ── Package Hero ───────────────────────────────────── */}
      <PackageHero
        destinationName={pkg.destinationName}
        shortDescription={pkg.shortDescription}
        heroImage={pkg.heroImage}
        priceUSD={pkg.priceUSD}
        transportOptions={pkg.transportOptions}
      />

      {/* ── Itinerary Section ──────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Typography variant="h2" className="mb-10 text-theme-heading">
          4-Night / 5-Day Itinerary
        </Typography>

        {isAuthenticated ? (
          /* ── FULL ITINERARY (Authenticated) ────────────── */
          <ItineraryTimeline itinerary={pkg.itinerary} />
        ) : (
          /* ── PREVIEW + AUTH WALL (Guest) ───────────────── */
          <div>
            <ItineraryTimeline itinerary={previewItinerary} />
            <AuthWallOverlay
              returnPath={`/packages/${pkg.themeKey}`}
              message="Sign in to unlock the full 5-day itinerary, AI-powered recommendations, and booking."
            />
          </div>
        )}
      </section>

      {/* ── Accommodation & Booking CTA (Authenticated Only) */}
      {isAuthenticated && (
        <>
          <section className="mx-auto max-w-5xl px-6 pb-12">
            <Typography variant="h2" className="mb-8 text-theme-heading">
              Your Stay
            </Typography>
            <AccommodationCard
              accommodation={pkg.accommodation}
              citySlug={pkg.themeKey}
              priceUSD={pkg.priceUSD}
            />
          </section>

          <section className="mx-auto max-w-5xl px-6 pb-20 text-center">
            <Link href={`/packages/${pkg.themeKey}/book`}>
              <Button
                variant="primary"
                size="lg"
                className="!bg-theme-primary !text-white hover:!bg-theme-hover font-bold shadow-lg"
              >
                Book This Package →
              </Button>
            </Link>
          </section>
        </>
      )}
    </main>
  );
}
