/* ============================================================
   Hook: useBooking
   ============================================================
   Abstracts the POST /api/bookings call. Handles loading, error,
   and the booking result (including AI itinerary).

   Auth: Reads Supabase session token automatically via
         @supabase/ssr browser client.
   ============================================================ */

"use client";

import { useState, useCallback } from "react";
import { API_URL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

/* ── Types ──────────────────────────────────────────────────── */

export interface BookingPayload {
  citySlug: string;
  originCity: string;
  transportMode: string;
  passengers: {
    adults: number;
    children: number;
    seniors: number;
  };
  travelDates?: {
    start?: string;
    end?: string;
  };
}

export interface AIDailyPlan {
  day: number;
  activity: string;
  time: string;
}

export interface BookingResult {
  booking_id: string;
  status: string;
  total_price: number;
  ai_customization: {
    daily_plan: AIDailyPlan[];
    vibe_score: number;
    suggested_addons: string[];
  };
  created_at: string;
}

interface ApiErrorDetail {
  path: string;
  message: string;
}

/* ── Hook ───────────────────────────────────────────────────── */

export function useBooking() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    ApiErrorDetail[] | null
  >(null);

  const submitBooking = useCallback(
    async (payload: BookingPayload) => {
      setIsLoading(true);
      setError(null);
      setResult(null);
      setValidationErrors(null);

      try {
        /* Build headers — grab Supabase session token if available */
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        try {
          const supabase = createClient();
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session?.access_token) {
            headers["Authorization"] = `Bearer ${session.access_token}`;
          }
        } catch {
          /* Supabase not configured — continue without auth header */
        }

        const res = await fetch(`${API_URL}/api/bookings`, {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          /* Validation errors from Zod */
          if (json.details) {
            setValidationErrors(json.details);
          }
          throw new Error(json.error || `Request failed (${res.status})`);
        }

        setResult(json.data as BookingResult);
        return json.data as BookingResult;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setResult(null);
    setValidationErrors(null);
  }, []);

  return {
    submitBooking,
    isLoading,
    error,
    validationErrors,
    result,
    reset,
  };
}
