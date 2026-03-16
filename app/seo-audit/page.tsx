import type { Metadata } from "next";
import { SeoAuditClient } from "./seo-audit-client";

export const metadata: Metadata = {
  title: "SEO and E-E-A-T Audit",
  description:
    "Audit any page URL for SEO and E-E-A-T signals, including structured data, metadata quality, and trust-page linking.",
  alternates: {
    canonical: "/seo-audit",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SeoAuditPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14 lg:px-10">
      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">Audit</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-slate-950 sm:text-6xl">SEO and E-E-A-T score checker</h1>
        <p className="mt-5 text-base leading-8 text-[var(--muted)]">
          Enter any page URL to estimate SEO score, E-E-A-T score, and action-level checks for metadata, schema, trust pages, and content structure.
        </p>
      </header>

      <SeoAuditClient />

      <section className="mt-8 rounded-[1.5rem] border border-[var(--line)] bg-white/90 p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Steps to request indexing in Google Search Console</h2>
        <ol className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
          <li>1. Open Google Search Console and select your verified property.</li>
          <li>2. Use URL Inspection and paste the exact page URL.</li>
          <li>3. Click Test live URL and confirm the page is reachable.</li>
          <li>4. Click Request Indexing.</li>
          <li>5. Repeat for priority pages: homepage, treatment pages, corridor pages, and trust pages.</li>
          <li>6. Submit sitemap URL as sitemap.xml once deployment is live.</li>
        </ol>
      </section>
    </main>
  );
}