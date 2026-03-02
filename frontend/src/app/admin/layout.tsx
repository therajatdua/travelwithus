/* ============================================================
   /admin Route Group Layout – Server-Side Role Guard
   ============================================================
   Runs on every /admin/* request. Verifies the Firebase ID token
   from the __session cookie and checks profiles.role in Firestore.
   ============================================================ */

import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyIdToken, getAdminDb } from "@/lib/firebase/admin";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("__session")?.value;

  const decoded = await verifyIdToken(token);
  if (!decoded) redirect("/login?next=/admin/dashboard");

  const db          = getAdminDb();
  const profileSnap = await db.collection("profiles").doc(decoded.uid).get();
  const role        = profileSnap.data()?.role;

  if (role !== "admin") redirect("/");

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
