"use client";

import { FormEvent, useState } from "react";

type Props = {
  treatmentName: string;
};

type ItineraryOption = {
  location: string;
  estimatedCostRange: string;
  treatmentTime: string;
  visa: string;
  stay: string;
  postTreatmentCare: string;
};

type ItineraryResponse = {
  options?: ItineraryOption[];
  message?: string;
};

export function TreatmentInlineAi({ treatmentName }: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = question.trim();

    if (!message || loading) {
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const response = await fetch("/api/itinerary-research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `${treatmentName}: ${message}`,
        }),
      });

      const result = (await response.json()) as ItineraryResponse;

      if (!response.ok) {
        throw new Error(result.message || "Unable to get a response right now.");
      }

      const options = Array.isArray(result.options) ? result.options : [];

      if (options.length === 0) {
        setAnswer("I can help further once you share more condition details.");
        return;
      }

      const summary = options
        .slice(0, 3)
        .map((item, index) => {
          return [
            `${index + 1}. ${item.location}`,
            `Estimated cost range: ${item.estimatedCostRange}`,
            `Treatment time: ${item.treatmentTime}`,
            `Stay planning: ${item.stay}`,
            `Post-treatment care: ${item.postTreatmentCare}`,
            `Visa note: ${item.visa}`,
          ].join("\n");
        })
        .join("\n\n");

      setAnswer(summary);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to get a response right now.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.28)] lg:p-8">
      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">TREA AI</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">I can help you initially understand your condition</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
          Ask your first question about symptoms, expected tests, treatment journey, or recovery planning before traveling abroad.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            rows={4}
            placeholder={`Example: I have ${treatmentName.toLowerCase()} reports. What should I check before traveling?`}
            className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-white/25"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Thinking..." : "Ask TREA AI"}
          </button>
        </form>

        {answer ? (
          <article className="mt-4 rounded-xl border border-white/10 bg-white/6 p-4">
            <p className="text-sm font-semibold text-white">TREA AI response</p>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-200">{answer}</p>
          </article>
        ) : null}

        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

        <p className="mt-5 rounded-xl border border-amber-300/35 bg-amber-300/10 px-4 py-3 text-xs leading-6 text-amber-100">
          Disclaimer (India): This AI tool provides general educational information only. It is not a diagnosis,
          prescription, or medical advice. Under Indian medical law, final diagnosis and treatment decisions must be made
          by a registered medical practitioner after clinical evaluation. For emergency symptoms, seek immediate in-person care.
        </p>
      </div>
    </section>
  );
}
