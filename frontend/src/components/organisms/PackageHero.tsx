/* ============================================================
   Organism: PackageHero
   ============================================================
   Full-width hero header for the dynamic [city] package page.
   Renders the city-specific hero image with --hero-gradient
   overlay, destination name, and short description.
   ============================================================ */

"use client";

interface PackageHeroProps {
  /** Display name of the destination, e.g. "Tokyo" */
  destinationName: string;
  /** Short editorial description */
  shortDescription: string;
  /** Path to the hero background image */
  heroImage: string;
  /** Price in USD for the floating badge */
  priceUSD: number;
  /** Transport options for the pill badges */
  transportOptions: string[];
}

export default function PackageHero({
  destinationName,
  shortDescription,
  heroImage,
  priceUSD,
  transportOptions,
}: PackageHeroProps) {
  return (
    <section className="relative isolate min-h-[65vh] flex items-end overflow-hidden">
      {/* ── Background image layer ───────────────────────── */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
        aria-hidden="true"
      />

      {/* ── Hero gradient overlay ────────────────────────── */}
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--hero-gradient)", opacity: 0.88 }}
        aria-hidden="true"
      />

      {/* ── Content ──────────────────────────────────────── */}
      <div className="w-full px-6 pb-12 pt-32 md:px-12 lg:px-16">
        <div className="mx-auto max-w-5xl">
          {/* Transport pills */}
          <div className="mb-4 flex flex-wrap gap-2">
            {transportOptions.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-lg md:text-6xl">
            {destinationName}
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
            {shortDescription}
          </p>

          {/* Price badge */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 backdrop-blur-sm">
            <span className="text-sm text-white/70">Starting from</span>
            <span className="text-xl font-bold text-white">${priceUSD}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
