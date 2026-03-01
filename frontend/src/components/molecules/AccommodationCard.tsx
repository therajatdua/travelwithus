/* ============================================================
   Molecule: AccommodationCard
   ============================================================
   Displays partnered hotel details for a travel package.
   Surface: bg-theme-surface, border: border-theme-accent.
   "Proceed to Booking" button routes to /packages/[city]/book.
   ============================================================ */

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms";
import type { Accommodation } from "@/types";

interface AccommodationCardProps {
  /** Accommodation data from the travel package */
  accommodation: Accommodation;
  /** City slug used for the booking route */
  citySlug: string;
  /** Package price in USD */
  priceUSD: number;
}

export default function AccommodationCard({
  accommodation,
  citySlug,
  priceUSD,
}: AccommodationCardProps) {
  const router = useRouter();

  const handleBooking = () => {
    router.push(`/packages/${citySlug}/book`);
  };

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border-2 border-theme-accent bg-theme-surface shadow-md transition-all duration-500">
      {/* ── Header strip ─────────────────────────────────── */}
      <div className="border-b border-theme-accent/30 px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-theme-accent">
              Partnered Stay
            </span>
            <h3 className="mt-1 text-xl font-bold text-theme-heading">
              🏨 {accommodation.name}
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-theme-accent/10 px-3 py-1">
            <span className="text-sm">
              {"⭐".repeat(accommodation.starRating)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────── */}
      <div className="px-6 py-5">
        {/* Room type */}
        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-theme-body">
            Room Type
          </span>
          <p className="mt-1 text-base font-medium text-theme-heading">
            {accommodation.roomType}
          </p>
        </div>

        {/* Amenities */}
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-theme-body">
            Amenities
          </span>
          <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {accommodation.amenities.map((amenity) => (
              <li
                key={amenity}
                className="flex items-center gap-2 text-sm text-theme-body"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-theme-primary/10 text-[10px] text-theme-primary">
                  ✓
                </span>
                {amenity}
              </li>
            ))}
          </ul>
        </div>

        {/* Price & CTA */}
        <div className="flex flex-col items-center gap-4 border-t border-theme-accent/20 pt-5 sm:flex-row sm:justify-between">
          <div>
            <span className="text-sm text-theme-body">Total package from</span>
            <p className="text-2xl font-bold text-theme-heading">${priceUSD}</p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={handleBooking}
            className="w-full bg-theme-primary hover:bg-theme-hover transition-colors duration-500 ease-in-out sm:w-auto"
          >
            Proceed to Booking →
          </Button>
        </div>
      </div>
    </div>
  );
}
