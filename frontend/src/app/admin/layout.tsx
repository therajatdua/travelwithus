"use client";
/* ============================================================
   /admin Layout – Client-Side Role Guard
   Uses Firebase client SDK (no Admin SDK / OAuth2 needed).
   Reads profiles/{uid}.role from Firestore to verify admin.
   ============================================================ */

import { useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard",  icon: "📊" },
  { href: "/admin/bookings",  label: "Bookings",   icon: "✈️" },
  { href: "/admin/packages",  label: "Packages",   icon: "📦" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"loading" | "ok" | "denied">("loading");
  const [email,  setEmail]  = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login?next=/admin/dashboard");
        return;
      }
      const snap = await getDoc(doc(db, "profiles", user.uid));
      if (snap.data()?.role === "admin") {
        setEmail(user.email ?? "");
        setStatus("ok");
      } else {
        setStatus("denied");
        router.replace("/");
      }
    });
    return unsub;
  }, [router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 rounded-full border-4 border-[var(--accent)] border-t-transparent animate-spin" />
          <p className="text-sm text-[var(--muted)]">Verifying admin access…</p>
        </div>
      </div>
    );
  }

  if (status === "denied") return null;

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🌍</span>
            <span className="font-bold text-[var(--heading)] text-sm tracking-wide">TravelWithUs</span>
          </div>
          <span className="inline-block rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">
            Admin Panel
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "text-[var(--body)] hover:bg-[var(--border)]"
                }`}
              >
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User strip */}
        <div className="p-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-3 rounded-xl bg-[var(--border)] px-3 py-2.5">
            <div className="h-7 w-7 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold">
              {email[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--heading)] truncate">{email}</p>
              <p className="text-[10px] text-[var(--muted)]">Administrator</p>
            </div>
          </div>
          <button
            onClick={() => auth.signOut()}
            className="mt-2 w-full rounded-xl px-3 py-2 text-xs text-[var(--muted)] hover:text-red-500 hover:bg-red-50 transition-colors text-left"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
