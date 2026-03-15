import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { africaCountries } from "../lib/africa-content";
import { GlobalFloatingCta } from "./components/global-floating-cta";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteName = "TreatAxis";
const siteUrl = "https://www.treataxis.com";
const slogan = "Plan Treatment Abroad With Confidence";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/treataxis-logo.svg",
    shortcut: "/treataxis-logo.svg",
    apple: "/treataxis-logo.svg",
  },
  title: {
    default: `${siteName} | ${slogan}`,
    template: `%s | ${siteName}`,
  },
  description:
    "TreatAxis helps international patients plan treatment abroad with confidence through trusted care pathways, structured medical travel guidance, and a direct inquiry process.",
  keywords: [
    "medical tourism",
    "treatment abroad",
    "international patient services",
    "medical travel planner",
    "healthcare abroad",
    "patient inquiry platform",
    "plan treatment abroad",
  ],
  applicationName: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: `${siteName} | ${slogan}`,
    description:
      "Compare treatment pathways, understand timelines, and request a personalized care plan through TreatAxis.",
    siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | ${slogan}`,
    description:
      "Explore treatment abroad with a structured patient inquiry flow and a conversion-focused medical tourism homepage.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "healthcare",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${cormorant.variable} antialiased`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GJ4X5Y1YJE"
          strategy="afterInteractive"
        />
        <Script id="ga-gtag" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-GJ4X5Y1YJE');`}
        </Script>
        <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-white/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3 lg:px-10">
            <Link
              href="/"
              aria-label="Go to TreatAxis homepage"
              className="inline-flex items-center gap-3 rounded-full px-2 py-1 transition hover:opacity-90"
            >
              <Image src="/treataxis-logo.svg" alt="TreatAxis" width={110} height={110} priority />
              <span className="text-base font-semibold uppercase tracking-[0.18em] text-slate-900">
                TreatAxis
              </span>
            </Link>
            <nav className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-700">
              <Link href="/#why-treataxis" className="transition hover:text-[var(--brand)]">Why TreatAxis</Link>
              <Link href="/treatments" className="transition hover:text-[var(--brand)]">Treatments</Link>
              <Link href="/doctors" className="transition hover:text-[var(--brand)]">Doctors</Link>
              <div className="group relative">
                <Link href="/africa" className="inline-flex items-center gap-1 transition hover:text-[var(--brand)]">
                  Africa
                  <span aria-hidden="true" className="text-xs">▾</span>
                </Link>
                <div className="pointer-events-none absolute left-0 top-full z-50 mt-2 w-56 rounded-xl border border-[var(--line)] bg-white/95 p-2 opacity-0 shadow-[0_18px_40px_rgba(15,23,42,0.14)] transition group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                  {africaCountries.map((country) => (
                    <Link
                      key={country.slug}
                      href={`/africa/${country.slug}`}
                      className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[var(--brand)]"
                    >
                      {country.country}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/destinations" className="transition hover:text-[var(--brand)]">Destinations</Link>
              <Link href="/#process" className="transition hover:text-[var(--brand)]">How it works</Link>
              <Link href="/#faq" className="transition hover:text-[var(--brand)]">FAQ</Link>
            </nav>
          </div>
        </header>
        {children}
        <section className="mx-auto mt-12 w-full max-w-7xl px-6 lg:px-10">
          <div className="rounded-[1.8rem] border border-[var(--line)] bg-[linear-gradient(140deg,#0f766e_0%,#0b5f58_55%,#0f172a_100%)] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.2)] lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Why Choose India for Medical Tourism?</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <article className="rounded-xl border border-white/15 bg-white/10 p-4">
                <p className="text-3xl font-bold text-white">60-80%</p>
                <p className="mt-2 text-sm text-slate-100">Cost savings compared to USA/UK</p>
              </article>
              <article className="rounded-xl border border-white/15 bg-white/10 p-4">
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="mt-2 text-sm text-slate-100">JCI accredited hospitals</p>
              </article>
              <article className="rounded-xl border border-white/15 bg-white/10 p-4">
                <p className="text-3xl font-bold text-white">24/7</p>
                <p className="mt-2 text-sm text-slate-100">Medical coordinator support</p>
              </article>
              <article className="rounded-xl border border-white/15 bg-white/10 p-4">
                <p className="text-3xl font-bold text-white">0</p>
                <p className="mt-2 text-sm text-slate-100">Waiting time for most procedures</p>
              </article>
            </div>
          </div>
        </section>
        <footer className="mx-auto w-full max-w-7xl px-6 py-6 lg:px-10">
          <p className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-center text-sm font-semibold text-slate-700">
            © 2026 Medical Tourism India. All rights reserved.
          </p>
        </footer>
        <GlobalFloatingCta />
      </body>
    </html>
  );
}
