import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Medical Disclaimer",
  description:
    "TreatAxis medical disclaimer for educational content, non-diagnostic guidance, and emergency-care limitations.",
  alternates: {
    canonical: "/medical-disclaimer",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Medical Disclaimer",
  url: "https://www.treataxis.com/medical-disclaimer",
  description:
    "Educational treatment-abroad content only. Not medical diagnosis, prescription, or emergency triage.",
};

export default function MedicalDisclaimerPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-14 lg:px-10">
      <Script id="medical-disclaimer-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">Safety</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-slate-950 sm:text-6xl">Medical Disclaimer</h1>
        <p className="mt-5 text-base leading-8 text-[var(--muted)]">Last updated: 16 March 2026</p>
      </header>

      <section className="mt-8 space-y-6 rounded-[1.5rem] border border-[var(--line)] bg-white/90 p-6 text-sm leading-8 text-slate-700">
        <p>
          TreatAxis content is for educational and treatment-planning purposes only. It is not a diagnosis, treatment
          prescription, or replacement for direct physician consultation.
        </p>
        <p>
          Do not delay, avoid, or replace professional medical advice based on website content or chat guidance.
          Always consult a qualified healthcare professional for clinical decisions.
        </p>
        <p>
          For emergency symptoms, seek immediate in-person medical care through local emergency services.
        </p>
        <p>
          Any treatment estimates, timelines, or pathway examples are indicative and may vary based on individual
          clinical condition, specialist advice, and hospital protocols.
        </p>
      </section>
    </main>
  );
}