import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { PathwaySwitchCards } from "../components/pathway-switch-cards";
import { africaCountries } from "../../lib/africa-content";

export const metadata: Metadata = {
  title: "Medical Tourism from Africa and Maldives to India",
  description:
    "Explore country-specific medical tourism pages for Africa and Maldives, and compare treatment in India by hospital, budget, and travel planning needs.",
  alternates: {
    canonical: "/africa",
    languages: {
      en: "https://www.treataxis.com/africa",
      "x-default": "https://www.treataxis.com/africa",
    },
  },
  openGraph: {
    title: "Medical Tourism from Africa and Maldives to India | TreatAxis",
    description:
      "Country-specific pages for Africa and Maldives with practical pathway, stay, and recovery guidance.",
    url: "https://www.treataxis.com/africa",
    type: "website",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      name: "Africa Country Pages",
      url: "https://www.treataxis.com/africa",
      description:
        "Country-specific pages for African patients planning medical treatment in India.",
    },
    {
      "@type": "ItemList",
      itemListElement: africaCountries.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${item.country} to India medical tourism`,
        url: `https://www.treataxis.com/africa/${item.slug}`,
      })),
    },
  ],
};

export default function AfricaHubPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-10">
      <Script id="africa-hub-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">Africa</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-slate-950 sm:text-6xl">
          Country-specific treatment abroad pages for Africa and Maldives
        </h1>
        <p className="mt-5 text-base leading-8 text-[var(--muted)]">
          Compare treatment pathways in India with country-specific planning guidance for hospitals, visa, stay,
          and post-treatment recovery.
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          Priority corridors: <Link href="/africa/ghana" className="font-semibold text-[var(--brand)] hover:underline">Ghana</Link>, <Link href="/africa/nigeria" className="font-semibold text-[var(--brand)] hover:underline">Nigeria</Link>, <Link href="/africa/kenya" className="font-semibold text-[var(--brand)] hover:underline">Kenya</Link>, <Link href="/africa/ethiopia" className="font-semibold text-[var(--brand)] hover:underline">Ethiopia</Link>, <Link href="/africa/egypt" className="font-semibold text-[var(--brand)] hover:underline">Egypt</Link>, and <Link href="/africa/maldives" className="font-semibold text-[var(--brand)] hover:underline">Maldives</Link>.
        </p>
      </header>

      <PathwaySwitchCards />

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {africaCountries.map((item) => (
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
              href={`/africa/${item.slug}`}
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
