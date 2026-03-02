/* ============================================================
   Firebase – Middleware Helper
   ============================================================
   Next.js middleware runs in the Edge runtime where firebase-admin
   is unavailable. We do a lightweight cookie-presence check here.
   Full token verification is handled by Server Components and
   Route Handlers (which run in the Node.js runtime) via admin.ts.
   ============================================================ */

import { type NextRequest, NextResponse } from "next/server";

export interface MiddlewareSession {
  /** Raw Firebase ID token stored in the __session cookie */
  token: string | null;
  /** True if the cookie is present (not verified at middleware level) */
  isPresent: boolean;
}

/** Reads the __session cookie set by AuthContext on the client. */
export function getSessionFromRequest(request: NextRequest): MiddlewareSession {
  const token = request.cookies.get("__session")?.value ?? null;
  return { token, isPresent: Boolean(token) };
}

/** Returns a redirect response to the login page. */
export function redirectToLogin(request: NextRequest, next: string): NextResponse {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", next);
  return NextResponse.redirect(loginUrl);
}
