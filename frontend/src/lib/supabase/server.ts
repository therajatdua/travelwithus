/* ============================================================
   Supabase – Server Client (Server Components / Middleware)
   ============================================================
   Creates a Supabase client that reads cookies from the
   Next.js request context (headers/cookies). Used in:
     • Server Components
     • Route Handlers
     • middleware.ts
   ============================================================ */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/constants";

export async function createClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // setAll can throw in Server Components — safe to ignore.
          // Middleware and Route Handlers will handle cookie writes.
        }
      },
    },
  });
}
