import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { TreatmentPriceModal } from "../../components/treatment-price-modal";
import { highVolumeCountries, highVolumeCountryBySlug } from "../../../lib/high-volume-country-content";
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
  "united-states": {
    narrative:
      "Patients from the United States usually compare India pathways when they want specialist-led planning with clearer total-cost visibility for elective or high-ticket procedures.",
    corridorNotes: [
      "US patients often request side-by-side specialist and hospital comparisons before travel.",
      "Cardiac, orthopedic, and IVF pathways frequently need structured pre-travel report review.",
      "Travel plans should include buffer days for follow-up and medicine stabilization.",
    ],
    conversionNote:
      "For US patients, we prioritize treatment fit and realistic timeline planning first, then optimize hospital and budget choices.",
    faqs: [
      {
        question: "Why do US patients consider treatment in India?",
        answer:
          "Many compare India for specialist depth, faster scheduling for planned care, and clearer total-journey planning for complex or elective procedures.",
      },
      {
        question: "What should US families share in the first inquiry?",
        answer:
          "Recent reports, diagnosis details, medication history, and desired travel window help produce better specialist and city matching, with estimate ranges shown in USD.",
      },
    ],
  },
  "united-kingdom": {
    narrative:
      "UK patients often explore India treatment pathways for planned procedures where waiting-time certainty, specialist selection, and private-care coordination are key priorities.",
    corridorNotes: [
      "UK-origin inquiries usually compare timeline certainty across more than one hospital city.",
      "Orthopedic and cardiac pathways are common high-intent categories.",
      "Families should finalize discharge and return-to-routine planning before booking return flights.",
    ],
    conversionNote:
      "For UK patients, we focus on specialist matching, timeline reliability, and complete treatment journey visibility.",
    faqs: [
      {
        question: "Can UK patients finalize treatment options before traveling?",
        answer:
          "Yes, report-first triage helps compare city options, specialist teams, and expected stay windows before travel confirmation.",
      },
      {
        question: "Which treatment pathways are frequently requested from the UK?",
        answer:
          "Orthopedic, cardiac, and bariatric pathways are commonly researched due to specialist depth and structured planning needs, and comparisons can be reviewed in GBP.",
      },
    ],
  },
  "united-arab-emirates": {
    narrative:
      "UAE-based patients frequently evaluate India for planned specialist care when they need predictable budgets, tight scheduling, and clear family support planning.",
    corridorNotes: [
      "Dubai and Abu Dhabi cases often prioritize shorter corridor travel and fast specialist mapping.",
      "Oncology and cardiac pathways usually need stronger sequencing before ticket confirmation.",
      "Attendant planning should cover discharge logistics and local follow-up visits.",
    ],
    conversionNote:
      "For UAE patients, we prioritize speed-to-specialist and practical care coordination from first inquiry.",
    faqs: [
      {
        question: "How do UAE patients shortlist hospitals in India?",
        answer:
          "Most families start with treatment complexity, specialist team depth, and expected timeline before comparing budget ranges.",
      },
      {
        question: "Is pre-travel case review recommended for UAE patients?",
        answer:
          "Yes, report-first review improves pathway clarity, helps avoid avoidable delays after arrival, and lets families compare estimate ranges in AED.",
      },
    ],
  },
  "saudi-arabia": {
    narrative:
      "Saudi Arabia patients often request specialist-first treatment planning with strong documentation and recovery support to ensure smoother international care journeys.",
    corridorNotes: [
      "Families commonly request tertiary-center options for transplant, neuro, and cardiac pathways.",
      "Hospital comparison usually includes doctor credentials and expected inpatient timeline.",
      "Recovery accommodation and follow-up scheduling should be defined before travel.",
    ],
    conversionNote:
      "For Saudi patients, we focus on specialist credibility, pathway clarity, and family-oriented recovery planning.",
    faqs: [
      {
        question: "What is the first step for Saudi patients planning treatment in India?",
        answer:
          "Start with a full report submission so specialist teams can provide condition-specific guidance and timeline expectations.",
      },
      {
        question: "Do Saudi families typically compare multiple cities in India?",
        answer:
          "Yes, city comparison helps balance specialist access, treatment speed, and recovery convenience, with budget comparisons available in SAR.",
      },
    ],
  },
  canada: {
    narrative:
      "Canadian patients usually seek India treatment pathways when they need specialist availability, clear procedural planning, and practical timelines for complete care journeys.",
    corridorNotes: [
      "Canada-origin inquiries often prioritize full treatment-plus-recovery scheduling before travel.",
      "Orthopedic and fertility pathways frequently require multi-step planning and follow-up checkpoints.",
      "Medication continuity and remote follow-up plan should be finalized before return.",
    ],
    conversionNote:
      "For Canadian patients, we emphasize complete pathway clarity from diagnosis review to safe return-home planning.",
    faqs: [
      {
        question: "Why do Canadian patients compare India treatment options?",
        answer:
          "Many compare specialist access, scheduling speed for planned procedures, and end-to-end support for international care logistics.",
      },
      {
        question: "What details improve matching for Canadian patients?",
        answer:
          "Clinical summary, diagnostics, previous treatment history, and preferred travel month help narrow better hospital options, and cost planning can be discussed in CAD.",
      },
    ],
  },
  australia: {
    narrative:
      "Australia-based patients often assess India options for specialist breadth, coordinated private-care pathways, and full-journey treatment planning with predictable milestones.",
    corridorNotes: [
      "Australian families frequently compare city options by specialist depth and post-op follow-up support.",
      "Cardiac and oncology pathways typically require earlier case review and timeline mapping.",
      "Return travel should account for procedure-specific recovery and observation windows.",
    ],
    conversionNote:
      "For Australian patients, we prioritize specialist fit and realistic milestones for treatment, recovery, and remote follow-up.",
    faqs: [
      {
        question: "Can Australia patients pre-plan treatment in India before booking flights?",
        answer:
          "Yes, report-first planning helps align specialist team, treatment sequence, and expected stay duration before travel.",
      },
      {
        question: "Which pathways are common from Australia to India?",
        answer:
          "Orthopedic, cardiac, and oncology pathways are common due to specialist requirements and planning complexity, with estimate communication available in AUD.",
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
  return highVolumeCountries.map((item) => ({ country: item.slug }));
}

function buildLanguageAlternates() {
  const languages: Record<string, string> = {
    en: "https://www.treataxis.com/countries",
    "x-default": "https://www.treataxis.com/countries",
  };

  highVolumeCountries.forEach((item) => {
    languages[item.locale] = `https://www.treataxis.com/countries/${item.slug}`;
  });

  return languages;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params;
  const landing = highVolumeCountryBySlug[country];

  if (!landing) {
    return {};
  }

  return {
    title: `Treatment in India from ${landing.country}`,
    description: `${landing.country} patient guide: compare hospitals in India, treatment budget ranges, visa and stay planning, and specialist pathways before travel.`,
    alternates: {
      canonical: `/countries/${landing.slug}`,
      languages: buildLanguageAlternates(),
    },
    keywords: landing.intentKeywords,
    openGraph: {
      title: `Treatment in India from ${landing.country} | TreatAxis`,
      description: `${landing.country}-focused medical tourism guide for treatment in India with practical planning support.`,
      url: `https://www.treataxis.com/countries/${landing.slug}`,
      type: "website",
    },
  };
}

export default async function CountryPage({ params }: PageProps) {
  const { country } = await params;
  const landing = highVolumeCountryBySlug[country];

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
        url: `https://www.treataxis.com/countries/${landing.slug}`,
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
  const leadTreatment = linkedTreatments[0];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14 lg:px-10">
      <Script id={`country-schema-${landing.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">{landing.country}</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-slate-950 sm:text-6xl">
          Treatment in India from {landing.country}
        </h1>
        <p className="mt-5 text-base leading-8 text-[var(--muted)]">{landing.marketFocus}</p>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          Start with <Link href="/destinations/india" className="font-semibold text-[var(--brand)] hover:underline">India hospital comparison</Link>, then review <Link href="/treatments" className="font-semibold text-[var(--brand)] hover:underline">treatment pathways</Link> and <Link href="/blog" className="font-semibold text-[var(--brand)] hover:underline">patient planning blogs</Link> before requesting an estimate.
        </p>
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
          {leadTreatment ? (
            <p className="mt-3 text-sm leading-7 text-slate-700">
              A common next step is to review <Link href={`/treatments/${leadTreatment.slug}`} className="font-semibold text-[var(--brand)] hover:underline">{leadTreatment.name}</Link> and then read the related <Link href={`/blog/${leadTreatment.slug}`} className="font-semibold text-[var(--brand)] hover:underline">treatment guide</Link>.
            </p>
          ) : null}
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