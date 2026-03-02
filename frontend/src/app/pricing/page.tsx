import Link from "next/link";

export const metadata = { title: "Pricing | TravelWithUs" };

const packages = [
  { dest: "🇮🇳 Mumbai",   price: 1299, tag: "Most booked" },
  { dest: "🇧🇷 Rio",       price: 1749, tag: null },
  { dest: "🇹🇭 Thailand",  price: 1149, tag: "Best value" },
  { dest: "🇮🇹 Italy",     price: 2199, tag: "Premium pick" },
  { dest: "🇯🇵 Tokyo",     price: 1899, tag: null },
];

const includes = [
  "4-night accommodation (hotel of your choice)",
  "AI-generated personalised itinerary",
  "All ground transfers in destination city",
  "Daily breakfast",
  "24/7 AI concierge chat",
  "Free itinerary modifications (up to 48h before travel)",
];

const transports = [
  { mode: "✈️ Flight",  surcharge: "+$120" },
  { mode: "🚆 Train",   surcharge: "+$40" },
  { mode: "⛴️ Ferry",   surcharge: "+$60" },
  { mode: "🚌 Bus",     surcharge: "Free" },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <section className="py-24 px-6 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--primary)" }}>Transparent pricing</p>
        <h1 className="text-4xl font-extrabold sm:text-5xl" style={{ color: "var(--heading)" }}>
          No hidden fees. Ever.
        </h1>
        <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: "var(--body)" }}>
          Base prices are per person for 5 days / 4 nights. Transport surcharges are listed separately.
        </p>
      </section>

      {/* Package prices */}
      <section className="py-8 px-6">
        <div className="mx-auto max-w-4xl grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((p) => (
            <div
              key={p.dest}
              className="relative rounded-2xl p-8"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              {p.tag && (
                <span
                  className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full text-white"
                  style={{ background: "var(--primary)" }}
                >
                  {p.tag}
                </span>
              )}
              <div className="text-2xl mb-3">{p.dest}</div>
              <div className="text-4xl font-black" style={{ color: "var(--heading)" }}>
                ${p.price.toLocaleString()}
              </div>
              <div className="text-xs mt-1 mb-6" style={{ color: "var(--muted)" }}>per person · 5 days</div>
              <Link
                href={`/packages/${p.dest.split(" ")[1].toLowerCase()}`}
                className="block text-center rounded-full py-3 text-sm font-bold text-white transition-transform hover:scale-105"
                style={{ background: "var(--primary)" }}
              >
                View package
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: "var(--heading)" }}>What&apos;s included in every package</h2>
          <div
            className="rounded-2xl p-8 grid sm:grid-cols-2 gap-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            {includes.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm" style={{ color: "var(--body)" }}>
                <span className="text-green-500 mt-0.5">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transport surcharges */}
      <section className="py-8 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: "var(--heading)" }}>Transport surcharges (per person)</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {transports.map((t) => (
              <div
                key={t.mode}
                className="rounded-2xl p-6 text-center"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div className="text-2xl mb-2">{t.mode.split(" ")[0]}</div>
                <div className="text-sm font-semibold" style={{ color: "var(--heading)" }}>{t.mode.split(" ")[1]}</div>
                <div className="mt-2 text-lg font-black" style={{ color: "var(--primary)" }}>{t.surcharge}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 text-center">
        <Link
          href="/"
          className="inline-block rounded-full px-8 py-4 font-bold text-white text-sm transition-transform hover:scale-105"
          style={{ background: "var(--primary)" }}
        >
          Book a package →
        </Link>
      </section>
    </main>
  );
}
