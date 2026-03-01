"use strict";
/* ============================================================
   Routes: /api/bookings
   ============================================================
   POST /           → Create a new booking  (auth + validation)
   GET  /           → List current user's bookings  (auth)
   GET  /:id        → Get a single booking by ID  (auth)
   ============================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const types_1 = require("../types");
const booking_1 = require("../controllers/booking");
const router = (0, express_1.Router)();
/* All booking routes require authentication */
router.use(auth_1.authenticateUser);
router.post("/", (0, auth_1.validateRequest)(types_1.BookingInputSchema), booking_1.createBooking);
router.get("/", booking_1.getUserBookings);
router.get("/:id", booking_1.getBookingById);
exports.default = router;
//# sourceMappingURL=bookings.js.map