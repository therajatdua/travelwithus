/* ============================================================
   AuthContext – Firebase Auth State
   ============================================================
   • Subscribes to Firebase's onIdTokenChanged for automatic
     session sync across tabs and token refreshes.
   • Sets a __session cookie with the current ID token so
     Next.js Server Components and middleware can verify auth.
   • Exposes the Firebase User object.
   ============================================================ */

"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { onIdTokenChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";
import { auth, db } from "@/lib/firebase/client";

interface AuthContextValue {
  /** Firebase User object, null when logged out */
  firebaseUser: User | null;
  /** Convenience: display name (displayName > email > null) */
  displayName: string | null;
  /** True when a session exists */
  isAuthenticated: boolean;
  /** True before the first auth state check resolves */
  isLoading: boolean;
  /** Whether the auth modal is open */
  isModalOpen: boolean;
  /** Sign out – clears Firebase session and __session cookie */
  logout: () => Promise<void>;
  /** Open the auth modal */
  openAuthModal: () => void;
  /** Close the auth modal */
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Writes (or clears) the __session cookie used by middleware / Server Components. */
function setSessionCookie(token: string | null) {
  const isProd = process.env.NODE_ENV === "production";
  if (token) {
    document.cookie = `__session=${token}; path=/; max-age=${60 * 60}; SameSite=Lax${isProd ? "; Secure" : ""}`;
  } else {
    document.cookie = `__session=; path=/; max-age=0; SameSite=Lax${isProd ? "; Secure" : ""}`;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const router      = useRouter();
  const pathname    = usePathname();
  /* track previous user to detect fresh login (null → user) */
  const prevUserRef = useRef<User | null | undefined>(undefined);

  /* ── Subscribe to Firebase auth state + token refresh ──── */
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setSessionCookie(token);

        /* ── Auto-redirect admin on fresh login ───────────── */
        const freshLogin = prevUserRef.current === null;
        if (freshLogin && !pathname.startsWith("/admin")) {
          try {
            const snap = await getDoc(doc(db, "profiles", user.uid));
            if (snap.data()?.role === "admin") {
              router.push("/admin/dashboard");
            }
          } catch {
            // silently ignore – non-critical
          }
        }
      } else {
        setSessionCookie(null);
      }
      prevUserRef.current = user ?? null;
      setFirebaseUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Auth modal is opened only by explicit user action (e.g. clicking Sign In). */

  const logout = useCallback(async () => {
    await signOut(auth);
    // onIdTokenChanged will clear firebaseUser and the cookie automatically
  }, []);

  const openAuthModal  = useCallback(() => setIsModalOpen(true),  []);
  const closeAuthModal = useCallback(() => setIsModalOpen(false), []);

  const displayName = firebaseUser?.displayName ?? firebaseUser?.email ?? null;

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        displayName,
        isAuthenticated: firebaseUser !== null,
        isLoading,
        isModalOpen,
        logout,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}



