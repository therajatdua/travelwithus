"use strict";
/* ============================================================
   TravelWithUs – Express Server Entry Point  (v2 Hardened)
   ============================================================ */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
/* Load env vars before any module that reads process.env */
dotenv_1.default.config();
const packages_1 = __importDefault(require("./routes/packages"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const logger_1 = require("./middlewares/logger");
const errorHandler_1 = require("./middlewares/errorHandler");
const ai_1 = require("./services/ai");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
/* ── Security Middleware ──────────────────────────────────── */
app.use((0, helmet_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." },
});
app.use(limiter);
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(logger_1.logger);
/* ── Routes ──────────────────────────────────────────────── */
app.use("/api/packages", packages_1.default);
app.use("/api/bookings", bookings_1.default);
/* ── Health: server ─────────────────────────────────────── */
app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        ai_key_present: (0, ai_1.hasValidAIKey)(),
    });
});
/* ── Health: AI (real ping — never lies) ────────────────── */
app.get("/api/ai/health", async (_req, res) => {
    const result = await (0, ai_1.pingAI)();
    const httpStatus = result.ok ? 200 : 503;
    res.status(httpStatus).json({
        status: result.ok ? "ok" : "down",
        model: process.env.AI_MODEL || "gemini-2.5-flash",
        latency_ms: result.latencyMs,
        ...(result.error ? { error: result.error } : {}),
    });
});
/* ── Centralized error handler (MUST be last) ───────────── */
app.use(errorHandler_1.errorHandler);
/* ── Start ───────────────────────────────────────────────── */
app.listen(PORT, () => {
    console.log(`🚀 TravelWithUs API running on http://localhost:${PORT}`);
    console.log(`   AI key configured: ${(0, ai_1.hasValidAIKey)()}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map