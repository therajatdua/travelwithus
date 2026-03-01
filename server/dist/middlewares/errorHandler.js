"use strict";
/* ============================================================
   Centralized Error Handler Middleware
   ============================================================
   Catches all errors propagated via next(err).
   Handles:
     • ZodError         → 422 Unprocessable Entity
     • AIServiceError   → 503 Service Unavailable
     • Generic errors   → 500 Internal Server Error
   ============================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationError = exports.AIServiceError = void 0;
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
/* ── Typed custom error ─────────────────────────────────────── */
class AIServiceError extends Error {
    constructor(message, code = "AI_UNAVAILABLE") {
        super(message);
        this.name = "AIServiceError";
        this.code = code;
    }
}
exports.AIServiceError = AIServiceError;
class AuthorizationError extends Error {
    constructor(message, statusCode = 403) {
        super(message);
        this.name = "AuthorizationError";
        this.statusCode = statusCode;
    }
}
exports.AuthorizationError = AuthorizationError;
/* ── Handler ────────────────────────────────────────────────── */
function errorHandler(err, _req, res, _next) {
    /* Zod validation errors */
    if (err instanceof zod_1.ZodError) {
        res.status(422).json({
            success: false,
            error: "Validation failed",
            issues: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
        });
        return;
    }
    /* AI service down */
    if (err instanceof AIServiceError) {
        res.status(503).json({
            success: false,
            error: "AI service is temporarily unavailable. Please try again shortly.",
            code: err.code,
        });
        return;
    }
    /* Auth errors */
    if (err instanceof AuthorizationError) {
        res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
        return;
    }
    /* Generic fallback */
    const message = err instanceof Error
        ? err.message
        : "An unexpected error occurred.";
    console.error("[ERROR]", err);
    res.status(500).json({ success: false, error: message });
}
//# sourceMappingURL=errorHandler.js.map