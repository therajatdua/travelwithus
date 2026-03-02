export const metadata = { title: "Cookie Policy | TravelWithUs" };

const cookies = [
  {
    category: "Essential",
    required: true,
    desc: "Required for the platform to function. Includes session authentication (__session), CSRF protection, and load balancing. Cannot be disabled.",
    examples: ["__session (Firebase Auth token)", "csrf_token"],
  },
  {
    category: "Analytics",
    required: false,
    desc: "Help us understand how visitors use the platform so we can improve it. Data is aggregated and anonymised. Powered by Firebase Analytics.",
    examples: ["_ga (Google Analytics)", "_gid"],
  },
  {
    category: "Preferences",
    required: false,
    desc: "Remember your settings such as light/dark theme, last searched destination, and language preferences.",
    examples: ["theme", "locale"],
  },
  {
    category: "Marketing",
    required: false,
    desc: "We currently do not use marketing or tracking cookies for ad-targeting purposes. This may change in the future with prior notice.",
    examples: [],
  },
];

export default function CookiesPage() {
  return (
    <main className="min-h-screen py-20 px-6" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--primary)" }}>Legal</p>
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: "var(--heading)" }}>Cookie Policy</h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Last updated: 1 March 2026</p>

        <p className="text-sm leading-relaxed mb-12" style={{ color: "var(--body)" }}>
          This policy explains what cookies TravelWithUs uses, why we use them, and how you can manage your preferences.
          A cookie is a small text file placed on your device by a website you visit.
        </p>

        <div className="space-y-6">
          {cookies.map((c) => (
            <div
              key={c.category}
              className="rounded-2xl p-6"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <h2 className="font-bold text-base" style={{ color: "var(--heading)" }}>{c.category}</h2>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: c.required ? "var(--primary)" : "var(--border)",
                    color: c.required ? "#fff" : "var(--muted)",
                  }}
                >
                  {c.required ? "Required" : "Optional"}
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--body)" }}>{c.desc}</p>
              {c.examples.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {c.examples.map((ex) => (
                    <code
                      key={ex}
                      className="text-xs px-2 py-1 rounded-lg"
                      style={{ background: "var(--bg)", color: "var(--muted)", border: "1px solid var(--border)" }}
                    >
                      {ex}
                    </code>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          className="mt-14 rounded-2xl p-6 text-sm"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--body)" }}
        >
          To opt out of optional cookies or request data removal, email{" "}
          <a href="mailto:privacy@travelwithus.app" className="underline" style={{ color: "var(--primary)" }}>
            privacy@travelwithus.app
          </a>
        </div>
      </div>
    </main>
  );
}
