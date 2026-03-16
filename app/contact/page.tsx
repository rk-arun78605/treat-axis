import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Contact TreatAxis",
  description:
    "Contact TreatAxis for treatment-abroad planning support, hospital comparison guidance, and patient coordination queries.",
  alternates: {
    canonical: "/contact",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact TreatAxis",
  url: "https://www.treataxis.com/contact",
  mainEntity: {
    "@type": "Organization",
    name: "TreatAxis",
    url: "https://www.treataxis.com",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@treataxis.com",
        availableLanguage: ["English"],
        areaServed: "Worldwide",
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-14 lg:px-10">
      <Script id="contact-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">Contact</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-slate-950 sm:text-6xl">Contact TreatAxis</h1>
        <p className="mt-5 text-base leading-8 text-[var(--muted)]">
          Reach out for treatment-abroad planning support, report-first case coordination, and pathway comparison.
        </p>
      </header>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-[1.5rem] border border-[var(--line)] bg-white/90 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Support</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Email: <a href="mailto:support@treataxis.com" className="font-semibold text-[var(--brand)] hover:underline">support@treataxis.com</a>
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-700">Hours: Monday to Saturday, 9:00 AM to 7:00 PM (IST)</p>
          <p className="mt-2 text-sm leading-7 text-slate-700">Coverage: International patient support</p>
        </article>

        <article className="rounded-[1.5rem] border border-[var(--line)] bg-white/90 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Quick links</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm font-semibold">
            <Link href="/about" className="text-[var(--brand)] hover:underline">About TreatAxis</Link>
            <Link href="/medical-disclaimer" className="text-[var(--brand)] hover:underline">Medical Disclaimer</Link>
            <Link href="/privacy" className="text-[var(--brand)] hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="text-[var(--brand)] hover:underline">Terms of Use</Link>
          </div>
        </article>
      </section>
    </main>
  );
}