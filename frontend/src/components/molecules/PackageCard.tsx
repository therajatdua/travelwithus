/* ============================================================
   Molecule: PackageCard
   ============================================================
   Combines Card + Typography + Button to display a travel
   package preview. Molecules compose atoms into functional UI.
   ============================================================ */

import { Card, Typography, Button } from "@/components/atoms";
import type { TravelPackage } from "@/types";

interface PackageCardProps {
  pkg: TravelPackage;
  onExplore?: (id: string) => void;
}

/* City-to-image map for card hero banners */
const cityImages: Record<string, string> = {
  mumbai: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80",
  rio: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80",
  thailand: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
  italy: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
};

export default function PackageCard({ pkg, onExplore }: PackageCardProps) {
  const image = cityImages[pkg.themeKey];

  return (
    <Card className="flex flex-col gap-4 overflow-hidden">
      {/* Image hero strip */}
      <div className="relative flex h-36 w-full items-end rounded-[var(--radius-md)] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <span className="relative text-lg font-bold text-white drop-shadow-md p-4">
          {pkg.destinationName}
        </span>
      </div>

      <Typography variant="body" className="line-clamp-2">{pkg.shortDescription}</Typography>

      <div className="mt-auto flex items-center justify-between">
        <Typography variant="caption">
          From <strong className="text-[var(--heading)]">${pkg.priceUSD}</strong>
        </Typography>
        <Button variant="primary" size="sm" onClick={() => onExplore?.(pkg.id)}>
          Explore →
        </Button>
      </div>
    </Card>
  );
}
