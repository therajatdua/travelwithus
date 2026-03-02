/* ============================================================
   Organism: ChatBot – "Travyy" AI Travel Assistant
   ============================================================
   Floating FAB (bottom-right) → animated slide-up chat panel.
   Fixes: useParams at top level, correct CSS vars, animations.
   ============================================================ */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { API_URL } from "@/lib/constants";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
}

let msgId = 0;
const nextId = () => ++msgId;

const WELCOME: Message = {
  id: 0,
  role: "bot",
  text: "Hey! ✈️ I'm Travyy, your AI travel buddy. Ask me anything — destinations, packing tips, local food, hidden gems, or itinerary ideas!",
};

function fallbackReply(input: string, city?: string): string {
  const text = input.toLowerCase();
  const place = city ? city.charAt(0).toUpperCase() + city.slice(1) : "your destination";

  if (text.includes("best time") || text.includes("when to")) {
    return `Great question! For ${place}, shoulder season is usually your best balance of weather and crowd size. If you share your exact month range, I can narrow it down day-by-day.`;
  }
  if (text.includes("packing") || text.includes("pack")) {
    return `For ${place}: keep light layers, comfortable walking shoes, a universal adapter, and basic meds. I can give you a precise checklist if you tell me trip length and travel month.`;
  }
  if (text.includes("food") || text.includes("eat") || text.includes("restaurant")) {
    return `For ${place}, start with local street food + one highly rated neighborhood spot. I can suggest a practical breakfast/lunch/dinner plan based on your budget style.`;
  }
  if (text.includes("budget") || text.includes("cost") || text.includes("price")) {
    return `Prices vary by season and booking window, but I can help you estimate transport, stay, and daily spend ranges for ${place}. Tell me your travel dates and number of travelers.`;
  }
  return `I’m facing temporary high demand on live AI right now, but I can still help. Tell me your destination, dates, and traveler count, and I’ll suggest a practical starter plan.`;
}

export default function ChatBot() {
  const [open, setOpen]       = useState(false);
  const [closing, setClosing] = useState(false);
  const [fabAnim, setFabAnim] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  /* ── useParams at TOP LEVEL (Rules of Hooks) ─────────────── */
  const params = useParams<{ city?: string }>();
  const city   = params?.city as string | undefined;

  /* ── Scroll to latest ────────────────────────────────────── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── Focus input on open ─────────────────────────────────── */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 320);
  }, [open]);

  /* ── Open / close with animation ────────────────────────── */
  const openChat = useCallback(() => {
    setClosing(false);
    setOpen(true);
    setFabAnim(true);
    setTimeout(() => setFabAnim(false), 420);
  }, []);

  const closeChat = useCallback(() => {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 220);
  }, []);

  const toggle = useCallback(() => {
    if (open) {
      closeChat();
      return;
    }
    openChat();
  }, [open, openChat, closeChat]);

  /* ── Send message ────────────────────────────────────────── */
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((p) => [...p, { id: nextId(), role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ message: text, ...(city ? { city } : {}) }),
      });
      if (!res.ok) {
        const fallback = fallbackReply(text, city);
        setMessages((p) => [...p, { id: nextId(), role: "bot", text: fallback }]);
        return;
      }
      const data = (await res.json()) as { reply?: string };
      if (!data.reply) {
        const fallback = fallbackReply(text, city);
        setMessages((p) => [...p, { id: nextId(), role: "bot", text: fallback }]);
        return;
      }
      const reply = data.reply;
      setMessages((p) => [...p, { id: nextId(), role: "bot", text: reply }]);
    } catch (err) {
      console.error("[Travyy]", err);
      setMessages((p) => [
        ...p,
        { id: nextId(), role: "bot", text: fallbackReply(text, city) },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, city]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }, [sendMessage]);

  const SUGGESTED = ["Best time to visit Tokyo?", "Packing tips for Thailand", "Top food in Mumbai"];

  return (
    <>
      {/* ── Chat Panel ────────────────────────────────────── */}
      {(open || closing) && (
        <div
          role="dialog"
          aria-label="Travyy AI chat"
          className={`fixed bottom-[4.75rem] right-4 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl shadow-2xl ${
            closing ? "travyy-close" : "travyy-open"
          }`}
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {/* ── Header ────────────────────────────────────── */}
          <div
            className="relative flex items-center justify-between overflow-hidden px-4 py-3"
            style={{ background: "var(--primary)" }}
          >
            {/* pulse ring bg deco */}
            <span
              aria-hidden
              className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full"
              style={{ background: "rgba(255,255,255,.12)", animation: "travyy-pulse-ring 2.2s ease-out infinite" }}
            />
            {/* Avatar + name */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-xl shadow-inner">
                ✈️
              </div>
              <div>
                <p className="text-sm font-extrabold leading-none tracking-wide text-white">Travyy</p>
                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-white/65">AI Travel Assistant</p>
              </div>
            </div>
            {/* Online dot + close */}
            <div className="relative z-10 flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 items-center justify-center">
                <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400/70" style={{ animation: "travyy-pulse-ring 1.8s ease-out infinite" }} />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
              </span>
              <button
                onClick={closeChat}
                className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                aria-label="Close Travyy"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* City context pill */}
          {city && (
            <div
              className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-semibold"
              style={{ background: "var(--surface-alt)", color: "var(--body)" }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              </svg>
              Browsing&nbsp;<span className="font-bold capitalize">{city}</span>
            </div>
          )}

          {/* ── Messages ──────────────────────────────────── */}
          <div
            className="flex flex-col gap-3 overflow-y-auto px-4 py-4"
            style={{ maxHeight: "300px", minHeight: "160px", scrollbarWidth: "none" }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`travyy-msg flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "bot" && (
                  <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white"
                    style={{ background: "var(--primary)" }}
                  >T</div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${msg.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"}`}
                  style={
                    msg.role === "user"
                      ? { background: "var(--primary)", color: "#fff" }
                      : { background: "var(--background)", color: "var(--body)", border: "1px solid var(--border)" }
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing dots */}
            {loading && (
              <div className="travyy-msg flex items-end gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white" style={{ background: "var(--primary)" }}>T</div>
                <div
                  className="flex items-center gap-1 rounded-2xl rounded-bl-sm px-3.5 py-3 shadow-sm"
                  style={{ background: "var(--background)", border: "1px solid var(--border)" }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="block h-1.5 w-1.5 rounded-full"
                      style={{
                        background: "var(--primary)",
                        animation: `travyy-dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length === 1 && !loading && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-3">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }}
                  className="rounded-full border px-2.5 py-1 text-[11px] font-medium transition-opacity hover:opacity-70"
                  style={{ borderColor: "var(--border)", color: "var(--primary)", background: "var(--background)" }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* ── Input bar ─────────────────────────────────── */}
          <div
            className="flex items-center gap-2 border-t px-3 py-2.5"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Travyy anything…"
              maxLength={500}
              disabled={loading}
              className="flex-1 rounded-full border px-3.5 py-2 text-sm outline-none transition-shadow focus:shadow-md disabled:opacity-50"
              style={{
                background: "var(--background)",
                color: "var(--body)",
                borderColor: "var(--border)",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
              style={{ background: "var(--primary)" }}
              aria-label="Send"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── FAB ───────────────────────────────────────────── */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
        {/* Tooltip bubble */}
        {!open && !closing && (
          <div
            className="travyy-open mb-0.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold text-white shadow-md"
            style={{ background: "var(--primary)" }}
          >
            Chat with Travyy ✈️
          </div>
        )}

        <button
          onClick={toggle}
          className={`relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-transform hover:scale-110 active:scale-95 ${fabAnim ? "travyy-fab-pop" : ""}`}
          style={{ background: "var(--primary)" }}
          aria-label={open ? "Close Travyy" : "Open Travyy"}
          aria-expanded={open}
        >
          {/* Ambient pulse ring */}
          {!open && (
            <span
              aria-hidden
              className="absolute inset-0 rounded-full"
              style={{ animation: "travyy-pulse-ring 2.8s ease-out infinite", background: "var(--primary)", opacity: 0.5 }}
            />
          )}
          <span
            className="relative"
            style={{ transition: "transform .3s ease", transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
            )}
          </span>
        </button>
      </div>
    </>
  );
}