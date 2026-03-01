"use strict";
/* ============================================================
   Middleware: Logger
   ============================================================
   Simple request logger for development.
   ============================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const logger = (req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};
exports.logger = logger;
//# sourceMappingURL=logger.js.map