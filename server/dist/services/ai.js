"use strict";
/* ============================================================
   Service: AI Engine  (Google Gemini via @google/genai)
   ============================================================
   • Generates personalised itineraries via Gemini.
   • Strict JSON mode: responseMimeType = "application/json".
   • NO silent fallback — throws AIServiceError on failure
     so callers can return a proper 503 to the client.
   ============================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasValidAIKey = hasValidAIKey;
exports.pingAI = pingAI;
exports.generateItinerary = generateItinerary;
const genai_1 = require("@google/genai");
const errorHandler_1 = require("../middlewares/errorHandler");
/* ── Client Configuration ───────────────────────────────────── */
function getAIConfig() {
    const apiKey = process.env.AI_API_KEY ?? "";
    return {
        ai: new genai_1.GoogleGenAI({ apiKey }),
        model: process.env.AI_MODEL || "gemini-2.5-flash",
        apiKey,
    };
}
function hasValidAIKey() {
    const key = process.env.AI_API_KEY ?? "";
    return key.length > 0 && key !== "YOUR_GEMINI_API_KEY";
}
/* ── System Prompt ──────────────────────────────────────────── */
const SYSTEM_PROMPT = `You are TravelWithUs's expert travel planner AI.
You receive user travel preferences and return a personalised daily itinerary.

RULES:
1. Return ONLY valid JSON. No markdown, no commentary, no code fences.
2. The JSON must match this exact schema:
{
  "daily_plan": [
    { "day": <number>, "activity": "<string>", "time": "<HH:MM>" }
  ],
  "vibe_score": <number 1-100>,
  "suggested_addons": ["<string>", ...]
}
3. daily_plan must have exactly (nights + 1) entries (one per day including arrival and departure).
4. vibe_score is 1-100 based on how well the plan matches the user preferences.
5. suggested_addons are 2-4 optional upsells (e.g. "Sunset cruise", "Cooking class").
6. If you cannot answer, still return valid JSON with generic activities. NEVER return prose.`;
/* ── Perform a lightweight ping to verify Gemini is reachable ─ */
async function pingAI() {
    if (!hasValidAIKey()) {
        return { ok: false, latencyMs: 0, error: "AI_API_KEY is not configured." };
    }
    const { ai, model } = getAIConfig();
    const start = Date.now();
    try {
        await ai.models.generateContent({
            model,
            contents: [{ role: "user", parts: [{ text: "ping" }] }],
            config: { maxOutputTokens: 1 },
        });
        return { ok: true, latencyMs: Date.now() - start };
    }
    catch (err) {
        return {
            ok: false,
            latencyMs: Date.now() - start,
            error: err.message,
        };
    }
}
/* ── Main itinerary generator ───────────────────────────────── */
async function generateItinerary(prefs) {
    if (!hasValidAIKey()) {
        throw new errorHandler_1.AIServiceError("AI_API_KEY is not configured on the server.", "AI_NOT_CONFIGURED");
    }
    const { ai, model } = getAIConfig();
    const userMessage = JSON.stringify({
        destination: prefs.destination,
        origin: prefs.origin,
        transport: prefs.transport,
        travellers: {
            adults: prefs.adults,
            children: prefs.children,
            seniors: prefs.seniors,
        },
        nights: prefs.nights,
    });
    let raw;
    try {
        const response = await ai.models.generateContent({
            model,
            contents: [{ role: "user", parts: [{ text: userMessage }] }],
            config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.7,
                responseMimeType: "application/json",
            },
        });
        raw = response.text;
    }
    catch (err) {
        const msg = err.message;
        console.error("[AI Engine] Gemini call failed:", msg);
        throw new errorHandler_1.AIServiceError(`AI service error: ${msg}`, "AI_REQUEST_FAILED");
    }
    if (!raw?.trim()) {
        throw new errorHandler_1.AIServiceError("Gemini returned an empty response.", "AI_EMPTY_RESPONSE");
    }
    let parsed;
    try {
        parsed = JSON.parse(raw);
    }
    catch {
        console.error("[AI Engine] Invalid JSON from Gemini:", raw.slice(0, 200));
        throw new errorHandler_1.AIServiceError("Gemini returned malformed JSON.", "AI_INVALID_JSON");
    }
    /* Shape validation */
    if (!Array.isArray(parsed.daily_plan) ||
        typeof parsed.vibe_score !== "number" ||
        !Array.isArray(parsed.suggested_addons)) {
        throw new errorHandler_1.AIServiceError("Gemini response did not match expected schema.", "AI_SCHEMA_MISMATCH");
    }
    return parsed;
}
//# sourceMappingURL=ai.js.map