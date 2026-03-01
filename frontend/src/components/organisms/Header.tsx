/* ============================================================
   Organism: Header
   ============================================================
   Navigation bar — brand, destination links, theme mode toggle,
   and auth trigger button.
   ============================================================ */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/atoms";
import { useAuth } from "@/context/AuthContext";
import { useTheme, type ColorMode } from "@/context/ThemeContext";

const destinations = [
  { label: "Mumbai", href: "/packages/mumbai" },
  { label: "Rio", href: "/packages/rio" },
  { label: "Thailand", href: "/packages/thailand" },
  { label: "Italy", href: "/packages/italy" },
  { label: "Tokyo", href: "/packages/tokyo" },
] as const;

/* Icon labels & next-mode cycle: light → dark → system → light */
const MODE_CYCLE: Record<ColorMode, { icon: string; label: string; next: ColorMode }> = {
  light: { icon: "☀️", label: "Light", next: "dark" },
  dark:  { icon: "🌙", label: "Dark",  next: "system" },
  system:{ icon: "💻", label: "Auto",  next: "light" },
};

export default function Header() {
  const { isAuthenticated, displayName, openAuthModal, logout } = useAuth();
  const { colorMode, setColorMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeMode: ColorMode = mounted ? colorMode : "system";

  const { icon, label, next } = MODE_CYCLE[safeMode];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] backdrop-blur-md" style={{ backgroundColor: 'color-mix(in srgb, var(--background) 80%, transparent)' }}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* ── Brand ──────────────────────────────────────── */}
        <Link href="/" className="text-xl font-bold tracking-tight text-[var(--primary)]">
          TravelWithUs
        </Link>

        {/* ── Destination Links ─────────────────────────── */}
        <nav className="hidden items-center gap-5 md:flex">
          {destinations.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="text-sm font-medium text-[var(--body)] transition-colors hover:text-[var(--primary)]"
            >
              {d.label}
            </Link>
          ))}
        </nav>

        {/* ── Theme Toggle + Auth ───────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Theme mode toggle */}
          <button
            type="button"
            onClick={() => setColorMode(next)}
            className="flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--body)] transition-colors hover:bg-[var(--surface)]"
            aria-label={`Switch to ${next} mode`}
          >
            <span>{icon}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>

          {isAuthenticated ? (
            <>
              <span className="text-sm text-[var(--body)]">
                Hi, <strong>{displayName}</strong>
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                Log Out
              </Button>
            </>
          ) : (
            <Button variant="primary" size="sm" onClick={openAuthModal}>
              Log In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
