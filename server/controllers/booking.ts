/* ============================================================
   Controller: bookings
   ============================================================
   POST /   → createBooking   (auth + validated body)
   GET  /   → getUserBookings  (auth)
   GET  /:id → getBookingById  (auth, own booking only)
   ============================================================ */

import type { Request, Response } from "express";
import { getFirestore } from "../lib/firebase";
import { generateItinerary } from "../services/ai";
import type { BookingInput, UserPreferences, ApiResponse } from "../types";

/* ── Price helpers ──────────────────────────────────────────── */

const TRANSPORT_SURCHARGE: Record<string, number> = {
  Flight: 120,
  Train: 40,
  Bus: 0,
  Ferry: 60,
  Car: 20,
};

function calculateTotalPrice(
  basePrice: number,
  adults: number,
  children: number,
  seniors: number,
  transport: string,
): number {
  const totalPax = adults + children + seniors;
  const surcharge = TRANSPORT_SURCHARGE[transport] ?? 0;
  return (basePrice + surcharge) * totalPax;
}

/* ── CREATE BOOKING ─────────────────────────────────────────── */

export const createBooking = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const input = req.body as BookingInput;
    const userId = req.userId!;

    /* 1. Look up the package by city slug */
    const db = getFirestore();
    const pkgSnap = await db
      .collection("packages")
      .where("slug", "==", input.citySlug)
      .limit(1)
      .get();

    if (pkgSnap.empty) {
      res.status(404).json({
        success: false,
        error: `Package not found for slug "${input.citySlug}".`,
      } satisfies ApiResponse);
      return;
    }

    const pkgDoc  = pkgSnap.docs[0];
    const pkg     = { id: pkgDoc.id, ...pkgDoc.data() } as {
      id: string; name: string; base_price: number; slug: string; theme_key: string;
    };

    /* 2. Server-side price calculation */
    const { adults, children, seniors } = input.passengers;
    const totalPrice = calculateTotalPrice(
      pkg.base_price,
      adults,
      children ?? 0,
      seniors ?? 0,
      input.transportMode,
    );

    /* 3. AI itinerary (non-blocking — we await but fall back gracefully) */
    const aiPrefs: UserPreferences = {
      destination: pkg.name,
      origin: input.originCity,
      transport: input.transportMode,
      adults,
      children: children ?? 0,
      seniors: seniors ?? 0,
      nights: 4,
    };

    const aiResult = await generateItinerary(aiPrefs);

    /* 4. Insert booking into Firestore */
    const now = new Date().toISOString();
    const bookingRef = await db.collection("bookings").add({
      user_id:          userId,
      package_id:       pkg.id,
      package_name:     pkg.name,
      package_slug:     pkg.slug,
      package_theme:    pkg.theme_key,
      origin_city:      input.originCity,
      transport_mode:   input.transportMode,
      pax_details: {
        adults,
        children: children ?? 0,
        seniors:  seniors ?? 0,
      },
      base_price:       pkg.base_price,
      total_price:      totalPrice,
      ai_customization: aiResult,
      status:           "pending",
      payment_status:   "unpaid",
      created_at:       now,
      updated_at:       now,
    });

    const bookingSnap = await bookingRef.get();
    if (!bookingSnap.exists) {
      res.status(500).json({
        success: false,
        error: "Failed to create booking. Please try again.",
      } satisfies ApiResponse);
      return;
    }

    const booking = bookingSnap.data()!;

    /* 5. Success response */
    res.status(201).json({
      success: true,
      data: {
        booking_id:       bookingSnap.id,
        status:           booking.status,
        total_price:      booking.total_price,
        ai_customization: booking.ai_customization,
        created_at:       booking.created_at,
      },
    } satisfies ApiResponse);
  } catch (err) {
    console.error("[Booking] Unhandled error:", (err as Error).message);
    res.status(500).json({
      success: false,
      error: "Internal server error.",
    } satisfies ApiResponse);
  }
};

/* ── GET USER BOOKINGS ──────────────────────────────────────── */

export const getUserBookings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId!;

    const db = getFirestore();
    const snap = await db
      .collection("bookings")
      .where("user_id", "==", userId)
      .orderBy("created_at", "desc")
      .get();

    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.json({ success: true, data } satisfies ApiResponse);
  } catch (err) {
    console.error("[Booking] Unhandled error:", (err as Error).message);
    res.status(500).json({
      success: false,
      error: "Internal server error.",
    } satisfies ApiResponse);
  }
};

/* ── GET BOOKING BY ID ──────────────────────────────────────── */

export const getBookingById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const db   = getFirestore();
    const snap = await db.collection("bookings").doc(id).get();

    if (!snap.exists) {
      res.status(404).json({
        success: false,
        error: "Booking not found.",
      } satisfies ApiResponse);
      return;
    }

    const data = { id: snap.id, ...snap.data() } as Record<string, unknown>;

    /* Ownership check */
    if (data.user_id !== userId) {
      res.status(404).json({
        success: false,
        error: "Booking not found.",
      } satisfies ApiResponse);
      return;
    }

    res.json({ success: true, data } satisfies ApiResponse);
  } catch (err) {
    console.error("[Booking] Unhandled error:", (err as Error).message);
    res.status(500).json({
      success: false,
      error: "Internal server error.",
    } satisfies ApiResponse);
  }
};
