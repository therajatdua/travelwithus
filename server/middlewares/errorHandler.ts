/* ============================================================
   Centralized Error Handler Middleware
   ============================================================
   Catches all errors propagated via next(err).
   Handles:
     • ZodError         → 422 Unprocessable Entity
     • AIServiceError   → 503 Service Unavailable
     • Generic errors   → 500 Internal Server Error
   ============================================================ */

import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

/* ── Typed custom error ─────────────────────────────────────── */
export class AIServiceError extends Error {
  readonly code: string;
  constructor(message: string, code = "AI_UNAVAILABLE") {
    super(message);
    this.name = "AIServiceError";
    this.code = code;
  }
}

export class AuthorizationError extends Error {
  readonly statusCode: number;
  constructor(message: string, statusCode = 403) {
    super(message);
    this.name = "AuthorizationError";
    this.statusCode = statusCode;
  }
}

/* ── Handler ────────────────────────────────────────────────── */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  /* Zod validation errors */
  if (err instanceof ZodError) {
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
  const message =
    err instanceof Error
      ? err.message
      : "An unexpected error occurred.";

  console.error("[ERROR]", err);
  res.status(500).json({ success: false, error: message });
}
