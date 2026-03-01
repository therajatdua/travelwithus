import type { Request, Response, NextFunction } from "express";
export declare class AIServiceError extends Error {
    readonly code: string;
    constructor(message: string, code?: string);
}
export declare class AuthorizationError extends Error {
    readonly statusCode: number;
    constructor(message: string, statusCode?: number);
}
export declare function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void;
//# sourceMappingURL=errorHandler.d.ts.map