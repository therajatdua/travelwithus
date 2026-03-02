/* ============================================================
   /admin/dashboard – Real-data Admin Dashboard
   ============================================================
   Server Component – all data fetched server-side via Firestore.
   Role guard already enforced by admin/layout.tsx.
   ============================================================ */

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyIdToken, getAdminDb } from "@/lib/firebase/admin";
import { AIHealthBadge } from "@/components/admin/AIHealthBadge";

/* ── Types ─────────────────────────────────────────────── */
type Booking = {
  id: string;
  created_at: string;
  status: string;
  payment_status: string;
  total_price: number | null;
  user_full_name?: string | null;
  package_name?: string | null;
};

/* ── Page ───────────────────────────────────────────────── */
export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("__session")?.value;
  const decoded = await verifyIdToken(token);
  if (!decoded) redirect("/login?next=/admin/dashboard");

  const db = getAdminDb();

  /* ── Stats queries (parallel) ──────────────────────────── */
  const [bookingsSnap, packagesSnap, usersSnap, recentSnap] =
    await Promise.all([
      db.collection("bookings").count().get(),
      db.collection("packages").count().get(),
      db.collection("profiles").count().get(),
      db.collection("bookings").orderBy("created_at", "desc").limit(10).get(),
    ]);

  const totalBookings = bookingsSnap.data().count;
  const totalPackages = packagesSnap.data().count;
  const totalUsers    = usersSnap.data().count;

  /* Revenue from paid bookings */
  const paidSnap   = await db.collection("bookings").where("payment_status", "==", "paid").get();
  const totalRevenue = paidSnap.docs.reduce((sum, d) => sum + (d.data().total_price ?? 0), 0);

  const recentBookings: Booking[] = recentSnap.docs.map((d) => ({
    id:             d.id,
    created_at:     d.data().created_at ?? "",
    status:         d.data().status ?? "",
    payment_status: d.data().payment_status ?? "",
    total_price:    d.data().total_price ?? null,
    package_name:   d.data().package_name ?? null,
  }));

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
          <p className="mt-1 text-sm text-[var(--muted)]">Live data from Firebase</p>
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
                    <td className="px-4 py-3">{b.user_full_name ?? "—"}</td>
                    <td className="px-4 py-3">{b.package_name ?? "—"}</td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      {new Date(b.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      {b.total_price != null ? `₹${b.total_price.toLocaleString("en-IN")}` : "—"}
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
