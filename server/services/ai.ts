/* ============================================================
   Service: AI Engine  (Google Gemini via @google/genai)
   ============================================================
   • Generates personalised itineraries via Gemini.
   • Strict JSON mode: responseMimeType = "application/json".
   • NO silent fallback — throws AIServiceError on failure
     so callers can return a proper 503 to the client.
   ============================================================ */

import { GoogleGenAI } from "@google/genai";
import { AIServiceError } from "../middlewares/errorHandler";
import type { AIResponse, UserPreferences } from "../types";

/* ── Client Configuration ───────────────────────────────────── */
function getAIConfig(): { ai: GoogleGenAI; model: string; apiKey: string } {
  const apiKey = process.env.AI_API_KEY ?? "";
  return {
    ai: new GoogleGenAI({ apiKey }),
    model: process.env.AI_MODEL || "gemini-2.5-flash",
    apiKey,
  };
}

export function hasValidAIKey(): boolean {
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
export async function pingAI(): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  if (!hasValidAIKey()) {
    return { ok: false, latencyMs: 0, error: "AI_API_KEY is not configured." };
  }
  const { ai, model } = getAIConfig();
  const start = Date.now();
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: "Respond with exactly: PONG" }] }],
      config: { maxOutputTokens: 8, temperature: 0 },
    });
    const text = (response.text ?? "").trim().toUpperCase();
    const isPong = text === "PONG" || text.includes("PONG");
    if (!isPong) {
      return {
        ok: false,
        latencyMs: Date.now() - start,
        error: `Unexpected AI ping response: ${response.text ?? "(empty)"}`,
      };
    }
    return { ok: true, latencyMs: Date.now() - start };
  } catch (err) {
    return {
      ok: false,
      latencyMs: Date.now() - start,
      error: (err as Error).message,
    };
  }
}

/* ── Main itinerary generator ───────────────────────────────── */
export async function generateItinerary(
  prefs: UserPreferences,
): Promise<AIResponse> {
  if (!hasValidAIKey()) {
    throw new AIServiceError(
      "AI_API_KEY is not configured on the server.",
      "AI_NOT_CONFIGURED",
      503,
    );
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

  let raw: string | undefined;
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
  } catch (err) {
    const msg = (err as Error).message;
    console.error("[AI Engine] Gemini call failed:", msg);
    throw new AIServiceError(
      `AI service error: ${msg}`,
      "AI_REQUEST_FAILED",
      502,
    );
  }

  if (!raw?.trim()) {
    throw new AIServiceError("Gemini returned an empty response.", "AI_EMPTY_RESPONSE", 502);
  }

  let parsed: AIResponse;
  try {
    parsed = JSON.parse(raw) as AIResponse;
  } catch {
    console.error("[AI Engine] Invalid JSON from Gemini:", raw.slice(0, 200));
    throw new AIServiceError("Gemini returned malformed JSON.", "AI_INVALID_JSON", 502);
  }

  /* Shape validation */
  if (
    !Array.isArray(parsed.daily_plan) ||
    typeof parsed.vibe_score !== "number" ||
    !Array.isArray(parsed.suggested_addons)
  ) {
    throw new AIServiceError("Gemini response did not match expected schema.", "AI_SCHEMA_MISMATCH", 502);
  }

  return parsed;
}


