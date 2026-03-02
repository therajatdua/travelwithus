export const metadata = { title: "Careers | TravelWithUs" };

const roles = [
  {
    title: "Senior Full-Stack Engineer",
    team: "Engineering",
    location: "Remote (India / Global)",
    type: "Full-time",
  },
  {
    title: "AI / ML Engineer",
    team: "Product & AI",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Destination Content Writer",
    team: "Content",
    location: "Remote",
    type: "Contract",
  },
  {
    title: "Growth & Partnerships Manager",
    team: "Growth",
    location: "Mumbai or Remote",
    type: "Full-time",
  },
  {
    title: "UI/UX Designer",
    team: "Design",
    location: "Remote",
    type: "Full-time",
  },
];

const perks = [
  { icon: "✈️", label: "Annual travel stipend", desc: "₹1L/year to book anything on the platform" },
  { icon: "🏠", label: "Fully remote", desc: "Work from anywhere — we care about output, not hours" },
  { icon: "📚", label: "Learning budget", desc: "₹50K/year for courses, books, conferences" },
  { icon: "🏥", label: "Health cover", desc: "Global health insurance for you and your family" },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <section
        className="py-28 px-6 text-center"
        style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)" }}
      >
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-200">We&apos;re hiring</p>
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
          Help us make travel<br />
          <span className="text-yellow-300">effortless for everyone</span>
        </h1>
        <p className="mt-6 text-lg text-blue-100 max-w-xl mx-auto">
          We&apos;re a small, ambitious team building AI-powered travel experiences. If you love travel and great engineering, you&apos;ll fit right in.
        </p>
      </section>

      {/* Perks */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: "var(--heading)" }}>Why TravelWithUs?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((p) => (
              <div
                key={p.label}
                className="rounded-2xl p-6 text-center"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div className="text-4xl mb-3">{p.icon}</div>
                <div className="font-bold text-sm mb-1" style={{ color: "var(--heading)" }}>{p.label}</div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="py-8 px-6 pb-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: "var(--heading)" }}>Open roles</h2>
          <div className="space-y-4">
            {roles.map((role) => (
              <div
                key={role.title}
                className="rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div>
                  <div className="font-bold" style={{ color: "var(--heading)" }}>{role.title}</div>
                  <div className="mt-1 flex gap-3 text-xs flex-wrap" style={{ color: "var(--muted)" }}>
                    <span>{role.team}</span>
                    <span>·</span>
                    <span>{role.location}</span>
                    <span>·</span>
                    <span>{role.type}</span>
                  </div>
                </div>
                <a
                  href="mailto:careers@travelwithus.app"
                  className="shrink-0 rounded-full px-5 py-2 text-sm font-bold text-white transition-transform hover:scale-105"
                  style={{ background: "var(--primary)" }}
                >
                  Apply →
                </a>
              </div>
            ))}
          </div>
          <p className="text-center mt-10 text-sm" style={{ color: "var(--muted)" }}>
            Don&apos;t see a match?{" "}
            <a href="mailto:careers@travelwithus.app" className="underline" style={{ color: "var(--primary)" }}>
              Send us an open application
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
