/* ============================================================
   Organism: PackageGrid
   ============================================================
   Renders a responsive grid of PackageCard molecules.
   Organisms are sections composed of molecules + atoms.
   ============================================================ */

"use client";

import { PackageCard } from "@/components/molecules";
import type { TravelPackage } from "@/types";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";

interface PackageGridProps {
  packages: TravelPackage[];
}

export default function PackageGrid({ packages }: PackageGridProps) {
  const { setTheme } = useTheme();
  const router = useRouter();

  const handleExplore = (pkg: TravelPackage) => {
    setTheme(pkg.themeKey);
    router.push(`/packages/${pkg.themeKey}`);
  };

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => (
        <PackageCard
          key={pkg.id}
          pkg={pkg}
          onExplore={() => handleExplore(pkg)}
        />
      ))}
    </section>
  );
}
