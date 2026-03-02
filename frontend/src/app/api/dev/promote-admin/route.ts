/**
 * DEV-ONLY route: POST /api/dev/promote-admin
 * Body: { "email": "you@example.com", "secret": "twu-promote-2026" }
 *
 * Promotes a Firebase Auth user to role=admin in Firestore + custom claims.
 * Automatically disabled in production.
 *
 * DELETE THIS FILE after use.
 */

import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import * as admin from "firebase-admin";

const DEV_SECRET = "twu-promote-2026";

export async function POST(request: Request) {
  // Hard-disable in production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  let body: { email?: string; secret?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.secret !== DEV_SECRET) {
    return NextResponse.json({ error: "Bad secret" }, { status: 401 });
  }

  const email = body.email?.trim();
  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  try {
    const auth = getAdminAuth();
    const db   = getAdminDb();

    // Look up user
    const user = await auth.getUserByEmail(email);
    const uid  = user.uid;

    // Update / create Firestore profile
    const profileRef = db.collection("profiles").doc(uid);
    const snap = await profileRef.get();

    if (snap.exists) {
      await profileRef.update({
        role: "admin",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      await profileRef.set({
        uid,
        email,
        role: "admin",
        displayName: user.displayName ?? "",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Set custom Auth claim
    await auth.setCustomUserClaims(uid, { role: "admin" });

    return NextResponse.json({
      success: true,
      message: `✅ ${email} (uid=${uid}) promoted to admin. Sign out and back in, then visit /admin/dashboard.`,
    });
  } catch (err: any) {
    if (err.code === "auth/user-not-found") {
      return NextResponse.json(
        { error: `No Firebase user found for "${email}". Register on the site first.` },
        { status: 404 },
      );
    }
    return NextResponse.json({ error: err.message ?? "Unknown error" }, { status: 500 });
  }
}
