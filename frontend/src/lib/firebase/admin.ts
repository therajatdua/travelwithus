/* ============================================================
   Firebase – Admin SDK (Server Components / Route Handlers)
   ============================================================
   DO NOT import this in client components or middleware.
   This file is Node.js-only (uses firebase-admin).
   ============================================================ */

import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];

  const projectId   = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey  = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin credentials not configured. " +
      "Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.",
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

/** Verify a Firebase ID token. Returns decoded token or null. */
export async function verifyIdToken(token: string | undefined) {
  if (!token) return null;
  try {
    return await getAuth(getAdminApp()).verifyIdToken(token);
  } catch {
    return null;
  }
}

/** Firestore Admin instance for server-side queries */
export function getAdminDb() {
  return getFirestore(getAdminApp());
}

/** Admin Auth instance */
export function getAdminAuth() {
  return getAuth(getAdminApp());
}
