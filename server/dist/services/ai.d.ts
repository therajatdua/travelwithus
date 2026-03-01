import type { AIResponse, UserPreferences } from "../types";
export declare function hasValidAIKey(): boolean;
export declare function pingAI(): Promise<{
    ok: boolean;
    latencyMs: number;
    error?: string;
}>;
export declare function generateItinerary(prefs: UserPreferences): Promise<AIResponse>;
//# sourceMappingURL=ai.d.ts.map