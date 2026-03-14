"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { TreatmentQuickInquiryForm } from "./treatment-quick-inquiry-form";
import { indiaFeaturedHospitals } from "../../lib/featured-hospitals";
import { treatments } from "../../lib/seo-content";

type CityFilter = "All Cities" | "Delhi" | "Bangalore" | "Kochi";

type ResearchResult = {
  illnessOverview: string;
  treatmentAtHospital: string;
  specialtyFit: string;
  doctorInsights: string[];
  estimatedDuration: string;
  estimatedCostRange: string;
  nextStep: string;
};

const cityFilters: CityFilter[] = ["All Cities", "Delhi", "Bangalore", "Kochi"];
const treatmentOptions = treatments.map((item) => item.name);

type Props = {
  initialTreatment?: string;
};

export function FeaturedHospitalsIndia({ initialTreatment = "" }: Props) {
  const treatmentFromQuery = initialTreatment.trim();
  const [selectedCity, setSelectedCity] = useState<CityFilter>("All Cities");
  const [activeHospitalId, setActiveHospitalId] = useState<string | null>(null);
  const [treatmentInput, setTreatmentInput] = useState(treatmentFromQuery);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [showPriceForm, setShowPriceForm] = useState(false);

  const hospitals = useMemo(() => {
    const byCity =
      selectedCity === "All Cities"
        ? indiaFeaturedHospitals
        : indiaFeaturedHospitals.filter((item) => item.city === selectedCity);

    if (!treatmentFromQuery) {
      return byCity;
    }

    const keyword = treatmentFromQuery.toLowerCase();

    return [...byCity].sort((a, b) => {
      const aMatch =
        Number(a.sampleTreatments.some((item) => item.toLowerCase().includes(keyword))) +
        Number(a.specialties.some((item) => item.toLowerCase().includes(keyword)));
      const bMatch =
        Number(b.sampleTreatments.some((item) => item.toLowerCase().includes(keyword))) +
        Number(b.specialties.some((item) => item.toLowerCase().includes(keyword)));

      return bMatch - aMatch;
    });
  }, [selectedCity, treatmentFromQuery]);

  const activeHospital = useMemo(
    () => indiaFeaturedHospitals.find((item) => item.id === activeHospitalId) || null,
    [activeHospitalId],
  );
  const alternativeHospitals = useMemo(() => {
    if (!activeHospital) {
      return [];
    }

    return indiaFeaturedHospitals
      .filter((item) => item.city === activeHospital.city && item.id !== activeHospital.id)
      .slice(0, 2);
  }, [activeHospital]);

  function openDetails(hospitalId: string) {
    setActiveHospitalId(hospitalId);
    setTreatmentInput(treatmentFromQuery);
    setResult(null);
    setError("");
    setSubmitting(false);
    setShowPriceForm(false);
  }

  function closeDetails() {
    setActiveHospitalId(null);
    setTreatmentInput("");
    setResult(null);
    setError("");
    setSubmitting(false);
    setShowPriceForm(false);
  }

  async function handleResearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeHospital || !treatmentInput.trim()) {
      setError("Please type or select a treatment first.");
      return;
    }

    setSubmitting(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/hospital-research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hospitalId: activeHospital.id,
          treatment: treatmentInput.trim(),
        }),
      });

      const data = (await response.json()) as { message?: string; result?: ResearchResult };

      if (!response.ok || !data.result) {
        throw new Error(data.message || "Unable to research this treatment right now.");
      }

      setResult(data.result);
    } catch (researchError) {
      setError(
        researchError instanceof Error
          ? researchError.message
          : "Unable to research this treatment right now.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="india-hospitals-list" className="rounded-[1.8rem] border border-[var(--line)] bg-white/95 p-6 lg:p-8">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">India hospitals</p>
        <h2 className="mt-3 text-4xl font-semibold leading-tight text-slate-950">Featured Hospitals</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          Compare hospitals by city, specialties, and sample treatment pathways. Click View Full Details to first select treatment and get hospital-specific insights.
        </p>
        {treatmentFromQuery ? (
          <p className="mt-2 text-sm font-semibold text-slate-800">
            Showing hospitals for treatment: {treatmentFromQuery}
          </p>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {cityFilters.map((city) => {
          const active = city === selectedCity;
          return (
            <button
              key={city}
              type="button"
              onClick={() => setSelectedCity(city)}
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                active
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-[var(--line)] bg-slate-50 text-slate-700 hover:border-slate-400"
              }`}
            >
              {city}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {hospitals.map((hospital) => (
          <article
            key={hospital.id}
            className="overflow-hidden rounded-[1rem] border border-[var(--line)] bg-white"
          >
            <div className="relative h-52 w-full">
              <Image src={hospital.imagePath} alt={hospital.name} fill className="object-cover" />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[2rem] font-semibold leading-tight text-slate-900">{hospital.name}</h3>
                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-semibold text-emerald-700">
                  ★ {hospital.rating.toFixed(1)}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{hospital.location}</p>

              <p className="mt-4 text-sm font-semibold text-slate-900">Accreditations:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {hospital.accreditations.map((item) => (
                  <span key={item} className="rounded-full border border-[var(--line)] bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {item}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-900">Specialties:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {hospital.specialties.slice(0, 3).map((item) => (
                  <span key={item} className="rounded-full border border-[var(--line)] bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {item}
                  </span>
                ))}
                {hospital.specialties.length > 3 ? (
                  <span className="rounded-full border border-[var(--line)] bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                    +{hospital.specialties.length - 3} more
                  </span>
                ) : null}
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-900">Sample Treatments:</p>
              <ul className="mt-2 space-y-1 text-sm leading-7 text-slate-700">
                {hospital.sampleTreatments.slice(0, 2).map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => openDetails(hospital.id)}
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold !text-white transition hover:bg-slate-800"
                style={{ color: "#ffffff" }}
              >
                View Full Details
              </button>
            </div>
          </article>
        ))}
      </div>

      {activeHospital ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 px-4 py-6">
          <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[1.5rem] border border-[var(--line)] bg-white p-6 sm:p-8">
            <button
              type="button"
              onClick={closeDetails}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] text-lg text-slate-700 transition hover:text-slate-900"
              aria-label="Close details"
            >
              ×
            </button>

            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">Hospital research</p>
            <h3 className="mt-2 text-3xl font-semibold leading-tight text-slate-950">{activeHospital.name}</h3>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Step 1: select treatment. Step 2: get hospital-specific illness, doctor, specialty, and duration insights.
            </p>

            <form onSubmit={handleResearch} className="mt-5 rounded-2xl border border-[var(--line)] bg-slate-50 p-4">
              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                Treatment / illness
              </label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  required
                  list="hospital-treatment-options"
                  value={treatmentInput}
                  onChange={(event) => setTreatmentInput(event.target.value)}
                  placeholder="Type treatment or illness (e.g., Kidney Transplant)"
                  className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-[var(--brand)]"
                />
                <datalist id="hospital-treatment-options">
                  {treatmentOptions.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Researching..." : "Research"}
                </button>
              </div>
              {error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
            </form>

            {result ? (
              <div className="mt-5 grid gap-4">
                <article className="rounded-xl border border-[var(--line)] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">Illness overview</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{result.illnessOverview}</p>
                </article>

                <article className="rounded-xl border border-[var(--line)] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">Treatment at hospital</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{result.treatmentAtHospital}</p>
                </article>

                <article className="rounded-xl border border-[var(--line)] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">Specialty fit</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{result.specialtyFit}</p>
                </article>

                <article className="rounded-xl border border-[var(--line)] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">Doctors and team</p>
                  <ul className="mt-2 space-y-1 text-sm leading-7 text-slate-700">
                    {result.doctorInsights.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </article>

                <div className="grid gap-4 md:grid-cols-2">
                  <article className="rounded-xl border border-[var(--line)] bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">Estimated duration</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{result.estimatedDuration}</p>
                  </article>
                  <article className="rounded-xl border border-[var(--line)] bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">Estimated cost range</p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{result.estimatedCostRange}</p>
                  </article>
                </div>

                <article className="rounded-xl border border-[var(--line)] bg-[linear-gradient(160deg,#eef7ff_0%,#ffffff_100%)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">Next step</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{result.nextStep}</p>
                </article>

                <section className="grid gap-4 md:grid-cols-2">
                  <article className="rounded-xl border border-[var(--line)] bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">Hospital vs alternatives</p>
                    <h4 className="mt-2 text-sm font-semibold text-slate-900">{activeHospital.name}</h4>
                    <ul className="mt-2 space-y-1 text-sm leading-7 text-slate-700">
                      <li>• Rating: {activeHospital.rating.toFixed(1)}</li>
                      <li>• City: {activeHospital.city}</li>
                      <li>• Key specialties: {activeHospital.specialties.slice(0, 3).join(", ")}</li>
                    </ul>
                  </article>

                  <article className="rounded-xl border border-[var(--line)] bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">Alternatives in same city</p>
                    {alternativeHospitals.length > 0 ? (
                      <ul className="mt-2 space-y-2 text-sm leading-7 text-slate-700">
                        {alternativeHospitals.map((item) => (
                          <li key={item.id}>
                            • <span className="font-semibold text-slate-900">{item.name}</span> ({item.rating.toFixed(1)})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm leading-7 text-slate-700">
                        Add more hospitals in this city to unlock deeper same-city comparison.
                      </p>
                    )}
                  </article>
                </section>

                <article className="rounded-xl border border-[var(--line)] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">Best doctors for this treatment</p>
                  <ul className="mt-2 space-y-2 text-sm leading-7 text-slate-700">
                    {activeHospital.doctorProfiles.map((doctor, index) => (
                      <li key={doctor.role} id={`doctor-${index}`}>
                        • <span className="font-semibold text-slate-900">{doctor.role}</span>: {doctor.detail}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            ) : null}

            <section className="mt-6 rounded-xl border border-[var(--line)] bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-900">Ready to get treatment estimate for this hospital?</p>
                <button
                  type="button"
                  onClick={() => setShowPriceForm((previous) => !previous)}
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  {showPriceForm ? "Hide treatment estimate form" : `Get treatment estimate for ${activeHospital.name}`}
                </button>
              </div>
              {showPriceForm ? (
                <div className="mt-4 rounded-xl border border-[var(--line)] bg-white p-4">
                  <TreatmentQuickInquiryForm
                    defaultTreatment={treatmentInput.trim() || "Treatment Planning"}
                    mode="modal"
                  />
                </div>
              ) : null}
            </section>
          </div>
        </div>
      ) : null}
    </section>
  );
}
