/* ============================================================
   Organism: Footer
   ============================================================
   Multi-column footer — brand, destinations, company links,
   social icons, and copyright.
   ============================================================ */

import Link from "next/link";
import { BRAND_NAME, BRAND_TAGLINE, BRAND_LEGAL } from "@/lib/constants";

const destinations = [
  { label: "Mumbai",   href: "/packages/mumbai",   flag: "🇮🇳" },
  { label: "Rio",      href: "/packages/rio",       flag: "🇧🇷" },
  { label: "Thailand", href: "/packages/thailand",  flag: "🇹🇭" },
  { label: "Italy",    href: "/packages/italy",     flag: "🇮🇹" },
  { label: "Tokyo",    href: "/packages/tokyo",     flag: "🇯🇵" },
] as const;

const company = [
  { label: "About Us",     href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing",      href: "/pricing" },
  { label: "Blog",         href: "/blog" },
  { label: "Careers",      href: "/careers" },
] as const;

const legal = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use",   href: "/terms" },
  { label: "Cookie Policy",  href: "/cookies" },
  { label: "Contact Us",     href: "/contact" },
] as const;

/* Simple inline SVG social icons */
const socials = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
] as const;

export default function Footer() {
  return (
    <footer
      className="theme-transition"
      style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
    >
      {/* ── Main grid ──────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* ── Brand column ─────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-xl font-extrabold tracking-tight"
              style={{ color: "var(--primary)" }}
            >
              {BRAND_NAME}
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "var(--body)" }}>
              {BRAND_TAGLINE}
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              AI-powered packages · Handpicked destinations · Best prices
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border transition-colors hover:opacity-80"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--muted)",
                    background: "var(--surface-alt)",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Destinations column ───────────────────────── */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Destinations
            </h3>
            <ul className="flex flex-col gap-2">
              {destinations.map((d) => (
                <li key={d.href}>
                  <Link
                    href={d.href}
                    className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
                    style={{ color: "var(--body)" }}
                  >
                    <span>{d.flag}</span>
                    <span>{d.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company column ────────────────────────────── */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Company
            </h3>
            <ul className="flex flex-col gap-2">
              {company.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-sm transition-colors hover:opacity-80"
                    style={{ color: "var(--body)" }}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Legal column ──────────────────────────────── */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Legal
            </h3>
            <ul className="flex flex-col gap-2">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm transition-colors hover:opacity-80"
                    style={{ color: "var(--body)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* App download nudge */}
            <div
              className="mt-4 rounded-xl p-3 text-xs leading-relaxed"
              style={{ background: "var(--surface-alt)", color: "var(--body)" }}
            >
              <p className="font-semibold" style={{ color: "var(--heading)" }}>✈️ Plan smarter</p>
              <p className="mt-0.5" style={{ color: "var(--muted)" }}>
                AI itineraries · Real-time prices · Zero hassle
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────── */}
      <div
        className="border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row">
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {BRAND_LEGAL}
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Made with ❤️ for travellers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}

