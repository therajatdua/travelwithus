/* ============================================================
   HeroSearchWidget – MakeMyTrip-style search card
   ============================================================
   Tabs: Packages (active) | Flights (coming soon) | Hotels
   Inputs: Country → city, departure date, traveller count
   Uses country-state-city, react-hook-form + zod
   ============================================================ */

"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Country, City } from "country-state-city";
import { useRouter } from "next/navigation";

/* ── Zod schema ───────────────────────────────────────── */
const schema = z.object({
  countryCode: z.string().min(1, "Select a country"),
  city:        z.string().min(1, "Select a city"),
  date:        z.string().min(1, "Pick a date"),
  adults:      z.number().min(1).max(9),
  children:    z.number().min(0).max(8),
});
type FormData = z.infer<typeof schema>;

type Tab = "packages" | "flights" | "hotels";

/* ── Component ────────────────────────────────────────── */
export function HeroSearchWidget() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("packages");
  const [showPax, setShowPax] = useState(false);

  const { control, register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: { countryCode: "", city: "", date: "", adults: 2, children: 0 },
    });

  const selectedCountry = watch("countryCode");
  const adults          = watch("adults");
  const children        = watch("children");

  const allCountries = Country.getAllCountries();
  const cities       = selectedCountry
    ? City.getCitiesOfCountry(selectedCountry) ?? []
    : [];

  const onSubmit = (data: FormData) => {
    const params = new URLSearchParams({
      country:  data.countryCode,
      city:     data.city,
      date:     data.date,
      adults:   String(data.adults),
      children: String(data.children),
    });
    router.push(`/packages?${params.toString()}`);
  };

  const tabs: { id: Tab; label: string; disabled: boolean }[] = [
    { id: "packages", label: "📦 Packages",     disabled: false },
    { id: "flights",  label: "✈️ Flights",      disabled: true  },
    { id: "hotels",   label: "🏨 Hotels",       disabled: true  },
  ];

  return (
    <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden">
      {/* ── Tab Bar ─────────────────────────────────────── */}
      <div className="flex border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            disabled={t.disabled}
            onClick={() => !t.disabled && setActiveTab(t.id)}
            className={`relative flex-1 py-4 text-sm font-semibold transition-colors
              ${t.disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}
              ${activeTab === t.id && !t.disabled
                ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
                : "text-gray-500 hover:text-gray-800"
              }
            `}
          >
            {t.label}
            {t.disabled && (
              <span className="ml-1.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-normal text-gray-400">
                Soon
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Form ────────────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Country */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Country
            </label>
            <Controller
              control={control}
              name="countryCode"
              render={({ field }) => (
                <select
                  {...field}
                  onChange={(e) => { field.onChange(e); setValue("city", ""); }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Where to?</option>
                  {allCountries.map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                  ))}
                </select>
              )}
            />
            {errors.countryCode && (
              <p className="text-xs text-red-500">{errors.countryCode.message}</p>
            )}
          </div>

          {/* City */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              City
            </label>
            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <select
                  {...field}
                  disabled={!selectedCountry}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">Pick a city</option>
                  {cities.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              )}
            />
            {errors.city && (
              <p className="text-xs text-red-500">{errors.city.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Depart
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              {...register("date")}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.date && (
              <p className="text-xs text-red-500">{errors.date.message}</p>
            )}
          </div>

          {/* Travellers popover */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Travellers
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPax((p) => !p)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-left text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {adults + children} Traveller{adults + children !== 1 ? "s" : ""}
                <span className="ml-1 text-xs text-gray-400">
                  ({adults}A{children > 0 ? ` · ${children}C` : ""})
                </span>
              </button>

              {showPax && (
                <div className="absolute bottom-full left-0 z-20 mb-2 w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
                  <PaxRow
                    label="Adults" sub="12+ yrs"
                    value={adults}
                    onDec={() => setValue("adults", Math.max(1, adults - 1))}
                    onInc={() => setValue("adults", Math.min(9, adults + 1))}
                  />
                  <PaxRow
                    label="Children" sub="2–11 yrs"
                    value={children}
                    onDec={() => setValue("children", Math.max(0, children - 1))}
                    onInc={() => setValue("children", Math.min(8, children + 1))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPax(false)}
                    className="mt-3 w-full rounded-lg bg-blue-600 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          type="submit"
          className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-base font-bold tracking-wide text-white shadow-md transition-colors hover:bg-blue-700 active:scale-[0.99]"
        >
          SEARCH PACKAGES
        </button>
      </form>
    </div>
  );
}

/* ── Pax row sub-component ──────────────────────────── */
function PaxRow({
  label, sub, value, onDec, onInc,
}: { label: string; sub: string; value: number; onDec: () => void; onInc: () => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDec}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          −
        </button>
        <span className="w-4 text-center text-sm font-semibold text-gray-800">{value}</span>
        <button
          type="button"
          onClick={onInc}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          +
        </button>
      </div>
    </div>
  );
}
