import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "About TreatAxis",
  description:
    "Learn how TreatAxis supports international patients with treatment-abroad planning, hospital comparison, and transparent care coordination.",
  alternates: {
    canonical: "/about",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      name: "About TreatAxis",
      url: "https://www.treataxis.com/about",
      description:
        "TreatAxis supports planned treatment abroad with structured hospital comparison, travel planning guidance, and patient-first coordination.",
    },
    {
      "@type": "Organization",
      name: "TreatAxis",
      url: "https://www.treataxis.com",
      sameAs: [
        "https://www.linkedin.com/company/treataxis",
        "https://x.com/TreatAxis",
        "https://www.instagram.com/treataxis",
        "https://www.facebook.com/treataxis",
        "https://www.youtube.com/@TreatAxis",
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-14 lg:px-10">
      <Script id="about-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">About</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-slate-950 sm:text-6xl">About TreatAxis</h1>
        <p className="mt-5 text-base leading-8 text-[var(--muted)]">
          TreatAxis helps international patients plan treatment abroad in India with clearer hospital comparison,
          practical travel guidance, and post-treatment recovery coordination.
        </p>
      </header>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-[1.5rem] border border-[var(--line)] bg-white/85 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">What we do</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-800">
            <li>• Guide planned treatment-abroad pathways with report-first intake.</li>
            <li>• Help families compare hospitals and specialists by treatment type.</li>
            <li>• Support travel readiness, stay planning, and follow-up sequencing.</li>
          </ul>
        </article>

        <article className="rounded-[1.5rem] border border-[var(--line)] bg-white/85 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">How we work</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-800">
            <li>• We prioritize planned, non-emergency medical travel journeys.</li>
            <li>• We organize patient details to improve pathway clarity and response quality.</li>
            <li>• We do not replace direct physician diagnosis or emergency services.</li>
          </ul>
        </article>
      </section>

      <section className="mt-8 rounded-[1.5rem] border border-[var(--line)] bg-white/90 p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Editorial and medical content standards</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">
          We publish educational treatment-abroad content for patient planning. Content is reviewed for clarity,
          safety language, and practical travel-readiness context. It is not a substitute for in-person consultation,
          diagnosis, or emergency care.
        </p>
      </section>
    </main>
  );
}