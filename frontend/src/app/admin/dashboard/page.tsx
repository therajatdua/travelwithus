"use client";
/* ============================================================
   /admin/dashboard – Analytics Dashboard (Client Component)
   Uses Firebase client SDK – no Admin SDK / OAuth2 needed.
   ============================================================ */

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { AIHealthBadge } from "@/components/admin/AIHealthBadge";

/* ── Types ──────────────────────────────────────────────────── */
type Booking = {
  id: string; created_at: string; status: string; payment_status: string;
  total_price: number | null; user_full_name?: string | null;
  package_name?: string | null; destination?: string | null;
};
type Stats = {
  totalUsers: number; totalBookings: number; totalPackages: number;
  totalRevenue: number; paidBookings: number; pendingBookings: number; cancelledBookings: number;
};
type DestCount = { name: string; count: number; revenue: number };

/* ── Helpers ─────────────────────────────────────────────────── */
const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");
function fmtDate(s: string) {
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(d.getTime()) ? s : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-emerald-100 text-emerald-700", confirmed: "bg-blue-100 text-blue-700",
    unpaid: "bg-yellow-100 text-yellow-700", pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",    refunded: "bg-purple-100 text-purple-700",
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status || "—"}
    </span>
  );
}
function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-28 mt-2">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] text-[var(--muted)] font-medium">{d.value > 0 ? fmt(d.value) : ""}</span>
          <div className="w-full rounded-t-md bg-[var(--primary)] transition-all"
            style={{ height: `${Math.max((d.value / max) * 72, d.value > 0 ? 6 : 2)}px`, opacity: d.value > 0 ? 0.85 : 0.2 }} />
          <span className="text-[10px] text-[var(--muted)] truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
function ProgressBar({ value, max, color = "var(--primary)" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full h-2 rounded-full bg-[var(--border)] overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────── */
export default function AdminDashboardPage() {
  const [stats,        setStats]        = useState<Stats | null>(null);
  const [recent,       setRecent]       = useState<Booking[]>([]);
  const [destinations, setDestinations] = useState<DestCount[]>([]);
  const [monthlyRev,   setMonthlyRev]   = useState<{ label: string; value: number }[]>([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [usersSnap, bookingsSnap, packagesSnap] = await Promise.all([
          getDocs(collection(db, "profiles")),
          getDocs(query(collection(db, "bookings"), orderBy("created_at", "desc"))),
          getDocs(collection(db, "packages")),
        ]);
        const all: Booking[] = bookingsSnap.docs.map((d) => ({
          id: d.id, created_at: d.data().created_at ?? "", status: d.data().status ?? "",
          payment_status: d.data().payment_status ?? "", total_price: d.data().total_price ?? null,
          user_full_name: d.data().user_full_name ?? d.data().displayName ?? null,
          package_name: d.data().package_name ?? d.data().packageName ?? null,
          destination: d.data().destination ?? d.data().package_name ?? null,
        }));
        let totalRevenue = 0, paid = 0, pending = 0, cancelled = 0;
        const destMap: Record<string, DestCount> = {};
        const monthMap: Record<string, number>   = {};
        for (const b of all) {
          const isPaid = b.payment_status === "paid" || b.status === "confirmed";
          if (isPaid) { totalRevenue += b.total_price ?? 0; paid++; }
          else if (b.status === "cancelled") cancelled++;
          else pending++;
          const dest = b.destination ?? b.package_name ?? "Unknown";
          if (!destMap[dest]) destMap[dest] = { name: dest, count: 0, revenue: 0 };
          destMap[dest].count++;
          if (isPaid) destMap[dest].revenue += b.total_price ?? 0;
          if (b.created_at && isPaid) {
            const d = new Date(b.created_at);
            if (!isNaN(d.getTime())) {
              const key = d.toLocaleString("en-IN", { month: "short", year: "2-digit" });
              monthMap[key] = (monthMap[key] ?? 0) + (b.total_price ?? 0);
            }
          }
        }
        const topDests = Object.values(destMap).sort((a, b) => b.count - a.count).slice(0, 5);
        const now = new Date();
        const mRev = Array.from({ length: 6 }, (_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
          const label = d.toLocaleString("en-IN", { month: "short", year: "2-digit" });
          return { label, value: monthMap[label] ?? 0 };
        });
        setStats({ totalUsers: usersSnap.size, totalBookings: all.length, totalPackages: packagesSnap.size,
                   totalRevenue, paidBookings: paid, pendingBookings: pending, cancelledBookings: cancelled });
        setRecent(all.slice(0, 10));
        setDestinations(topDests);
        setMonthlyRev(mRev);
      } finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 rounded-full border-4 border-[var(--accent)] border-t-transparent animate-spin" />
          <p className="text-sm text-[var(--muted)]">Loading analytics…</p>
        </div>
      </div>
    );
  }

  const s        = stats!;
  const convRate = s.totalBookings > 0 ? Math.round((s.paidBookings / s.totalBookings) * 100) : 0;
  const avgOrder = s.paidBookings  > 0 ? Math.round(s.totalRevenue  / s.paidBookings)          : 0;

  const statCards = [
    { label: "Registered Users", value: s.totalUsers.toLocaleString(),       icon: "👥", sub: "All-time signups",                         color: "#3B82F6" },
    { label: "Total Bookings",   value: s.totalBookings.toLocaleString(),     icon: "✈️", sub: `${s.pendingBookings} pending`,               color: "#8B5CF6" },
    { label: "Revenue (paid)",   value: fmt(s.totalRevenue),                  icon: "💰", sub: `Avg order ${fmt(avgOrder)}`,                 color: "#10B981" },
    { label: "Active Packages",  value: s.totalPackages.toLocaleString(),     icon: "📦", sub: "Destinations live",                          color: "#F59E0B" },
    { label: "Conversion Rate",  value: `${convRate}%`,                       icon: "📈", sub: `${s.paidBookings} paid of ${s.totalBookings}`,color: "#0F3057" },
    { label: "Cancellations",    value: s.cancelledBookings.toLocaleString(), icon: "❌", sub: `${s.totalBookings > 0 ? Math.round((s.cancelledBookings / s.totalBookings) * 100) : 0}% of total`, color: "#6B7280" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--heading)]">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Live data · {new Date().toLocaleTimeString("en-IN")}</p>
        </div>
        <div className="flex items-center gap-3">
          <AIHealthBadge />
          <button onClick={() => window.location.reload()}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--body)] hover:bg-[var(--border)] transition-colors">
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{c.icon}</span>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
            </div>
            <p className="text-2xl font-bold text-[var(--heading)]">{c.value}</p>
            <p className="mt-0.5 text-xs font-semibold text-[var(--muted)]">{c.label}</p>
            <p className="mt-1 text-[11px] text-[var(--muted)] opacity-70">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-sm font-semibold text-[var(--heading)]">Revenue – Last 6 Months</h2>
          <p className="text-xs text-[var(--muted)] mb-4">Paid bookings only</p>
          {monthlyRev.every((m) => m.value === 0)
            ? <div className="flex items-center justify-center h-28 text-sm text-[var(--muted)]">No revenue data yet</div>
            : <BarChart data={monthlyRev} />}
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-sm font-semibold text-[var(--heading)]">Booking Status</h2>
          <p className="text-xs text-[var(--muted)] mb-5">Current breakdown</p>
          <div className="flex flex-col gap-4">
            {[
              { label: "Paid / Confirmed", value: s.paidBookings,     color: "#10B981" },
              { label: "Pending",          value: s.pendingBookings,   color: "#F59E0B" },
              { label: "Cancelled",        value: s.cancelledBookings, color: "#EF4444" },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[var(--body)]">{row.label}</span>
                  <span className="font-bold text-[var(--heading)]">{row.value}</span>
                </div>
                <ProgressBar value={row.value} max={s.totalBookings} color={row.color} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      {destinations.length > 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 mb-8">
          <h2 className="text-sm font-semibold text-[var(--heading)]">Popular Destinations</h2>
          <p className="text-xs text-[var(--muted)] mb-5">By number of bookings</p>
          <div className="flex flex-col gap-3">
            {destinations.map((d, i) => (
              <div key={d.name} className="flex items-center gap-4">
                <span className="text-sm font-bold text-[var(--muted)] w-5 shrink-0">#{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-[var(--body)] capitalize">{d.name}</span>
                    <span className="text-[var(--muted)] text-xs">{d.count} bookings · {fmt(d.revenue)}</span>
                  </div>
                  <ProgressBar value={d.count} max={destinations[0].count} color="var(--accent)" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Bookings */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-semibold text-[var(--heading)]">Recent Bookings</h2>
          <p className="text-xs text-[var(--muted)]">Latest 10 entries</p>
        </div>
        {recent.length === 0 ? (
          <div className="py-16 text-center text-sm text-[var(--muted)]">No bookings yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg)]">
                  {["Booking ID", "Customer", "Package", "Date", "Amount", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {recent.map((b) => (
                  <tr key={b.id} className="hover:bg-[var(--border)]/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-[var(--muted)]">{b.id.slice(0, 8)}…</td>
                    <td className="px-5 py-3.5 font-medium text-[var(--heading)]">{b.user_full_name ?? "—"}</td>
                    <td className="px-5 py-3.5 text-[var(--body)] capitalize">{b.package_name ?? "—"}</td>
                    <td className="px-5 py-3.5 text-[var(--muted)]">{fmtDate(b.created_at)}</td>
                    <td className="px-5 py-3.5 font-semibold text-[var(--heading)]">{b.total_price != null ? fmt(b.total_price) : "—"}</td>
                    <td className="px-5 py-3.5"><Badge status={b.payment_status || b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
