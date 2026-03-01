/* ============================================================
   Organism: DestinationGrid
   ============================================================
   Maps mockData travel packages into destination cards.
   onClick → sets the city theme via ThemeContext,
   "View Package" → navigates to /packages/[city].
   3-D perspective tilt + shimmer + per-city glow ring.
   ============================================================ */

"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { travelPackages } from "@/lib/mockData";
import { useTheme } from "@/context/ThemeContext";
import { Button, ScrollReveal } from "@/components/atoms";
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

/* Per-city glow / accent colours */
const cityGlow: Record<string, string> = {
  mumbai:   "rgba(232,120,23,0.55)",
  rio:      "rgba(29,185,84,0.55)",
  thailand: "rgba(255,107,107,0.55)",
  italy:    "rgba(78,205,196,0.55)",
  tokyo:    "rgba(167,139,250,0.55)",
};

const cityAccent: Record<string, string> = {
  mumbai:   "#e87817",
  rio:      "#1db954",
  thailand: "#ff6b6b",
  italy:    "#4ecdc4",
  tokyo:    "#a78bfa",
};

function DestinationCard({ pkg, index }: { pkg: TravelPackage; index: number }) {
  const { setTheme } = useTheme();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const image = cityImages[pkg.themeKey];

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -10, y: dx * 10 });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleCardClick = () => setTheme(pkg.themeKey as ThemeKey);

  const handleViewPackage = () => {
    setTheme(pkg.themeKey as ThemeKey);
    router.push(`/packages/${pkg.themeKey}`);
  };

  const glow = cityGlow[pkg.themeKey] ?? "rgba(99,102,241,0.4)";
  const accent = cityAccent[pkg.themeKey] ?? "#6366f1";

  return (
    <ScrollReveal direction="up" delay={index * 90}>
      <div style={{ perspective: "900px" }} className="h-full">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleCardClick();
            }
          }}
          className="group card-theme flex flex-col gap-4 overflow-hidden cursor-pointer h-full"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.04 : 1}) translateZ(${isHovered ? "12px" : "0"})`,
            transition: isHovered
              ? "transform 0.08s linear, box-shadow 0.2s ease"
              : "transform 0.45s cubic-bezier(0.23,1,0.32,1), box-shadow 0.45s ease",
            boxShadow: isHovered
              ? `0 24px 60px -10px ${glow}, 0 0 0 1.5px ${glow}`
              : "0 4px 20px rgba(0,0,0,0.08)",
            borderRadius: "var(--radius-md, 12px)",
            willChange: "transform",
          }}
        >
          {/* ── Image hero strip ─────────────────────────────── */}
          <div className="shimmer-parent relative flex h-44 w-full items-end overflow-hidden rounded-t-[var(--radius-md)]">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* City-colour accent strip — expands on hover */}
            <div
              className="absolute bottom-0 left-0 h-[3px] transition-all duration-500 ease-out"
              style={{
                width: isHovered ? "100%" : "0%",
                background: `linear-gradient(90deg, ${accent}, transparent)`,
              }}
            />

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
          <p className="text-sm leading-relaxed text-theme-body line-clamp-2 px-4">
            {pkg.shortDescription}
          </p>

          {/* ── Transport badges ─────────────────────────────── */}
          <div className="flex flex-wrap gap-1.5 px-4">
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
          <div className="mt-auto px-4 pb-4 pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleViewPackage();
              }}
              className="w-full transition-all duration-300 hover:brightness-110"
              style={{
                background: isHovered
                  ? `linear-gradient(135deg, ${accent}, ${accent}bb)`
                  : undefined,
              }}
            >
              View Package →
            </Button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function DestinationGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {travelPackages.map((pkg, i) => (
        <DestinationCard key={pkg.id} pkg={pkg} index={i} />
      ))}
    </div>
  );
}
