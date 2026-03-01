import { z } from "zod";
export declare const TransportModeSchema: z.ZodEnum<{
    Flight: "Flight";
    Train: "Train";
    Bus: "Bus";
    Ferry: "Ferry";
    Car: "Car";
}>;
export declare const PaxDetailsSchema: z.ZodObject<{
    adults: z.ZodNumber;
    children: z.ZodDefault<z.ZodNumber>;
    seniors: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const BookingInputSchema: z.ZodObject<{
    citySlug: z.ZodString;
    originCountry: z.ZodOptional<z.ZodString>;
    originState: z.ZodOptional<z.ZodString>;
    originCity: z.ZodString;
    transportMode: z.ZodEnum<{
        Flight: "Flight";
        Train: "Train";
        Bus: "Bus";
        Ferry: "Ferry";
        Car: "Car";
    }>;
    passengers: z.ZodObject<{
        adults: z.ZodNumber;
        children: z.ZodDefault<z.ZodNumber>;
        seniors: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>;
    travelDates: z.ZodOptional<z.ZodObject<{
        start: z.ZodOptional<z.ZodString>;
        end: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type BookingInput = z.infer<typeof BookingInputSchema>;
export type TransportMode = z.infer<typeof TransportModeSchema>;
export type PaxDetails = z.infer<typeof PaxDetailsSchema>;
export interface AIDailyPlan {
    day: number;
    activity: string;
    time: string;
}
export interface AIResponse {
    daily_plan: AIDailyPlan[];
    vibe_score: number;
    suggested_addons: string[];
}
export interface UserPreferences {
    destination: string;
    origin: string;
    transport: string;
    adults: number;
    children: number;
    seniors: number;
    nights: number;
}
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}
declare global {
    namespace Express {
        interface Request {
            /** Authenticated user ID (set by authenticateUser middleware) */
            userId?: string;
            /** Full Supabase user object */
            supabaseUser?: {
                id: string;
                email?: string;
            };
        }
    }
}
//# sourceMappingURL=types.d.ts.map