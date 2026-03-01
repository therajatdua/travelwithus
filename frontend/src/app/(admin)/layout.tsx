/* ============================================================
   (admin) Route Group Layout – Server-Side Role Guard
   ============================================================
   Runs on every /admin/* request. Checks Supabase session
   and profiles.role before rendering children.
   No client-side workaround is possible after this guard.
   ============================================================ */

import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  if (!supabase) {
    // Supabase not configured – deny access
    redirect("/login?next=/admin/dashboard");
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col gap-2">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
          Admin
        </p>
        {[
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/bookings",  label: "Bookings" },
          { href: "/admin/packages",  label: "Packages" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-[var(--body)] transition-colors hover:bg-[var(--border)]"
          >
            {label}
          </Link>
        ))}
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
