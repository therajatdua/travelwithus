/* ============================================================
   AuthContext – Real Supabase Auth State  (v2)
   ============================================================
   • Subscribes to supabase.auth.onAuthStateChange for
     automatic session sync across tabs and refreshes.
   • Exposes the real Supabase User object.
   • No hardcoded credentials or demo cookies.
   ============================================================ */

"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthContextValue {
  /** Real Supabase User object, null when logged out */
  supabaseUser: User | null;
  /** Convenience: display name (full_name meta > email > null) */
  displayName: string | null;
  /** True when a session exists */
  isAuthenticated: boolean;
  /** True before the first session check resolves */
  isLoading: boolean;
  /** Whether the auth modal is open */
  isModalOpen: boolean;
  /** Sign out – clears Supabase session */
  logout: () => Promise<void>;
  /** Open the auth modal */
  openAuthModal: () => void;
  /** Close the auth modal */
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isModalOpen,  setIsModalOpen]  = useState(false);

  /* ── Subscribe to Supabase auth state changes ──────────── */
  useEffect(() => {
    const supabase = createClient();

    /* Initial session check */
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user ?? null);
      setIsLoading(false);
    });

    /* Live subscription */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSupabaseUser(session?.user ?? null);
        setIsLoading(false);
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  /* ── Show auth modal when not logged in after load ──────── */
  useEffect(() => {
    if (!isLoading && !supabaseUser) {
      setIsModalOpen(true);
    }
  }, [isLoading, supabaseUser]);

  const logout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // onAuthStateChange will clear supabaseUser automatically
  }, []);

  const openAuthModal  = useCallback(() => setIsModalOpen(true),  []);
  const closeAuthModal = useCallback(() => setIsModalOpen(false), []);

  const displayName =
    (supabaseUser?.user_metadata?.full_name as string | undefined) ??
    supabaseUser?.email ??
    null;

  return (
    <AuthContext.Provider
      value={{
        supabaseUser,
        displayName,
        isAuthenticated: supabaseUser !== null,
        isLoading,
        isModalOpen,
        logout,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}


