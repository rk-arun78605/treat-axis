import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TreatmentBlogCtaForm } from "../../components/treatment-blog-cta-form";
import { treatmentBySlug, treatments } from "../../../lib/seo-content";

type Params = {
  slug: string;
};

type PageProps = {
  params: Promise<Params>;
};

const slugAliases: Record<string, string> = {
  "cardiac-care": "cardiac-care-abroad",
  "orthopedic-surgery": "orthopedic-surgery-abroad",
  "ivf-treatment": "ivf-fertility-treatment-abroad",
  "dental-implants": "dental-implants-abroad",
};

function resolveSlug(slug: string) {
  return treatmentBySlug[slug] ? slug : slugAliases[slug] || "";
}

export function generateStaticParams(): Params[] {
  return treatments.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolveSlug(slug);
  const treatment = treatmentBySlug[resolved];

  if (!treatment) {
    return {};
  }

  return {
    title: `${treatment.name} Guide | Medical Travel Blog`,
    description: treatment.summary,
    alternates: {
      canonical: `/blog/${treatment.slug}`,
    },
    keywords: [
      treatment.name,
      "medical tourism India",
      "treatment abroad",
      "international patient guide",
      "medical travel planning",
    ],
    openGraph: {
      title: `${treatment.name} | TreatAxis Blog`,
      description: treatment.summary,
      url: `https://www.treataxis.com/blog/${treatment.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${treatment.name} Guide | Medical Travel Blog`,
      description: treatment.summary,
    },
  };
}

export default async function TreatmentBlogPage({ params }: PageProps) {
  const { slug } = await params;
  const resolved = resolveSlug(slug);
  const treatment = treatmentBySlug[resolved];

  if (!treatment) {
    notFound();
  }

  const publishedDate = "2026-03-01";
  const modifiedDate = new Date().toISOString();
  const articleSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: `${treatment.name} Guide`,
        description: treatment.summary,
        datePublished: publishedDate,
        dateModified: modifiedDate,
        mainEntityOfPage: `https://www.treataxis.com/blog/${treatment.slug}`,
        author: {
          "@type": "Organization",
          name: "TreatAxis Editorial Team",
        },
        publisher: {
          "@type": "Organization",
          name: "TreatAxis",
          logo: {
            "@type": "ImageObject",
            url: "https://www.treataxis.com/treataxis-logo.svg",
          },
        },
        articleSection: "Medical Tourism",
      },
      {
        "@type": "FAQPage",
        mainEntity: treatment.faqs.map((item) => ({
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

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-10">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      ></script>
      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">Treatment Blog</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-slate-950 sm:text-6xl">{treatment.name}</h1>
        <p className="mt-6 text-base leading-8 text-[var(--muted)]">{treatment.summary}</p>
      </header>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <article className="rounded-[1.6rem] border border-[var(--line)] bg-white/80 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Who should consider this pathway</h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{treatment.candidateProfile}</p>
          <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-800">
            {treatment.keyBenefits.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-[1.6rem] border border-[var(--line)] bg-white/80 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Planning timeline</h2>
          <ol className="mt-6 space-y-3 text-sm leading-7 text-slate-800">
            {treatment.timeline.map((item, index) => (
              <li key={item}>
                {index + 1}. {item}
              </li>
            ))}
          </ol>
        </article>
      </section>

      <section className="mt-10">
        <TreatmentBlogCtaForm treatmentName={treatment.name} />
      </section>

      <section className="mt-10 rounded-[1.6rem] border border-[var(--line)] bg-white/80 p-6">
        <h2 className="text-2xl font-semibold text-slate-900">FAQs</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {treatment.faqs.map((item) => (
            <article key={item.question} className="rounded-2xl border border-[var(--line)] bg-white p-4">
              <h3 className="text-lg font-semibold text-slate-900">{item.question}</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.answer}</p>
            </article>
          ))}
        </div>
        <Link
          href="/blog"
          className="mt-6 inline-flex rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
        >
          Explore more treatment blogs
        </Link>
      </section>
    </main>
  );
}
