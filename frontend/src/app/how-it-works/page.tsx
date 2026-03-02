import Link from "next/link";

export const metadata = { title: "How It Works | TravelWithUs" };

const steps = [
  {
    num: "01",
    icon: "🔍",
    title: "Choose your destination",
    desc: "Browse our 5 curated destinations — Mumbai, Rio, Thailand, Italy, or Tokyo. Each package is built around real local insights, not generic tourism.",
  },
  {
    num: "02",
    icon: "🤖",
    title: "Let AI personalise it",
    desc: "Tell us your origin city, travel dates, group size and budget. Our Gemini AI generates a custom day-by-day itinerary in seconds.",
  },
  {
    num: "03",
    icon: "🏨",
    title: "Pick your travel style",
    desc: "Select your transport mode (flight, train, ferry) and accommodation tier. Prices update in real time — no surprises at checkout.",
  },
  {
    num: "04",
    icon: "✅",
    title: "Book & travel",
    desc: "Confirm your booking with one click. You'll receive a full itinerary PDF and packing list. All that's left is showing up.",
  },
];

const faqs = [
  { q: "Can I modify my itinerary after booking?", a: "Yes — contact our support team within 48 hours of booking for free modifications." },
  { q: "Are flights included in the price?", a: "A flight surcharge is added during checkout. Ground transport options like train and ferry are pre-included." },
  { q: "Is my payment secure?", a: "All payments are processed through Stripe with 256-bit SSL encryption." },
  { q: "What if I need to cancel?", a: "Free cancellation up to 14 days before travel. A 10% fee applies within 14 days." },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <section className="py-24 px-6 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--primary)" }}>Simple by design</p>
        <h1 className="text-4xl font-extrabold sm:text-5xl" style={{ color: "var(--heading)" }}>
          From idea to itinerary<br />in under 60 seconds
        </h1>
        <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: "var(--body)" }}>
          Here's exactly how TravelWithUs turns your wanderlust into a confirmed booking.
        </p>
      </section>

      {/* Steps */}
      <section className="py-8 px-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="flex gap-6 rounded-2xl p-8 items-start"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div
                className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-black text-lg"
                style={{ background: "var(--primary)", color: "#fff" }}
              >
                {step.num}
              </div>
              <div>
                <div className="text-2xl mb-2">{step.icon}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--heading)" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--body)" }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ color: "var(--heading)" }}>Common questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl p-6"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <p className="font-semibold mb-2" style={{ color: "var(--heading)" }}>{faq.q}</p>
                <p className="text-sm" style={{ color: "var(--body)" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <Link
          href="/"
          className="inline-block rounded-full px-8 py-4 font-bold text-white text-sm transition-transform hover:scale-105"
          style={{ background: "var(--primary)" }}
        >
          Start planning now →
        </Link>
      </section>
    </main>
  );
}
