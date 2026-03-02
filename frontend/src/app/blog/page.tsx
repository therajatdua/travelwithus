import Link from "next/link";

export const metadata = { title: "Blog | TravelWithUs" };

const posts = [
  {
    slug: "#",
    category: "Destinations",
    title: "Tokyo in Cherry Blossom Season: Your 5-Day Plan",
    excerpt: "Sakura season is short and sweeter than mochi. Here&apos;s how to time your trip, the best spots to picnic under the blooms, and what to eat while you&apos;re there.",
    date: "Feb 20, 2026",
    readTime: "6 min read",
    emoji: "🌸",
  },
  {
    slug: "#",
    category: "Travel Tips",
    title: "How AI Changed the Way We Plan Trips",
    excerpt: "From generic tour packages to personalised itineraries generated in seconds — the travel planning industry is being transformed. Here&apos;s what that means for you.",
    date: "Feb 12, 2026",
    readTime: "5 min read",
    emoji: "🤖",
  },
  {
    slug: "#",
    category: "Food & Culture",
    title: "Street Food Survival Guide: Bangkok Edition",
    excerpt: "Pad thai from the wrong stall is a crime. Pad see ew at the right one is a religious experience. We rank the 10 dishes you must try and where to find them.",
    date: "Jan 30, 2026",
    readTime: "7 min read",
    emoji: "🍜",
  },
  {
    slug: "#",
    category: "Destinations",
    title: "Why Rio's Off-Season Might Be Your Best Season",
    excerpt: "Carnival gets the headlines but shoulder-season Rio has shorter queues, lower prices, and locals who actually want to chat. Full breakdown inside.",
    date: "Jan 18, 2026",
    readTime: "5 min read",
    emoji: "🌴",
  },
  {
    slug: "#",
    category: "Packing",
    title: "The 30-Litre Carry-On Challenge: 5 Destinations, No Check-In",
    excerpt: "Our travel editor packed for Mumbai, Italy, Thailand and Tokyo in one 30L bag. Here&apos;s the exact list, the compression cubes, and the one thing you&apos;ll regret leaving behind.",
    date: "Jan 5, 2026",
    readTime: "8 min read",
    emoji: "🎒",
  },
  {
    slug: "#",
    category: "Tips",
    title: "Hidden Gems in Florence Nobody Warns You About",
    excerpt: "The Uffizi is great. But the neighbourhood osteria two streets behind it, with handwritten menus and a €9 lunch menu — that&apos;s Florence.",
    date: "Dec 22, 2025",
    readTime: "4 min read",
    emoji: "🇮🇹",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <section className="py-24 px-6 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--primary)" }}>Stories & Guides</p>
        <h1 className="text-4xl font-extrabold sm:text-5xl" style={{ color: "var(--heading)" }}>The TravelWithUs Blog</h1>
        <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: "var(--body)" }}>
          Destination guides, packing lists, AI travel tips, and the kind of food content you&apos;ll read at your desk while wishing you were elsewhere.
        </p>
      </section>

      {/* Posts grid */}
      <section className="py-8 px-6 pb-24">
        <div className="mx-auto max-w-5xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.title}
              href={post.slug}
              className="group flex flex-col rounded-2xl overflow-hidden transition-transform hover:-translate-y-1"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div
                className="h-36 flex items-center justify-center text-6xl"
                style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)" }}
              >
                {post.emoji}
              </div>
              <div className="flex flex-col gap-3 p-6 flex-1">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--primary)" }}>
                  {post.category}
                </span>
                <h2 className="font-bold leading-snug text-base" style={{ color: "var(--heading)" }}>
                  {post.title}
                </h2>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--body)" }}>
                  {post.excerpt}
                </p>
                <div className="flex gap-3 text-xs mt-2" style={{ color: "var(--muted)" }}>
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
