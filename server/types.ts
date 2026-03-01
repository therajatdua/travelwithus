/* ============================================================
   Server – Shared TypeScript Types
   ============================================================ */

import { z } from "zod";

/* ── Zod Schemas ────────────────────────────────────────────── */

export const TransportModeSchema = z.enum([
  "Flight",
  "Train",
  "Bus",
  "Ferry",
  "Car",
]);

export const PaxDetailsSchema = z.object({
  adults: z.number().int().min(1, "At least 1 adult is required"),
  children: z.number().int().min(0).default(0),
  seniors: z.number().int().min(0).default(0),
});

export const BookingInputSchema = z.object({
  citySlug: z.string().min(1),
  originCountry: z.string().min(1, "Origin country is required").optional(),
  originState: z.string().min(1, "Origin state is required").optional(),
  originCity: z.string().min(1, "Origin city is required"),
  transportMode: TransportModeSchema,
  passengers: PaxDetailsSchema,
  travelDates: z
    .object({
      start: z.string().optional(),
      end: z.string().optional(),
    })
    .optional(),
});

export type BookingInput = z.infer<typeof BookingInputSchema>;
export type TransportMode = z.infer<typeof TransportModeSchema>;
export type PaxDetails = z.infer<typeof PaxDetailsSchema>;

/* ── AI Response Types ──────────────────────────────────────── */

export interface AIDailyPlan {
  day: number;
  activity: string;
  time: string;
}

export interface AIResponse {
  daily_plan: AIDailyPlan[];
  vibe_score: number;
  suggested_addons: string[];
}

/* ── User Preferences for AI ────────────────────────────────── */

export interface UserPreferences {
  destination: string;
  origin: string;
  transport: string;
  adults: number;
  children: number;
  seniors: number;
  nights: number;
}

/* ── API Response Envelope ──────────────────────────────────── */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/* ── Express Request augmentation ───────────────────────────── */

declare global {
  namespace Express {
    interface Request {
      /** Authenticated user ID (set by authenticateUser middleware) */
      userId?: string;
      /** Full Supabase user object */
      supabaseUser?: { id: string; email?: string };
    }
  }
}
