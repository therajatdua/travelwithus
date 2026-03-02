/* ============================================================
   Organism: BookingForm  (Day 6 — Production Rewrite)
   ============================================================
   3-step booking state machine with:
     Step 1 → Dependent dropdowns (Country → State → City) +
              Transport mode selection
     Step 2 → Passenger enumeration (adults, children, seniors)
     Step 3 → Review summary & submission via API

   Tools: react-hook-form + zod + country-state-city
   ============================================================ */

"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Country, State, City } from "country-state-city";
import type { ICountry, IState, ICity } from "country-state-city";
import { Button } from "@/components/atoms";
import { useBooking, type BookingResult } from "@/hooks/useBooking";
import type { TransportMode } from "@/types";

/* ── Zod Schema ─────────────────────────────────────────────── */

const bookingFormSchema = z.object({
  /* Origin — validated as real ISO codes / names */
  originCountry: z.string().min(1, "Select a country"),
  originState: z.string().min(1, "Select a state / region"),
  originCity: z.string().min(1, "Select a city"),
  /* Transport */
  transportMode: z.enum(["Flight", "Train", "Bus", "Ferry", "Car"], {
    message: "Select a transport mode",
  }),
  /* Passengers */
  adults: z.number().int().min(1, "At least 1 adult is required"),
  children: z.number().int().min(0),
  seniors: z.number().int().min(0),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

/* ── Types ──────────────────────────────────────────────────── */
type Step = 1 | 2 | 3;

interface BookingFormProps {
  destinationName: string;
  citySlug: string;
  transportOptions: TransportMode[];
  priceUSD: number;
  accommodationName: string;
}

/* ── Transport icons ────────────────────────────────────────── */
const transportIcons: Record<string, string> = {
  Flight: "✈️",
  Train: "🚄",
  Bus: "🚌",
  Ferry: "⛴️",
  Car: "🚗",
};

/* ── Select wrapper (themed) ────────────────────────────────── */
function ThemedSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-theme-body">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full cursor-pointer rounded-[var(--radius-md)] border bg-theme-surface px-4 py-2.5 text-sm text-theme-heading transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
          error
            ? "border-red-500 focus:ring-red-400"
            : "border-theme-accent focus:ring-theme-primary"
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs font-medium text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function BookingForm({
  destinationName,
  citySlug,
  transportOptions,
  priceUSD,
  accommodationName,
}: BookingFormProps) {
  const router = useRouter();
  /* ── State machine ────────────────────────────────────────── */
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState<BookingResult | null>(null);

  /* ── React Hook Form ──────────────────────────────────────── */
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      originCountry: "",
      originState: "",
      originCity: "",
      transportMode: "" as TransportMode,
      adults: 1,
      children: 0,
      seniors: 0,
    },
    mode: "onBlur",
  });

  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  /* ── Booking API hook ─────────────────────────────────────── */
  const { submitBooking, isLoading, error: apiError } = useBooking();

  /* ── Dependent dropdown state ─────────────────────────────── */
  const selectedCountry = watch("originCountry");
  const selectedState = watch("originState");

  const [countries] = useState<ICountry[]>(() => Country.getAllCountries());
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  /* Update states when country changes */
  useEffect(() => {
    if (selectedCountry) {
      const stateList = State.getStatesOfCountry(selectedCountry);
      setStates(stateList);
      setValue("originState", "");
      setValue("originCity", "");
      setCities([]);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [selectedCountry, setValue]);

  /* Update cities when state changes */
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const cityList = City.getCitiesOfState(selectedCountry, selectedState);
      setCities(cityList);
      setValue("originCity", "");
    } else {
      setCities([]);
    }
  }, [selectedCountry, selectedState, setValue]);

  /* ──────────────────────────────────────────────────────────
     STEP INDICATOR
     ────────────────────────────────────────────────────────── */
  const steps = [
    { num: 1, label: "Origin & Transport" },
    { num: 2, label: "Passengers" },
    { num: 3, label: "Review" },
  ] as const;

  function StepIndicator() {
    return (
      <div className="mb-10 flex items-center justify-center gap-3">
        {steps.map((s, i) => {
          const isActive = currentStep === s.num;
          const isDone = currentStep > s.num;
          return (
            <div key={s.num} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors duration-500 ${
                    isActive || isDone
                      ? "bg-theme-primary text-text-inverse"
                      : "bg-theme-surface text-theme-heading"
                  }`}
                >
                  {isDone ? "✓" : s.num}
                </span>
                <span
                  className={`text-xs font-medium transition-colors duration-300 ${
                    isActive ? "text-theme-heading" : "text-theme-body"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-0.5 w-10 rounded-full transition-colors duration-500 sm:w-16 ${
                    currentStep > s.num ? "bg-theme-primary" : "bg-theme-surface"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────────
     STEP 1 — Origin (Dependent Dropdowns) & Transport
     ────────────────────────────────────────────────────────── */
  function StepOne() {
    const transport = watch("transportMode");

    const validateAndNext = async () => {
      const valid = await form.trigger([
        "originCountry",
        "originState",
        "originCity",
        "transportMode",
      ]);
      if (valid) setCurrentStep(2);
    };

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-lg font-semibold text-theme-heading">
            Where are you traveling from?
          </h3>
          <p className="mt-1 text-sm text-theme-body">
            Select your country, state, and city of departure.
          </p>
        </div>

        {/* Country → State → City dependent dropdowns */}
        <ThemedSelect
          label="Country"
          value={selectedCountry}
          onChange={(val) => setValue("originCountry", val, { shouldValidate: true })}
          options={countries.map((c) => ({ value: c.isoCode, label: c.name }))}
          placeholder="Select country…"
          error={errors.originCountry?.message}
        />

        <ThemedSelect
          label="State / Region"
          value={selectedState}
          onChange={(val) => setValue("originState", val, { shouldValidate: true })}
          options={states.map((s) => ({ value: s.isoCode, label: s.name }))}
          placeholder={selectedCountry ? "Select state…" : "Select a country first"}
          error={errors.originState?.message}
          disabled={!selectedCountry}
        />

        <ThemedSelect
          label="City"
          value={watch("originCity")}
          onChange={(val) => setValue("originCity", val, { shouldValidate: true })}
          options={cities.map((c) => ({ value: c.name, label: c.name }))}
          placeholder={selectedState ? "Select city…" : "Select a state first"}
          error={errors.originCity?.message}
          disabled={!selectedState}
        />

        {/* Transport mode selection */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-theme-body">
            Preferred Transport
          </label>
          {errors.transportMode && (
            <p className="text-xs font-medium text-red-500" role="alert">
              {errors.transportMode.message}
            </p>
          )}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {transportOptions.map((mode) => {
              const isSelected = transport === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() =>
                    setValue("transportMode", mode, { shouldValidate: true })
                  }
                  className={`flex items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 px-4 py-3 text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "border-theme-primary bg-theme-surface text-theme-heading shadow-sm"
                      : "border-transparent bg-theme-surface/50 text-theme-body hover:border-theme-surface hover:bg-theme-surface"
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="text-lg">
                    {transportIcons[mode] ?? "🚀"}
                  </span>
                  {mode}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" size="lg" onClick={validateAndNext}>
            Next →
          </Button>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────────
     STEP 2 — Passenger Enumeration
     ────────────────────────────────────────────────────────── */
  function PassengerCounter({
    label,
    sublabel,
    value,
    onChange,
    min = 0,
  }: {
    label: string;
    sublabel: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
  }) {
    return (
      <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-theme-accent bg-theme-surface px-5 py-4 transition-colors duration-500">
        <div>
          <p className="text-sm font-semibold text-theme-heading">{label}</p>
          <p className="text-xs text-theme-body">{sublabel}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={value <= min}
            onClick={() => onChange(Math.max(min, value - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-theme-accent bg-theme-bg text-sm font-bold text-theme-heading transition-colors hover:bg-theme-surface disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            aria-label={`Decrease ${label}`}
          >
            −
          </button>
          <span className="w-8 text-center text-lg font-bold text-theme-heading">
            {value}
          </span>
          <button
            type="button"
            onClick={() => onChange(value + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-theme-accent bg-theme-primary text-sm font-bold text-text-inverse transition-colors hover:bg-theme-hover cursor-pointer"
            aria-label={`Increase ${label}`}
          >
            +
          </button>
        </div>
      </div>
    );
  }

  function StepTwo() {
    const adults = watch("adults");
    const children = watch("children");
    const seniors = watch("seniors");

    const validateAndNext = async () => {
      const valid = await form.trigger(["adults", "children", "seniors"]);
      if (valid) setCurrentStep(3);
    };

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-lg font-semibold text-theme-heading">
            Who&apos;s Traveling?
          </h3>
          <p className="mt-1 text-sm text-theme-body">
            At least 1 adult is required to proceed.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <PassengerCounter
            label="Adults"
            sublabel="Ages 18+"
            value={adults}
            onChange={(v) => setValue("adults", v, { shouldValidate: true })}
            min={1}
          />
          <PassengerCounter
            label="Children"
            sublabel="Ages 2–17"
            value={children}
            onChange={(v) => setValue("children", v, { shouldValidate: true })}
            min={0}
          />
          <PassengerCounter
            label="Seniors"
            sublabel="Ages 65+"
            value={seniors}
            onChange={(v) => setValue("seniors", v, { shouldValidate: true })}
            min={0}
          />
        </div>

        {errors.adults && (
          <p
            className="text-center text-xs font-medium text-red-500"
            role="alert"
          >
            {errors.adults.message}
          </p>
        )}

        <div className="flex justify-between pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => setCurrentStep(1)}
          >
            ← Back
          </Button>
          <Button variant="primary" size="lg" onClick={validateAndNext}>
            Next →
          </Button>
        </div>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────────
     STEP 3 — Review & Submission
     ────────────────────────────────────────────────────────── */
  function StepThree() {
    const data = form.getValues();
    const totalPassengers = data.adults + data.children + data.seniors;

    /* Resolve display names */
    const countryName =
      countries.find((c) => c.isoCode === data.originCountry)?.name ??
      data.originCountry;
    const stateName =
      states.find((s) => s.isoCode === data.originState)?.name ??
      data.originState;
    const originDisplay = `${data.originCity}, ${stateName}, ${countryName}`;

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      const result = await submitBooking({
        citySlug,
        originCity: originDisplay,
        transportMode: data.transportMode,
        passengers: {
          adults: data.adults,
          children: data.children,
          seniors: data.seniors,
        },
      });

      if (result) {
        setBookingData(result);
        setIsConfirmed(true);
        router.push(`/bookings/${result.booking_id}/confirmation`);
      }
    };

    const summaryRows = [
      { label: "From", value: originDisplay },
      { label: "To", value: destinationName },
      {
        label: "Transport",
        value: `${transportIcons[data.transportMode] ?? ""} ${data.transportMode}`,
      },
      { label: "Adults", value: String(data.adults) },
      { label: "Children", value: String(data.children) },
      { label: "Seniors", value: String(data.seniors) },
      { label: "Total Passengers", value: String(totalPassengers) },
      { label: "Accommodation", value: accommodationName },
      { label: "Price / person", value: `$${priceUSD}` },
      { label: "Estimated Total", value: `$${priceUSD * totalPassengers}` },
    ];

    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div>
          <h3 className="text-lg font-semibold text-theme-heading">
            Review Your Booking
          </h3>
          <p className="mt-1 text-sm text-theme-body">
            Please confirm the details below before submitting.
          </p>
        </div>

        {/* Summary card */}
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-theme-accent bg-theme-surface transition-colors duration-500">
          <div className="border-b border-theme-accent/30 px-6 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-theme-accent">
              Booking Summary
            </span>
          </div>
          <div className="divide-y divide-theme-surface">
            {summaryRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-6 py-3"
              >
                <span className="text-sm text-theme-body">{row.label}</span>
                <span className="text-sm font-semibold text-theme-heading">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* API Error */}
        {apiError && (
          <div
            className="rounded-[var(--radius-md)] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-900/20 dark:text-red-300"
            role="alert"
          >
            {apiError}
          </div>
        )}

        {/* Navigation & Submit */}
        <div className="flex justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => setCurrentStep(2)}
            disabled={isLoading}
          >
            ← Back
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="bg-theme-primary hover:bg-theme-hover transition-colors duration-500 ease-in-out"
          >
            {isLoading ? "Booking…" : "Confirm Booking ✓"}
          </Button>
        </div>
      </form>
    );
  }

  /* ──────────────────────────────────────────────────────────
     CONFIRMED STATE
     ────────────────────────────────────────────────────────── */
  if (isConfirmed) {
    const data = form.getValues();
    const totalPassengers = data.adults + data.children + data.seniors;
    const displayPrice =
      bookingData?.total_price ?? priceUSD * totalPassengers;

    const countryName =
      countries.find((c) => c.isoCode === data.originCountry)?.name ??
      data.originCountry;
    const stateName =
      states.find((s) => s.isoCode === data.originState)?.name ??
      data.originState;
    const originDisplay = `${data.originCity}, ${stateName}, ${countryName}`;

    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-theme-primary/15 text-4xl">
          🎉
        </div>
        <h2 className="text-2xl font-bold text-theme-heading md:text-3xl">
          Booking Confirmed!
        </h2>
        <p className="max-w-md text-base text-theme-body">
          Your {destinationName} escape is locked in.
          {bookingData?.booking_id && (
            <>
              {" "}
              Booking ID:{" "}
              <strong className="text-theme-heading">
                {bookingData.booking_id.slice(0, 8)}…
              </strong>
            </>
          )}
        </p>
        <div className="mt-2 overflow-hidden rounded-[var(--radius-md)] border border-theme-accent bg-theme-surface px-6 py-4 text-left text-sm">
          <p className="text-theme-body">
            <strong className="text-theme-heading">Route:</strong>{" "}
            {originDisplay} → {destinationName}
          </p>
          <p className="mt-1 text-theme-body">
            <strong className="text-theme-heading">Transport:</strong>{" "}
            {transportIcons[data.transportMode] ?? ""} {data.transportMode}
          </p>
          <p className="mt-1 text-theme-body">
            <strong className="text-theme-heading">Passengers:</strong>{" "}
            {totalPassengers} total
          </p>
          <p className="mt-1 text-theme-body">
            <strong className="text-theme-heading">Total:</strong> $
            {displayPrice}
          </p>
        </div>

        {/* AI-generated itinerary preview */}
        {bookingData?.ai_customization?.daily_plan && (
          <div className="mt-4 w-full max-w-md overflow-hidden rounded-[var(--radius-lg)] border border-theme-accent bg-theme-surface text-left">
            <div className="border-b border-theme-accent/30 px-5 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-theme-accent">
                🤖 AI Itinerary Preview
              </span>
              {bookingData.ai_customization.vibe_score > 0 && (
                <span className="ml-2 text-xs text-theme-body">
                  Vibe Score: {bookingData.ai_customization.vibe_score}/100
                </span>
              )}
            </div>
            <div className="divide-y divide-theme-surface">
              {bookingData.ai_customization.daily_plan.map((day) => (
                <div
                  key={day.day}
                  className="flex items-start gap-3 px-5 py-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-theme-primary/15 text-xs font-bold text-theme-primary">
                    {day.day}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-theme-heading">
                      {day.activity}
                    </p>
                    <p className="text-xs text-theme-body">{day.time}</p>
                  </div>
                </div>
              ))}
            </div>
            {bookingData.ai_customization.suggested_addons?.length > 0 && (
              <div className="border-t border-theme-accent/30 px-5 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-theme-accent mb-1">
                  Suggested Add-ons
                </p>
                <div className="flex flex-wrap gap-2">
                  {bookingData.ai_customization.suggested_addons.map(
                    (addon) => (
                      <span
                        key={addon}
                        className="rounded-full bg-theme-primary/10 px-3 py-1 text-xs font-medium text-theme-primary"
                      >
                        {addon}
                      </span>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          onClick={() => window.location.assign(`/packages/${citySlug}`)}
          className="mt-4"
        >
          Back to {destinationName} →
        </Button>
      </div>
    );
  }

  /* ──────────────────────────────────────────────────────────
     RENDER
     ────────────────────────────────────────────────────────── */
  return (
    <div>
      <StepIndicator />
      {currentStep === 1 && <StepOne />}
      {currentStep === 2 && <StepTwo />}
      {currentStep === 3 && <StepThree />}
    </div>
  );
}
