/* ============================================================
   Controller: Chat  (AI Travel Assistant)
   ============================================================
   POST /api/chat  →  { message, city? }
   Returns          →  { reply }
   Uses Gemini to answer travel Q&A in a friendly assistant tone.
   ============================================================ */

import type { Request, Response, NextFunction } from "express";
import { GoogleGenAI } from "@google/genai";
import { hasValidAIKey } from "../services/ai";
import { AIServiceError } from "../middlewares/errorHandler";

const CHAT_SYSTEM_PROMPT = `You are Travyy, a friendly and enthusiastic AI travel assistant for TravelWithUs.
You help users plan trips, answer questions about destinations, give packing tips, explain local customs, suggest food, and more.

RULES:
1. Be warm, helpful, and concise (2-4 sentences max per response).
2. If asked about a specific destination (Mumbai, Rio, Thailand, Italy, Tokyo), give specific local tips.
3. Never make up flight prices or hotel prices — say "prices vary" instead.
4. If the question is completely unrelated to travel, politely redirect: "I'm best at travel questions — ask me about destinations, packing, or itineraries!"
5. Respond in plain text only. No markdown, no bullet points.`;

export async function chatWithAI(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { message, city } = req.body as { message?: string; city?: string };

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      res.status(400).json({ error: "message is required." });
      return;
    }

    if (message.trim().length > 500) {
      res.status(400).json({ error: "message must be 500 characters or fewer." });
      return;
    }

    /* Honest API: do not return mock responses */
    if (!hasValidAIKey()) {
      throw new AIServiceError("AI service is not configured.", "AI_NOT_CONFIGURED", 503);
    }

    const apiKey = process.env.AI_API_KEY ?? "";
    const model  = process.env.AI_MODEL || "gemini-2.5-flash";
    const ai     = new GoogleGenAI({ apiKey });

    const contextHint = city ? ` The user is currently browsing the ${city} package.` : "";
    const prompt = `${message}${contextHint}`;

    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: CHAT_SYSTEM_PROMPT,
        temperature: 0.8,
        maxOutputTokens: 256,
      },
    });

    const reply = response.text?.trim();
    if (!reply) {
      throw new AIServiceError("AI returned an empty response.", "AI_EMPTY_RESPONSE", 502);
    }
    res.json({ reply });
  } catch (err) {
    if (err instanceof AIServiceError) {
      next(err);
      return;
    }
    next(new AIServiceError((err as Error).message, "AI_CHAT_FAILED", 502));
  }
}
