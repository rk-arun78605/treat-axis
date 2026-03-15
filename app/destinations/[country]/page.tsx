import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { FeaturedHospitalsIndia } from "../../components/featured-hospitals-india";
import { HospitalsInitialScroll } from "../../components/hospitals-initial-scroll";
import { PathwaySwitchCards } from "../../components/pathway-switch-cards";
import { indiaFeaturedHospitals } from "../../../lib/featured-hospitals";
import { destinationByCountrySlug, destinations, treatments } from "../../../lib/seo-content";

type Params = {
  country: string;
};

type PageProps = {
  params: Promise<Params>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams(): Params[] {
  return destinations.map((item) => ({ country: item.slug }));
}

export async function generateMetadata({ params }: Pick<PageProps, "params">): Promise<Metadata> {
  const { country } = await params;
  const destination = destinationByCountrySlug[country];

  if (!destination) {
    return {};
  }

  if (country === "india") {
    return {
      title: "Featured Hospitals in India",
      description:
        "Explore featured hospitals in India by city, compare specialties and accreditations, and research treatment fit before checking price.",
      alternates: {
        canonical: "/destinations/india",
      },
      openGraph: {
        title: "Featured Hospitals in India | TreatAxis",
        description:
          "Compare hospital options in Delhi, Bangalore, and Kochi with treatment-specific research.",
        url: "https://www.treataxis.com/destinations/india",
        type: "website",
      },
    };
  }

  return {
    title: `${destination.country} Medical Tourism`,
    description: destination.seoSummary,
    alternates: {
      canonical: `/destinations/${destination.slug}`,
    },
  };
}

export default async function DestinationCountryPage({ params, searchParams }: PageProps) {
  const { country } = await params;
  const resolvedSearchParams = await searchParams;
  const treatmentParam = resolvedSearchParams.treatment;
  const initialTreatment = Array.isArray(treatmentParam)
    ? treatmentParam[0] || ""
    : treatmentParam || "";
  const destination = destinationByCountrySlug[country];
  const isIndia = country === "india";

  if (!destination) {
    notFound();
  }

  if (isIndia) {
    const relatedTreatmentLinks = treatments.slice(0, 6);

    const treatmentSeoTitle = initialTreatment
      ? `${initialTreatment} in India: top hospitals, treatment cost, doctor teams, and city comparison`
      : "Top hospitals in India by city, treatment cost range, doctor teams, and specialties";

    const treatmentSeoDescription = initialTreatment
      ? `Compare ${initialTreatment} in India across Delhi, Bangalore, and Kochi. Explore hospital ratings, accreditations, specialist teams, and treatment duration before checking price.`
      : "Compare hospitals in India by city with ratings, accreditations, specialties, and treatment pathways for medical tourism planning.";

    const seoKeywords = initialTreatment
      ? [
          `${initialTreatment.toLowerCase()} in india`,
          `${initialTreatment.toLowerCase()} cost in india`,
          `${initialTreatment.toLowerCase()} hospitals in delhi`,
          `${initialTreatment.toLowerCase()} hospitals in bangalore`,
          `${initialTreatment.toLowerCase()} hospitals in kochi`,
        ]
      : [
          "best hospitals in india for international patients",
          "medical tourism hospitals in india",
          "india hospital ratings and accreditations",
        ];

    const breadcrumbItems = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.treataxis.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Treatments",
        item: "https://www.treataxis.com/treatments",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "India Hospitals",
        item: "https://www.treataxis.com/destinations/india",
      },
    ];

    if (initialTreatment) {
      breadcrumbItems.splice(2, 0, {
        "@type": "ListItem",
        position: 3,
        name: initialTreatment,
        item: `https://www.treataxis.com/destinations/india?treatment=${encodeURIComponent(initialTreatment)}`,
      });

      breadcrumbItems[3] = {
        "@type": "ListItem",
        position: 4,
        name: "India Hospitals",
        item: "https://www.treataxis.com/destinations/india",
      };
    }

    const indiaSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          name: "Featured Hospitals in India",
          url: "https://www.treataxis.com/destinations/india",
          description: treatmentSeoDescription,
        },
        {
          "@type": "ItemList",
          itemListElement: indiaFeaturedHospitals.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
          })),
        },
        {
          "@type": "WebPage",
          name: treatmentSeoTitle,
          keywords: seoKeywords.join(", "),
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbItems,
        },
      ],
    };

    return (
      <main className="mx-auto w-full max-w-[88rem] px-4 py-8 lg:px-8">
        <HospitalsInitialScroll />
        <Script
          id="india-featured-hospitals-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(indiaSchema) }}
        />
        <section className="mb-5 rounded-xl border border-[var(--line)] bg-white/85 p-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
            <Link href="/" className="transition hover:text-[var(--brand)]">Home</Link>
            <span>/</span>
            <Link href="/treatments" className="transition hover:text-[var(--brand)]">Treatments</Link>
            {initialTreatment ? (
              <>
                <span>/</span>
                <span className="text-slate-800">{initialTreatment}</span>
              </>
            ) : null}
            <span>/</span>
            <span className="text-slate-900">India Hospitals</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={initialTreatment ? `/treatments?focus=${encodeURIComponent(initialTreatment)}` : "/treatments"}
              className="inline-flex rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              Back to Treatments
            </Link>
            <Link
              href="/destinations/india"
              className="inline-flex rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              All Cities and Hospitals
            </Link>
          </div>
        </section>
        <section className="mb-5 rounded-xl border border-[var(--line)] bg-[linear-gradient(160deg,#ffffff_0%,#eef7ff_100%)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--brand)]">SEO treatment guide</p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight text-slate-900">{treatmentSeoTitle}</h1>
          <p className="mt-2 text-sm leading-7 text-slate-700">{treatmentSeoDescription}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {seoKeywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {keyword}
              </span>
            ))}
          </div>
        </section>
        <PathwaySwitchCards />
        <FeaturedHospitalsIndia initialTreatment={initialTreatment} />

        <section className="mt-6 rounded-xl border border-[var(--line)] bg-white/85 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">Related treatment clusters</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Explore related treatment and blog pages</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <article className="rounded-xl border border-[var(--line)] bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">Treatment pages</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {relatedTreatmentLinks.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/treatments/${item.slug}`}
                    className="rounded-full border border-[var(--line)] px-3 py-2 text-xs font-semibold text-slate-800 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </article>
            <article className="rounded-xl border border-[var(--line)] bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">Blog guides</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {relatedTreatmentLinks.map((item) => (
                  <Link
                    key={`blog-${item.slug}`}
                    href={`/blog/${item.slug}`}
                    className="rounded-full border border-[var(--line)] px-3 py-2 text-xs font-semibold text-slate-800 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                  >
                    {item.name} blog
                  </Link>
                ))}
              </div>
            </article>
          </div>
        </section>
      </main>
    );
  }

  const relatedTreatmentLinks = treatments.slice(0, 4);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-10">
      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
          Country page
        </p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-slate-950 sm:text-6xl">
          {destination.country} medical tourism guide.
        </h1>
        <p className="mt-5 text-base leading-8 text-[var(--muted)]">{destination.seoSummary}</p>
      </header>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <article className="rounded-[1.5rem] border border-[var(--line)] bg-white/80 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Why patients choose {destination.country}</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-800">
            {destination.whyChoose.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-[1.5rem] border border-[var(--line)] bg-slate-950 p-6 text-white">
          <p className="text-sm uppercase tracking-[0.26em] text-amber-300">Lead conversion</p>
          <h2 className="mt-3 text-2xl font-semibold">Ready to plan treatment in {destination.country}?</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Move from destination research into a structured inquiry with treatment, budget, and timeline details.
          </p>
          <Link
            href="/#inquiry-form"
            className="mt-6 inline-flex rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            Start inquiry
          </Link>
        </article>
      </section>

      <section className="mt-10 rounded-[1.5rem] border border-[var(--line)] bg-white/80 p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Top cities in {destination.country}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {destination.cities.map((city) => (
            <article key={city.slug} className="rounded-2xl border border-[var(--line)] bg-white p-5">
              <h3 className="text-xl font-semibold text-slate-900">{city.city}</h3>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-[var(--muted)]">
                {city.highlights.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
              <Link
                href={`/destinations/${destination.slug}/${city.slug}`}
                className="mt-5 inline-flex rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                View city page
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[1.5rem] border border-[var(--line)] bg-white/80 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">Related pathways</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Popular treatment and blog links</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-[var(--line)] bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Treatment pages</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedTreatmentLinks.map((item) => (
                <Link
                  key={`treat-${item.slug}`}
                  href={`/treatments/${item.slug}`}
                  className="rounded-full border border-[var(--line)] px-3 py-2 text-xs font-semibold text-slate-800 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-[var(--line)] bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Blog guides</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedTreatmentLinks.map((item) => (
                <Link
                  key={`blog-guide-${item.slug}`}
                  href={`/blog/${item.slug}`}
                  className="rounded-full border border-[var(--line)] px-3 py-2 text-xs font-semibold text-slate-800 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                >
                  {item.name} blog
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>

      <PathwaySwitchCards />
    </main>
  );
}
