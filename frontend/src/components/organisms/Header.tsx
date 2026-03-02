/* ============================================================
   Organism: Header  (v3 — animated)
   ============================================================
   • Slides down on mount (header-mount)
   • Shrinks + deepens shadow on scroll
   • Nav links get animated underline on hover
   • Brand logo gets sparkle ✦ decoration on hover
   ============================================================ */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/atoms";
import { useAuth } from "@/context/AuthContext";
import { useTheme, type ColorMode } from "@/context/ThemeContext";

const destinations = [
  { label: "✈ Mumbai",   href: "/packages/mumbai"   },
  { label: "🌊 Rio",      href: "/packages/rio"      },
  { label: "🏖 Thailand", href: "/packages/thailand" },
  { label: "🍕 Italy",    href: "/packages/italy"    },
  { label: "⛩ Tokyo",    href: "/packages/tokyo"    },
] as const;

const MODE_CYCLE: Record<ColorMode, { icon: string; label: string; next: ColorMode }> = {
  light: { icon: "☀️", label: "Light", next: "dark" },
  dark:  { icon: "🌙", label: "Dark",  next: "light" },
};

export default function Header() {
  const { isAuthenticated, displayName, openAuthModal, logout } = useAuth();
  const { colorMode, setColorMode } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const safeMode = colorMode as ColorMode;
  const { icon, label, next } = MODE_CYCLE[safeMode];

  return (
    <header
      className={[
        "header-mount sticky top-0 z-40 w-full border-b transition-all duration-300",
        scrolled
          ? "border-[var(--border)] shadow-lg h-14"
          : "border-transparent h-16",
      ].join(" ")}
      style={{
        backgroundColor: scrolled
          ? "color-mix(in srgb, var(--background) 95%, transparent)"
          : "color-mix(in srgb, var(--background) 80%, transparent)",
        backdropFilter: "blur(16px) saturate(2)",
        WebkitBackdropFilter: "blur(16px) saturate(2)",
      }}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">

        {/* ── Brand ──────────────────────────────────────── */}
        <Link
          href="/"
          className="group relative flex items-center gap-2 text-xl font-bold tracking-tight text-[var(--primary)] transition-all duration-300 hover:opacity-90"
        >
          <Image
            src="/favicon.ico"
            alt="TravelWithUs"
            width={22}
            height={22}
            className="rounded-sm"
          />
          <span className="relative">
            TravelWithUs
            {/* Sparkle decoration on hover */}
            <span
              className="pointer-events-none absolute -right-4 -top-1 text-xs text-[var(--accent)] opacity-0 group-hover:opacity-100 sparkle transition-opacity"
              aria-hidden
            >
              ✦
            </span>
          </span>
        </Link>

        {/* ── Destination Links ─────────────────────────── */}
        <nav className="hidden items-center gap-1 md:flex">
          {destinations.map((d, i) => (
            <Link
              key={d.href}
              href={d.href}
              className="nav-underline rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--body)] transition-colors hover:text-[var(--primary)]"
              style={{ animationDelay: `${0.05 + i * 0.05}s` }}
            >
              {d.label}
            </Link>
          ))}
        </nav>

        {/* ── Theme Toggle + Auth ───────────────────────── */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setColorMode(next)}
            className="flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--body)] transition-all hover:bg-[var(--surface)] hover:scale-105 active:scale-95"
            aria-label={`Switch to ${next} mode`}
          >
            <span>{icon}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>

          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-[var(--body)] sm:inline">
                Hi, <strong>{displayName}</strong>
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                Log Out
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={openAuthModal}
              className="transition-transform hover:scale-105 active:scale-95"
            >
              Log In ✈️
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

