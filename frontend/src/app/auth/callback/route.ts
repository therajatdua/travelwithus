/* ============================================================
   /auth/callback – Firebase Auth Action Handler
   ============================================================
   Firebase email-verification and password-reset links include
   an `oobCode` parameter. This route completes those actions
   by delegating to Firebase and then redirecting the user.
   ============================================================ */

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") ?? "/";

  /* Firebase handles oobCode validation client-side via the
     Firebase SDK (applyActionCode / confirmPasswordReset).
     Here we simply redirect to the intended destination.       */
  return NextResponse.redirect(`${origin}${next}`);
}
