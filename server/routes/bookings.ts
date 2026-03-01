/* ============================================================
   Routes: /api/bookings
   ============================================================
   POST /           → Create a new booking  (auth + validation)
   GET  /           → List current user's bookings  (auth)
   GET  /:id        → Get a single booking by ID  (auth)
   ============================================================ */

import { Router } from "express";
import { authenticateUser, validateRequest } from "../middlewares/auth";
import { BookingInputSchema } from "../types";
import {
  createBooking,
  getUserBookings,
  getBookingById,
} from "../controllers/booking";

const router = Router();

/* All booking routes require authentication */
router.use(authenticateUser);

router.post("/", validateRequest(BookingInputSchema), createBooking);
router.get("/", getUserBookings);
router.get("/:id", getBookingById);

export default router;
