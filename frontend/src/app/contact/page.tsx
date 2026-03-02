"use client";

import { useState } from "react";

const channels = [
  { icon: "📧", label: "Email", value: "hello@travelwithus.app", href: "mailto:hello@travelwithus.app" },
  { icon: "🐦", label: "Twitter / X", value: "@travelwithus", href: "https://x.com" },
  { icon: "💼", label: "LinkedIn", value: "TravelWithUs", href: "https://linkedin.com" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production this would POST to an API endpoint; for now show success state
    setSent(true);
  }

  const inputStyle: React.CSSProperties = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "0.75rem",
    color: "var(--heading)",
    width: "100%",
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    outline: "none",
  };

  return (
    <main className="min-h-screen py-20 px-6" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--primary)" }}>Get in touch</p>
          <h1 className="text-4xl font-extrabold sm:text-5xl" style={{ color: "var(--heading)" }}>We&apos;d love to hear from you</h1>
          <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: "var(--body)" }}>
            Have a question about a booking, a partnership enquiry, or just want to say hi? We reply within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact channels */}
          <div className="space-y-4">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl p-5 transition-transform hover:-translate-y-1"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <span className="text-3xl">{c.icon}</span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>{c.label}</div>
                  <div className="text-sm font-medium mt-0.5" style={{ color: "var(--heading)" }}>{c.value}</div>
                </div>
              </a>
            ))}

            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--muted)" }}>Response time</div>
              <div className="text-sm" style={{ color: "var(--body)" }}>We typically reply within 24 hours on weekdays.</div>
            </div>
          </div>

          {/* Form */}
          <div
            className="lg:col-span-2 rounded-2xl p-8"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-12 text-center">
                <div className="text-6xl">✈️</div>
                <h2 className="text-2xl font-bold" style={{ color: "var(--heading)" }}>Message sent!</h2>
                <p className="text-sm" style={{ color: "var(--body)" }}>
                  We&apos;ll get back to you at <strong>{form.email}</strong> within 24 hours.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-2 text-sm underline"
                  style={{ color: "var(--primary)" }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--muted)" }}>Name</label>
                    <input name="name" required value={form.name} onChange={handleChange} placeholder="Arjun Mehra" style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--muted)" }}>Email</label>
                    <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="arjun@email.com" style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--muted)" }}>Subject</label>
                  <select name="subject" required value={form.subject} onChange={handleChange} style={inputStyle}>
                    <option value="">Select a topic…</option>
                    <option>Booking question</option>
                    <option>Cancellation / refund</option>
                    <option>Partnership enquiry</option>
                    <option>Technical issue</option>
                    <option>Feedback</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--muted)" }}>Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us what&apos;s on your mind…"
                    style={{ ...inputStyle, resize: "none" }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full py-4 font-bold text-white text-sm transition-transform hover:scale-[1.02]"
                  style={{ background: "var(--primary)" }}
                >
                  Send message →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
