import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { destinations } from "../../../../lib/seo-content";

type Params = {
  country: string;
  city: string;
};

type PageProps = {
  params: Promise<Params>;
};

export function generateStaticParams(): Params[] {
  return destinations.flatMap((country) =>
    country.cities.map((city) => ({ country: country.slug, city: city.slug })),
  );
}

function getCity(params: Params) {
  const country = destinations.find((item) => item.slug === params.country);
  const city = country?.cities.find((item) => item.slug === params.city);
  return { country, city };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const { country, city } = getCity(resolved);

  if (!country || !city) {
    return {};
  }

  return {
    title: `${city.city} Medical Tourism`,
    description: `${city.city}, ${country.country} medical tourism page with treatment fit highlights and inquiry pathways for planned care abroad.`,
    alternates: {
      canonical: `/destinations/${country.slug}/${city.slug}`,
    },
  };
}

export default async function DestinationCityPage({ params }: PageProps) {
  const resolved = await params;
  const { country, city } = getCity(resolved);

  if (!country || !city) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-10">
      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
          City page
        </p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-slate-950 sm:text-6xl">
          {city.city}, {country.country} treatment abroad guide.
        </h1>
        <p className="mt-5 text-base leading-8 text-[var(--muted)]">
          Built for users comparing city-level care options before submitting a medical tourism inquiry.
        </p>
      </header>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <article className="rounded-[1.5rem] border border-[var(--line)] bg-white/80 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Why {city.city} appears in treatment searches</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-800">
            {city.highlights.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-[1.5rem] border border-[var(--line)] bg-white/80 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Common treatment fit in {city.city}</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-800">
            {city.bestFor.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <Link
            href="/#inquiry-form"
            className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Request treatment planning support
          </Link>
        </article>
      </section>

      <section className="mt-10 rounded-[1.5rem] border border-[var(--line)] bg-slate-950 p-6 text-white">
        <p className="text-sm uppercase tracking-[0.26em] text-amber-300">Internal linking</p>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Use city pages to link treatment pages and country hubs. This improves crawl depth and creates stronger topical clusters for SEO.
        </p>
        <Link
          href={`/destinations/${country.slug}`}
          className="mt-5 inline-flex rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
        >
          Back to {country.country}
        </Link>
      </section>
    </main>
  );
}
