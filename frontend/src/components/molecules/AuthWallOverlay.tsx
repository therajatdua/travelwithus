/* ============================================================
   Molecule: AuthWallOverlay
   ============================================================
   Blurred overlay with "Login to Unlock" CTA.
   Applied over gated content (itinerary) for guest users.
   ============================================================ */

"use client";

import Link from "next/link";
import { Button } from "@/components/atoms";
import { BRAND_NAME } from "@/lib/constants";

interface AuthWallOverlayProps {
  /** The path the user was trying to access (for redirect-back) */
  returnPath?: string;
  /** Custom message */
  message?: string;
}

export default function AuthWallOverlay({
  returnPath = "/login",
  message = "Sign in to unlock the full itinerary, AI recommendations, and booking.",
}: AuthWallOverlayProps) {
  const loginHref = returnPath.startsWith("/login")
    ? returnPath
    : `/login?next=${encodeURIComponent(returnPath)}`;

  return (
    <div className="relative mt-[-2rem] pt-8">
      {/* Blur / fade gradient mask */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent via-theme-bg/70 to-theme-bg" />

      {/* CTA Card */}
      <div className="relative z-20 mx-auto max-w-lg rounded-[var(--radius-lg)] border border-theme-accent bg-theme-surface p-8 text-center shadow-lg">
        <div className="mb-4 text-4xl">🔒</div>
        <h3 className="text-xl font-bold text-theme-heading">
          Unlock the Full Experience
        </h3>
        <p className="mt-2 text-sm text-theme-body">{message}</p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href={loginHref}>
            <Button variant="primary" size="lg">
              Sign In to {BRAND_NAME}
            </Button>
          </Link>
        </div>
        <p className="mt-3 text-xs text-theme-body/60">
          Free account — no credit card required.
        </p>
      </div>
    </div>
  );
}
