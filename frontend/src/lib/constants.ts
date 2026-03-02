/* ============================================================
   TravelWithUs – Global Constants & Brand Strings
   ============================================================
   Single source of truth for brand name, taglines, API URLs,
   and any magic strings used across the application.
   ============================================================ */

/* ── Brand ──────────────────────────────────────────────────── */
export const BRAND_NAME = "TravelWithUs";
export const BRAND_TAGLINE = "Your AI-Powered Global Travel Platform";
export const BRAND_DESCRIPTION =
  "Discover curated travel packages with immersive destination themes. Mumbai, Rio, Thailand, Italy, Tokyo — your next adventure awaits.";
export const BRAND_LEGAL = `© ${new Date().getFullYear()} TravelWithUs. All rights reserved.`;

/* ── SEO / Metadata ─────────────────────────────────────────── */
export const META_TITLE = "TravelWithUs | Global AI Travel Platform";
export const META_DESCRIPTION = BRAND_DESCRIPTION;

/* ── API ────────────────────────────────────────────────────── */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

/* ── Firebase (public config — safe for client bundle) ─────── */
export const FIREBASE_CONFIG = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY            ?? "",
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        ?? "",
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID         ?? "",
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID             ?? "",
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID     ?? "",
};

/* ── Auth Routes ────────────────────────────────────────────── */
export const LOGIN_PATH = "/login";
export const PROTECTED_PREFIXES = ["/admin", "/bookings"] as const;
export const PROTECTED_PATTERNS = [/^\/packages\/[^/]+\/book$/] as const;

/* ── Local Storage Keys ─────────────────────────────────────── */
export const LS_COLOR_MODE = "travelwithus-color-mode";
export const LS_AUTH_USER = "travelwithus-auth-user";
export const DEMO_AUTH_COOKIE = "travelwithus-demo-auth";
