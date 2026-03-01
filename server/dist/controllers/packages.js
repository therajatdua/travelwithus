"use strict";
/* ============================================================
   Controller: packages
   ============================================================
   Handlers for the /api/packages routes.
   Uses the same mock data from the frontend for now.
   ============================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageByTheme = exports.getAllPackages = void 0;
/* Inline subset of mock data — mirrors frontend mockData.ts
   In production this would query a database. */
const packages = [
    { id: "pkg-mumbai-001", themeKey: "mumbai", destinationName: "Mumbai" },
    { id: "pkg-rio-002", themeKey: "rio", destinationName: "Rio de Janeiro" },
    { id: "pkg-thailand-003", themeKey: "thailand", destinationName: "Thailand" },
    { id: "pkg-italy-004", themeKey: "italy", destinationName: "Italy" },
    { id: "pkg-tokyo-005", themeKey: "tokyo", destinationName: "Tokyo" },
];
const getAllPackages = (_req, res) => {
    res.json({ success: true, data: packages });
};
exports.getAllPackages = getAllPackages;
const getPackageByTheme = (req, res) => {
    const { themeKey } = req.params;
    const pkg = packages.find((p) => p.themeKey === themeKey);
    if (!pkg) {
        res.status(404).json({ success: false, message: "Package not found" });
        return;
    }
    res.json({ success: true, data: pkg });
};
exports.getPackageByTheme = getPackageByTheme;
//# sourceMappingURL=packages.js.map