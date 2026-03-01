/* ============================================================
   Middleware: authenticateUser + validateRequest
   ============================================================
   authenticateUser  → Extracts Bearer token, verifies it via
                       Supabase, attaches userId to req.
   validateRequest   → HOF that takes a Zod schema and validates
                       req.body before the handler runs.
   ============================================================ */

import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { ZodSchema } from "zod";
import { supabase } from "../lib/supabase";

/* ──────────────────────────────────────────────────────────────
   AUTH MIDDLEWARE
   ────────────────────────────────────────────────────────────── */

export const authenticateUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

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
  } catch (err) {
    console.error("[Auth Middleware]", err);
    res.status(500).json({ success: false, error: "Auth verification failed." });
  }
};

/* ──────────────────────────────────────────────────────────────
   VALIDATION MIDDLEWARE (Higher-Order Function)
   ────────────────────────────────────────────────────────────── */

export function validateRequest(schema: ZodSchema): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
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
