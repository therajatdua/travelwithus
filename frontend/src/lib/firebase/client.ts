/* ============================================================
   Firebase – Browser Client (Client Components)
   ============================================================
   Initialises the Firebase app once (idempotent) and exports
   reusable `auth` and `db` singletons for use in client
   components and hooks.
   ============================================================ */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG } from "@/lib/constants";

const app: FirebaseApp =
  getApps().length > 0 ? getApps()[0] : initializeApp(FIREBASE_CONFIG);

export const auth = getAuth(app);
export const db   = getFirestore(app);
