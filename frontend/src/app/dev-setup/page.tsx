"use client";
/**
 * DEV-ONLY one-shot page: /dev-setup
 * Writes profiles/{uid}.role = "admin" for the currently signed-in user,
 * using the Firebase CLIENT SDK (no Admin SDK / OAuth2 needed).
 *
 * Works while Firestore is in test mode.
 * DELETE this file once you have admin access.
 */

import { useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { auth } from "@/lib/firebase/client";

export default function DevSetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function promote() {
    setStatus("loading");
    setMessage("");

    const user = auth.currentUser;
    if (!user) {
      setStatus("error");
      setMessage("Not signed in. Go to the home page, sign in, then come back here.");
      return;
    }

    try {
      await setDoc(
        doc(db, "profiles", user.uid),
        {
          uid: user.uid,
          email: user.email,
          role: "admin",
          displayName: user.displayName ?? user.email,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      setStatus("done");
      setMessage(
        `✅ Done! ${user.email} (uid: ${user.uid}) is now admin.\n` +
        `Sign out and back in, then visit /admin/dashboard.`,
      );
    } catch (err: any) {
      setStatus("error");
      setMessage(`Error: ${err.message}`);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 p-8">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 text-white shadow-2xl">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-yellow-500">
          Dev Only — Delete after use
        </p>
        <h1 className="mb-6 text-2xl font-bold">Promote myself to Admin</h1>

        {status === "idle" && (
          <>
            <p className="mb-6 text-sm text-gray-400">
              Make sure you are <strong>signed in</strong> on the site before clicking below.
              This writes <code className="text-yellow-400">role: &quot;admin&quot;</code> to
              your Firestore profile using the client SDK.
            </p>
            <button
              onClick={promote}
              className="w-full rounded-xl bg-yellow-500 py-3 font-bold text-gray-950 transition hover:bg-yellow-400"
            >
              Promote me to Admin
            </button>
          </>
        )}

        {status === "loading" && (
          <p className="text-center text-gray-400">Writing to Firestore…</p>
        )}

        {status === "done" && (
          <div className="rounded-xl bg-green-900/40 border border-green-700 p-4">
            <pre className="whitespace-pre-wrap text-sm text-green-300">{message}</pre>
            <div className="mt-4 flex gap-3">
              <a
                href="/"
                className="flex-1 rounded-xl bg-gray-700 py-2 text-center text-sm font-bold hover:bg-gray-600"
              >
                Home (sign out &amp; in)
              </a>
              <a
                href="/admin/dashboard"
                className="flex-1 rounded-xl bg-yellow-500 py-2 text-center text-sm font-bold text-gray-950 hover:bg-yellow-400"
              >
                Admin Dashboard →
              </a>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="rounded-xl bg-red-900/40 border border-red-700 p-4">
            <p className="text-sm text-red-300">{message}</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-3 text-sm underline text-gray-400 hover:text-white"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
