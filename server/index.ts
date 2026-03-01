/* ============================================================
   TravelWithUs – Express Server Entry Point  (v2 Hardened)
   ============================================================ */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

/* Load env vars before any module that reads process.env */
dotenv.config();

import packageRoutes from "./routes/packages";
import bookingRoutes from "./routes/bookings";
import chatRoutes from "./routes/chat";
import { logger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { pingAI, hasValidAIKey } from "./services/ai";

const app = express();
const PORT = process.env.PORT || 5001;

/* ── Security Middleware ──────────────────────────────────── */
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(limiter);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(logger);

/* ── Routes ──────────────────────────────────────────────── */
app.use("/api/packages", packageRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/chat", chatRoutes);

/* ── Health: server ─────────────────────────────────────── */
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    ai_key_present: hasValidAIKey(),
  });
});

/* ── Health: AI (real ping — never lies) ────────────────── */
app.get("/api/ai/health", async (_req, res) => {
  const result = await pingAI();
  const httpStatus = result.ok ? 200 : 503;
  res.status(httpStatus).json({
    status:     result.ok ? "ok" : "down",
    model:      process.env.AI_MODEL || "gemini-2.5-flash",
    latency_ms: result.latencyMs,
    ...(result.error ? { error: result.error } : {}),
  });
});

/* ── Centralized error handler (MUST be last) ───────────── */
app.use(errorHandler);

/* ── Start ───────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`🚀 TravelWithUs API running on http://localhost:${PORT}`);
  console.log(`   AI key configured: ${hasValidAIKey()}`);
});

export default app;

