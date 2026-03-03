/* ============================================================
  ThemeContext – Dual-Axis Theme Engine
  ─────────────────────────────────────────────────────────────
  Axis 1  → ColorMode  (light | dark)
          First visit defaults to dark mode.
          Initial data-mode is set by a blocking <script> in
          layout.tsx to avoid FOUC.
  Axis 2  → CityTheme  (ThemeKey | null)
          Sets data-theme on <html>.
  ============================================================ */

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { ThemeKey } from "@/types";

/* ── Types ──────────────────────────────────────────────────── */
export type ColorMode = "light" | "dark";

interface ThemeContextValue {
  /** Current color-mode preference (persisted) */
  colorMode: ColorMode;
  /** Resolved effective mode (always "light" or "dark") */
  resolvedMode: "light" | "dark";
  /** Set the global color mode */
  setColorMode: (mode: ColorMode) => void;
  /** Currently active city theme key, or null for home */
  theme: ThemeKey | null;
  /** Switch to a destination city theme (or null to reset) */
  setTheme: (theme: ThemeKey | null) => void;
}

const STORAGE_KEY = "travelwithus-color-mode";
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/* ── Helpers ────────────────────────────────────────────────── */
function getSystemPreference(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getSavedMode(): "light" | "dark" | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return null;
}

/** Read the data-mode the blocking <script> already set on <html> */
function getInitialResolved(): "light" | "dark" {
  if (typeof document === "undefined") return "dark";
  return (document.documentElement.getAttribute("data-mode") as "light" | "dark") || "dark";
}

/* ── Provider ───────────────────────────────────────────────── */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const savedMode = getSavedMode();
  /* Initialise from what the blocking script already applied —
     this avoids a flash between server-render and first hydration. */
  const [colorMode, setColorModeState] = useState<ColorMode>(savedMode ?? "dark");
  const [resolvedMode, setResolvedMode] = useState<"light" | "dark">(getInitialResolved);
  const [followSystem, setFollowSystem] = useState<boolean>(savedMode === null);
  const [theme, setThemeState] = useState<ThemeKey | null>(null);

  /* Listen for OS preference changes while following system */
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (followSystem) {
        const next = getSystemPreference();
        setColorModeState(next);
        setResolvedMode(next);
        document.documentElement.setAttribute("data-mode", next);
      }
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [followSystem]);

  /* Apply data-mode to <html> whenever resolvedMode changes */
  useEffect(() => {
    document.documentElement.setAttribute("data-mode", resolvedMode);
  }, [resolvedMode]);

  /* Apply data-theme to <html> */
  useEffect(() => {
    const root = document.documentElement;
    if (theme) {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  }, [theme]);

  /* Public setters */
  const setColorMode = useCallback((mode: ColorMode) => {
    const resolved = mode;
    setFollowSystem(false);
    setColorModeState(mode);
    setResolvedMode(resolved);
    localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.setAttribute("data-mode", resolved);
  }, []);

  const setTheme = useCallback((next: ThemeKey | null) => {
    setThemeState(next);
  }, []);

  return (
    <ThemeContext.Provider
      value={{ colorMode, resolvedMode, setColorMode, theme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/* ── Hook ───────────────────────────────────────────────────── */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a <ThemeProvider />");
  }
  return ctx;
}
