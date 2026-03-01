/* ============================================================
   Middleware: Logger
   ============================================================
   Simple request logger for development.
   ============================================================ */

import type { Request, Response, NextFunction } from "express";

export const logger = (req: Request, _res: Response, next: NextFunction): void => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
