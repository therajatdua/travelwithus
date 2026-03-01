"use strict";
/* ============================================================
   Server – Shared TypeScript Types
   ============================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingInputSchema = exports.PaxDetailsSchema = exports.TransportModeSchema = void 0;
const zod_1 = require("zod");
/* ── Zod Schemas ────────────────────────────────────────────── */
exports.TransportModeSchema = zod_1.z.enum([
    "Flight",
    "Train",
    "Bus",
    "Ferry",
    "Car",
]);
exports.PaxDetailsSchema = zod_1.z.object({
    adults: zod_1.z.number().int().min(1, "At least 1 adult is required"),
    children: zod_1.z.number().int().min(0).default(0),
    seniors: zod_1.z.number().int().min(0).default(0),
});
exports.BookingInputSchema = zod_1.z.object({
    citySlug: zod_1.z.string().min(1),
    originCountry: zod_1.z.string().min(1, "Origin country is required").optional(),
    originState: zod_1.z.string().min(1, "Origin state is required").optional(),
    originCity: zod_1.z.string().min(1, "Origin city is required"),
    transportMode: exports.TransportModeSchema,
    passengers: exports.PaxDetailsSchema,
    travelDates: zod_1.z
        .object({
        start: zod_1.z.string().optional(),
        end: zod_1.z.string().optional(),
    })
        .optional(),
});
//# sourceMappingURL=types.js.map