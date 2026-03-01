/* ============================================================
   TravelWithUs – Core Type Definitions
   ============================================================ */

/** CSS data-theme attribute keys for destination theming */
export type ThemeKey = "mumbai" | "rio" | "thailand" | "italy" | "tokyo";

/** A single day within a travel itinerary */
export interface ItineraryDay {
  /** Day number (1-based) */
  day: number;
  /** Short title for the day, e.g. "Arrival & Sunset Vibes" */
  title: string;
  /** Detailed description of the day's activities */
  description: string;
  /** Key highlights / points of interest */
  highlights: string[];
  /** Meals included for the day */
  meals: ("Breakfast" | "Lunch" | "Dinner")[];
}

/** Available transport modes */
export type TransportMode = "Flight" | "Train" | "Bus" | "Ferry" | "Car";

/** Accommodation details for a package */
export interface Accommodation {
  /** Hotel / resort name */
  name: string;
  /** Star rating (1–5) */
  starRating: number;
  /** Type of room or suite */
  roomType: string;
  /** Amenities included */
  amenities: string[];
}

/** A complete travel package */
export interface TravelPackage {
  /** Unique identifier */
  id: string;
  /** Display-friendly destination name */
  destinationName: string;
  /** Short, Gen-Z-targeted description */
  shortDescription: string;
  /** Matches the CSS [data-theme] key */
  themeKey: ThemeKey;
  /** 5-day / 4-night itinerary */
  itinerary: [ItineraryDay, ItineraryDay, ItineraryDay, ItineraryDay, ItineraryDay];
  /** Available transport options to the destination */
  transportOptions: TransportMode[];
  /** Partnered accommodation */
  accommodation: Accommodation;
  /** Price in USD – used for display purposes */
  priceUSD: number;
  /** Hero image path (relative to /public) */
  heroImage: string;
}
