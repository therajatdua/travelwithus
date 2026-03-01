"use strict";
/* ============================================================
   Controller: bookings
   ============================================================
   POST /   → createBooking   (auth + validated body)
   GET  /   → getUserBookings  (auth)
   GET  /:id → getBookingById  (auth, own booking only)
   ============================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingById = exports.getUserBookings = exports.createBooking = void 0;
const supabase_1 = require("../lib/supabase");
const ai_1 = require("../services/ai");
/* ── Price helpers ──────────────────────────────────────────── */
const TRANSPORT_SURCHARGE = {
    Flight: 120,
    Train: 40,
    Bus: 0,
    Ferry: 60,
    Car: 20,
};
function calculateTotalPrice(basePrice, adults, children, seniors, transport) {
    const totalPax = adults + children + seniors;
    const surcharge = TRANSPORT_SURCHARGE[transport] ?? 0;
    return (basePrice + surcharge) * totalPax;
}
/* ── CREATE BOOKING ─────────────────────────────────────────── */
const createBooking = async (req, res) => {
    try {
        const input = req.body;
        const userId = req.userId;
        /* 1. Look up the package by city slug */
        const { data: pkg, error: pkgErr } = await supabase_1.supabaseAdmin
            .from("packages")
            .select("id, name, base_price, slug, theme_key")
            .eq("slug", input.citySlug)
            .single();
        if (pkgErr || !pkg) {
            res.status(404).json({
                success: false,
                error: `Package not found for slug "${input.citySlug}".`,
            });
            return;
        }
        /* 2. Server-side price calculation */
        const { adults, children, seniors } = input.passengers;
        const totalPrice = calculateTotalPrice(pkg.base_price, adults, children ?? 0, seniors ?? 0, input.transportMode);
        /* 3. AI itinerary (non-blocking — we await but fall back gracefully) */
        const aiPrefs = {
            destination: pkg.name,
            origin: input.originCity,
            transport: input.transportMode,
            adults,
            children: children ?? 0,
            seniors: seniors ?? 0,
            nights: 4, // default 5-day package (4 nights)
        };
        const aiResult = await (0, ai_1.generateItinerary)(aiPrefs);
        /* 4. Insert booking via admin client (bypasses RLS) */
        const { data: booking, error: insertErr } = await supabase_1.supabaseAdmin
            .from("bookings")
            .insert({
            user_id: userId,
            package_id: pkg.id,
            origin_city: input.originCity,
            transport_mode: input.transportMode,
            pax_details: {
                adults,
                children: children ?? 0,
                seniors: seniors ?? 0,
            },
            base_price: pkg.base_price,
            total_price: totalPrice,
            ai_customization: aiResult,
            status: "pending",
        })
            .select("id, status, total_price, ai_customization, created_at")
            .single();
        if (insertErr) {
            console.error("[Booking] Insert failed:", insertErr.message);
            res.status(500).json({
                success: false,
                error: "Failed to create booking. Please try again.",
            });
            return;
        }
        /* 5. Success response */
        res.status(201).json({
            success: true,
            data: {
                booking_id: booking.id,
                status: booking.status,
                total_price: booking.total_price,
                ai_customization: booking.ai_customization,
                created_at: booking.created_at,
            },
        });
    }
    catch (err) {
        console.error("[Booking] Unhandled error:", err.message);
        res.status(500).json({
            success: false,
            error: "Internal server error.",
        });
    }
};
exports.createBooking = createBooking;
/* ── GET USER BOOKINGS ──────────────────────────────────────── */
const getUserBookings = async (req, res) => {
    try {
        const userId = req.userId;
        const { data, error } = await supabase_1.supabaseAdmin
            .from("bookings")
            .select(`
        id,
        status,
        origin_city,
        transport_mode,
        pax_details,
        total_price,
        created_at,
        packages ( name, slug, theme_key )
      `)
            .eq("user_id", userId)
            .order("created_at", { ascending: false });
        if (error) {
            console.error("[Booking] Fetch failed:", error.message);
            res.status(500).json({
                success: false,
                error: "Failed to fetch bookings.",
            });
            return;
        }
        res.json({ success: true, data });
    }
    catch (err) {
        console.error("[Booking] Unhandled error:", err.message);
        res.status(500).json({
            success: false,
            error: "Internal server error.",
        });
    }
};
exports.getUserBookings = getUserBookings;
/* ── GET BOOKING BY ID ──────────────────────────────────────── */
const getBookingById = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { data, error } = await supabase_1.supabaseAdmin
            .from("bookings")
            .select(`
        id,
        status,
        origin_city,
        transport_mode,
        pax_details,
        base_price,
        total_price,
        ai_customization,
        created_at,
        updated_at,
        packages ( name, slug, theme_key )
      `)
            .eq("id", id)
            .eq("user_id", userId)
            .single();
        if (error || !data) {
            res.status(404).json({
                success: false,
                error: "Booking not found.",
            });
            return;
        }
        res.json({ success: true, data });
    }
    catch (err) {
        console.error("[Booking] Unhandled error:", err.message);
        res.status(500).json({
            success: false,
            error: "Internal server error.",
        });
    }
};
exports.getBookingById = getBookingById;
//# sourceMappingURL=booking.js.map