/**
 * promote-admin.ts
 *
 * Promotes a registered user to the "admin" role.
 *
 * Usage:
 *   npx ts-node --project tsconfig.json promote-admin.ts <email>
 *
 * Example:
 *   npx ts-node --project tsconfig.json promote-admin.ts you@example.com
 */

import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
import * as path from "path";

// ── load env ──────────────────────────────────────────────────────────────────
dotenv.config({ path: path.resolve(__dirname, ".env") });

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  console.error("❌  Missing Firebase env vars. Check server/.env");
  process.exit(1);
}

// ── init firebase ─────────────────────────────────────────────────────────────
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const auth = admin.auth();
const db   = admin.firestore();

// ── main ──────────────────────────────────────────────────────────────────────
async function promoteAdmin(email: string) {
  console.log(`\n🔍  Looking up user: ${email}`);

  let user: admin.auth.UserRecord;
  try {
    user = await auth.getUserByEmail(email);
  } catch (err: any) {
    if (err.code === "auth/user-not-found") {
      console.error(`❌  No Firebase Auth user found for "${email}".`);
      console.error(
        "    Register on the site first, then run this script again."
      );
    } else {
      console.error("❌  Firebase Auth error:", err.message);
    }
    process.exit(1);
  }

  const uid = user.uid;
  console.log(`✅  Found user  uid=${uid}  displayName=${user.displayName ?? "(none)"}`);

  // ── update / create Firestore profile ─────────────────────────────────────
  const profileRef = db.collection("profiles").doc(uid);
  const snap = await profileRef.get();

  if (snap.exists) {
    await profileRef.update({ role: "admin", updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    console.log("✅  Updated existing profile → role: admin");
  } else {
    await profileRef.set({
      uid,
      email,
      role: "admin",
      displayName: user.displayName ?? "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log("✅  Created new profile     → role: admin");
  }

  // ── set Firebase Auth custom claim (optional but useful for server checks) ─
  await auth.setCustomUserClaims(uid, { role: "admin" });
  console.log("✅  Set custom Auth claim   → role: admin");

  console.log(`\n🎉  Done! Sign out and sign back in on the site, then visit /admin/dashboard\n`);
}

// ── entry point ───────────────────────────────────────────────────────────────
const email = process.argv[2];
if (!email || !email.includes("@")) {
  console.error("Usage: npx ts-node --project tsconfig.json promote-admin.ts <email>");
  process.exit(1);
}

promoteAdmin(email).catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
