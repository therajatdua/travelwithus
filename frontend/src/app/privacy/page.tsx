export const metadata = { title: "Privacy Policy | TravelWithUs" };

const sections = [
  {
    title: "1. Information We Collect",
    body: `We collect information you provide directly to us when you create an account, make a booking, or contact us. This includes your name, email address, travel preferences, and payment information. We also automatically collect certain technical information when you use our platform, such as your IP address, browser type, and pages visited.`,
  },
  {
    title: "2. How We Use Your Information",
    body: `We use your information to process bookings, generate personalised AI itineraries, send booking confirmations, respond to support queries, and improve our platform. We do not sell your personal data to third parties. We may share data with trusted service providers (e.g. payment processors, accommodation partners) strictly to fulfil your booking.`,
  },
  {
    title: "3. AI & Data Processing",
    body: `Our AI itinerary generator processes your travel preferences to create personalised trip plans. The data used for this purpose is anonymised and not retained beyond the session. We use Google Gemini AI under their enterprise data protection terms.`,
  },
  {
    title: "4. Cookies",
    body: `We use cookies to maintain your session, remember your preferences, and analyse usage. You can manage cookie preferences via our Cookie Policy page. Disabling cookies may affect platform functionality.`,
  },
  {
    title: "5. Data Retention",
    body: `We retain your account information for as long as your account is active or as needed to provide services. Booking records are kept for 7 years for legal and tax purposes. You may request deletion of your account and associated data at any time.`,
  },
  {
    title: "6. Your Rights",
    body: `Depending on your jurisdiction, you may have the right to access, correct, delete, or port your personal data. To exercise any of these rights, contact us at privacy@travelwithus.app. We will respond within 30 days.`,
  },
  {
    title: "7. Security",
    body: `We use industry-standard security measures including TLS encryption, Firebase Authentication, and regular security audits. No method of transmission over the internet is 100% secure; we cannot guarantee absolute security but take every reasonable precaution.`,
  },
  {
    title: "8. Changes to This Policy",
    body: `We may update this Privacy Policy periodically. Material changes will be notified by email or a prominent notice on our platform at least 14 days before they take effect.`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-20 px-6" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--primary)" }}>Legal</p>
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: "var(--heading)" }}>Privacy Policy</h1>
        <p className="text-sm mb-12" style={{ color: "var(--muted)" }}>Last updated: 1 March 2026</p>

        <div className="space-y-10">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-lg font-bold mb-3" style={{ color: "var(--heading)" }}>{s.title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--body)" }}>{s.body}</p>
            </div>
          ))}
        </div>

        <div
          className="mt-14 rounded-2xl p-6 text-sm"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--body)" }}
        >
          Questions about this policy? Email us at{" "}
          <a href="mailto:privacy@travelwithus.app" className="underline" style={{ color: "var(--primary)" }}>
            privacy@travelwithus.app
          </a>
        </div>
      </div>
    </main>
  );
}
