/* ============================================================
   TravelWithUs – Home Page  (v4 — Premium Edition)
   ============================================================ */

"use client";

import { useRef } from "react";
import { HeroSearchWidget } from "@/components/home/HeroSearchWidget";
import { DestinationGrid } from "@/components/organisms";
import { Typography, ScrollReveal } from "@/components/atoms";

/* Marquee stat items */
const STATS = [
  { icon: "✈️", label: "5 Curated Destinations" },
  { icon: "🗺️", label: "100+ Day Itineraries" },
  { icon: "🤖", label: "AI-Powered Planning" },
  { icon: "⭐", label: "Highest-Rated Packages" },
  { icon: "💰", label: "Best Price Guarantee" },
  { icon: "🌍", label: "50K+ Happy Travellers" },
];

const TESTIMONIALS = [
  {
    quote: "The AI itinerary for Tokyo was so good I thought a local wrote it. Every restaurant recommendation was perfect.",
    name: "Priya S.",
    location: "Bangalore, India",
    dest: "🇯🇵 Tokyo",
    avatar: "PS",
  },
  {
    quote: "Booked Rio in under 3 minutes. The whole UI changed to carnival colours and I was already in holiday mode before I left.",
    name: "Marcus O.",
    location: "London, UK",
    dest: "🇧🇷 Rio de Janeiro",
    avatar: "MO",
  },
  {
    quote: "Italy package was immaculate. Taj Mahal Palace included, no hidden charges, and the Tuscan wine day trip was chef's kiss.",
    name: "Anika M.",
    location: "Mumbai, India",
    dest: "🇮🇹 Italy",
    avatar: "AM",
  },
];

export default function HomePage() {
  const destinationsRef = useRef<HTMLElement>(null);

  return (
    <main className="bg-[var(--background)] text-[var(--body)] transition-colors duration-500 overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════
          HERO  — cinematic fullscreen with glass search
          ══════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">

        {/* Background — Ken Burns */}
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center ken-burns"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=90')" }}
          aria-hidden
        />

        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/55 to-black/80" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0F3057]/40 via-transparent to-[#0F3057]/20" aria-hidden />

        {/* Luxury badge */}
        <div
          className="hero-word relative z-10 mb-8 flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm"
          style={{ background: "rgba(255,255,255,0.06)", animationDelay: "0s" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          AI-Powered · Curated · Premium
        </div>

        {/* Hero headline */}
        <div className="relative z-10 mb-6 text-center text-white max-w-5xl">
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight drop-shadow-2xl md:text-7xl lg:text-8xl"
              style={{ perspective: "800px" }}>
            {"Where do you want".split(" ").map((word, i) => (
              <span key={i} className="hero-word mr-[0.22em]" style={{ animationDelay: `${i * 0.1}s` }}>
                {word}
              </span>
            ))}
            <br />
            <span className="gradient-text-live">
              {"to go?".split(" ").map((word, i) => (
                <span key={i} className="hero-word mr-[0.22em]" style={{ animationDelay: `${(i + 4) * 0.1}s` }}>
                  {word}
                </span>
              ))}
            </span>
          </h1>

          <p className="hero-word mt-6 text-base font-light tracking-wide text-white/70 md:text-lg max-w-xl mx-auto" style={{ animationDelay: "0.7s" }}>
            Five handpicked destinations. One AI that plans your whole trip.
            <br className="hidden md:block" />
            No agency. No fees. Just travel.
          </p>
        </div>

        {/* Glassmorphic Search Widget */}
        <div className="relative z-10 w-full max-w-4xl hero-word" style={{ animationDelay: "0.9s" }}>
          <HeroSearchWidget />
        </div>

        {/* Trust strip */}
        <div className="hero-word relative z-10 mt-8 flex flex-wrap items-center justify-center gap-6 text-white/50 text-xs tracking-wider" style={{ animationDelay: "1.1s" }}>
          {["50K+ travellers", "4.9 ★ rating", "Free cancellation", "No hidden fees"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <span className="h-px w-4 bg-white/30" />
              {t}
            </span>
          ))}
        </div>

        {/* Scroll cue */}
        <button
          type="button"
          aria-label="Scroll to destinations"
          onClick={() => destinationsRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-white/80 transition-colors group"
        >
          <svg className="animate-bounce" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 16l-6-6h12z" />
          </svg>
        </button>
      </section>

      {/* ══════════════════════════════════════════════════════
          MARQUEE STATS STRIP
          ══════════════════════════════════════════════════════ */}
      <div className="overflow-hidden border-y border-[var(--border)] bg-[var(--surface)] py-3">
        <div className="marquee-track gap-12">
          {[...STATS, ...STATS].map((s, i) => (
            <div key={i} className="flex items-center gap-2 whitespace-nowrap px-6 text-sm font-semibold text-[var(--body)]">
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
      <section ref={destinationsRef} className="mx-auto max-w-7xl px-6 py-28">
        <ScrollReveal direction="up" className="text-center mb-3">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--primary)] mb-4">Handpicked destinations</p>
          <Typography variant="h2" className="text-[var(--heading)]">
            Select Your{" "}
            <span className="gradient-text-live">Vibe</span>
          </Typography>
        </ScrollReveal>
        <ScrollReveal direction="fade" delay={150} className="text-center mb-16">
          <p className="mx-auto max-w-lg text-[var(--body)] text-base">
            Each destination transforms the entire experience — colours, itinerary, hotels. Pick yours.
          </p>
        </ScrollReveal>
        <DestinationGrid />
      </section>

      {/* ══════════════════════════════════════════════════════
          WHY CHOOSE US
          ══════════════════════════════════════════════════════ */}
      <section className="py-28" style={{ background: "var(--surface)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal direction="up" className="text-center mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--primary)] mb-4">The TravelWithUs difference</p>
            <Typography variant="h2" className="text-[var(--heading)]">Why travellers choose us</Typography>
          </ScrollReveal>
          <ScrollReveal direction="fade" delay={100} className="text-center mb-16">
            <p className="max-w-lg mx-auto text-[var(--body)]">We built the travel experience we always wanted — and couldn't find.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "🤖", title: "AI Itineraries",      body: "Gemini AI builds a bespoke day-by-day plan in seconds, tuned to your group size and travel style." },
              { icon: "🎨", title: "Immersive Themes",     body: "Every city flips the entire UI to match its aesthetic — Mumbai gold, Tokyo neon, Rio carnival." },
              { icon: "💳", title: "Transparent Pricing",  body: "Flat package prices, zero hidden fees, zero confusing add-ons. What you see is what you pay." },
              { icon: "📞", title: "24/7 AI Concierge",    body: "Chat with Travyy, our AI assistant, anytime. A real agent is one message away too." },
            ].map(({ icon, title, body }, i) => (
              <ScrollReveal key={title} direction="up" delay={i * 80}>
                <div
                  className="relative overflow-hidden rounded-2xl p-7 h-full flex flex-col gap-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                  style={{ background: "var(--background)", border: "1px solid var(--border)" }}
                >
                  {/* Accent corner glow */}
                  <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-10" style={{ background: "var(--primary)" }} />
                  <span className="text-4xl">{icon}</span>
                  <h3 className="text-base font-bold" style={{ color: "var(--heading)" }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--body)" }}>{body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5 WORLDS PHOTO STRIP
          ══════════════════════════════════════════════════════ */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal direction="up" className="text-center mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--primary)] mb-4">Every continent, one platform</p>
            <Typography variant="h2" className="text-[var(--heading)]">5 worlds. 1 platform.</Typography>
          </ScrollReveal>
          <ScrollReveal direction="fade" delay={100} className="text-center mb-16">
            <p className="max-w-lg mx-auto text-[var(--body)]">Step into a destination — and feel it before you fly.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            {[
              { name: "Mumbai",   flag: "🇮🇳", img: "photo-1567157577867-05ccb1388e66", color: "#E87817", price: "$1,299" },
              { name: "Rio",      flag: "🇧🇷", img: "photo-1483729558449-99ef09a8c325", color: "#1DB954", price: "$1,749" },
              { name: "Thailand", flag: "🇹🇭", img: "photo-1506905925346-21bda4d32df4", color: "#FF6B6B", price: "$1,149" },
              { name: "Italy",    flag: "🇮🇹", img: "photo-1552832230-c0197dd311b5", color: "#4ECDC4", price: "$2,199" },
              { name: "Tokyo",    flag: "🇯🇵", img: "photo-1540959733332-eab4deabeeaf", color: "#A78BFA", price: "$1,899" },
            ].map(({ name, flag, img, color, price }, i) => (
              <ScrollReveal key={name} direction="scale" delay={i * 70}>
                <a
                  href={`/packages/${name.toLowerCase()}`}
                  className="group relative block h-72 sm:h-96 overflow-hidden rounded-2xl"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(https://images.unsplash.com/${img}?w=600&q=80)` }}
                  />
                  {/* Gradient with accent colour at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-500 group-hover:h-1.5"
                    style={{ background: color }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-2xl block mb-1">{flag}</span>
                        <span className="text-base font-black text-white">{name}</span>
                      </div>
                      <div className="text-right opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <div className="text-xs text-white/60 mb-0.5">from</div>
                        <div className="text-sm font-bold" style={{ color }}>{price}</div>
                      </div>
                    </div>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TESTIMONIALS
          ══════════════════════════════════════════════════════ */}
      <section className="py-28" style={{ background: "var(--surface)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal direction="up" className="text-center mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--primary)] mb-4">Traveller stories</p>
            <Typography variant="h2" className="text-[var(--heading)]">Real trips. Real people.</Typography>
          </ScrollReveal>
          <ScrollReveal direction="fade" delay={100} className="text-center mb-16">
            <p className="max-w-lg mx-auto text-[var(--body)]">Don't take our word for it.</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <ScrollReveal key={t.name} direction="up" delay={i * 100}>
                <div
                  className="relative rounded-2xl p-8 flex flex-col gap-6 h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                  style={{ background: "var(--background)", border: "1px solid var(--border)" }}
                >
                  {/* Opening quote */}
                  <div className="text-5xl font-black leading-none" style={{ color: "var(--primary)", opacity: 0.15 }}>"</div>
                  <p className="text-sm leading-relaxed -mt-6" style={{ color: "var(--body)" }}>"{t.quote}"</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div
                      className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-xs font-black text-white"
                      style={{ background: "var(--primary)" }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: "var(--heading)" }}>{t.name}</div>
                      <div className="text-xs" style={{ color: "var(--muted)" }}>{t.location} · {t.dest}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FINAL CTA
          ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-36">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center ken-burns"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80')" }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0F3057]/95 via-[#0F3057]/85 to-[#C6A75E]/60" aria-hidden />

        <div className="relative mx-auto max-w-3xl px-6 text-center text-white">
          <ScrollReveal direction="up">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/50 mb-6">Your adventure awaits</p>
            <h2 className="text-4xl font-black leading-tight md:text-6xl">
              Your next adventure<br />
              <span className="gradient-text-live">starts right here.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="fade" delay={200}>
            <p className="mt-5 text-lg text-white/70 font-light">
              5 destinations. AI-planned itineraries. Zero hassle.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={350}>
            <a
              onClick={(e) => { e.preventDefault(); destinationsRef.current?.scrollIntoView({ behavior: "smooth" }); }}
              href="#destinations"
              className="btn-glow mt-10 inline-flex items-center gap-3 rounded-full px-10 py-5 text-base font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(198,167,94,0.4)] active:scale-95"
              style={{ background: "linear-gradient(135deg, var(--accent) 0%, #B89640 100%)" }}
            >
              Start Exploring
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </ScrollReveal>
        </div>
      </section>

    </main>
  );
}
