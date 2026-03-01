/* ============================================================
   TravelWithUs – Hardcoded Itinerary Dataset
   ============================================================
   5 travel packages (Mumbai, Rio, Thailand, Italy, Tokyo)
   Each with a 4-Night / 5-Day itinerary, transport options,
   and partnered accommodation details.
   ============================================================ */

import type { TravelPackage } from "@/types";

export const travelPackages: TravelPackage[] = [
  /* ──────────────────────────────────────────────────────────
     1. MUMBAI
     ────────────────────────────────────────────────────────── */
  {
    id: "pkg-mumbai-001",
    destinationName: "Mumbai",
    shortDescription:
      "Bollywood beats, street-food feasts & skyline sunsets — Mumbai is giving main character energy 🌇",
    themeKey: "mumbai",
    priceUSD: 1299,
    heroImage: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1600&q=80",
    transportOptions: ["Flight", "Train"],
    accommodation: {
      name: "The Taj Mahal Palace",
      starRating: 5,
      roomType: "Luxury Sea-View Suite",
      amenities: [
        "Rooftop Pool",
        "Spa & Wellness Center",
        "24/7 Concierge",
        "Complimentary Breakfast Buffet",
        "Free Wi-Fi",
      ],
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival & Gateway Glow-Up",
        description:
          "Land in Mumbai, check into the iconic Taj Mahal Palace, and soak in the views of the Gateway of India at golden hour. Evening Marine Drive stroll with cutting chai in hand.",
        highlights: [
          "Gateway of India",
          "Marine Drive sunset walk",
          "Welcome dinner at Masala Library",
        ],
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Old Bombay & Street Eats",
        description:
          "Explore the chaotic-beautiful lanes of Colaba and Crawford Market. Hit up Chowpatty Beach for the most unhinged pani puri session of your life.",
        highlights: [
          "Colaba Causeway shopping",
          "Crawford Market spice tour",
          "Chowpatty Beach street food crawl",
        ],
        meals: ["Breakfast", "Lunch"],
      },
      {
        day: 3,
        title: "Bollywood & Dharavi Hustle",
        description:
          "Morning Bollywood studio tour followed by the Dharavi creative-economy walk — the real entrepreneurial heartbeat of the city.",
        highlights: [
          "Film City Bollywood tour",
          "Dharavi leather & pottery workshops",
          "Bandra street-art walk",
        ],
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Elephanta & Rooftop Vibes",
        description:
          "Ferry to the UNESCO Elephanta Caves for ancient rock-cut cave temples. Return for a sundowner at Aer, Mumbai's highest rooftop lounge.",
        highlights: [
          "Elephanta Island ferry",
          "UNESCO cave sculptures",
          "Rooftop cocktails at Aer Lounge",
        ],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 5,
        title: "Sunrise & Farewell",
        description:
          "Catch the sunrise at Worli Sea Link, pick up last-minute souvenirs at Linking Road, and head to the airport with a suitcase full of memories (and snacks).",
        highlights: [
          "Worli Sea Link sunrise",
          "Linking Road shopping",
          "Airport transfer",
        ],
        meals: ["Breakfast"],
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     2. RIO DE JANEIRO
     ────────────────────────────────────────────────────────── */
  {
    id: "pkg-rio-002",
    destinationName: "Rio de Janeiro",
    shortDescription:
      "Samba, sunsets & sugarloaf — Rio is literally the vibe check every wanderlust soul needs 🌴",
    themeKey: "rio",
    priceUSD: 1749,
    heroImage: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1600&q=80",
    transportOptions: ["Flight"],
    accommodation: {
      name: "Belmond Copacabana Palace",
      starRating: 5,
      roomType: "Ocean-Front Deluxe Room",
      amenities: [
        "Semi-Olympic Pool",
        "Private Beach Access",
        "On-site Michelin Restaurant",
        "Fitness Center",
        "Free Wi-Fi",
      ],
    },
    itinerary: [
      {
        day: 1,
        title: "Copacabana Check-In & Chill",
        description:
          "Arrive in Rio, transfer to Copacabana Palace, and spend the afternoon vibing on Copacabana Beach. Welcome caipirinhas at sunset.",
        highlights: [
          "Copacabana Beach",
          "Caipirinha welcome party",
          "Beachfront dinner",
        ],
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Christ the Redeemer & Santa Teresa",
        description:
          "Cog-train ride up to Cristo Redentor for that iconic panoramic view. Afternoon exploring the bohemian cobblestoned streets of Santa Teresa.",
        highlights: [
          "Christ the Redeemer statue",
          "Cog railway experience",
          "Santa Teresa art galleries & cafés",
        ],
        meals: ["Breakfast", "Lunch"],
      },
      {
        day: 3,
        title: "Sugarloaf & Samba School",
        description:
          "Cable car up Sugarloaf Mountain for 360° city views, then an evening samba dance workshop with local instructors in Lapa.",
        highlights: [
          "Sugarloaf Mountain cable car",
          "Urca sunset lookout",
          "Lapa samba lesson & nightlife",
        ],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 4,
        title: "Tijuca Rainforest & Ipanema",
        description:
          "Morning guided hike through Tijuca — the world's largest urban rainforest. Afternoon chill at Ipanema Beach with açaí bowls.",
        highlights: [
          "Tijuca National Park hike",
          "Waterfall swim",
          "Ipanema Beach & açaí tasting",
        ],
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 5,
        title: "Market Stroll & Tchau Rio",
        description:
          "Browse the Hippie Market in Ipanema for artisan souvenirs, grab a last-minute churrasco lunch, and head to the airport.",
        highlights: [
          "Ipanema Hippie Market",
          "Churrasco farewell lunch",
          "Airport transfer",
        ],
        meals: ["Breakfast", "Lunch"],
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     3. THAILAND
     ────────────────────────────────────────────────────────── */
  {
    id: "pkg-thailand-003",
    destinationName: "Thailand",
    shortDescription:
      "Temples, floating markets & full-moon energy — Thailand is the reset button your soul ordered ✨",
    themeKey: "thailand",
    priceUSD: 1149,
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80",
    transportOptions: ["Flight", "Bus", "Ferry"],
    accommodation: {
      name: "Anantara Riverside Bangkok Resort",
      starRating: 5,
      roomType: "Riverside Premier Room",
      amenities: [
        "Infinity Pool",
        "Thai Cooking Classes",
        "Spa & Muay Thai Ring",
        "Shuttle Boat to BTS Skytrain",
        "Free Wi-Fi",
      ],
    },
    itinerary: [
      {
        day: 1,
        title: "Bangkok Landing & Night Markets",
        description:
          "Touch down in Bangkok, check into the riverside resort, and ease into the chaos at Jodd Fairs night market — pad thai, mango sticky rice, the whole vibe.",
        highlights: [
          "Anantara check-in & river cruise",
          "Jodd Fairs Night Market",
          "First pad thai of the trip",
        ],
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Grand Palace & Temple Run",
        description:
          "Full-day temple hopping: Grand Palace, Wat Pho's reclining Buddha, and a long-tail boat along the Chao Phraya to Wat Arun at sunset.",
        highlights: [
          "Grand Palace guided tour",
          "Wat Pho Thai massage",
          "Wat Arun sunset from the river",
        ],
        meals: ["Breakfast", "Lunch"],
      },
      {
        day: 3,
        title: "Floating Markets & Chinatown",
        description:
          "Early boat ride to Damnoen Saduak Floating Market. Afternoon exploring Bangkok Chinatown's Yaowarat Road for legendary street food.",
        highlights: [
          "Damnoen Saduak Floating Market",
          "Coconut pancake tasting",
          "Yaowarat street-food trail",
        ],
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Ayutthaya Day Trip",
        description:
          "Day trip to the ancient capital Ayutthaya. Explore crumbling temples and the iconic Buddha head entwined in tree roots at Wat Mahathat.",
        highlights: [
          "Ayutthaya Historical Park",
          "Wat Mahathat tree-root Buddha",
          "Elephant sanctuary visit",
        ],
        meals: ["Breakfast", "Lunch"],
      },
      {
        day: 5,
        title: "Thai Cooking & Khob Khun Ka",
        description:
          "Morning Thai cooking class at the resort — learn tom yum & green curry from scratch. Pack up, say goodbye, and head to the airport zen AF.",
        highlights: [
          "Hands-on Thai cooking class",
          "Spa farewell treatment",
          "Airport transfer",
        ],
        meals: ["Breakfast", "Lunch"],
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     4. ITALY
     ────────────────────────────────────────────────────────── */
  {
    id: "pkg-italy-004",
    destinationName: "Italy",
    shortDescription:
      "Pasta, Prosecco & Renaissance drama — Italy is the romanticization of life you've been binge-watching 🍝",
    themeKey: "italy",
    priceUSD: 2199,
    heroImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80",
    transportOptions: ["Flight", "Train"],
    accommodation: {
      name: "Hotel Lungarno, Florence",
      starRating: 4,
      roomType: "Arno River-View Classic Room",
      amenities: [
        "Rooftop Terrace",
        "Wine Cellar Tastings",
        "Complimentary Vespa Rental",
        "Art Library Lounge",
        "Free Wi-Fi",
      ],
    },
    itinerary: [
      {
        day: 1,
        title: "Benvenuto a Firenze",
        description:
          "Arrive in Florence, settle into Hotel Lungarno, and take an evening passeggiata along the Arno. Aperitivo on the rooftop with Ponte Vecchio views.",
        highlights: [
          "Ponte Vecchio sunset walk",
          "Rooftop Aperol Spritz",
          "Welcome Tuscan dinner",
        ],
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Renaissance Overload",
        description:
          "Skip-the-line entry to the Uffizi Gallery followed by the Duomo climb for panoramic Florence views. Gelato research in every piazza.",
        highlights: [
          "Uffizi Gallery – Botticelli's Venus",
          "Duomo rooftop panorama",
          "Artisan gelato tour",
        ],
        meals: ["Breakfast", "Lunch"],
      },
      {
        day: 3,
        title: "Tuscan Wine Country",
        description:
          "Full-day Vespa or minivan tour through Chianti wine country. Vineyard tastings, truffle-hunting, and a farm-to-table lunch under the Tuscan sun.",
        highlights: [
          "Chianti vineyard tour",
          "Truffle hunting experience",
          "Farm-to-table lunch in Greve",
        ],
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Cinque Terre Day Trip",
        description:
          "High-speed train to the Cinque Terre coast. Hike the cliffside trails between colorful villages, swim in the Ligurian Sea, and eat your body weight in pesto.",
        highlights: [
          "Cinque Terre coastal hike",
          "Riomaggiore photo op",
          "Fresh pesto & focaccia lunch",
        ],
        meals: ["Breakfast", "Lunch"],
      },
      {
        day: 5,
        title: "Leather, Limoncello & Arrivederci",
        description:
          "Morning visit to the San Lorenzo leather market. Last espresso at a piazza café. Limoncello toast before heading to the airport. Ciao, bella!",
        highlights: [
          "San Lorenzo leather market",
          "Final espresso ritual",
          "Airport transfer",
        ],
        meals: ["Breakfast"],
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     5. TOKYO
     ────────────────────────────────────────────────────────── */
  {
    id: "pkg-tokyo-005",
    destinationName: "Tokyo",
    shortDescription:
      "Neon streets, sakura dreams & ramen at 2 AM — Tokyo is the anime protagonist arc IRL 🌸",
    themeKey: "tokyo",
    priceUSD: 1899,
    heroImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80",
    transportOptions: ["Flight", "Train"],
    accommodation: {
      name: "Park Hyatt Tokyo",
      starRating: 5,
      roomType: "Deluxe King with Shinjuku Skyline View",
      amenities: [
        "47th-Floor Indoor Pool",
        "Girandole French Dining",
        "Deep-Soaking Tub",
        "24/7 Gym & Spa",
        "Free Wi-Fi",
      ],
    },
    itinerary: [
      {
        day: 1,
        title: "Shinjuku Arrival & Neon Overload",
        description:
          "Land at Narita/Haneda, bullet-train or transfer to the Park Hyatt. Evening exploring Shinjuku's neon alleys, Robot Restaurant vibes, and Golden Gai bar-hopping.",
        highlights: [
          "Park Hyatt Lost in Translation check-in",
          "Shinjuku Gyoen evening walk",
          "Golden Gai izakaya crawl",
        ],
        meals: ["Dinner"],
      },
      {
        day: 2,
        title: "Shibuya, Harajuku & Kawaii Culture",
        description:
          "Cross the world's busiest intersection, shop Harajuku's Takeshita Street, and explore Meiji Shrine's tranquil forests right in the middle of the city.",
        highlights: [
          "Shibuya Crossing from Starbucks view",
          "Harajuku Takeshita Street fashion",
          "Meiji Shrine forest walk",
        ],
        meals: ["Breakfast", "Lunch"],
      },
      {
        day: 3,
        title: "Tsukiji, Akihabara & Anime Realness",
        description:
          "Early sushi breakfast at Tsukiji Outer Market, afternoon deep-dive into Akihabara's otaku paradise — manga, arcades, maid cafés, the works.",
        highlights: [
          "Tsukiji tuna auction breakfast",
          "Akihabara anime mega-stores",
          "Retro arcade marathon",
        ],
        meals: ["Breakfast", "Lunch", "Dinner"],
      },
      {
        day: 4,
        title: "Asakusa, Skytree & Ramen Mastery",
        description:
          "Morning at Senso-ji temple in Asakusa, then Tokyo Skytree for the 360° view. Evening ramen-tasting crawl through Ikebukuro's ramen street.",
        highlights: [
          "Senso-ji Temple & Nakamise Street",
          "Tokyo Skytree observation deck",
          "Ikebukuro ramen street challenge",
        ],
        meals: ["Breakfast", "Dinner"],
      },
      {
        day: 5,
        title: "Teamlab, Souvenirs & Sayonara",
        description:
          "Immersive morning at teamLab Borderless digital art museum. Last-minute shopping at Ginza, pick up Japanese Kit-Kats for everyone, and head to the airport.",
        highlights: [
          "teamLab Borderless immersive art",
          "Ginza luxury shopping",
          "Airport transfer",
        ],
        meals: ["Breakfast", "Lunch"],
      },
    ],
  },
];
