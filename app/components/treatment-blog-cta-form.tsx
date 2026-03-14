"use client";

import { FormEvent, useMemo, useState } from "react";

type Props = {
  treatmentName: string;
};

type FormState = {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  budgetRangeUsd: string;
  country: string;
  message: string;
  submitting: boolean;
  success: string;
  error: string;
};

const dialCodeByRegion: Record<string, { dialCode: string; country: string }> = {
  GH: { dialCode: "+233", country: "Ghana" },
  NG: { dialCode: "+234", country: "Nigeria" },
  KE: { dialCode: "+254", country: "Kenya" },
  TZ: { dialCode: "+255", country: "Tanzania" },
  UG: { dialCode: "+256", country: "Uganda" },
  ET: { dialCode: "+251", country: "Ethiopia" },
  MA: { dialCode: "+212", country: "Morocco" },
  EG: { dialCode: "+20", country: "Egypt" },
  MV: { dialCode: "+960", country: "Maldives" },
  IN: { dialCode: "+91", country: "India" },
};

const countryCodeOptions = [
  "+233 Ghana",
  "+234 Nigeria",
  "+254 Kenya",
  "+255 Tanzania",
  "+256 Uganda",
  "+251 Ethiopia",
  "+212 Morocco",
  "+20 Egypt",
  "+960 Maldives",
  "+91 India",
];

function detectInitialCountryCode() {
  if (typeof navigator === "undefined") {
    return countryCodeOptions[0];
  }

  const locale = Intl.DateTimeFormat().resolvedOptions().locale || navigator.language || "en-GH";
  const region = locale.split("-")[1]?.toUpperCase();

  if (!region || !dialCodeByRegion[region]) {
    return countryCodeOptions[0];
  }

  const choice = dialCodeByRegion[region];
  return `${choice.dialCode} ${choice.country}`;
}

export function TreatmentBlogCtaForm({ treatmentName }: Props) {
  const [state, setState] = useState<FormState>({
    name: "",
    email: "",
    countryCode: detectInitialCountryCode(),
    phone: "",
    budgetRangeUsd: "1200-3000",
    country: "",
    message: `I need treatment planning support for ${treatmentName}.`,
    submitting: false,
    success: "",
    error: "",
  });

  const countryFromCode = useMemo(() => {
    const parts = state.countryCode.split(" ");
    return parts.slice(1).join(" ") || "Not specified";
  }, [state.countryCode]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!state.name.trim() || !state.email.trim() || !state.phone.trim()) {
      setState((previous) => ({
        ...previous,
        error: "Name, email, and mobile number are required.",
        success: "",
      }));
      return;
    }

    setState((previous) => ({
      ...previous,
      submitting: true,
      success: "",
      error: "",
    }));

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: state.name,
          email: state.email,
          phone: `${state.countryCode.split(" ")[0]}${state.phone.trim()}`,
          country: state.country.trim() || countryFromCode,
          treatment: treatmentName,
          budgetRangeUsd: state.budgetRangeUsd,
          destination: "India",
          message: state.message.trim() || `I need treatment planning support for ${treatmentName}.`,
          consent: "on",
          company: "",
        }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Unable to submit now.");
      }

      setState((previous) => ({
        ...previous,
        phone: "",
        success: "Request received. Our team will share next steps soon.",
        error: "",
        submitting: false,
      }));
    } catch (error) {
      setState((previous) => ({
        ...previous,
        submitting: false,
        success: "",
        error: error instanceof Error ? error.message : "Unable to submit now.",
      }));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-[var(--line)] bg-white/90 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">Treatment Blog CTA</p>
      <h3 className="mt-3 text-2xl font-semibold text-slate-900">Get personalized treatment estimate</h3>
      <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
        Share your details for {treatmentName}. We will provide India pathway options with cost range.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <input
          value={state.name}
          onChange={(event) => setState((previous) => ({ ...previous, name: event.target.value }))}
          placeholder="Full name"
          className="rounded-xl border border-[var(--line)] bg-white px-3 py-3 text-sm text-slate-900 outline-none"
        />
        <input
          type="email"
          value={state.email}
          onChange={(event) => setState((previous) => ({ ...previous, email: event.target.value }))}
          placeholder="Email"
          className="rounded-xl border border-[var(--line)] bg-white px-3 py-3 text-sm text-slate-900 outline-none"
        />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-[0.42fr_0.58fr]">
        <select
          value={state.countryCode}
          onChange={(event) => setState((previous) => ({ ...previous, countryCode: event.target.value }))}
          className="rounded-xl border border-[var(--line)] bg-white px-3 py-3 text-sm text-slate-900 outline-none"
        >
          {countryCodeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input
          value={state.phone}
          onChange={(event) => setState((previous) => ({ ...previous, phone: event.target.value }))}
          placeholder="Mobile number"
          className="rounded-xl border border-[var(--line)] bg-white px-3 py-3 text-sm text-slate-900 outline-none"
        />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <input
          value={treatmentName}
          readOnly
          className="rounded-xl border border-[var(--line)] bg-slate-50 px-3 py-3 text-sm text-slate-700"
        />
        <select
          value={state.budgetRangeUsd}
          onChange={(event) => setState((previous) => ({ ...previous, budgetRangeUsd: event.target.value }))}
          className="rounded-xl border border-[var(--line)] bg-white px-3 py-3 text-sm text-slate-900 outline-none"
        >
          <option value="1200-3000">$1,200 - $3,000</option>
          <option value="3000-6000">$3,000 - $6,000</option>
          <option value="6000-12000">$6,000 - $12,000</option>
          <option value="12000+">$12,000+</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={state.submitting}
        className="mt-4 w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {state.submitting ? "Submitting..." : "Request treatment estimate"}
      </button>

      {state.success ? <p className="mt-2 text-sm text-emerald-700">{state.success}</p> : null}
      {state.error ? <p className="mt-2 text-sm text-rose-700">{state.error}</p> : null}
    </form>
  );
}
