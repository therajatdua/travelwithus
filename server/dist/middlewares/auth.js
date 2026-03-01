"use strict";
/* ============================================================
   Middleware: authenticateUser + validateRequest
   ============================================================
   authenticateUser  → Extracts Bearer token, verifies it via
                       Supabase, attaches userId to req.
   validateRequest   → HOF that takes a Zod schema and validates
                       req.body before the handler runs.
   ============================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
exports.validateRequest = validateRequest;
const supabase_1 = require("../lib/supabase");
/* ──────────────────────────────────────────────────────────────
   AUTH MIDDLEWARE
   ────────────────────────────────────────────────────────────── */
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                error: "Missing or malformed Authorization header.",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        const { data: { user }, error, } = await supabase_1.supabase.auth.getUser(token);
        if (error || !user) {
            res.status(401).json({
                success: false,
                error: "Invalid or expired token.",
            });
            return;
        }
        /* Attach user info to the request for downstream handlers */
        req.userId = user.id;
        req.supabaseUser = { id: user.id, email: user.email };
        next();
    }
    catch (err) {
        console.error("[Auth Middleware]", err);
        res.status(500).json({ success: false, error: "Auth verification failed." });
    }
};
exports.authenticateUser = authenticateUser;
/* ──────────────────────────────────────────────────────────────
   VALIDATION MIDDLEWARE (Higher-Order Function)
   ────────────────────────────────────────────────────────────── */
function validateRequest(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const formatted = result.error.issues.map((i) => ({
                path: i.path.join("."),
                message: i.message,
            }));
            res.status(400).json({
                success: false,
                error: "Validation failed.",
                details: formatted,
            });
            return;
        }
        /* Replace body with the parsed (and default-filled) data */
        req.body = result.data;
        next();
    };
}
//# sourceMappingURL=auth.js.map