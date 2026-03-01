"use strict";
/* ============================================================
   Server – Supabase Client Singletons
   ============================================================
   Two clients:
     • supabase      → respects RLS (used after verifying JWT)
     • supabaseAdmin → service-role key, bypasses RLS (admin ops)

   Clients are created lazily so the server can boot even when
   Supabase credentials aren't configured (local dev / demo).
   ============================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseAdmin = exports.supabase = void 0;
exports.getSupabase = getSupabase;
exports.getSupabaseAdmin = getSupabaseAdmin;
const supabase_js_1 = require("@supabase/supabase-js");
function getSupabaseEnv() {
    return {
        url: process.env.SUPABASE_URL ?? "",
        anonKey: process.env.SUPABASE_ANON_KEY ?? "",
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    };
}
/* ── Lazy singletons ────────────────────────────────────────── */
let _supabase = null;
let _supabaseAdmin = null;
/** Public client – respects Row Level Security */
function getSupabase() {
    const { url, anonKey } = getSupabaseEnv();
    const supabaseConfigured = Boolean(url && anonKey);
    if (!supabaseConfigured) {
        console.warn("⚠️  SUPABASE_URL or SUPABASE_ANON_KEY missing — Supabase features will be unavailable.");
        throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.");
    }
    if (!_supabase) {
        _supabase = (0, supabase_js_1.createClient)(url, anonKey);
    }
    return _supabase;
}
/** Admin client – bypasses RLS (for server-side writes) */
function getSupabaseAdmin() {
    const { url, anonKey, serviceRoleKey } = getSupabaseEnv();
    const supabaseConfigured = Boolean(url && anonKey);
    if (!supabaseConfigured) {
        console.warn("⚠️  SUPABASE_URL or SUPABASE_ANON_KEY missing — Supabase features will be unavailable.");
        throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.");
    }
    if (!_supabaseAdmin) {
        _supabaseAdmin = (0, supabase_js_1.createClient)(url, serviceRoleKey || anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
    }
    return _supabaseAdmin;
}
/** Convenience aliases (lazy getters) */
exports.supabase = new Proxy({}, {
    get(_target, prop, receiver) {
        return Reflect.get(getSupabase(), prop, receiver);
    },
});
exports.supabaseAdmin = new Proxy({}, {
    get(_target, prop, receiver) {
        return Reflect.get(getSupabaseAdmin(), prop, receiver);
    },
});
//# sourceMappingURL=supabase.js.map