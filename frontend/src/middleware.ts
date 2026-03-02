/* ============================================================
   Next.js Middleware – Firebase Auth & Route Guard
   ============================================================
   Protected routes:
     /admin/*              → must be authenticated
     /bookings/*           → must be authenticated
     /packages/[city]/book → must be authenticated

   Note: Middleware runs in the Edge runtime where firebase-admin
   is unavailable. We check __session cookie presence here.
   Full token verification + role checks happen in the Server
   Component layouts (admin/layout.tsx).
   ============================================================ */

import { type NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, redirectToLogin } from "@/lib/firebase/middleware";

const ADMIN_PREFIX  = "/admin";
const AUTH_PREFIXES = ["/bookings"];
const BOOK_PATTERN  = /^\/packages\/[^/]+\/book$/;

function routeType(pathname: string): "admin" | "protected" | "public" {
  if (pathname.startsWith(ADMIN_PREFIX)) return "admin";
  if (AUTH_PREFIXES.some((p) => pathname.startsWith(p))) return "protected";
  if (BOOK_PATTERN.test(pathname)) return "protected";
  return "public";
}

export async function middleware(request: NextRequest) {
  const kind = routeType(request.nextUrl.pathname);
  if (kind === "public") return NextResponse.next();

  /* ── Check __session cookie presence ─────────────────────── */
  const { isPresent } = getSessionFromRequest(request);

  if (!isPresent) {
    return redirectToLogin(request, request.nextUrl.pathname);
  }

  /* Admin role is verified by the Server Component in admin/layout.tsx */
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
