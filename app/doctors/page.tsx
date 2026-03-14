import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { DoctorsInitialScroll } from "../components/doctors-initial-scroll";
import { TreatmentPriceModal } from "../components/treatment-price-modal";
import { indiaFeaturedHospitals } from "../../lib/featured-hospitals";
import { treatments } from "../../lib/seo-content";
import { PathwaySwitchCards } from "../components/pathway-switch-cards";

type DoctorListing = {
  name: string;
  specialty: string;
  hospital: string;
  city: string;
  hospitalRating: number;
  treatment: string;
};

function inferSpecialtyByTreatment(treatmentName: string) {
  const normalized = treatmentName.toLowerCase();

  if (normalized.includes("cardiac") || normalized.includes("heart")) {
    return "Cardiac Surgeon / Interventional Cardiologist";
  }

  if (normalized.includes("orthopedic") || normalized.includes("spine") || normalized.includes("joint")) {
    return "Orthopedic and Spine Surgeon";
  }

  if (normalized.includes("ivf") || normalized.includes("fertility")) {
    return "Fertility Specialist and IVF Consultant";
  }

  if (normalized.includes("dental")) {
    return "Implant Dentist and Oral Surgeon";
  }

  if (normalized.includes("kidney") || normalized.includes("renal")) {
    return "Transplant Nephrologist and Transplant Surgeon";
  }

  if (normalized.includes("liver")) {
    return "Liver Transplant Surgeon and Hepatologist";
  }

  if (normalized.includes("neuro") || normalized.includes("brain")) {
    return "Neurosurgeon and Neuro Specialist";
  }

  if (normalized.includes("oncology") || normalized.includes("cancer")) {
    return "Medical and Surgical Oncologist";
  }

  if (normalized.includes("urology")) {
    return "Urology Surgeon";
  }

  if (normalized.includes("ent")) {
    return "ENT Surgeon";
  }

  if (normalized.includes("ophthalmology") || normalized.includes("eye")) {
    return "Ophthalmology Surgeon";
  }

  return "Senior Specialist Consultant";
}

function buildDoctorListings(): DoctorListing[] {
  const listings: DoctorListing[] = [];

  treatments.forEach((treatment) => {
    const specialty = inferSpecialtyByTreatment(treatment.name);

    indiaFeaturedHospitals.slice(0, 6).forEach((hospital, index) => {
      listings.push({
        name: `${specialty} - ${hospital.city} Team ${index + 1}`,
        specialty,
        hospital: hospital.name,
        city: hospital.city,
        hospitalRating: hospital.rating,
        treatment: treatment.name,
      });
    });
  });

  return listings;
}

const doctorListings = buildDoctorListings();

export const metadata: Metadata = {
  title: "Doctors by Treatment and City",
  description:
    "Browse treatment-focused specialist teams by city and hospital, then request a consultation directly in one step.",
  alternates: { canonical: "/doctors" },
};

const doctorsSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      name: "Doctors by Treatment and City",
      url: "https://www.treataxis.com/doctors",
      description:
        "Doctor discovery page for treatment-specific specialist search by hospital and city.",
    },
    {
      "@type": "ItemList",
      itemListElement: doctorListings.slice(0, 30).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${item.specialty} - ${item.hospital}`,
      })),
    },
  ],
};

export default function DoctorsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-10">
      <DoctorsInitialScroll />
      <Script
        id="doctors-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(doctorsSchema) }}
      />

      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">Doctors</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-slate-950 sm:text-6xl">
          Doctors by illness, hospital, and city
        </h1>
        <p className="mt-5 text-base leading-8 text-[var(--muted)]">
          Browse treatment-focused specialist suggestions by city and hospital context, then request direct consultation support through TreatAxis.
        </p>
      </header>

      <PathwaySwitchCards />

      <section className="mt-8 flex flex-wrap gap-2">
        {treatments.map((item) => (
          <a
            key={item.slug}
            href={`#${item.slug}`}
            className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
          >
            {item.name}
          </a>
        ))}
      </section>

      <section className="mt-8 space-y-8">
        {treatments.map((treatment) => {
          const items = doctorListings.filter((entry) => entry.treatment === treatment.name).slice(0, 6);

          return (
            <article key={treatment.slug} id={treatment.slug} className="rounded-[1.5rem] border border-[var(--line)] bg-white/85 p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">{treatment.name}</h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{treatment.summary}</p>
                </div>
                <Link
                  href={`/destinations/india?treatment=${encodeURIComponent(treatment.name)}`}
                  className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold !text-white transition hover:bg-slate-800"
                  style={{ color: "#ffffff" }}
                >
                  View hospitals for this treatment
                </Link>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((doctor) => (
                  <article key={`${doctor.treatment}-${doctor.hospital}-${doctor.name}`} className="rounded-xl border border-[var(--line)] bg-white p-4">
                    <p className="text-sm font-semibold text-slate-900">{doctor.name}</p>
                    <p className="mt-1 text-sm text-slate-700">{doctor.specialty}</p>
                    <p className="mt-2 text-sm text-slate-700">{doctor.hospital}</p>
                    <p className="text-xs text-slate-500">{doctor.city}, India</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
                      Hospital rating {doctor.hospitalRating.toFixed(1)}
                    </p>
                    <div className="mt-3">
                      <TreatmentPriceModal
                        defaultTreatment={doctor.treatment}
                        buttonLabel="Click for consultation"
                        buttonClassName="inline-flex rounded-full border border-[var(--line)] bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                        formCopy={{
                          kicker: "Consultation",
                          title: "Share 4 details to book consultation support",
                          description:
                            "Submit your details and our team will connect you with treatment-focused consultation options.",
                          submitLabel: "Request consultation",
                          inquiryMessage: `Doctor consultation request for ${doctor.treatment}.`,
                        }}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
