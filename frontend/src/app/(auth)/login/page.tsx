/* ============================================================
   /login – Real Supabase Email + Password Auth  (v2)
   ============================================================
   No demo mode. Auth state propagates via onAuthStateChange
   in AuthContext – no manual login() call needed.
   ============================================================ */

"use client";

import { useState, Suspense, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, InputField } from "@/components/atoms";
import { createClient } from "@/lib/supabase/client";
import { BRAND_NAME } from "@/lib/constants";

type Tab = "signin" | "signup";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background)] p-8 shadow-xl text-center text-[var(--muted)]">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const nextPath     = searchParams.get("next") || "/";

  const [tab,      setTab]      = useState<Tab>("signin");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [message,  setMessage]  = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setMessage(""); setLoading(true);

    const supabase = createClient();

    try {
      if (tab === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (err) throw err;
        setMessage("Check your email for a confirmation link!");
        return;
      }

      /* Sign In */
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) throw err;

      /* Redirect admin → dashboard, others → intended path */
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", data.user.id)
          .single();

        router.push(profile?.role === "admin" ? "/admin/dashboard" : nextPath);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background)] p-8 shadow-xl">
      {/* Brand */}
      <h1 className="mb-1 text-center text-2xl font-bold text-[var(--heading)]">
        {BRAND_NAME}
      </h1>
      <p className="mb-8 text-center text-sm text-[var(--muted)]">
        {tab === "signin" ? "Sign in to continue" : "Create your account"}
      </p>

      {/* Tabs */}
      <div className="mb-6 flex rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden">
        {(["signin", "signup"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); setError(""); setMessage(""); }}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
              tab === t
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--surface)] text-[var(--body)] hover:bg-[var(--border)]"
            }`}
          >
            {t === "signin" ? "Sign In" : "Sign Up"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputField
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-center text-xs font-medium text-red-500" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="text-center text-xs font-medium text-green-600" role="status">
            {message}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          className="mt-2 w-full"
        >
          {loading ? "Please wait…" : tab === "signin" ? "Sign In" : "Sign Up"}
        </Button>
      </form>

    </div>
  );
}
