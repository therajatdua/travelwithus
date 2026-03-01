/* ============================================================
   /admin/dashboard – Real-data Admin Dashboard  (v2)
   ============================================================
   Server Component – all data fetched server-side.
   Role guard already enforced by (admin)/layout.tsx.
   ============================================================ */

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AIHealthBadge } from "@/components/admin/AIHealthBadge";

/* ── Types ─────────────────────────────────────────────── */
type Booking = {
  id: string;
  created_at: string;
  status: string;
  payment_status: string;
  total_amount: number | null;
  profiles: { full_name: string | null }[] | null;
  packages: { title: string }[] | null;
};

/* ── Page ───────────────────────────────────────────────── */
export default async function AdminDashboardPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/login?next=/admin/dashboard");

  /* ── Stats queries (parallel) ──────────────────────────── */
  const [bookingsResult, packagesResult, usersResult, revenueResult] =
    await Promise.all([
      supabase.from("bookings").select("id", { count: "exact", head: true }),
      supabase.from("packages").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("user_id", { count: "exact", head: true }),
      supabase
        .from("bookings")
        .select("total_amount")
        .eq("payment_status", "paid"),
    ]);

  const totalBookings = bookingsResult.count ?? 0;
  const totalPackages = packagesResult.count ?? 0;
  const totalUsers    = usersResult.count ?? 0;
  const totalRevenue  = (revenueResult.data ?? []).reduce(
    (sum, r) => sum + (r.total_amount ?? 0),
    0,
  );

  /* ── Recent bookings ─────────────────────────────────── */
  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("id, created_at, status, payment_status, total_amount, profiles(full_name), packages(title)")
    .order("created_at", { ascending: false })
    .limit(10);

  const stats = [
    { label: "Total Bookings",   value: totalBookings.toLocaleString(),                             icon: "✈️" },
    { label: "Total Packages",   value: totalPackages.toLocaleString(),                             icon: "📦" },
    { label: "Registered Users", value: totalUsers.toLocaleString(),                                icon: "👥" },
    { label: "Revenue (paid)",   value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: "💰" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--heading)]">Dashboard</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Live data from Supabase</p>
        </div>
        <AIHealthBadge />
      </div>

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
            <span className="text-2xl">{s.icon}</span>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-[var(--heading)]">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Recent Bookings Table ──────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-[var(--heading)]">Recent Bookings</h2>

        {!recentBookings || recentBookings.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)]">
            No bookings yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--surface)]">
                <tr className="border-b border-[var(--border)]">
                  {["ID", "Customer", "Package", "Date", "Amount", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium text-[var(--muted)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--background)] text-[var(--body)]">
                {(recentBookings as Booking[]).map((b) => (
                  <tr key={b.id}>
                    <td className="px-4 py-3 font-mono text-xs">{b.id.slice(0, 8)}…</td>
                    <td className="px-4 py-3">{b.profiles?.[0]?.full_name ?? "—"}</td>
                    <td className="px-4 py-3">{b.packages?.[0]?.title ?? "—"}</td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      {new Date(b.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      {b.total_amount != null ? `₹${b.total_amount.toLocaleString("en-IN")}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <PaymentBadge status={b.payment_status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid:     "bg-green-100 text-green-700",
    unpaid:   "bg-yellow-100 text-yellow-700",
    refunded: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}
