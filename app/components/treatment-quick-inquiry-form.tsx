"use client";

import { FormEvent, useMemo, useState } from "react";
import { treatments } from "../../lib/seo-content";

type Props = {
  defaultTreatment: string;
  mode?: "inline" | "modal";
  onSuccess?: () => void;
  copy?: {
    kicker?: string;
    title?: string;
    description?: string;
    submitLabel?: string;
    inquiryMessage?: string;
  };
};

type CountryPhoneRule = {
  country: string;
  dialCode: string;
  iso: string;
  minDigits: number;
  maxDigits: number;
  placeholder: string;
};

type FormState = {
  name: string;
  countryPhone: string;
  phone: string;
  treatment: string;
  budgetRangeUsd: string;
  submitting: boolean;
  success: string;
  error: string;
};

const countryPhoneRules: CountryPhoneRule[] = [
  {
    country: "Ghana",
    dialCode: "+233",
    iso: "GH",
    minDigits: 9,
    maxDigits: 9,
    placeholder: "Example: 241234567",
  },
  {
    country: "Nigeria",
    dialCode: "+234",
    iso: "NG",
    minDigits: 10,
    maxDigits: 10,
    placeholder: "Example: 8012345678",
  },
  {
    country: "Kenya",
    dialCode: "+254",
    iso: "KE",
    minDigits: 9,
    maxDigits: 9,
    placeholder: "Example: 712345678",
  },
  {
    country: "Tanzania",
    dialCode: "+255",
    iso: "TZ",
    minDigits: 9,
    maxDigits: 9,
    placeholder: "Example: 712345678",
  },
  {
    country: "Uganda",
    dialCode: "+256",
    iso: "UG",
    minDigits: 9,
    maxDigits: 9,
    placeholder: "Example: 712345678",
  },
  {
    country: "Ethiopia",
    dialCode: "+251",
    iso: "ET",
    minDigits: 9,
    maxDigits: 9,
    placeholder: "Example: 911234567",
  },
  {
    country: "Morocco",
    dialCode: "+212",
    iso: "MA",
    minDigits: 9,
    maxDigits: 9,
    placeholder: "Example: 612345678",
  },
  {
    country: "Egypt",
    dialCode: "+20",
    iso: "EG",
    minDigits: 10,
    maxDigits: 10,
    placeholder: "Example: 1012345678",
  },
  {
    country: "Maldives",
    dialCode: "+960",
    iso: "MV",
    minDigits: 7,
    maxDigits: 7,
    placeholder: "Example: 7712345",
  },
  {
    country: "India",
    dialCode: "+91",
    iso: "IN",
    minDigits: 10,
    maxDigits: 10,
    placeholder: "Example: 9876543210",
  },
  {
    country: "United Arab Emirates",
    dialCode: "+971",
    iso: "AE",
    minDigits: 9,
    maxDigits: 9,
    placeholder: "Example: 501234567",
  },
  {
    country: "Saudi Arabia",
    dialCode: "+966",
    iso: "SA",
    minDigits: 9,
    maxDigits: 9,
    placeholder: "Example: 512345678",
  },
  {
    country: "Qatar",
    dialCode: "+974",
    iso: "QA",
    minDigits: 8,
    maxDigits: 8,
    placeholder: "Example: 33123456",
  },
  {
    country: "Kuwait",
    dialCode: "+965",
    iso: "KW",
    minDigits: 8,
    maxDigits: 8,
    placeholder: "Example: 55123456",
  },
  {
    country: "Oman",
    dialCode: "+968",
    iso: "OM",
    minDigits: 8,
    maxDigits: 8,
    placeholder: "Example: 92123456",
  },
  {
    country: "Bahrain",
    dialCode: "+973",
    iso: "BH",
    minDigits: 8,
    maxDigits: 8,
    placeholder: "Example: 33123456",
  },
  {
    country: "United States",
    dialCode: "+1",
    iso: "US",
    minDigits: 10,
    maxDigits: 10,
    placeholder: "Example: 4155552671",
  },
  {
    country: "Canada",
    dialCode: "+1",
    iso: "CA",
    minDigits: 10,
    maxDigits: 10,
    placeholder: "Example: 4165552671",
  },
  {
    country: "United Kingdom",
    dialCode: "+44",
    iso: "GB",
    minDigits: 10,
    maxDigits: 10,
    placeholder: "Example: 7400123456",
  },
  {
    country: "Australia",
    dialCode: "+61",
    iso: "AU",
    minDigits: 9,
    maxDigits: 9,
    placeholder: "Example: 412345678",
  },
  {
    country: "South Africa",
    dialCode: "+27",
    iso: "ZA",
    minDigits: 9,
    maxDigits: 9,
    placeholder: "Example: 821234567",
  },
  {
    country: "Bangladesh",
    dialCode: "+880",
    iso: "BD",
    minDigits: 10,
    maxDigits: 10,
    placeholder: "Example: 1712345678",
  },
  {
    country: "Pakistan",
    dialCode: "+92",
    iso: "PK",
    minDigits: 10,
    maxDigits: 10,
    placeholder: "Example: 3012345678",
  },
  {
    country: "Nepal",
    dialCode: "+977",
    iso: "NP",
    minDigits: 10,
    maxDigits: 10,
    placeholder: "Example: 9812345678",
  },
  {
    country: "Sri Lanka",
    dialCode: "+94",
    iso: "LK",
    minDigits: 9,
    maxDigits: 9,
    placeholder: "Example: 712345678",
  },
  {
    country: "Singapore",
    dialCode: "+65",
    iso: "SG",
    minDigits: 8,
    maxDigits: 8,
    placeholder: "Example: 81234567",
  },
  {
    country: "Malaysia",
    dialCode: "+60",
    iso: "MY",
    minDigits: 9,
    maxDigits: 10,
    placeholder: "Example: 123456789",
  },
];

const treatmentChoices = treatments.map((item) => item.name);

function getDefaultCountryPhone() {
  if (typeof navigator === "undefined") {
    return `${countryPhoneRules[0].dialCode} ${countryPhoneRules[0].country}`;
  }

  const locale = Intl.DateTimeFormat().resolvedOptions().locale || navigator.language || "en-GH";
  const region = locale.split("-")[1]?.toUpperCase();
  const matchedRule = countryPhoneRules.find((item) => item.iso === region);

  if (!matchedRule) {
    return `${countryPhoneRules[0].dialCode} ${countryPhoneRules[0].country}`;
  }

  return `${matchedRule.dialCode} ${matchedRule.country}`;
}

function parseCountryName(countryPhone: string) {
  const firstSpaceIndex = countryPhone.indexOf(" ");
  if (firstSpaceIndex === -1) {
    return "";
  }

  return countryPhone.slice(firstSpaceIndex + 1).trim();
}

export function TreatmentQuickInquiryForm({
  defaultTreatment,
  mode = "inline",
  onSuccess,
  copy,
}: Props) {
  const [state, setState] = useState<FormState>({
    name: "",
    countryPhone: getDefaultCountryPhone(),
    phone: "",
    treatment: defaultTreatment,
    budgetRangeUsd: "3000-6000",
    submitting: false,
    success: "",
    error: "",
  });

  const selectedRule = useMemo(() => {
    const countryName = parseCountryName(state.countryPhone);
    return (
      countryPhoneRules.find((item) => item.country === countryName) || countryPhoneRules[0]
    );
  }, [state.countryPhone]);

  const phonePattern = `^\\d{${selectedRule.minDigits},${selectedRule.maxDigits}}$`;
  const kickerText = copy?.kicker || "Check Price";
  const titleText = copy?.title || "Share 4 details to get your treatment estimate";
  const descriptionText =
    copy?.description ||
    "This quick form is designed for faster follow-up. Fill in your details and we will send realistic India treatment options.";
  const submitLabel = copy?.submitLabel || "Check price and treatment options";
  const inquiryMessage =
    copy?.inquiryMessage ||
    `Quick estimate request from treatment page for ${state.treatment.trim()}.`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const digitsOnly = state.phone.replace(/\D/g, "");

    if (!state.name.trim()) {
      setState((previous) => ({
        ...previous,
        error: "Please enter your full name.",
        success: "",
      }));
      return;
    }

    if (!state.treatment.trim()) {
      setState((previous) => ({
        ...previous,
        error: "Please select or type the treatment you are looking for.",
        success: "",
      }));
      return;
    }

    if (digitsOnly.length < selectedRule.minDigits || digitsOnly.length > selectedRule.maxDigits) {
      setState((previous) => ({
        ...previous,
        error: `Please enter a valid ${selectedRule.country} mobile number (${selectedRule.minDigits} digits).`,
        success: "",
      }));
      return;
    }

    setState((previous) => ({
      ...previous,
      submitting: true,
      error: "",
      success: "",
    }));

    try {
      const fullPhone = `${selectedRule.dialCode}${digitsOnly}`;
      const syntheticEmail = `lead.${selectedRule.iso.toLowerCase()}.${digitsOnly}@noemail.treataxis.com`;
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: state.name.trim(),
          email: syntheticEmail,
          phone: fullPhone,
          country: selectedRule.country,
          treatment: state.treatment.trim(),
          budgetRangeUsd: state.budgetRangeUsd,
          destination: "India",
          message: inquiryMessage,
          consent: "on",
          company: "",
        }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Unable to submit request right now.");
      }

      setState((previous) => ({
        ...previous,
        phone: "",
        success: "Great. We received your details and will share estimated options shortly.",
        error: "",
        submitting: false,
      }));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setState((previous) => ({
        ...previous,
        submitting: false,
        success: "",
        error: error instanceof Error ? error.message : "Unable to submit request right now.",
      }));
    }
  }

  const content = (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">{kickerText}</p>
      <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
        {titleText}
      </h2>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
        {descriptionText}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Full name</span>
            <input
              required
              value={state.name}
              onChange={(event) =>
                setState((previous) => ({ ...previous, name: event.target.value }))
              }
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-[var(--brand)]"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Mobile number</span>
            <div className="grid gap-2 sm:grid-cols-[0.45fr_0.55fr]">
              <select
                value={state.countryPhone}
                onChange={(event) =>
                  setState((previous) => ({ ...previous, countryPhone: event.target.value, phone: "" }))
                }
                className="rounded-xl border border-[var(--line)] bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-[var(--brand)]"
              >
                {countryPhoneRules.map((item) => {
                  const optionLabel = `${item.dialCode} ${item.country}`;
                  return (
                    <option key={optionLabel} value={optionLabel}>
                      {optionLabel}
                    </option>
                  );
                })}
              </select>
              <input
                required
                value={state.phone}
                onChange={(event) =>
                  setState((previous) => ({
                    ...previous,
                    phone: event.target.value.replace(/\D/g, "").slice(0, selectedRule.maxDigits),
                  }))
                }
                inputMode="numeric"
                pattern={phonePattern}
                placeholder={selectedRule.placeholder}
                className="rounded-xl border border-[var(--line)] bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-[var(--brand)]"
              />
            </div>
            <p className="text-xs text-[var(--muted)]">
              Format: {selectedRule.dialCode} + {selectedRule.minDigits} digit mobile number for {selectedRule.country}.
            </p>
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Treatment looking for</span>
            <input
              required
              list="treatment-choices"
              value={state.treatment}
              onChange={(event) =>
                setState((previous) => ({ ...previous, treatment: event.target.value }))
              }
              placeholder="Type or select treatment"
              className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-[var(--brand)]"
            />
            <datalist id="treatment-choices">
              {treatmentChoices.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
            <p className="text-xs text-[var(--muted)]">
              Current page treatment is preselected. You can type and choose any other treatment from the list.
            </p>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Budget looking for</span>
            <select
              value={state.budgetRangeUsd}
              onChange={(event) =>
                setState((previous) => ({ ...previous, budgetRangeUsd: event.target.value }))
              }
              className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-[var(--brand)]"
            >
              <option value="1200-3000">$1,200 - $3,000</option>
              <option value="3000-6000">$3,000 - $6,000</option>
              <option value="6000-12000">$6,000 - $12,000</option>
              <option value="12000+">$12,000+</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          disabled={state.submitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state.submitting ? "Submitting..." : submitLabel}
        </button>

        {state.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}
        {state.error ? <p className="text-sm text-rose-700">{state.error}</p> : null}
      </form>
    </>
  );

  if (mode === "modal") {
    return content;
  }

  return (
    <section id="check-price" className="rounded-[1.8rem] border border-[var(--line)] bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-8">
      {content}
    </section>
  );
}
