/**
 * seed-firestore.ts
 * Run once to populate Firestore with the 5 travel packages.
 *
 *   npx ts-node --project tsconfig.json seed-firestore.ts
 */

import * as dotenv from "dotenv";
dotenv.config();

import * as admin from "firebase-admin";

/* ── Init Admin SDK ─────────────────────────────────────────── */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

/* ── Package data ───────────────────────────────────────────── */
const packages = [
  {
    slug:          "mumbai",
    name:          "Mumbai",
    theme_key:     "mumbai",
    base_price:    1299,
    short_description:
      "Bollywood beats, street-food feasts & skyline sunsets — Mumbai is giving main character energy 🌇",
    hero_image:
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1600&q=80",
    transport_options: ["Flight", "Train"],
    accommodation: {
      name:        "The Taj Mahal Palace",
      star_rating: 5,
      room_type:   "Luxury Sea-View Suite",
      amenities: [
        "Rooftop Pool",
        "Spa & Wellness Center",
        "24/7 Concierge",
        "Complimentary Breakfast Buffet",
        "Free Wi-Fi",
      ],
    },
  },
  {
    slug:          "rio",
    name:          "Rio de Janeiro",
    theme_key:     "rio",
    base_price:    1749,
    short_description:
      "Samba, sunsets & sugarloaf — Rio is literally the vibe check every wanderlust soul needs 🌴",
    hero_image:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1600&q=80",
    transport_options: ["Flight"],
    accommodation: {
      name:        "Belmond Copacabana Palace",
      star_rating: 5,
      room_type:   "Ocean-Front Deluxe Room",
      amenities: [
        "Semi-Olympic Pool",
        "Private Beach Access",
        "On-site Michelin Restaurant",
        "Fitness Center",
        "Free Wi-Fi",
      ],
    },
  },
  {
    slug:          "thailand",
    name:          "Thailand",
    theme_key:     "thailand",
    base_price:    1149,
    short_description:
      "Temples, floating markets & full-moon energy — Thailand is the reset button your soul ordered ✨",
    hero_image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80",
    transport_options: ["Flight", "Bus", "Ferry"],
    accommodation: {
      name:        "Anantara Riverside Bangkok Resort",
      star_rating: 5,
      room_type:   "Riverside Premier Room",
      amenities: [
        "Infinity Pool",
        "Thai Cooking Classes",
        "Spa & Muay Thai Ring",
        "Shuttle Boat to BTS Skytrain",
        "Free Wi-Fi",
      ],
    },
  },
  {
    slug:          "italy",
    name:          "Italy",
    theme_key:     "italy",
    base_price:    2199,
    short_description:
      "Pasta, Prosecco & Renaissance drama — Italy is the romanticization of life you've been binge-watching 🍝",
    hero_image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80",
    transport_options: ["Flight", "Train"],
    accommodation: {
      name:        "Hotel Lungarno, Florence",
      star_rating: 4,
      room_type:   "Arno River-View Classic Room",
      amenities: [
        "Rooftop Terrace",
        "Wine Cellar Tastings",
        "Complimentary Vespa Rental",
        "Art Library Lounge",
        "Free Wi-Fi",
      ],
    },
  },
  {
    slug:          "tokyo",
    name:          "Tokyo",
    theme_key:     "tokyo",
    base_price:    1899,
    short_description:
      "Neon streets, sakura dreams & ramen at 2 AM — Tokyo is the anime protagonist arc IRL 🌸",
    hero_image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80",
    transport_options: ["Flight", "Train"],
    accommodation: {
      name:        "Park Hyatt Tokyo",
      star_rating: 5,
      room_type:   "Deluxe King with Shinjuku Skyline View",
      amenities: [
        "47th-Floor Indoor Pool",
        "Girandole French Dining",
        "Deep-Soaking Tub",
        "24/7 Gym & Spa",
        "Free Wi-Fi",
      ],
    },
  },
];

/* ── Seed ───────────────────────────────────────────────────── */
async function seed() {
  const col = db.collection("packages");
  let seeded = 0;

  for (const pkg of packages) {
    // Use slug as document ID so it's easily readable in the console
    const ref = col.doc(pkg.slug);
    const snap = await ref.get();

    if (snap.exists) {
      console.log(`⏭  Skipping "${pkg.name}" — already exists`);
    } else {
      await ref.set({
        ...pkg,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✅ Seeded "${pkg.name}"`);
      seeded++;
    }
  }

  console.log(`\nDone! ${seeded} package(s) added.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
