"use client";

import { useMemo, useState } from "react";
import type { AuditResult } from "../../lib/seo-audit";

type AuditState = {
  loading: boolean;
  error: string;
  result: AuditResult | null;
};

function ScoreBadge({ label, value }: { label: string; value: number }) {
  const tone =
    value >= 80
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : value >= 60
        ? "text-amber-700 bg-amber-50 border-amber-200"
        : "text-rose-700 bg-rose-50 border-rose-200";

  return (
    <div className={`rounded-2xl border px-4 py-3 ${tone}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em]">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}/100</p>
    </div>
  );
}

function ChecksTable({ title, checks }: { title: string; checks: AuditResult["seoChecks"] }) {
  return (
    <article className="rounded-[1.5rem] border border-[var(--line)] bg-white/90 p-5">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <div className="mt-4 space-y-3">
        {checks.map((check) => (
          <div key={check.label} className="rounded-xl border border-[var(--line)] bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{check.label}</p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${check.passed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
              >
                {check.passed ? "Pass" : "Needs work"}
              </span>
            </div>
            <p className="mt-2 text-sm leading-7 text-slate-700">{check.detail}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export function SeoAuditClient() {
  const [url, setUrl] = useState("https://www.treataxis.com/");
  const [state, setState] = useState<AuditState>({ loading: false, error: "", result: null });

  const summary = useMemo(() => {
    if (!state.result) return "Run an audit to see actionable SEO and E-E-A-T checks.";
    if (state.result.totalScore >= 80) return "Strong baseline. Focus on incremental gains and indexing speed.";
    if (state.result.totalScore >= 60)
      return "Good start. Address failed checks to improve search trust and rank consistency.";
    return "Priority fix required. Improve technical SEO and trust signals before scaling more pages.";
  }, [state.result]);

  async function runAudit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, error: "", result: null });

    try {
      const response = await fetch("/api/seo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        setState({ loading: false, error: data.error || "Audit failed.", result: null });
        return;
      }

      setState({ loading: false, error: "", result: data as AuditResult });
    } catch {
      setState({ loading: false, error: "Network error while running audit.", result: null });
    }
  }

  return (
    <>
      <section className="mt-8 rounded-[1.5rem] border border-[var(--line)] bg-white/90 p-6">
        <form onSubmit={runAudit} className="flex flex-col gap-3 md:flex-row">
          <input
            type="url"
            required
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            className="flex-1 rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-[var(--brand)] focus:ring-2"
            placeholder="https://www.treataxis.com/treatments/cardiac-care-abroad"
          />
          <button
            type="submit"
            disabled={state.loading}
            className="rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {state.loading ? "Auditing..." : "Run audit"}
          </button>
        </form>
        {state.error ? <p className="mt-3 text-sm font-semibold text-rose-700">{state.error}</p> : null}
      </section>

      <section className="mt-8 rounded-[1.5rem] border border-[var(--line)] bg-white/90 p-6">
        <p className="text-sm leading-7 text-slate-700">{summary}</p>
        {state.result ? (
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <ScoreBadge label="Total score" value={state.result.totalScore} />
            <ScoreBadge label="SEO score" value={state.result.seoScore} />
            <ScoreBadge label="E-E-A-T score" value={state.result.eeatScore} />
          </div>
        ) : null}
      </section>

      {state.result ? (
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <ChecksTable title="SEO checks" checks={state.result.seoChecks} />
          <ChecksTable title="E-E-A-T checks" checks={state.result.eeatChecks} />
        </section>
      ) : null}
    </>
  );
}
