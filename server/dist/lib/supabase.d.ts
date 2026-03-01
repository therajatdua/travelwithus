import { type SupabaseClient } from "@supabase/supabase-js";
/** Public client – respects Row Level Security */
export declare function getSupabase(): SupabaseClient;
/** Admin client – bypasses RLS (for server-side writes) */
export declare function getSupabaseAdmin(): SupabaseClient;
/** Convenience aliases (lazy getters) */
export declare const supabase: SupabaseClient<any, "public", "public", any, any>;
export declare const supabaseAdmin: SupabaseClient<any, "public", "public", any, any>;
//# sourceMappingURL=supabase.d.ts.map