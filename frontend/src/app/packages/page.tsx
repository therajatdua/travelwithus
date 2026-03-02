/* ============================================================
   /packages – Search Results Page
   ============================================================
   Receives query params from HeroSearchWidget:
     ?country=IN&city=Mumbai&date=...&adults=2&children=0
   Tries to smart-match the country/city to an available
   package themeKey, then shows:
     - Matched packages highlighted at top
     - All other packages below
   ============================================================ */

"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { travelPackages } from "@/lib/mockData";
import { useTheme } from "@/context/ThemeContext";
import { Typography, Button } from "@/components/atoms";
import type { TravelPackage, ThemeKey } from "@/types";

/* ── Country-code / city keyword → themeKey map ─────────── */
const COUNTRY_MAP: Record<string, ThemeKey> = {
  IN: "mumbai", // India
  BR: "rio",    // Brazil
  TH: "thailand",
  IT: "italy",
  JP: "tokyo",
};

const CITY_KEYWORDS: Array<[RegExp, ThemeKey]> = [
  [/mumbai|bombay/i,                     "mumbai"],
  [/rio|brazil|carnival/i,               "rio"],
  [/thailand|bangkok|phuket|chiangmai|chiang/i, "thailand"],
  [/italy|rome|roma|venice|milan|naples|florence/i, "italy"],
  [/tokyo|osaka|kyoto|japan/i,           "tokyo"],
];

function matchPackages(country: string, city: string): ThemeKey[] {
  const matched = new Set<ThemeKey>();

  // Country code match
  if (country && COUNTRY_MAP[country.toUpperCase()]) {
    matched.add(COUNTRY_MAP[country.toUpperCase()]);
  }

  // City keyword match
  for (const [re, key] of CITY_KEYWORDS) {
    if (re.test(city) || re.test(country)) matched.add(key);
  }

  return Array.from(matched);
}

/* ── Package result card ────────────────────────────────── */
const IMAGES: Record<ThemeKey, string> = {
  mumbai:   "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80",
  rio:      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80",
  thailand: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
  italy:    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
  tokyo:    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
};

function PackageResultCard({
  pkg,
  highlighted,
  searchDate,
  adults,
  childCount,
}: {
  pkg: TravelPackage;
  highlighted: boolean;
  searchDate?: string;
  adults: number;
  childCount: number;
}) {
  const router = useRouter();
  const { setTheme } = useTheme();

  const handleBook = () => {
    setTheme(pkg.themeKey as ThemeKey);
    const params = new URLSearchParams({
      ...(searchDate ? { date: searchDate } : {}),
      adults:   String(adults),
      children: String(childCount),
    });
    router.push(`/packages/${pkg.themeKey}/book?${params.toString()}`);
  };

  const handleView = () => {
    setTheme(pkg.themeKey as ThemeKey);
    router.push(`/packages/${pkg.themeKey}`);
  };

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-[2px] ${
        highlighted ? "ring-2" : ""
      }`}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        ...(highlighted ? { ringColor: "var(--primary)" } : {}),
      }}
    >
      {highlighted && (
        <div
          className="absolute left-3 top-3 z-10 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow"
          style={{ background: "var(--primary)" }}
        >
          Best Match ✓
        </div>
      )}

      {/* Hero image */}
      <div className="relative h-44 w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${IMAGES[pkg.themeKey]})` }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <span className="text-lg font-extrabold text-white drop-shadow">{pkg.destinationName}</span>
          <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold text-white backdrop-blur-sm">
            From ${pkg.priceUSD}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="line-clamp-2 text-sm leading-relaxed" style={{ color: "var(--body)" }}>
          {pkg.shortDescription}
        </p>

        {/* Transport pills */}
        <div className="flex flex-wrap gap-1.5">
          {pkg.transportOptions.map((t) => (
            <span
              key={t}
              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ background: "var(--surface-alt)", color: "var(--heading)" }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-auto flex gap-2 pt-1">
          <Button variant="secondary" size="sm" onClick={handleView} className="flex-1">
            View Details
          </Button>
          <Button variant="primary" size="sm" onClick={handleBook} className="flex-1">
            Book Now →
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Main page content ──────────────────────────────────── */
function PackagesContent() {
  const searchParams = useSearchParams();

  const country  = searchParams.get("country") ?? "";
  const city     = searchParams.get("city")    ?? "";
  const date     = searchParams.get("date")    ?? "";
  const adults   = Number(searchParams.get("adults")   ?? 2);
  const children = Number(searchParams.get("children") ?? 0);

  const matchedKeys  = matchPackages(country, city);
  const matchedPkgs  = travelPackages.filter((p) => matchedKeys.includes(p.themeKey));
  const remainingPkgs = travelPackages.filter((p) => !matchedKeys.includes(p.themeKey));

  const hasSearch = country || city;

  return (
    <main
      className="min-h-screen bg-[var(--background)] pb-20 transition-colors duration-500"
      style={{ color: "var(--body)" }}
    >
      {/* ── Page header ─────────────────────────────────── */}
      <div
        className="px-6 py-12 text-center"
        style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
      >
        <Typography variant="h1" className="text-[var(--heading)]">
          {hasSearch
            ? city
              ? `Packages for "${city}"`
              : "Available Packages"
            : "All Destinations"}
        </Typography>
        {hasSearch && (
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            {date && `Departing ${date} · `}{adults} adult{adults !== 1 ? "s" : ""}
            {children > 0 ? ` · ${children} child${children !== 1 ? "ren" : ""}` : ""}
          </p>
        )}
        {hasSearch && matchedPkgs.length === 0 && (
          <p className="mx-auto mt-4 max-w-md rounded-xl px-4 py-3 text-sm font-medium" style={{ background: "var(--surface-alt)", color: "var(--heading)" }}>
            We don&apos;t have an exact package for <strong>{city || country}</strong> yet — but check out our hand-picked destinations below! 🌍
          </p>
        )}
      </div>

      <div className="mx-auto max-w-6xl px-6 pt-10">
        {/* ── Matched packages ────────────────────────────── */}
        {matchedPkgs.length > 0 && (
          <section className="mb-12">
            <Typography variant="h2" className="mb-6 text-[var(--heading)]">
              🎯 Closest Matches
            </Typography>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {matchedPkgs.map((pkg) => (
                <PackageResultCard
                  key={pkg.id}
                  pkg={pkg}
                  highlighted
                  searchDate={date}
                  adults={adults}
                  childCount={children}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── All / remaining packages ─────────────────────── */}
        <section>
          {matchedPkgs.length > 0 && (
            <Typography variant="h2" className="mb-6 text-[var(--heading)]">
              🌎 Explore More Destinations
            </Typography>
          )}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(matchedPkgs.length === 0 ? travelPackages : remainingPkgs).map((pkg) => (
              <PackageResultCard
                key={pkg.id}
                pkg={pkg}
                highlighted={false}
                searchDate={date}
                adults={adults}
                childCount={children}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

/* ── Suspense wrapper required by useSearchParams ───────── */
export default function PackagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
          <div className="text-center" style={{ color: "var(--muted)" }}>
            <div className="mb-3 text-3xl">✈️</div>
            <p className="text-sm font-medium">Loading packages…</p>
          </div>
        </div>
      }
    >
      <PackagesContent />
    </Suspense>
  );
}
