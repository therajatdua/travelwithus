"use strict";
/* ============================================================
   Route: /api/packages
   ============================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const packages_1 = require("../controllers/packages");
const router = (0, express_1.Router)();
router.get("/", packages_1.getAllPackages);
router.get("/:themeKey", packages_1.getPackageByTheme);
exports.default = router;
//# sourceMappingURL=packages.js.map