/* ============================================================
   Next.js Proxy – Firebase Auth Guard
   ============================================================
   Route matcher per production policy:
     /admin/:path*
     /packages/:city/book

   Edge runtime cannot use firebase-admin.
   We validate presence of __session cookie here and let route
   components perform deeper role checks (RBAC).
   ============================================================ */

import { type NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, redirectToLogin } from "@/lib/firebase/middleware";

const ADMIN_PREFIX = "/admin";
const BOOK_PATTERN = /^\/packages\/[^/]+\/book$/;

function routeType(pathname: string): "admin" | "protected" | "public" {
  if (pathname.startsWith(ADMIN_PREFIX)) return "admin";
  if (BOOK_PATTERN.test(pathname)) return "protected";
  return "public";
}

export async function proxy(request: NextRequest) {
  const kind = routeType(request.nextUrl.pathname);
  if (kind === "public") return NextResponse.next();

  const { isPresent } = getSessionFromRequest(request);

  if (!isPresent) {
    return redirectToLogin(request, request.nextUrl.pathname);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/packages/:city/book"],
};
