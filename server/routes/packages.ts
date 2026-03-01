/* ============================================================
   Route: /api/packages
   ============================================================ */

import { Router } from "express";
import { getAllPackages, getPackageByTheme } from "../controllers/packages";

const router = Router();

router.get("/", getAllPackages);
router.get("/:themeKey", getPackageByTheme);

export default router;
