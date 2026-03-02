/* ============================================================
   HeroSearchWidget – Premium Glassmorphic version
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

const FIELD_STYLE: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: "0.875rem",
  color: "#fff",
  width: "100%",
  padding: "0.875rem 1rem",
  fontSize: "0.875rem",
  outline: "none",
  backdropFilter: "blur(4px)",
  WebkitAppearance: "none",
};

export function HeroSearchWidget() {
  const router      = useRouter();
  const [tab, setTab]         = useState<Tab>("packages");
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
  const cities       = selectedCountry ? (City.getCitiesOfCountry(selectedCountry) ?? []) : [];

  const onSubmit = (data: FormData) => {
    const params = new URLSearchParams({
      country: data.countryCode, city: data.city,
      date: data.date, adults: String(data.adults), children: String(data.children),
    });
    router.push(`/packages?${params.toString()}`);
  };

  const tabs: { id: Tab; label: string; disabled: boolean }[] = [
    { id: "packages", label: "📦 Packages",  disabled: false },
    { id: "flights",  label: "✈️ Flights",   disabled: true  },
    { id: "hotels",   label: "🏨 Hotels",    disabled: true  },
  ];

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: "rgba(15, 20, 40, 0.55)",
        border: "1px solid rgba(255,255,255,0.14)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
      }}
    >
      {/* ── Tab bar ──────────────────────────────────────── */}
      <div className="flex border-b border-white/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            disabled={t.disabled}
            onClick={() => !t.disabled && setTab(t.id)}
            className={`relative flex-1 py-4 text-sm font-semibold transition-all duration-200
              ${t.disabled ? "cursor-not-allowed opacity-35" : "cursor-pointer"}
              ${tab === t.id && !t.disabled
                ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[var(--accent)]"
                : "text-white/50 hover:text-white/80"
              }
            `}
          >
            {t.label}
            {t.disabled && (
              <span className="ml-1.5 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-normal text-white/40">
                Soon
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Form ─────────────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 md:p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

          {/* Country */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 pl-1">
              Country
            </label>
            <Controller
              control={control}
              name="countryCode"
              render={({ field }) => (
                <select
                  {...field}
                  onChange={(e) => { field.onChange(e); setValue("city", ""); }}
                  style={{ ...FIELD_STYLE, colorScheme: "dark" }}
                  className="focus:ring-2 focus:ring-white/20 transition-all"
                >
                  <option value="" style={{ background: "#0f1628" }}>Where to?</option>
                  {allCountries.map((c) => (
                    <option key={c.isoCode} value={c.isoCode} style={{ background: "#0f1628" }}>{c.name}</option>
                  ))}
                </select>
              )}
            />
            {errors.countryCode && <p className="text-xs text-red-400 pl-1">{errors.countryCode.message}</p>}
          </div>

          {/* City */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 pl-1">
              City
            </label>
            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <select
                  {...field}
                  disabled={!selectedCountry}
                  style={{ ...FIELD_STYLE, colorScheme: "dark", opacity: selectedCountry ? 1 : 0.4 }}
                >
                  <option value="" style={{ background: "#0f1628" }}>Pick a city</option>
                  {cities.map((c) => (
                    <option key={c.name} value={c.name} style={{ background: "#0f1628" }}>{c.name}</option>
                  ))}
                </select>
              )}
            />
            {errors.city && <p className="text-xs text-red-400 pl-1">{errors.city.message}</p>}
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 pl-1">
              Depart
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              {...register("date")}
              style={{ ...FIELD_STYLE, colorScheme: "dark" }}
            />
            {errors.date && <p className="text-xs text-red-400 pl-1">{errors.date.message}</p>}
          </div>

          {/* Travellers popover */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 pl-1">
              Travellers
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPax((p) => !p)}
                style={FIELD_STYLE}
                className="text-left flex items-center justify-between"
              >
                <span>
                  {adults + children} Traveller{adults + children !== 1 ? "s" : ""}
                </span>
                <span className="text-xs text-white/40">
                  {adults}A{children > 0 ? ` · ${children}C` : ""}
                </span>
              </button>

              {showPax && (
                <div
                  className="absolute bottom-full left-0 z-20 mb-2 w-64 rounded-xl p-4"
                  style={{
                    background: "rgba(15,20,40,0.95)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                  }}
                >
                  <PaxRow
                    label="Adults" sub="12+ yrs" value={adults}
                    onDec={() => setValue("adults", Math.max(1, adults - 1))}
                    onInc={() => setValue("adults", Math.min(9, adults + 1))}
                  />
                  <PaxRow
                    label="Children" sub="2–11 yrs" value={children}
                    onDec={() => setValue("children", Math.max(0, children - 1))}
                    onInc={() => setValue("children", Math.min(8, children + 1))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPax(false)}
                    className="mt-3 w-full rounded-xl py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
                    style={{ background: "var(--accent)" }}
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
          className="mt-4 w-full rounded-xl py-4 text-sm font-black tracking-widest text-white uppercase transition-all duration-300 hover:scale-[1.01] hover:shadow-lg active:scale-[0.99]"
          style={{
            background: "linear-gradient(135deg, var(--primary) 0%, #1a4a7a 50%, var(--accent) 100%)",
            boxShadow: "0 8px 24px rgba(15,48,87,0.5)",
          }}
        >
          Search Packages ✈️
        </button>
      </form>
    </div>
  );
}

/* ── Pax row ──────────────────────────────────────────── */
function PaxRow({ label, sub, value, onDec, onInc }: {
  label: string; sub: string; value: number;
  onDec: () => void; onInc: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/10 last:border-0">
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-white/40">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDec}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/60 hover:bg-white/10 transition-colors text-lg leading-none"
        >
          −
        </button>
        <span className="w-4 text-center text-sm font-bold text-white">{value}</span>
        <button
          type="button"
          onClick={onInc}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/60 hover:bg-white/10 transition-colors text-lg leading-none"
        >
          +
        </button>
      </div>
    </div>
  );
}
