/* ============================================================
   /auth/callback – Supabase Auth Email Confirmation Handler
   ============================================================
   Handles the redirect from Supabase email confirmation.
   Exchanges the auth code for a session.
   ============================================================ */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.redirect(`${origin}/login`);
    }
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  /* Redirect to login on error */
  return NextResponse.redirect(`${origin}/login`);
}
