import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { TreatmentPriceModal } from "../../components/treatment-price-modal";
import { africaCountries, africaCountryBySlug } from "../../../lib/africa-content";
import { treatments } from "../../../lib/seo-content";

const countrySpecificContent: Record<
  string,
  {
    narrative: string;
    corridorNotes: string[];
    conversionNote: string;
    faqs: Array<{ question: string; answer: string }>;
  }
> = {
  ghana: {
    narrative:
      "Patients from Ghana often compare India options when they need faster specialist timelines, especially for cardiac and oncology planning. Family coordination and post-discharge support usually drive the final city choice.",
    corridorNotes: [
      "Accra cases commonly prefer Delhi for broader specialty coverage and faster slots.",
      "Kumasi families often choose Bengaluru when recovery-focused stay is a priority.",
      "Budget planning should include attendant accommodation and 5-7 days post-discharge review.",
    ],
    conversionNote:
      "For Ghana patients, we prioritize city and specialist matching first, then finalize budget and travel timing.",
    faqs: [
      {
        question: "How do Ghana patients shortlist hospitals in India?",
        answer:
          "Most families start with treatment type, expected admission timeline, and doctor team fit before comparing cost ranges across cities.",
      },
      {
        question: "What documents should Ghana families share first?",
        answer:
          "Recent scans, lab reports, diagnosis notes, and current medicine list help hospitals return a clearer treatment pathway.",
      },
    ],
  },
  nigeria: {
    narrative:
      "Nigeria-based inquiries are often high-intent and treatment-specific, with strong focus on second opinions and procedure readiness. Clear specialist mapping is usually the deciding factor.",
    corridorNotes: [
      "Lagos and Abuja patients often request side-by-side doctor profiles before confirming travel.",
      "Kidney and IVF pathways typically need longer pre-travel document review windows.",
      "Families should account for medicine continuity and follow-up protocol before return.",
    ],
    conversionNote:
      "For Nigeria patients, we focus on quick second-opinion triage and specialist-led pathway planning.",
    faqs: [
      {
        question: "Can Nigerian patients get a second opinion before booking tickets?",
        answer:
          "Yes, report-first review is recommended so treatment pathway and city options are confirmed before travel.",
      },
      {
        question: "Which treatments are commonly researched from Nigeria?",
        answer:
          "Kidney transplant, fertility treatment, neurosurgery, and complex orthopedic care are frequently requested.",
      },
    ],
  },
  kenya: {
    narrative:
      "Kenya patients often evaluate India for planned spine, cardiac, and transplant pathways where multidisciplinary care is needed. Duration clarity and discharge planning are usually key concerns.",
    corridorNotes: [
      "Nairobi-origin patients often compare Delhi and Bengaluru for specialist availability.",
      "Mombasa families frequently ask for city-level cost and stay comparisons.",
      "Fitness-to-fly and early follow-up planning should be defined before return booking.",
    ],
    conversionNote:
      "For Kenya patients, we prioritize specialist fit and recovery timeline before final city selection.",
    faqs: [
      {
        question: "How should Kenyan families choose city options in India?",
        answer:
          "Choose based on treatment specialty, hospital team depth, and realistic recovery stay rather than only package price.",
      },
      {
        question: "Do Kenyan patients need to plan extra stay days?",
        answer:
          "Yes, most cases should keep buffer days for follow-up checks or additional diagnostics.",
      },
    ],
  },
  tanzania: {
    narrative:
      "Tanzania patients usually ask for predictable treatment timelines and city-wise affordability before finalizing medical travel. Practical recovery support is a major decision factor.",
    corridorNotes: [
      "Dar es Salaam cases frequently compare oncology and urology centers by procedure timelines.",
      "Arusha families often prioritize post-treatment monitoring windows in the same city.",
      "Digital plus printed reports help speed up pre-travel review.",
    ],
    conversionNote:
      "For Tanzania patients, we focus on timeline certainty and practical post-procedure recovery planning.",
    faqs: [
      {
        question: "What is the best first step for Tanzania patients?",
        answer:
          "Share treatment reports early so hospital teams can confirm pathway, expected duration, and likely cost range.",
      },
      {
        question: "Why do Tanzania families compare more than one city?",
        answer:
          "City comparison helps balance specialist availability, stay logistics, and recovery convenience.",
      },
    ],
  },
  uganda: {
    narrative:
      "Uganda families frequently look for clear surgeon/team information and a reliable discharge roadmap before travel. Structured follow-up continuity is a common priority.",
    corridorNotes: [
      "Kampala patients often ask for doctor-team mapping before estimate requests.",
      "Neuro and general surgery cases usually need stronger post-discharge guidance.",
      "Allergy and medicine-history accuracy can reduce pre-op delays.",
    ],
    conversionNote:
      "For Uganda patients, we emphasize specialist mapping and follow-up continuity from day one.",
    faqs: [
      {
        question: "How can Uganda patients avoid treatment delays?",
        answer:
          "Prepare clinical summary, diagnostics, and medicine history before inquiry so hospitals can triage faster.",
      },
      {
        question: "Is attendant planning important for Uganda families?",
        answer:
          "Yes, an attendant helps with discharge logistics, medicine management, and follow-up visits.",
      },
    ],
  },
  ethiopia: {
    narrative:
      "Ethiopia-origin cases often require faster coordination for complex care, especially cardiac and oncology pathways. Strong case documentation usually improves hospital response quality.",
    corridorNotes: [
      "Addis Ababa patients frequently request dual-city options for better timeline flexibility.",
      "Complex oncology and transplant pathways need clear pre-travel clinical sequencing.",
      "Plan medication and monitoring roadmap before return travel.",
    ],
    conversionNote:
      "For Ethiopia patients, we prioritize rapid case triage and specialty-center matching.",
    faqs: [
      {
        question: "What helps Ethiopia patients get faster hospital responses?",
        answer:
          "Complete report sets with diagnosis summary and treatment history usually produce quicker and clearer pathway recommendations.",
      },
      {
        question: "Can Ethiopia families compare treatment paths before travel?",
        answer:
          "Yes, comparing city options and specialist teams before booking is recommended for planned care.",
      },
    ],
  },
  egypt: {
    narrative:
      "Egypt patients commonly compare India centers for IVF, bariatric, and complex planned surgeries where timing, comfort, and continuity matter. Families usually request detailed stay guidance.",
    corridorNotes: [
      "Cairo and Alexandria cases often ask for treatment-plus-recovery city planning.",
      "IVF and bariatric pathways benefit from tighter timeline scheduling.",
      "Discharge warning-sign guidance should be finalized before return.",
    ],
    conversionNote:
      "For Egypt patients, we focus on treatment scheduling precision and recovery continuity.",
    faqs: [
      {
        question: "How do Egypt families decide between treatment cities in India?",
        answer:
          "Most compare specialist depth, cycle/surgery scheduling speed, and comfort of post-treatment stay.",
      },
      {
        question: "Are IVF and bariatric pathways handled differently?",
        answer:
          "Yes, both require tighter timeline planning and follow-up sequencing compared with standard short-stay procedures.",
      },
    ],
  },
  morocco: {
    narrative:
      "Morocco patients typically ask for confidence-led planning with clear specialist credentials and realistic stay expectations. Ophthalmology and dental pathways are frequent high-intent requests.",
    corridorNotes: [
      "Casablanca-origin inquiries often request procedure-wise city comparison before estimate confirmation.",
      "Rabat and Marrakech families commonly prioritize shorter recovery corridors.",
      "Remote follow-up plan should be agreed before return.",
    ],
    conversionNote:
      "For Morocco patients, we emphasize specialist credibility and predictable recovery planning.",
    faqs: [
      {
        question: "What should Morocco patients verify before finalizing treatment travel?",
        answer:
          "Doctor profile fit, hospital accreditation, treatment window, and follow-up structure should be checked first.",
      },
      {
        question: "Can Morocco families plan post-treatment support before departure?",
        answer:
          "Yes, preparing follow-up milestones and medicine continuity in advance improves recovery confidence.",
      },
    ],
  },
};

type Params = {
  country: string;
};

type PageProps = {
  params: Promise<Params>;
};

export function generateStaticParams(): Params[] {
  return africaCountries.map((item) => ({ country: item.slug }));
}

function buildLanguageAlternates() {
  const languages: Record<string, string> = {
    en: "https://www.treataxis.com/africa",
    "x-default": "https://www.treataxis.com/africa",
  };

  africaCountries.forEach((item) => {
    languages[item.locale] = `https://www.treataxis.com/africa/${item.slug}`;
  });

  return languages;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params;
  const landing = africaCountryBySlug[country];

  if (!landing) {
    return {};
  }

  return {
    title: `Treatment in India from ${landing.country}`,
    description: `${landing.country} patient guide: compare hospitals in India, budget range, visa and stay planning, and treatment-specific pathways before travel.`,
    alternates: {
      canonical: `/africa/${landing.slug}`,
      languages: buildLanguageAlternates(),
    },
    keywords: landing.intentKeywords,
    openGraph: {
      title: `Treatment in India from ${landing.country} | TreatAxis`,
      description: `${landing.country}-focused medical tourism guide for treatment in India with practical planning support.`,
      url: `https://www.treataxis.com/africa/${landing.slug}`,
      type: "website",
    },
  };
}

export default async function AfricaCountryPage({ params }: PageProps) {
  const { country } = await params;
  const landing = africaCountryBySlug[country];

  if (!landing) {
    notFound();
  }

  const specific = countrySpecificContent[landing.slug];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: `Treatment in India from ${landing.country}`,
        url: `https://www.treataxis.com/africa/${landing.slug}`,
        description: landing.marketFocus,
        keywords: landing.intentKeywords.join(", "),
      },
      {
        "@type": "Service",
        name: `Medical tourism support for ${landing.country} patients`,
        provider: { "@type": "Organization", name: "TreatAxis" },
        areaServed: landing.country,
        serviceType: "Treatment abroad planning and hospital coordination",
      },
      {
        "@type": "FAQPage",
        mainEntity: specific.faqs.map((item) => ({
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

  const linkedTreatments = treatments.filter((item) => landing.topTreatments.includes(item.name));

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14 lg:px-10">
      <Script id={`africa-country-schema-${landing.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">{landing.country}</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-slate-950 sm:text-6xl">
          Treatment in India from {landing.country}
        </h1>
        <p className="mt-5 text-base leading-8 text-[var(--muted)]">{landing.marketFocus}</p>
      </header>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-[1.5rem] border border-[var(--line)] bg-white/85 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">What families from {landing.country} usually need</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-800">
            {landing.primaryNeeds.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-[1.5rem] border border-[var(--line)] bg-white/85 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Why many patients choose India</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-800">
            {landing.whyIndia.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-8 rounded-[1.5rem] border border-[var(--line)] bg-white/90 p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Top treatments patients from {landing.country} often research</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {linkedTreatments.map((item) => (
            <Link
              key={item.slug}
              href={`/treatments/${item.slug}`}
              className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-[1.5rem] border border-[var(--line)] bg-white/85 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">{landing.country}-specific treatment planning context</h2>
          <p className="mt-4 text-sm leading-8 text-slate-700">{specific.narrative}</p>
        </article>
        <article className="rounded-[1.5rem] border border-[var(--line)] bg-white/85 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Common travel corridor notes for {landing.country}</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-800">
            {specific.corridorNotes.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-[1.5rem] border border-[var(--line)] bg-white/85 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Travel and recovery checklist</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-800">
            {landing.travelNotes.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <Link
            href="/destinations/india"
            className="mt-5 inline-flex rounded-full border border-[var(--brand)] bg-white px-5 py-2 text-sm font-semibold text-[var(--brand)] transition hover:bg-[var(--brand)] hover:text-white"
          >
            Compare hospitals in India
          </Link>
        </article>

        <article className="rounded-[1.5rem] border border-[var(--line)] bg-slate-950 p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">Conversion</p>
          <h2 className="mt-3 text-2xl font-semibold">Get treatment estimate from {landing.country}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {specific.conversionNote} Share your treatment need, budget range, and timeline to receive hospital options and next-step planning support.
          </p>
          <div className="mt-5">
            <TreatmentPriceModal
              defaultTreatment="Treatment Planning"
              buttonLabel={`Get treatment estimate from ${landing.country}`}
              buttonClassName="inline-flex rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
            />
          </div>
        </article>
      </section>

      <section className="mt-8 rounded-[1.5rem] border border-[var(--line)] bg-white/85 p-6">
        <h2 className="text-2xl font-semibold text-slate-900">High-intent keywords for {landing.country}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {landing.intentKeywords.map((item) => (
            <span key={item} className="rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-[1.5rem] border border-[var(--line)] bg-white/85 p-6">
        <h2 className="text-2xl font-semibold text-slate-900">FAQs for patients from {landing.country}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {specific.faqs.map((item) => (
            <article key={item.question} className="rounded-xl border border-[var(--line)] bg-white p-4">
              <h3 className="text-base font-semibold text-slate-900">{item.question}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
