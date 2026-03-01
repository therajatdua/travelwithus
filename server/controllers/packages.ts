/* ============================================================
   Controller: packages
   ============================================================
   Handlers for the /api/packages routes.
   Uses the same mock data from the frontend for now.
   ============================================================ */

import type { Request, Response } from "express";

/* Inline subset of mock data — mirrors frontend mockData.ts
   In production this would query a database. */
const packages = [
  { id: "pkg-mumbai-001", themeKey: "mumbai", destinationName: "Mumbai" },
  { id: "pkg-rio-002", themeKey: "rio", destinationName: "Rio de Janeiro" },
  { id: "pkg-thailand-003", themeKey: "thailand", destinationName: "Thailand" },
  { id: "pkg-italy-004", themeKey: "italy", destinationName: "Italy" },
  { id: "pkg-tokyo-005", themeKey: "tokyo", destinationName: "Tokyo" },
];

export const getAllPackages = (_req: Request, res: Response): void => {
  res.json({ success: true, data: packages });
};

export const getPackageByTheme = (req: Request, res: Response): void => {
  const { themeKey } = req.params;
  const pkg = packages.find((p) => p.themeKey === themeKey);

  if (!pkg) {
    res.status(404).json({ success: false, message: "Package not found" });
    return;
  }

  res.json({ success: true, data: pkg });
};
