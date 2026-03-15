import type { Metadata } from "next";
import Link from "next/link";
import { treatments } from "../../lib/seo-content";

export const metadata: Metadata = {
  title: "Medical Tourism Blog | Treatment Planning Guides",
  description:
    "Read practical treatment-planning guides for medical travel to India, including timelines, costs, recovery, and hospital selection tips.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Medical Tourism Blog | Treatment Planning Guides",
    description:
      "Read practical treatment-planning guides for medical travel to India, including timelines, costs, recovery, and hospital selection tips.",
    url: "https://www.treataxis.com/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medical Tourism Blog | Treatment Planning Guides",
    description:
      "Read practical treatment-planning guides for medical travel to India, including timelines, costs, recovery, and hospital selection tips.",
  },
};

export default function BlogIndexPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-10">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">Blog</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-slate-950 sm:text-6xl">
          Treatment blogs for patients planning care in India.
        </h1>
        <p className="mt-5 text-base leading-8 text-[var(--muted)]">
          Click a treatment to read practical planning guidance and request a personalized estimate.
        </p>
      </header>

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        {treatments.map((item) => (
          <article key={item.slug} className="rounded-[1.5rem] border border-[var(--line)] bg-white/80 p-6">
            <h2 className="text-2xl font-semibold text-slate-900">{item.name}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.summary}</p>
            <Link
              href={`/blog/${item.slug}`}
              className="mt-5 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Read blog
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
