/* ============================================================
   AIHealthBadge – polls /api/ai/health and shows live status
   Client Component (uses useEffect polling)
   ============================================================ */

"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/constants";

type Status = "loading" | "ok" | "degraded" | "down";

export function AIHealthBadge() {
  const [status,  setStatus]  = useState<Status>("loading");
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const runCheck = async () => {
      try {
        const res = await fetch(`${API_URL}/api/ai/health`, { cache: "no-store" });
        const body = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setStatus("down");
          setLatency(null);
          return;
        }

        const isOk = body.status === "ok";
        setStatus(isOk ? "ok" : "down");
        setLatency(body.latency_ms ?? null);
      } catch {
        if (cancelled) return;
        setStatus("down");
        setLatency(null);
      }
    };

    const kickoff = setTimeout(() => {
      void runCheck();
    }, 0);

    const id = setInterval(() => {
      void runCheck();
    }, 30_000);

    return () => {
      cancelled = true;
      clearTimeout(kickoff);
      clearInterval(id);
    };
  }, []);

  const styles: Record<Status, string> = {
    loading:  "bg-gray-100 text-gray-500",
    ok:       "bg-green-100 text-green-700",
    degraded: "bg-yellow-100 text-yellow-700",
    down:     "bg-red-100 text-red-700",
  };

  const label: Record<Status, string> = {
    loading:  "AI: checking…",
    ok:       `AI: online${latency != null ? ` (${latency} ms)` : ""}`,
    degraded: "AI: degraded",
    down:     "AI: offline",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          status === "ok" ? "bg-green-500" :
          status === "loading" ? "bg-gray-400" :
          status === "degraded" ? "bg-yellow-500" : "bg-red-500"
        }`}
      />
      {label[status]}
    </span>
  );
}
