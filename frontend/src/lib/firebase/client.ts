/* ============================================================
   Firebase – Browser Client (Client Components)
   ============================================================
   Initialises the Firebase app once (idempotent) and exports
   reusable `auth`, `db`, and `analytics` singletons.
   Analytics is lazy-initialised (browser-only).
   ============================================================ */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { FIREBASE_CONFIG } from "@/lib/constants";

const app: FirebaseApp =
  getApps().length > 0 ? getApps()[0] : initializeApp(FIREBASE_CONFIG);

export const auth = getAuth(app);
export const db   = getFirestore(app);

/** Analytics – only available in the browser and when measurementId is set. */
let _analytics: Analytics | null = null;
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (_analytics) return _analytics;
  if (await isSupported()) {
    _analytics = getAnalytics(app);
  }
  return _analytics;
}
