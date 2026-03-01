/* ============================================================
   Organism: AuthModal  (v2 – Real Supabase Auth)
   ============================================================
   Full-screen overlay with a travel background image.
   Email + password sign-in / sign-up via Supabase.
   Auth state updates automatically via onAuthStateChange.
   ============================================================ */

"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, InputField } from "@/components/atoms";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

type Tab = "signin" | "signup";

export default function AuthModal() {
  const router = useRouter();
  const { isAuthenticated, isModalOpen, closeAuthModal } = useAuth();

  /* ── Local form state ─────────────────────────────────── */
  const [tab,             setTab]             = useState<Tab>("signin");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error,           setError]           = useState("");
  const [loading,         setLoading]         = useState(false);

  /* Reset form whenever modal opens or tab switches */
  useEffect(() => {
    setEmail(""); setPassword(""); setConfirmPassword(""); setError("");
  }, [isModalOpen, tab]);

  /* ── Supabase auth handler ────────────────────────────── */
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError("");

      if (tab === "signup") {
        if (!email || !password || !confirmPassword) { setError("All fields are required."); return; }
        if (password !== confirmPassword) { setError("Passwords do not match."); return; }
      } else {
        if (!email || !password) { setError("Email and password are required."); return; }
      }

      setLoading(true);
      const supabase = createClient();

      if (tab === "signup") {
        const { error: signUpErr } = await supabase.auth.signUp({ email, password });
        setLoading(false);
        if (signUpErr) { setError(signUpErr.message); return; }
        setError("");
        closeAuthModal();
        return;
      }

      /* Sign In */
      const { data, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (signInErr) { setError(signInErr.message); return; }

      /* Check role for redirect */
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles").select("role").eq("user_id", data.user.id).single();
        closeAuthModal();
        if (profile?.role === "admin") router.push("/admin/dashboard");
      } else {
        closeAuthModal();
      }
    },
    [tab, email, password, confirmPassword, closeAuthModal, router],
  );

  /* ── Close on Escape key ──────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuthModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeAuthModal]);

  /* Don't render when hidden or already authenticated */
  if (!isModalOpen || isAuthenticated) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* ── Background overlay with travel image ────────── */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* ── Modal card ──────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-md rounded-[var(--radius-lg)] bg-[var(--background)] p-8 shadow-2xl theme-transition">
        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted)] transition-colors hover:bg-[var(--surface-alt)] hover:text-[var(--heading)]"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Brand */}
        <h2 className="mb-6 text-center text-2xl font-bold text-[var(--primary)]">
          TravelWithUs
        </h2>

        {/* ── Tab switcher ──────────────────────────────── */}
        <div className="mb-6 flex rounded-[var(--radius-md)] border border-[var(--border)] p-1">
          {(["signin", "signup"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-[var(--radius-sm)] py-2 text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-[var(--primary)] text-[var(--text-inverse)]"
                  : "text-[var(--body)] hover:text-[var(--heading)]"
              }`}
            >
              {t === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* ── Form ──────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputField
            id="auth-email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <InputField
            id="auth-password"
            label="Password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={tab === "signin" ? "current-password" : "new-password"}
          />

          {tab === "signup" && (
            <InputField
              id="auth-confirm-password"
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          )}

          {/* Error message */}
          {error && (
            <p className="text-center text-sm font-medium text-red-500" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="mt-2 w-full"
            disabled={loading}
          >
            {loading
              ? "Please wait…"
              : tab === "signin"
              ? "Sign In"
              : "Create Account"}
          </Button>
        </form>
      </div>
    </div>
  );
}



