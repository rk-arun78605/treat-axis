import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { PathwaySwitchCards } from "../components/pathway-switch-cards";
import { highVolumeCountries } from "../../lib/high-volume-country-content";

export const metadata: Metadata = {
  title: "Medical Tourism from US, UK, UAE, Saudi, Canada, and Australia",
  description:
    "Country-specific treatment-in-India pages for high-volume international markets with hospital comparison, budget clarity, and travel planning guidance.",
  alternates: {
    canonical: "/countries",
    languages: {
      en: "https://www.treataxis.com/countries",
      "x-default": "https://www.treataxis.com/countries",
    },
  },
  openGraph: {
    title: "Medical Tourism from High-Volume Countries to India | TreatAxis",
    description:
      "Dedicated country pages for US, UK, UAE, Saudi, Canada, and Australia patients planning treatment in India.",
    url: "https://www.treataxis.com/countries",
    type: "website",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      name: "High-Volume Country Corridors",
      url: "https://www.treataxis.com/countries",
      description:
        "Country-specific pages for patients from high-volume international markets planning treatment in India.",
    },
    {
      "@type": "ItemList",
      itemListElement: highVolumeCountries.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${item.country} to India medical tourism`,
        url: `https://www.treataxis.com/countries/${item.slug}`,
      })),
    },
  ],
};

export default function CountriesHubPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-10">
      <Script id="countries-hub-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">Global Corridors</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-slate-950 sm:text-6xl">
          Country-specific treatment abroad pages for high-volume markets
        </h1>
        <p className="mt-5 text-base leading-8 text-[var(--muted)]">
          Explore treatment-in-India planning pages built for patients from the US, UK, UAE, Saudi Arabia, Canada,
          and Australia. Each page focuses on specialist fit, travel readiness, and practical recovery planning.
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          Also see corridor pages for <Link href="/africa" className="font-semibold text-[var(--brand)] hover:underline">Africa and Maldives</Link>.
        </p>
      </header>

      <PathwaySwitchCards />

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {highVolumeCountries.map((item) => (
          <article key={item.slug} className="rounded-[1.4rem] border border-[var(--line)] bg-white/90 p-5">
            <h2 className="text-2xl font-semibold text-slate-900">{item.country}</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.marketFocus}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand)]">Top intent keywords</p>
            <ul className="mt-2 space-y-1 text-sm leading-7 text-slate-700">
              {item.intentKeywords.slice(0, 2).map((keyword) => (
                <li key={keyword}>• {keyword}</li>
              ))}
            </ul>
            <Link
              href={`/countries/${item.slug}`}
              className="mt-4 inline-flex rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark)]"
            >
              View {item.country} page
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}