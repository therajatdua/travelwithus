/* ============================================================
   Next.js Middleware – Supabase Auth & Role-Based Route Guard
   ============================================================
   Protected routes:
     /admin/*              → must be authenticated + role='admin'
     /bookings/*           → must be authenticated
     /packages/[city]/book → must be authenticated
   ============================================================ */

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

const ADMIN_PREFIX   = "/admin";
const AUTH_PREFIXES  = ["/bookings"];
const BOOK_PATTERN   = /^\/packages\/[^/]+\/book$/;

function routeType(pathname: string): "admin" | "protected" | "public" {
  if (pathname.startsWith(ADMIN_PREFIX)) return "admin";
  if (AUTH_PREFIXES.some((p) => pathname.startsWith(p))) return "protected";
  if (BOOK_PATTERN.test(pathname)) return "protected";
  return "public";
}

export async function middleware(request: NextRequest) {
  const { supabase, response } = await createClient(request);

  const kind = routeType(request.nextUrl.pathname);
  if (kind === "public") return response;

  /* ── Verify Supabase session ──────────────────────────── */
  let user = null;
  if (supabase) {
    try {
      user = (await supabase.auth.getUser()).data.user;
    } catch {
      user = null;
    }
  }

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  /* ── Admin role check ─────────────────────────────────── */
  if (kind === "admin" && supabase) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (profile?.role !== "admin") {
      /* Authenticated but not an admin → redirect to home */
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = "/";
      homeUrl.search = "";
      return NextResponse.redirect(homeUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

