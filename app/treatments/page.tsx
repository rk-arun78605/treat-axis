import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { PathwaySwitchCards } from "../components/pathway-switch-cards";
import { TreatmentsInitialScroll } from "../components/treatments-initial-scroll";
import { treatments } from "../../lib/seo-content";

const treatmentFactsBySlug: Record<string, { costRange: string; duration: string; imagePath: string }> = {
  "cardiac-care-abroad": {
    costRange: "$4,800 - $12,000",
    duration: "5-10 days",
    imagePath: "/infographics/heart.svg",
  },
  "orthopedic-surgery-abroad": {
    costRange: "$3,500 - $9,000",
    duration: "6-14 days",
    imagePath: "/infographics/bone.svg",
  },
  "ivf-fertility-treatment-abroad": {
    costRange: "$2,200 - $6,000",
    duration: "10-18 days",
    imagePath: "/infographics/fertility.svg",
  },
  "dental-implants-abroad": {
    costRange: "$1,800 - $5,000",
    duration: "3-10 days",
    imagePath: "/infographics/dental.svg",
  },
  "oncology-treatment-abroad": {
    costRange: "$2,500 - $15,000+",
    duration: "7-21 days",
    imagePath: "/infographics/oncology.svg",
  },
  "neurosurgery-abroad": {
    costRange: "$6,000 - $18,000",
    duration: "7-16 days",
    imagePath: "/infographics/neuro.svg",
  },
  "spine-surgery-abroad": {
    costRange: "$4,500 - $10,000",
    duration: "6-15 days",
    imagePath: "/infographics/spine.svg",
  },
  "kidney-transplant-abroad": {
    costRange: "$13,000 - $24,500",
    duration: "10-20 days",
    imagePath: "/infographics/kidney-transplant.svg",
  },
  "liver-transplant-abroad": {
    costRange: "$20,000 - $45,000",
    duration: "14-28 days",
    imagePath: "/infographics/liver.svg",
  },
  "bariatric-surgery-abroad": {
    costRange: "$5,000 - $12,000",
    duration: "5-12 days",
    imagePath: "/infographics/bariatric.svg",
  },
  "cosmetic-surgery-abroad": {
    costRange: "$3,000 - $11,000",
    duration: "4-12 days",
    imagePath: "/infographics/cosmetic.svg",
  },
  "urology-surgery-abroad": {
    costRange: "$3,000 - $8,000",
    duration: "4-10 days",
    imagePath: "/infographics/urology.svg",
  },
  "ent-surgery-abroad": {
    costRange: "$2,000 - $7,000",
    duration: "3-8 days",
    imagePath: "/infographics/ent.svg",
  },
  "ophthalmology-surgery-abroad": {
    costRange: "$1,500 - $6,500",
    duration: "2-7 days",
    imagePath: "/infographics/ophthalmology.svg",
  },
  "general-surgery-abroad": {
    costRange: "$2,500 - $9,500",
    duration: "4-10 days",
    imagePath: "/infographics/general-surgery.svg",
  },
};

const defaultTreatmentFacts = {
  costRange: "Case-based estimate",
  duration: "4-12 days",
  imagePath: "/infographics/illness-explained.svg",
};

export const metadata: Metadata = {
  title: "Major Treatment and Surgery Pages",
  description:
    "Explore major treatment and surgery pages with illness education, hospital guidance, doctor roles, duration, and quick estimate CTA for medical travel in India.",
  alternates: { canonical: "/treatments" },
  keywords: [
    "major treatments abroad",
    "surgeries in India",
    "medical tourism treatment pages",
    "check treatment price",
    "hospital and doctor guidance",
  ],
  openGraph: {
    title: "Major Treatment and Surgery Pages | TreatAxis",
    description:
      "Browse major treatment and surgery pages with practical patient guidance and quick estimate flow.",
    url: "https://www.treataxis.com/treatments",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Major Treatment and Surgery Pages | TreatAxis",
    description:
      "Find treatment education, hospital guidance, and a quick estimate form for medical travel planning.",
  },
};

const treatmentsPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      name: "Major Treatment and Surgery Pages",
      url: "https://www.treataxis.com/treatments",
      description:
        "Browse major treatment and surgery pages with illness education and treatment planning guidance.",
    },
    {
      "@type": "ItemList",
      itemListElement: treatments.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://www.treataxis.com/treatments/${item.slug}`,
        name: item.name,
      })),
    },
  ],
};

export default function TreatmentsIndexPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-10">
      <TreatmentsInitialScroll />
      <Script
        id="treatments-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(treatmentsPageSchema) }}
      />
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
          Treatments
        </p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-slate-950 sm:text-6xl">
          Treatment-specific medical tourism.
        </h1>
        <p className="mt-5 text-base leading-8 text-[var(--muted)]">
          Each page targets a high-intent treatment keyword and explains pathway, fit,
          timeline, and inquiry next steps.
        </p>
      </header>

      <PathwaySwitchCards />

      <section id="treatments-list" className="mt-10 grid gap-5 md:grid-cols-2">
        {treatments.map((item) => (
          <article
            key={item.slug}
            className="rounded-[1.5rem] border border-[var(--line)] bg-white/80 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[var(--line)] bg-white">
                <Image
                  src={(treatmentFactsBySlug[item.slug] || defaultTreatmentFacts).imagePath}
                  alt={`${item.name} infographic`}
                  width={44}
                  height={44}
                />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">{item.name}</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.summary}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 rounded-xl border border-[var(--line)] bg-slate-50 p-3 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">Typical cost range</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{(treatmentFactsBySlug[item.slug] || defaultTreatmentFacts).costRange}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">Typical treatment time</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{(treatmentFactsBySlug[item.slug] || defaultTreatmentFacts).duration}</p>
              </div>
            </div>
            <Link
              href={`/destinations/india?treatment=${encodeURIComponent(item.name)}`}
              className="mt-5 inline-flex rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark)]"
            >
              View hospitals by city
            </Link>
            <Link
              href={`/treatments/${item.slug}`}
              className="mt-3 inline-flex rounded-full border border-[var(--brand)] bg-white px-5 py-3 text-sm font-semibold text-[var(--brand)] transition hover:bg-[var(--brand)] hover:text-white"
            >
              Open treatment guide
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
