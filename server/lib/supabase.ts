/* ============================================================
   Server – Supabase Client Singletons
   ============================================================
   Two clients:
     • supabase      → respects RLS (used after verifying JWT)
     • supabaseAdmin → service-role key, bypasses RLS (admin ops)

   Clients are created lazily so the server can boot even when
   Supabase credentials aren't configured (local dev / demo).
   ============================================================ */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getSupabaseEnv() {
  return {
    url: process.env.SUPABASE_URL ?? "",
    anonKey: process.env.SUPABASE_ANON_KEY ?? "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  };
}

/* ── Lazy singletons ────────────────────────────────────────── */

let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

/** Public client – respects Row Level Security */
export function getSupabase(): SupabaseClient {
  const { url, anonKey } = getSupabaseEnv();
  const supabaseConfigured = Boolean(url && anonKey);

  if (!supabaseConfigured) {
    console.warn(
      "⚠️  SUPABASE_URL or SUPABASE_ANON_KEY missing — Supabase features will be unavailable.",
    );
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.");
  }

  if (!_supabase) {
    _supabase = createClient(url, anonKey);
  }
  return _supabase;
}

/** Admin client – bypasses RLS (for server-side writes) */
export function getSupabaseAdmin(): SupabaseClient {
  const { url, anonKey, serviceRoleKey } = getSupabaseEnv();
  const supabaseConfigured = Boolean(url && anonKey);

  if (!supabaseConfigured) {
    console.warn(
      "⚠️  SUPABASE_URL or SUPABASE_ANON_KEY missing — Supabase features will be unavailable.",
    );
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.");
  }

  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      url,
      serviceRoleKey || anonKey,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
  }
  return _supabaseAdmin;
}

/** Convenience aliases (lazy getters) */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getSupabase(), prop, receiver);
  },
});

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getSupabaseAdmin(), prop, receiver);
  },
});
