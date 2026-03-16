import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Read TreatAxis terms of use for website access, inquiry usage, service boundaries, and user responsibilities.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-14 lg:px-10">
      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">Legal</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-slate-950 sm:text-6xl">Terms of Use</h1>
        <p className="mt-5 text-base leading-8 text-[var(--muted)]">Last updated: 16 March 2026</p>
      </header>

      <section className="mt-8 space-y-6 rounded-[1.5rem] border border-[var(--line)] bg-white/90 p-6 text-sm leading-8 text-slate-700">
        <p>
          TreatAxis provides educational and coordination support content for planned treatment-abroad journeys.
          Content does not replace clinical diagnosis, physician consultation, or emergency care.
        </p>
        <p>
          By using this website, you agree to provide accurate information in inquiry submissions and avoid misuse of
          form, chat, and upload features.
        </p>
        <p>
          Treatment decisions should be made with licensed healthcare professionals. TreatAxis does not guarantee
          treatment outcomes and is not a substitute for direct medical care providers.
        </p>
        <p>
          We may update these terms when service features or legal requirements change. Continued use of the website
          indicates acceptance of updated terms.
        </p>
      </section>
    </main>
  );
}