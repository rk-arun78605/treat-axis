import type { Metadata } from "next";
import Link from "next/link";
import { TreaHeroAssistant } from "./components/trea-hero-assistant";
import { TreaChatWidget } from "./components/trea-chat-widget";
import { destinations, treatments } from "../lib/seo-content";

const treatmentCategories = [
  {
    title: "Cardiac care",
    description:
      "Initial screening, treatment planning, and hospital coordination for planned heart procedures.",
  },
  {
    title: "Orthopedic surgery",
    description:
      "Joint replacement, spine consultations, and rehabilitation-focused treatment pathways abroad.",
  },
  {
    title: "Fertility and women's health",
    description:
      "Private, coordinated support for IVF, gynecology, and second-opinion requests.",
  },
  {
    title: "Cosmetic and dental procedures",
    description:
      "Transparent planning for elective care, timelines, aftercare, and travel readiness.",
  },
];

const faqItems = [
  {
    question: "How does TreatAxis help international patients?",
    answer:
      "TreatAxis helps patients submit one inquiry, organize treatment details, and move forward with a clearer care pathway for treatment abroad.",
  },
  {
    question: "What should a patient include in the inquiry form?",
    answer:
      "The most useful inquiries include the treatment needed, country of residence, preferred destination, budget expectations, and any available medical reports.",
  },
  {
    question: "Can TreatAxis support planned treatments instead of emergencies?",
    answer:
      "Yes. The homepage and lead flow are positioned for planned care, elective procedures, second opinions, and organized medical travel journeys.",
  },
  {
    question: "Why is this homepage useful before treatment abroad?",
    answer:
      "It gives practical guidance patients need before medical travel: treatment pathways, hospital and city comparison, visa and stay planning, and a direct inquiry flow for next steps.",
  },
];

const trustSignals = [
  "Patient-first inquiry flow designed for planned medical travel",
  "Global treatment abroad guidance for hospitals, doctors, India medical visa, stay, and recovery",
  "Webhook-ready lead system for CRM, email, or automation handoff",
  "Clear visual hierarchy, fast scanning, and mobile-first conversion UX",
];

const patientSupportHighlights = [
  {
    title: "Hospital matching",
    description:
      "Shortlists shaped around treatment need, age, recovery pace, and travel comfort instead of random hospital lists.",
  },
  {
    title: "Travel and visa help",
    description:
      "Medical visa guidance, airport pickup planning, and paperwork preparation for patients and attendants.",
  },
  {
    title: "Stay and recovery planning",
    description:
      "Hotel options near the hospital, food suitability, medicine pickup, and post-treatment follow-up timing.",
  },
  {
    title: "Worldwide patient focus",
    description:
      "Content designed for patients traveling from Africa, the Middle East, Europe, North America, and Asia-Pacific for planned care in India.",
  },
  {
    title: "Multiple hospital options",
    description:
      "Each treatment pathway includes options across Delhi, Bengaluru, and Kerala so patients can compare more than one hospital before deciding.",
  },
  {
    title: "Doctor profile guidance",
    description:
      "Cards include specialist profile highlights to help families understand which doctor expertise to prioritize during consultation booking.",
  },
];

const patientJourneyGuides = [
  {
    title: "Before you travel",
    description:
      "Understand reports needed, likely visa path, travel window, and how many days you may need to stay in India.",
  },
  {
    title: "During treatment",
    description:
      "Compare hospital location, interpreter availability, food convenience, hotel distance, and support for attendants.",
  },
  {
    title: "After discharge",
    description:
      "Know the expected rest period, medicine access, follow-up scans, and what can continue safely after returning home.",
  },
];

const medicalTourismContent = [
  "Medical tourism works best when treatment choice, travel timing, and recovery planning are considered together rather than in isolation.",
  "Patients often need more than a hospital name. They also need clarity on medical visa process, length of stay, attendant support, local transport, and safe post-treatment recovery.",
  "TreatAxis content is built around these real decisions so users searching from Africa and Maldives can compare India pathways with less confusion and fewer hidden steps.",
];

export const metadata: Metadata = {
  title: "Medical Treatment Abroad in India | Global Patient Care",
  description:
    "Plan medical treatment abroad in India with hospital comparisons, medical visa guidance, and recovery support for patients worldwide.",
  keywords: [
    "medical treatment abroad",
    "medical treatment india",
    "treatment in india for international patients",
    "india medical visa for treatment",
    "global patient treatment planning",
    "medical tourism india",
    "international patient services india",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en": "/",
      "en-US": "/",
      "en-GB": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Medical Treatment Abroad in India | Global Patient Care",
    description:
      "Plan medical treatment abroad in India with hospital comparisons, medical visa guidance, and recovery support for patients worldwide.",
    url: "https://www.treataxis.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medical Treatment Abroad in India | Global Patient Care",
    description:
      "Plan medical treatment abroad in India with hospital comparisons, medical visa guidance, and recovery support for patients worldwide.",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "TreatAxis",
      url: "https://www.treataxis.com",
      slogan: "Plan Treatment Abroad With Confidence",
      description:
        "TreatAxis is a medical tourism platform that helps international patients explore treatment abroad and submit planned care inquiries.",
    },
    {
      "@type": "WebSite",
      name: "TreatAxis",
      url: "https://www.treataxis.com",
    },
    {
      "@type": "Service",
      name: "Medical tourism inquiry support",
      provider: {
        "@type": "Organization",
        name: "TreatAxis",
      },
      areaServed: "Worldwide",
      serviceType: "Medical tourism planning and patient inquiry support",
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      ></script>
      <main className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(circle_at_top,rgba(15,118,110,0.18),transparent_48%)]" />

        <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-12 px-6 py-8 lg:px-10">
          <section
            id="planner"
            className="space-y-8 rounded-[2rem] border border-[var(--line)] bg-[var(--surface-strong)] p-8 shadow-[0_28px_100px_rgba(15,23,42,0.08)] backdrop-blur lg:p-12"
          >
            <TreaHeroAssistant />

            <div className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                Plan treatment abroad with confidence
              </p>
              <h1 className="mt-5 max-w-4xl font-display text-5xl leading-none text-slate-950 sm:text-6xl lg:text-7xl">
                Plan medical treatment in India with clarity and confidence.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
                TreatAxis helps patients worldwide compare treatment pathways in India with hospital guidance, medical visa direction, hotel planning, food support, and realistic post-treatment recovery timelines.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {trustSignals.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-[var(--line)] bg-white/80 p-5 text-sm leading-7 text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="grid gap-4 rounded-[1.75rem] border border-[var(--line)] bg-white/70 p-5 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--accent)]">
                  Treatment pages
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {treatments.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/treatments/${item.slug}`}
                      className="rounded-full border border-[var(--line)] bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--accent)]">
                  Destination pages
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {destinations.slice(0, 4).map((item) => (
                    <Link
                      key={item.slug}
                      href={`/destinations/${item.slug}`}
                      className="rounded-full border border-[var(--line)] bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                    >
                      {item.country}
                    </Link>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-6 text-[var(--muted)]">
                  Country corridors: <Link href="/africa" className="font-semibold text-[var(--brand)] hover:underline">Africa and Maldives</Link> and <Link href="/countries" className="font-semibold text-[var(--brand)] hover:underline">US, UK, UAE, Saudi, Canada, Australia</Link>
                </p>
              </div>
            </div>
          </section>

          <section
            id="why-treataxis"
            className="grid gap-8 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-8 backdrop-blur lg:grid-cols-[0.9fr_1.1fr] lg:p-10"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
                Medical tourism support
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-slate-950 sm:text-5xl">
                Patient-first support for planning treatment abroad safely.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted)]">
                This section focuses on what international patients actually need before choosing medical treatment in India: hospital selection, visa planning, recovery stay, attendant support, and safe coordination after discharge.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {patientSupportHighlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.5rem] border border-[var(--line)] bg-white/75 p-5"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <article className="rounded-[2rem] border border-[var(--line)] bg-slate-950 p-8 text-slate-50 shadow-[0_24px_100px_rgba(15,23,42,0.18)] lg:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-300">
                Treatment focus
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
                Care pathways patients commonly research before traveling.
              </h2>
              <div className="mt-8 grid gap-4">
                {treatmentCategories.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5"
                  >
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </article>

            <article
              id="process"
              className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-8 lg:p-10"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                Medical travel guide
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-slate-950 sm:text-5xl">
                What patients should know before choosing treatment in another country.
              </h2>
              <div className="mt-8 space-y-4">
                {patientJourneyGuides.map((item, index) => (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-[1.5rem] border border-[var(--line)] bg-white/80 p-5"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-base font-semibold text-white">
                      {index + 1}
                    </div>
                    <div className="pt-1">
                      <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-700">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 space-y-4 text-sm leading-7 text-[var(--muted)]">
                {medicalTourismContent.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </article>
          </section>

          <footer className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] px-8 py-6 text-sm leading-7 text-[var(--muted)] lg:px-10">
            TreatAxis helps patients plan treatment in India with clear hospital options, structured travel guidance, and practical post-treatment recovery support.
          </footer>

          <section
            id="faq"
            className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-8 lg:p-10"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
              FAQ
            </p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-slate-950 sm:text-5xl">
              Answers patients and families ask before medical travel.
            </h2>
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {faqItems.map((item) => (
                <article
                  key={item.question}
                  className="rounded-[1.5rem] border border-[var(--line)] bg-white/80 p-6"
                >
                  <h3 className="text-xl font-semibold text-slate-900">{item.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.answer}</p>
                </article>
              ))}
            </div>
          </section>
        </section>
        <TreaChatWidget />
      </main>
    </>
  );
}
