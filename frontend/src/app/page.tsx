/* ============================================================
   TravelWithUs – Home Page  (v3 — Full Animation Edition)
   ============================================================ */

"use client";

import { useRef } from "react";
import { HeroSearchWidget } from "@/components/home/HeroSearchWidget";
import { DestinationGrid } from "@/components/organisms";
import { Typography, ScrollReveal } from "@/components/atoms";

/* Floating destination markers */
const FLOAT_MARKERS = [
  { emoji: "🗼", top: "14%", left: "8%",  delay: "0s",    size: "text-4xl" },
  { emoji: "🏖️", top: "22%", right: "7%", delay: "0.8s",  size: "text-3xl" },
  { emoji: "⛩️", top: "58%", left: "5%",  delay: "1.4s",  size: "text-3xl" },
  { emoji: "🛕", top: "72%", right: "6%", delay: "0.4s",  size: "text-4xl" },
  { emoji: "🏔️", top: "40%", left: "3%",  delay: "2.0s",  size: "text-2xl" },
  { emoji: "🌊", top: "48%", right: "4%", delay: "1.2s",  size: "text-2xl" },
  { emoji: "🍕", top: "80%", left: "10%", delay: "0.6s",  size: "text-2xl" },
  { emoji: "🌸", top: "30%", right: "11%",delay: "1.8s",  size: "text-2xl" },
];

/* Marquee stat items */
const STATS = [
  { icon: "✈️", label: "5 Curated Destinations" },
  { icon: "🗺️", label: "100+ Day Itineraries" },
  { icon: "🤖", label: "AI-Powered Planning" },
  { icon: "⭐", label: "Highest-Rated Packages" },
  { icon: "💰", label: "Best Price Guarantee" },
  { icon: "🌍", label: "10K+ Happy Travellers" },
];

export default function HomePage() {
  const destinationsRef = useRef<HTMLElement>(null);

  return (
    <main className="bg-[var(--background)] text-[var(--body)] transition-colors duration-500 overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════
          HERO  – Ken Burns bg + floating markers + word reveal
          ══════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-[95vh] flex-col items-center justify-center overflow-hidden bg-cover bg-center px-4">

        {/* Background image with Ken Burns zoom */}
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center ken-burns"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')",
          }}
          aria-hidden
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/45 to-black/70" aria-hidden />

        {/* Animated colour blobs */}
        <div className="hero-blob -z-10 w-[600px] h-[600px] bg-[var(--primary)]   top-[-20%] left-[-15%]" aria-hidden />
        <div className="hero-blob hero-blob-2 -z-10 w-[500px] h-[500px] bg-[var(--accent)] bottom-[-10%] right-[-10%]" aria-hidden />
        <div className="hero-blob hero-blob-3 -z-10 w-[350px] h-[350px] bg-[var(--primary-hover)] top-1/3 left-1/3" aria-hidden />

        {/* Floating destination emojis */}
        {FLOAT_MARKERS.map(({ emoji, top, left, right, delay, size }) => (
          <span
            key={emoji}
            className={`absolute hidden lg:block ${size} float select-none pointer-events-none`}
            style={{ top, left, right, animationDelay: delay, opacity: 0.75 }}
            aria-hidden
          >
            {emoji}
          </span>
        ))}

        {/* Hero headline – staggered word reveal */}
        <div className="relative z-10 mb-10 text-center text-white max-w-4xl">
          <h1 className="text-4xl font-extrabold leading-tight drop-shadow-2xl md:text-6xl lg:text-7xl"
              style={{ perspective: "800px" }}>
            {"Where do you want".split(" ").map((word, i) => (
              <span
                key={i}
                className="hero-word mr-[0.25em]"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                {word}
              </span>
            ))}
            <br />
            <span className="gradient-text-live" style={{ WebkitTextFillColor: undefined }}>
              {"to go?".split(" ").map((word, i) => (
                <span
                  key={i}
                  className="hero-word mr-[0.25em]"
                  style={{ animationDelay: `${(i + 4) * 0.12}s` }}
                >
                  {word}
                </span>
              ))}
            </span>
          </h1>

          <p
            className="hero-word mt-5 text-lg font-medium text-white/80 md:text-xl max-w-xl mx-auto"
            style={{ animationDelay: "0.9s" }}
          >
            AI-powered packages&nbsp;•&nbsp;Handpicked destinations&nbsp;•&nbsp;Best prices
          </p>
        </div>

        {/* Search Widget */}
        <div
          className="relative z-10 w-full max-w-3xl hero-word"
          style={{ animationDelay: "1.1s" }}
        >
          <HeroSearchWidget />
        </div>

        {/* Scroll cue */}
        <button
          type="button"
          aria-label="Scroll to destinations"
          onClick={() => destinationsRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors group"
        >
          <span className="text-xs font-medium tracking-widest uppercase opacity-70 group-hover:opacity-100">
            Explore
          </span>
          <svg
            className="animate-bounce"
            width="28" height="28" viewBox="0 0 24 24" fill="currentColor"
          >
            <path d="M12 16l-6-6h12z" />
          </svg>
        </button>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATS MARQUEE STRIP
          ══════════════════════════════════════════════════════ */}
      <div className="overflow-hidden border-y border-[var(--border)] bg-[var(--surface)] py-3">
        <div className="marquee-track gap-12">
          {[...STATS, ...STATS].map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-2 whitespace-nowrap px-6 text-sm font-semibold text-[var(--body)]"
            >
              <span className="text-base">{s.icon}</span>
              <span>{s.label}</span>
              <span className="ml-4 text-[var(--border)]">◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          DESTINATION GRID
          ══════════════════════════════════════════════════════ */}
      <section
        ref={destinationsRef}
        className="mx-auto max-w-7xl px-6 py-24"
      >
        <ScrollReveal direction="up" className="text-center mb-4">
          <Typography variant="h2" className="text-[var(--heading)]">
            Select Your{" "}
            <span className="gradient-text-live">Vibe</span>
          </Typography>
        </ScrollReveal>

        <ScrollReveal direction="fade" delay={150} className="text-center mb-14">
          <p className="mx-auto max-w-xl text-[var(--body)]">
            Click a destination to preview its theme — then dive in.
          </p>
        </ScrollReveal>

        <DestinationGrid />
      </section>

      {/* ══════════════════════════════════════════════════════
          WHY CHOOSE US – value props, scroll-revealed
          ══════════════════════════════════════════════════════ */}
      <section className="bg-[var(--surface)] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal direction="up" className="text-center mb-16">
            <Typography variant="h2" className="text-[var(--heading)]">
              Why travellers love us
            </Typography>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "🤖", title: "AI Itineraries",   body: "Gemini AI builds a bespoke day-by-day plan based on your vibe, group size, and travel style." },
              { icon: "🎨", title: "Immersive Themes",  body: "Every city flips the entire UI to match its aesthetic — Mumbai gold, Tokyo neon, Rio carnival." },
              { icon: "💳", title: "Transparent Pricing", body: "Flat package prices, no hidden fees, no confusing add-ons. What you see is what you pay." },
              { icon: "📞", title: "24/7 Support",      body: "Chat with Travyy, our AI concierge, anytime. A real agent is one message away too." },
            ].map(({ icon, title, body }, i) => (
              <ScrollReveal key={title} direction="up" delay={i * 100}>
                <div className="glass rounded-2xl p-6 h-full flex flex-col gap-3 bg-[var(--background)] border border-[var(--border)] hover:shadow-xl transition-shadow duration-500">
                  <span className="text-4xl float" style={{ animationDelay: `${i * 0.4}s` }}>
                    {icon}
                  </span>
                  <h3 className="text-lg font-bold text-[var(--heading)]">{title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--body)]">{body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          DESTINATIONS BANNER – full-width photo strips
          ══════════════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal direction="up" className="text-center mb-16">
            <Typography variant="h2" className="text-[var(--heading)]">
              5 worlds, 1 platform
            </Typography>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            {[
              { name: "Mumbai",   flag: "🇮🇳", img: "photo-1567157577867-05ccb1388e66", color: "#E87817" },
              { name: "Rio",      flag: "🇧🇷", img: "photo-1483729558449-99ef09a8c325", color: "#1DB954" },
              { name: "Thailand", flag: "🇹🇭", img: "photo-1506905925346-21bda4d32df4", color: "#FF6B6B" },
              { name: "Italy",    flag: "🇮🇹", img: "photo-1552832230-c0197dd311b5", color: "#4ECDC4" },
              { name: "Tokyo",    flag: "🇯🇵", img: "photo-1540959733332-eab4deabeeaf", color: "#A78BFA" },
            ].map(({ name, flag, img, color }, i) => (
              <ScrollReveal key={name} direction="scale" delay={i * 80}>
                <a
                  href={`/packages/${name.toLowerCase()}`}
                  className="group relative block h-64 sm:h-80 overflow-hidden rounded-2xl shimmer-parent"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(https://images.unsplash.com/${img}?w=600&q=80)`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div
                    className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <span className="map-pin text-2xl" style={{ animationDelay: `${i * 0.3}s` }}>
                        {flag}
                      </span>
                      <span className="text-lg font-bold text-white drop-shadow-lg">
                        {name}
                      </span>
                    </div>
                    <div
                      className="mt-1 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                      style={{ background: color }}
                    />
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FINAL CTA BANNER
          ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-28">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center ken-burns opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80')",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-[var(--primary)] opacity-90" aria-hidden />

        <div className="relative mx-auto max-w-3xl px-6 text-center text-white">
          <ScrollReveal direction="up">
            <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Your next adventure<br />starts with one click
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="fade" delay={200}>
            <p className="mt-4 text-lg text-white/80">
              Explore 5 handpicked destinations. Let AI plan it all.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={350}>
            <a
              href="#destinations"
              onClick={(e) => { e.preventDefault(); destinationsRef.current?.scrollIntoView({ behavior: "smooth" }); }}
              className="btn-glow mt-8 inline-block rounded-full bg-[var(--accent)] px-10 py-4 text-lg font-bold text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              Start Exploring ✈️
            </a>
          </ScrollReveal>
        </div>
      </section>

    </main>
  );
}

