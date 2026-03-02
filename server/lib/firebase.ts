/* ============================================================
   Server – Firebase Admin SDK Singletons
   ============================================================
   Provides lazy-initialised Admin Auth and Firestore instances.
   The app boots fine even when credentials aren't configured
   (local dev / demo). Errors are thrown only when a method is
   actually called without credentials.
   ============================================================ */

import * as admin from "firebase-admin";

let _initialized = false;

function initAdminApp(): void {
  if (_initialized || admin.apps.length > 0) {
    _initialized = true;
    return;
  }

  const projectId   = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey  = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      "⚠️  Firebase Admin credentials missing — set FIREBASE_PROJECT_ID, " +
      "FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env",
    );
    return;
  }

  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });
  _initialized = true;
}

/** Firebase Admin Auth – use to verify ID tokens */
export function getAdminAuth(): admin.auth.Auth {
  initAdminApp();
  return admin.auth();
}

/** Firestore Admin – use for all DB operations on the server */
export function getFirestore(): admin.firestore.Firestore {
  initAdminApp();
  return admin.firestore();
}
