import Link from "next/link";

export const metadata = { title: "About Us | TravelWithUs" };

const stats = [
  { value: "50K+",  label: "Travellers served" },
  { value: "5",     label: "Iconic destinations" },
  { value: "99%",   label: "Satisfaction rate" },
  { value: "24/7",  label: "AI concierge support" },
];

const team = [
  { name: "Arjun Mehra",    role: "Co-founder & CEO",      emoji: "👨‍💼" },
  { name: "Priya Kapoor",   role: "Co-founder & CTO",      emoji: "👩‍💻" },
  { name: "Diego Souza",    role: "Head of Experiences",   emoji: "🌍" },
  { name: "Yuki Tanaka",    role: "AI & Product Lead",     emoji: "🤖" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <section
        className="relative overflow-hidden py-28 text-center px-6"
        style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)" }}
      >
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-200">Our Story</p>
          <h1 className="text-4xl font-extrabold text-white sm:text-6xl leading-tight">
            Travel shouldn't be<br />
            <span className="text-yellow-300">complicated.</span>
          </h1>
          <p className="mt-6 text-lg text-blue-100 leading-relaxed">
            We built TravelWithUs because planning a trip felt like a second job.
            We combined AI, expert curation, and genuine wanderlust to change that.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-5xl grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-8 text-center"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="text-4xl font-black" style={{ color: "var(--primary)" }}>{s.value}</div>
              <div className="mt-2 text-sm" style={{ color: "var(--muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--heading)" }}>Our Mission</h2>
          <p className="text-lg leading-relaxed" style={{ color: "var(--body)" }}>
            We believe every person deserves a trip that feels tailored — not templated.
            Our AI analyzes thousands of options in seconds so you get a personalised
            itinerary, handpicked accommodation, and transparent pricing. No hidden fees.
            No generic tours. Just experiences worth talking about.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: "var(--heading)" }}>The Team</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {team.map((m) => (
              <div
                key={m.name}
                className="rounded-2xl p-8 text-center"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div className="text-5xl mb-4">{m.emoji}</div>
                <div className="font-bold text-sm" style={{ color: "var(--heading)" }}>{m.name}</div>
                <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--heading)" }}>Ready to go somewhere amazing?</h2>
        <Link
          href="/"
          className="inline-block rounded-full px-8 py-4 font-bold text-white text-sm transition-transform hover:scale-105"
          style={{ background: "var(--primary)" }}
        >
          Explore Destinations
        </Link>
      </section>
    </main>
  );
}
