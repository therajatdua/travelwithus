/* ============================================================
   /login – Firebase Email + Password Auth
   ============================================================
   Auth state propagates via onIdTokenChanged in AuthContext.
   ============================================================ */

"use client";

import { useState, Suspense, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { Button, InputField } from "@/components/atoms";
import { auth, db } from "@/lib/firebase/client";
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

    try {
      if (tab === "signup") {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName: email.split("@")[0] });
        await setDoc(doc(db, "profiles", user.uid), {
          uid:        user.uid,
          email:      user.email,
          full_name:  email.split("@")[0],
          role:       "user",
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
        setMessage("Account created! You are now signed in.");
        router.push(nextPath);
        router.refresh();
        return;
      }

      /* Sign In */
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      /* Redirect admin → dashboard, others → intended path */
      const profileSnap = await getDoc(doc(db, "profiles", user.uid));
      router.push(profileSnap.data()?.role === "admin" ? "/admin/dashboard" : nextPath);
      router.refresh();
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
