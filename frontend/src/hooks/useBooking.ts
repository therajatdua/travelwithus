/* ============================================================
   Hook: useBooking
   ============================================================
   Abstracts the POST /api/bookings call. Handles loading, error,
   and the booking result (including AI itinerary).

   Auth: Reads Firebase ID token from the current user.
   ============================================================ */

"use client";

import { useState, useCallback } from "react";
import { API_URL } from "@/lib/constants";
import { auth } from "@/lib/firebase/client";

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
        /* Build headers — grab Firebase ID token if available */
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        try {
          const currentUser = auth.currentUser;
          if (currentUser) {
            const idToken = await currentUser.getIdToken();
            headers["Authorization"] = `Bearer ${idToken}`;
          }
        } catch {
          /* Firebase not configured — continue without auth header */
        }

        const res = await fetch(`${API_URL}/api/bookings`, {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          if (res.status === 502 || res.status === 503) {
            throw new Error("AI service is under high demand. Please try again in a moment.");
          }
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
