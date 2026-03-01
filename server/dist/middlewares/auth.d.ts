import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";
export declare const authenticateUser: RequestHandler;
export declare function validateRequest(schema: ZodSchema): RequestHandler;
//# sourceMappingURL=auth.d.ts.map