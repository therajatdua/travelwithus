/* ============================================================
   Molecule: ItineraryTimeline
   ============================================================
   Vertical timeline displaying the 5-day itinerary.
   Timeline tracking line:   border-theme-surface
   Timeline node indicators: bg-theme-primary
   Day hover interaction:    hover:text-theme-hover
   ============================================================ */

"use client";

import { useState } from "react";
import type { ItineraryDay } from "@/types";

interface ItineraryTimelineProps {
  /** The 5-day itinerary array from the travel package */
  itinerary: ItineraryDay[];
}

export default function ItineraryTimeline({ itinerary }: ItineraryTimelineProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const toggleDay = (day: number) => {
    setExpandedDay((prev) => (prev === day ? null : day));
  };

  return (
    <div className="relative">
      {/* Vertical tracking line */}
      <div className="absolute left-5 top-0 h-full w-0.5 bg-theme-surface md:left-6" aria-hidden="true" />

      <ol className="relative flex flex-col gap-8">
        {itinerary.map((day) => {
          const isExpanded = expandedDay === day.day;

          return (
            <li key={day.day} className="relative pl-14 md:pl-16">
              {/* ── Timeline node indicator ────────────────── */}
              <span
                className="absolute left-2.5 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-theme-primary text-[10px] font-bold text-text-inverse shadow-md ring-4 ring-theme-bg md:left-3.5 md:h-5 md:w-5"
              >
                {day.day}
              </span>

              {/* ── Day card ───────────────────────────────── */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleDay(day.day)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleDay(day.day);
                  }
                }}
                className="group cursor-pointer rounded-[var(--radius-md)] border border-theme-surface bg-theme-surface/40 p-5 transition-all duration-300 hover:border-theme-primary hover:shadow-md"
              >
                {/* Day header */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-theme-accent">
                      Day {day.day}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold text-theme-heading transition-colors duration-300 group-hover:text-theme-hover">
                      {day.title}
                    </h3>
                  </div>

                  {/* Expand/collapse chevron */}
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-theme-surface text-xs text-theme-heading transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </div>

                {/* Description – always visible */}
                <p className="mt-2 text-sm leading-relaxed text-theme-body">
                  {day.description}
                </p>

                {/* ── Expandable details ───────────────────── */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isExpanded
                      ? "mt-4 grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    {/* Highlights */}
                    <div className="mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-theme-heading">
                        Highlights
                      </span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {day.highlights.map((h) => (
                          <span
                            key={h}
                            className="rounded-[var(--radius-sm)] bg-theme-bg px-2.5 py-1 text-xs font-medium text-theme-heading"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Meals */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-theme-heading">
                        Meals
                      </span>
                      <div className="flex gap-1.5">
                        {day.meals.map((meal) => (
                          <span
                            key={meal}
                            className="rounded-full bg-theme-primary/10 px-2.5 py-0.5 text-xs font-medium text-theme-primary"
                          >
                            {meal}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
