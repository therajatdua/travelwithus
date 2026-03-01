/* ============================================================
   Organism: DestinationGrid
   ============================================================
   Maps mockData travel packages into destination cards.
   onClick → sets the city theme via ThemeContext,
   "View Package" → navigates to /packages/[city].
   ============================================================ */

"use client";

import { useRouter } from "next/navigation";
import { travelPackages } from "@/lib/mockData";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/atoms";
import type { TravelPackage, ThemeKey } from "@/types";

/* City-to-image map for card hero banners */
const cityImages: Record<string, string> = {
  mumbai: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80",
  rio: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80",
  thailand: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
  italy: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
};

/* City emoji icons */
const cityEmoji: Record<string, string> = {
  mumbai: "🇮🇳",
  rio: "🇧🇷",
  thailand: "🇹🇭",
  italy: "🇮🇹",
  tokyo: "🇯🇵",
};

function DestinationCard({ pkg }: { pkg: TravelPackage }) {
  const { setTheme } = useTheme();
  const router = useRouter();
  const image = cityImages[pkg.themeKey];

  const handleCardClick = () => {
    setTheme(pkg.themeKey as ThemeKey);
  };

  const handleViewPackage = () => {
    setTheme(pkg.themeKey as ThemeKey);
    router.push(`/packages/${pkg.themeKey}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group card-theme flex flex-col gap-4 overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* ── Image hero strip ─────────────────────────────── */}
      <div className="relative flex h-40 w-full items-end rounded-[var(--radius-md)] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative flex w-full items-end justify-between p-4">
          <span className="text-xl font-bold text-white drop-shadow-md">
            {cityEmoji[pkg.themeKey]} {pkg.destinationName}
          </span>
          <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
            ${pkg.priceUSD}
          </span>
        </div>
      </div>

      {/* ── Description ──────────────────────────────────── */}
      <p className="text-sm leading-relaxed text-theme-body line-clamp-2">
        {pkg.shortDescription}
      </p>

      {/* ── Transport badges ─────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5">
        {pkg.transportOptions.map((t) => (
          <span
            key={t}
            className="rounded-full bg-theme-surface px-2.5 py-0.5 text-xs font-medium text-theme-heading"
          >
            {t}
          </span>
        ))}
      </div>

      {/* ── CTA ──────────────────────────────────────────── */}
      <div className="mt-auto pt-2">
        <Button
          variant="primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleViewPackage();
          }}
          className="w-full bg-theme-primary hover:bg-theme-hover transition-colors duration-500 ease-in-out"
        >
          View Package →
        </Button>
      </div>
    </div>
  );
}

export default function DestinationGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {travelPackages.map((pkg) => (
        <DestinationCard key={pkg.id} pkg={pkg} />
      ))}
    </div>
  );
}
