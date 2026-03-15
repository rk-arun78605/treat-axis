"use client";

import { FormEvent, useState } from "react";
import { trackEvent } from "../../lib/analytics";

type SubmissionState = {
  kind: "idle" | "loading" | "success" | "error";
  message?: string;
};

const initialState: SubmissionState = { kind: "idle" };

type LeadFormProps = {
  className?: string;
  compact?: boolean;
};

export function LeadForm({ className = "", compact = false }: LeadFormProps) {
  const [submission, setSubmission] = useState<SubmissionState>(initialState);
  const [trackedFields, setTrackedFields] = useState<Record<string, boolean>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmission({ kind: "loading" });
    trackEvent("inquiry_submit_started", { location: "hero" });

    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Unable to submit your inquiry.");
      }

      form.reset();
      setSubmission({
        kind: "success",
        message:
          result.message ||
          "Thank you. We have received your request and our care team will connect you within 24 hours with a hospital estimate and travel guidance.",
      });
      trackEvent("inquiry_submit_success", { location: "hero" });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to submit your inquiry.";

      setSubmission({ kind: "error", message });
      trackEvent("inquiry_submit_error", { location: "hero", reason: message });
    }
  }

  function trackField(field: string) {
    if (trackedFields[field]) {
      return;
    }

    setTrackedFields((previous) => ({ ...previous, [field]: true }));
    trackEvent("inquiry_field_interaction", { field, location: "hero" });
  }

  return (
    <>
      <aside
        id="inquiry-form"
        className={`rounded-[2rem] border border-[var(--line)] bg-slate-950 p-6 text-white shadow-[0_28px_100px_rgba(15,23,42,0.18)] md:p-8 ${className}`}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-300">
          Lead form
        </p>
        <h2 className={`mt-4 font-display leading-tight ${compact ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"}`}>
          Request your treatment plan.
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          This form is designed for medical tourism inquiries from patients, families, and coordinators planning treatment abroad.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="company"
          autoComplete="off"
          tabIndex={-1}
          className="hidden"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-200">Full name</span>
            <input
              name="name"
              type="text"
              required
              placeholder="Patient or family contact"
              onFocus={() => trackField("name")}
              className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-amber-300"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-200">Email address</span>
            <input
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              onFocus={() => trackField("email")}
              className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-amber-300"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-200">Phone or WhatsApp</span>
            <input
              name="phone"
              type="tel"
              required
              placeholder="+91 / +44 / +971"
              onFocus={() => trackField("phone")}
              className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-amber-300"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-200">Country of residence</span>
            <input
              name="country"
              type="text"
              required
              placeholder="Current country"
              onFocus={() => trackField("country")}
              className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-amber-300"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-200">Treatment needed</span>
            <select
              name="treatment"
              required
              defaultValue=""
              onFocus={() => trackField("treatment")}
              className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-white outline-none transition focus:border-amber-300"
            >
              <option value="" disabled className="text-slate-900">
                Select treatment
              </option>
              <option value="cardiac-care" className="text-slate-900">
                Cardiac care
              </option>
              <option value="orthopedic-surgery" className="text-slate-900">
                Orthopedic surgery
              </option>
              <option value="fertility-and-womens-health" className="text-slate-900">
                Fertility and women&apos;s health
              </option>
              <option value="cosmetic-or-dental" className="text-slate-900">
                Cosmetic or dental procedure
              </option>
              <option value="second-opinion" className="text-slate-900">
                Second opinion
              </option>
            </select>
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-200">Preferred destination</span>
            <input
              name="destination"
              type="text"
              placeholder="India, Turkey, Thailand, UAE"
              onFocus={() => trackField("destination")}
              className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-amber-300"
            />
          </label>
        </div>

        <label className="space-y-2 text-sm">
          <span className="font-medium text-slate-200">Budget range (USD)</span>
          <select
            name="budgetRangeUsd"
            required
            defaultValue=""
            onFocus={() => trackField("budgetRangeUsd")}
            className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-white outline-none transition focus:border-amber-300"
          >
            <option value="" disabled className="text-slate-900">
              Select budget range
            </option>
            <option value="under-3000" className="text-slate-900">
              Under $3,000
            </option>
            <option value="3000-7000" className="text-slate-900">
              $3,000 - $7,000
            </option>
            <option value="7000-15000" className="text-slate-900">
              $7,000 - $15,000
            </option>
            <option value="15000-30000" className="text-slate-900">
              $15,000 - $30,000
            </option>
            <option value="above-30000" className="text-slate-900">
              Above $30,000
            </option>
          </select>
        </label>

        <label className="space-y-2 text-sm">
          <span className="font-medium text-slate-200">Inquiry details</span>
          <textarea
            name="message"
            required
            rows={5}
            placeholder="Briefly describe the treatment need, timeline, and any reports you already have."
            onFocus={() => trackField("message")}
            className="w-full rounded-[1.5rem] border border-white/10 bg-white/8 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-amber-300"
          />
        </label>

        <label className="flex items-start gap-3 rounded-[1.5rem] border border-white/10 bg-white/6 px-4 py-4 text-sm leading-6 text-slate-300">
          <input
            name="consent"
            type="checkbox"
            required
            onFocus={() => trackField("consent")}
            className="mt-1 h-4 w-4 rounded border-white/20"
          />
          <span>
            I agree to be contacted by TreatAxis about this medical travel inquiry.
          </span>
        </label>

        <button
          type="submit"
          disabled={submission.kind === "loading"}
          className="w-full rounded-full bg-amber-400 px-6 py-4 text-base font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submission.kind === "loading" ? "Submitting inquiry..." : "Submit inquiry"}
        </button>

          <p aria-live="polite" className="min-h-6 text-sm text-slate-200">
            {submission.kind === "error" ? submission.message : ""}
          </p>
        </form>
      </aside>

      {submission.kind === "success" ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 px-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_30px_90px_rgba(2,6,23,0.35)]">
            <button
              type="button"
              aria-label="Close thank you message"
              onClick={() => setSubmission(initialState)}
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              x
            </button>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Thank you</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-900">Your request has been submitted.</h3>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              {submission.message || "We will connect you with suitable hospital options in the next 24 hours and share a treatment estimate with travel guidance."}
            </p>
            <button
              type="button"
              onClick={() => setSubmission(initialState)}
              className="mt-6 w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}