/* ============================================================
   Atom: ScrollProgress
   ============================================================
   A thin gradient bar at the very top of the viewport that
   shows how far down the page the user has scrolled.
   ============================================================ */

"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setWidth(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="scroll-progress"
      style={{ width: `${width}%` }}
      aria-hidden="true"
    />
  );
}
