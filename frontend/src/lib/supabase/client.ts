/* ============================================================
   Supabase – Browser Client (Client Components)
   ============================================================
   Used in "use client" components via the useSupabase() hook
   or direct import. This is the anon/public client.
   ============================================================ */

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/constants";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
