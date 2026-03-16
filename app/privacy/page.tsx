import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the TreatAxis privacy policy covering data collection, usage, inquiry processing, and patient communication preferences.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-14 lg:px-10">
      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">Legal</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-slate-950 sm:text-6xl">Privacy Policy</h1>
        <p className="mt-5 text-base leading-8 text-[var(--muted)]">Last updated: 16 March 2026</p>
      </header>

      <section className="mt-8 space-y-6 rounded-[1.5rem] border border-[var(--line)] bg-white/90 p-6 text-sm leading-8 text-slate-700">
        <p>
          TreatAxis collects information submitted through inquiry forms, chat inputs, and support interactions to
          coordinate treatment-abroad planning and patient communication.
        </p>
        <p>
          We may collect name, contact details, country, treatment interest, uploaded reports, and planning preferences.
          This information is used for case routing, support follow-up, and service improvement.
        </p>
        <p>
          We do not provide medical diagnosis. Information is handled for treatment planning and coordination support.
          Patients should seek direct physician advice for diagnosis and emergency decisions.
        </p>
        <p>
          You can request updates or deletion of your inquiry data by contacting support@treataxis.com. Operational,
          compliance, and security records may be retained where required.
        </p>
      </section>
    </main>
  );
}