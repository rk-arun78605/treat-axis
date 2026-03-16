import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TreatmentPriceModal } from "../../components/treatment-price-modal";
import { TreatmentInlineAi } from "../../components/treatment-inline-ai";
import { destinationByCountrySlug, treatmentBySlug, treatments } from "../../../lib/seo-content";

type Params = {
  slug: string;
};

type PageProps = {
  params: Promise<Params>;
};

type TreatmentEducation = {
  illnessOverview: string;
  illnessEducation: string[];
  hospitalGuide: string[];
  doctorGuide: Array<{ role: string; detail: string }>;
  durationGuide: Array<{ stage: string; duration: string; detail: string }>;
  hopeNote: string;
};

type BudgetGuide = {
  totalRangeUsd: string;
  cityEstimate: Array<{ city: string; range: string }>;
  includes: string[];
  shouldPlanFor: string[];
};

const treatmentEducationBySlug: Record<string, TreatmentEducation> = {
  "cardiac-care-abroad": {
    illnessOverview:
      "Cardiac illness can range from blocked arteries to valve and rhythm issues. Many patients improve significantly when diagnosis, procedure timing, and recovery planning are done in a structured way.",
    illnessEducation: [
      "Chest discomfort on effort, unusual tiredness, breathlessness, or swelling should be evaluated early.",
      "Planned treatment pathways are often safer because reports and risk factors are reviewed before travel.",
      "Family confidence improves when expected milestones are explained before admission and before discharge.",
    ],
    hospitalGuide: [
      "Choose hospitals with dedicated cardiac ICU, emergency backup, and international patient coordination.",
      "Check whether they provide integrated cardiology, cardiac surgery, anesthesia, and rehab support.",
      "Ask for transparent estimates covering procedure, stay duration, medicines, and follow-up checks.",
    ],
    doctorGuide: [
      {
        role: "Interventional cardiologist",
        detail: "Assesses angiography findings and decides if catheter-based procedure is suitable.",
      },
      {
        role: "Cardiac surgeon",
        detail: "Plans bypass or valve surgery when open surgery pathway is clinically needed.",
      },
      {
        role: "Cardiac anesthetist and ICU team",
        detail: "Manages intraoperative safety and immediate post-procedure stabilization.",
      },
    ],
    durationGuide: [
      {
        stage: "Pre-travel evaluation",
        duration: "2-5 days",
        detail: "Report review, risk assessment, and treatment recommendation before travel confirmation.",
      },
      {
        stage: "Hospital treatment window",
        duration: "4-10 days",
        detail: "Depends on procedure type, ICU requirement, and individual response.",
      },
      {
        stage: "Recovery and follow-up",
        duration: "7-21 days",
        detail: "Includes monitored recovery, medicine planning, and discharge fitness review before return.",
      },
    ],
    hopeNote:
      "With the right specialist team and good follow-up planning, many cardiac patients regain functional independence and return to routine life with stronger confidence.",
  },
  "orthopedic-surgery-abroad": {
    illnessOverview:
      "Orthopedic illness includes joint wear, spine compression, and mobility-limiting pain that affects daily function. Planned surgery plus rehab can improve movement and quality of life.",
    illnessEducation: [
      "Persistent pain, stiffness, instability, or nerve symptoms often need specialist imaging review.",
      "Treatment success is strongly linked to rehab discipline after surgery.",
      "Choosing procedure timing around work and family support improves recovery comfort.",
    ],
    hospitalGuide: [
      "Prefer hospitals with orthopedic ICU backup, infection control, and strong physiotherapy units.",
      "Confirm implant quality standards and rehabilitation protocol before committing.",
      "Ask about assisted mobility support after discharge and remote check-in plans.",
    ],
    doctorGuide: [
      { role: "Orthopedic surgeon", detail: "Leads joint, spine, or trauma procedure planning." },
      { role: "Rehab specialist", detail: "Designs mobility milestones and functional recovery targets." },
      { role: "Pain management team", detail: "Improves early recovery tolerance and sleep quality." },
    ],
    durationGuide: [
      { stage: "Pre-op review", duration: "2-4 days", detail: "Imaging review and surgery readiness assessment." },
      { stage: "Surgery and stay", duration: "3-8 days", detail: "Varies by procedure and age profile." },
      { stage: "Initial rehab", duration: "10-21 days", detail: "Guided exercises and follow-up progression." },
    ],
    hopeNote:
      "A structured procedure plus guided rehab can help many patients move with less pain and return to independent routines.",
  },
  "ivf-fertility-treatment-abroad": {
    illnessOverview:
      "Fertility challenges can be medical, hormonal, age-related, or unexplained. A well-coordinated IVF pathway provides clarity at each step and reduces emotional uncertainty.",
    illnessEducation: [
      "Cycle planning, hormone tracking, and lab quality all influence treatment outcomes.",
      "Not every cycle is identical; transparent counseling helps set realistic expectations.",
      "Psychological support and timeline flexibility improve treatment resilience.",
    ],
    hospitalGuide: [
      "Choose centers with strong embryology labs and clear success reporting methods.",
      "Confirm legal and documentation requirements before travel.",
      "Check communication style and continuity of support after return.",
    ],
    doctorGuide: [
      { role: "Fertility specialist", detail: "Defines stimulation and transfer strategy." },
      { role: "Embryologist", detail: "Handles embryo development and lab quality control." },
      { role: "Fertility counselor", detail: "Supports emotional and decision readiness." },
    ],
    durationGuide: [
      { stage: "Pre-cycle preparation", duration: "1-3 weeks", detail: "Testing, protocol selection, and timeline alignment." },
      { stage: "Treatment cycle", duration: "10-18 days", detail: "Stimulation, retrieval, and transfer window." },
      { stage: "Post-cycle follow-up", duration: "2-6 weeks", detail: "Monitoring and next-step planning." },
    ],
    hopeNote:
      "With clear guidance and supportive counseling, many families feel more in control and hopeful through each fertility step.",
  },
  "dental-implants-abroad": {
    illnessOverview:
      "Dental implant pathways are used for missing teeth, bite instability, and restorative function. Good diagnostics and staged planning improve comfort and long-term success.",
    illnessEducation: [
      "Bone quality and oral hygiene are key to implant predictability.",
      "Some patients complete treatment in one trip, while others need staged visits.",
      "Early planning avoids rushed decisions and reduces revision risk.",
    ],
    hospitalGuide: [
      "Choose centers with digital diagnostics and implant planning systems.",
      "Ask for transparent staging details including healing windows.",
      "Check restoration follow-up process before final commitment.",
    ],
    doctorGuide: [
      { role: "Implant dentist", detail: "Plans implant placement and load strategy." },
      { role: "Oral surgeon", detail: "Handles bone grafting or complex surgical needs." },
      { role: "Prosthodontist", detail: "Completes functional and esthetic restoration." },
    ],
    durationGuide: [
      { stage: "Diagnostic phase", duration: "1-3 days", detail: "Imaging and treatment staging." },
      { stage: "Implant phase", duration: "2-7 days", detail: "Placement and early healing monitoring." },
      { stage: "Restoration follow-up", duration: "2-12 weeks", detail: "Final prosthetic fit based on healing response." },
    ],
    hopeNote:
      "When diagnosis and staging are done carefully, many patients recover oral function and confidence in speaking and eating.",
  },
  "kidney-transplant-abroad": {
    illnessOverview:
      "A kidney transplant is a surgery where a healthy donor kidney is placed into a person with severe kidney failure. For many eligible patients, it can provide a better quality of life than long-term dialysis.",
    illnessEducation: [
      "Kidney failure is often linked to chronic kidney disease, diabetes, high blood pressure, or inherited conditions such as polycystic kidney disease.",
      "When both kidneys fail, waste and fluid build up in the body, and dialysis may be needed while transplant planning continues.",
      "Donor source can be living donor or deceased donor, based on medical and legal eligibility pathways.",
      "Most patients can live well with one healthy kidney, which is why living donation is medically possible in selected cases.",
    ],
    hospitalGuide: [
      "Choose a hospital with a dedicated transplant unit, transplant ICU, and 24x7 nephrology and critical care support.",
      "Confirm that donor and recipient legal documentation support is available through a formal transplant coordination desk.",
      "Ask for package clarity: surgery, ICU days, medicine estimates, follow-up labs, and emergency coverage window.",
    ],
    doctorGuide: [
      {
        role: "Nephrologist",
        detail: "Leads recipient evaluation, dialysis optimization, and post-transplant kidney function monitoring.",
      },
      {
        role: "Transplant surgeon",
        detail: "Performs donor kidney implantation and vascular connection to recipient blood vessels.",
      },
      {
        role: "Transplant immunology and pharmacy team",
        detail: "Guides immunosuppressive medicines such as tacrolimus, cyclosporine, and mycophenolate-based protocols.",
      },
    ],
    durationGuide: [
      {
        stage: "Evaluation and matching",
        duration: "1-3 weeks",
        detail: "Recipient workup, donor compatibility tests, and legal documentation review.",
      },
      {
        stage: "Surgery and hospital phase",
        duration: "7-14 days",
        detail: "Transplant surgery often takes around 3-4 hours, followed by ICU and monitored ward recovery.",
      },
      {
        stage: "Early post-transplant follow-up",
        duration: "3-6 weeks",
        detail: "Frequent lab checks, dose adjustments, and infection/rejection surveillance before return travel.",
      },
    ],
    hopeNote:
      "With the right transplant team, disciplined medicines, and regular follow-up, many kidney transplant patients regain energy, improve daily living, and move toward a more stable long-term recovery path.",
  },
};

const budgetGuideBySlug: Record<string, BudgetGuide> = {
  "cardiac-care-abroad": {
    totalRangeUsd: "$4,500 - $12,000",
    cityEstimate: [
      { city: "Delhi NCR", range: "$4,800 - $11,500" },
      { city: "Chennai", range: "$4,500 - $10,500" },
      { city: "Bengaluru", range: "$5,200 - $12,000" },
    ],
    includes: [
      "Initial specialist review and procedure planning",
      "Procedure/surgery and inpatient care window",
      "Basic medicines and discharge summary",
    ],
    shouldPlanFor: [
      "Pre-travel repeat diagnostics where needed",
      "Hotel and local commute near hospital",
      "Extended stay in case recovery needs extra observation",
    ],
  },
  "orthopedic-surgery-abroad": {
    totalRangeUsd: "$5,000 - $13,500",
    cityEstimate: [
      { city: "Delhi NCR", range: "$5,500 - $13,500" },
      { city: "Hyderabad", range: "$5,000 - $12,500" },
      { city: "Ahmedabad", range: "$4,800 - $11,800" },
    ],
    includes: [
      "Surgical package and routine hospital stay",
      "Inpatient physiotherapy initiation",
      "Discharge medicines for early phase recovery",
    ],
    shouldPlanFor: [
      "Implant category or premium device upgrades",
      "Post-discharge assisted mobility needs",
      "Additional rehabilitation sessions before flying back",
    ],
  },
  "ivf-fertility-treatment-abroad": {
    totalRangeUsd: "$2,800 - $7,500 per cycle",
    cityEstimate: [
      { city: "Delhi NCR", range: "$3,200 - $7,500" },
      { city: "Mumbai", range: "$3,500 - $8,200" },
      { city: "Bengaluru", range: "$2,800 - $6,800" },
    ],
    includes: [
      "Cycle planning, monitoring scans, and lab process",
      "Egg retrieval and embryo transfer pathway",
      "Basic follow-up instructions after transfer",
    ],
    shouldPlanFor: [
      "Additional freezing, testing, or advanced lab add-ons",
      "Second cycle possibility depending on outcome",
      "Stay extension around transfer timing",
    ],
  },
  "kidney-transplant-abroad": {
    totalRangeUsd: "$14,000 - $28,000",
    cityEstimate: [
      { city: "Delhi NCR", range: "$16,000 - $28,000" },
      { city: "Chennai", range: "$15,000 - $24,000" },
      { city: "Kochi", range: "$14,000 - $23,000" },
    ],
    includes: [
      "Recipient surgery package with ICU and ward care",
      "Immediate transplant medicine initiation",
      "Early post-discharge monitoring within hospital window",
    ],
    shouldPlanFor: [
      "Compatibility and extended pre-op testing",
      "Immunosuppressive medicine costs after discharge",
      "Longer local stay for frequent follow-up labs",
    ],
  },
};

function defaultEducationForTreatment(treatmentName: string): TreatmentEducation {
  return {
    illnessOverview: `${treatmentName} planning works best when diagnosis, specialist review, hospital capability, and recovery timeline are understood before travel.`,
    illnessEducation: [
      "Early understanding of illness stage helps avoid rushed decisions.",
      "Planned treatment pathways improve coordination and patient confidence.",
      "A clear follow-up roadmap is essential for safer recovery after discharge.",
    ],
    hospitalGuide: [
      "Choose hospitals with relevant specialist teams and procedure volume.",
      "Confirm ICU, diagnostics, pharmacy, and attendant support availability.",
      "Ask for transparent estimate and expected stay duration before travel.",
    ],
    doctorGuide: [
      {
        role: "Primary specialist",
        detail: "Leads diagnosis confirmation and procedure recommendation.",
      },
      {
        role: "Anesthesia and inpatient team",
        detail: "Supports procedural safety and early stabilization.",
      },
      {
        role: "Recovery and follow-up team",
        detail: "Guides post-discharge care, medicines, and next reviews.",
      },
    ],
    durationGuide: [
      {
        stage: "Pre-travel review",
        duration: "2-5 days",
        detail: "Reports are reviewed and treatment pathway is finalized.",
      },
      {
        stage: "Hospital treatment",
        duration: "3-10 days",
        detail: "Depends on procedure type and immediate recovery response.",
      },
      {
        stage: "Recovery and follow-up",
        duration: "1-4 weeks",
        detail: "Medication, review checks, and return travel readiness.",
      },
    ],
    hopeNote:
      "With the right team and a structured plan, many patients recover well and return home with better confidence and quality of life.",
  };
}

function defaultBudgetGuide(): BudgetGuide {
  return {
    totalRangeUsd: "$3,000 - $12,000",
    cityEstimate: [
      { city: "Delhi NCR", range: "$3,500 - $12,000" },
      { city: "Chennai", range: "$3,000 - $10,500" },
      { city: "Bengaluru", range: "$3,800 - $11,500" },
    ],
    includes: [
      "Core treatment package and routine inpatient care",
      "Standard discharge notes and medicine guidance",
      "Treatment coordinator support for key milestones",
    ],
    shouldPlanFor: [
      "Advanced investigations based on condition complexity",
      "Travel, stay, and local transport costs",
      "Extra follow-up days if clinical team advises observation",
    ],
  };
}

export function generateStaticParams(): Params[] {
  return treatments.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const treatment = treatmentBySlug[slug];

  if (!treatment) {
    return {};
  }

  return {
    title: treatment.name,
    description: treatment.summary,
    alternates: {
      canonical: `/treatments/${treatment.slug}`,
    },
    openGraph: {
      title: `${treatment.name} | TreatAxis`,
      description: treatment.summary,
      url: `https://www.treataxis.com/treatments/${treatment.slug}`,
      type: "article",
    },
  };
}

export default async function TreatmentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const treatment = treatmentBySlug[slug];
  const isKidneyTransplant = slug === "kidney-transplant-abroad";

  if (!treatment) {
    notFound();
  }

  const education = treatmentEducationBySlug[slug] || defaultEducationForTreatment(treatment.name);
  const budgetGuide = budgetGuideBySlug[slug] || defaultBudgetGuide();
  const relatedTreatments = treatments.filter((item) => item.slug !== slug).slice(0, 4);
  const indiaDestination = destinationByCountrySlug["india"];
  const reviewedDate = new Date().toISOString();

  const reviewerBySlug: Record<string, { name: string; title: string; credential: string; specialty: string }> = {
    "cardiac-care-abroad": {
      name: "Dr. A. Mehra",
      title: "Senior Cardiac Reviewer",
      credential: "MBBS, MD (Medicine)",
      specialty: "Cardiac care pathways",
    },
    "orthopedic-surgery-abroad": {
      name: "Dr. R. Iyer",
      title: "Orthopedic Content Reviewer",
      credential: "MBBS, MS (Ortho)",
      specialty: "Orthopedic and mobility recovery",
    },
    "ivf-fertility-treatment-abroad": {
      name: "Dr. N. Kapoor",
      title: "Fertility Content Reviewer",
      credential: "MBBS, MD (OBG)",
      specialty: "Fertility and IVF pathways",
    },
  };

  const reviewer =
    reviewerBySlug[slug] || {
      name: "Dr. TreatAxis Medical Board",
      title: "Medical Content Reviewer",
      credential: "MBBS, MD",
      specialty: treatment.name,
    };

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalWebPage",
        name: treatment.name,
        description: treatment.summary,
        url: `https://www.treataxis.com/treatments/${treatment.slug}`,
        reviewedBy: {
          "@type": "Person",
          name: reviewer.name,
          jobTitle: reviewer.title,
          knowsAbout: reviewer.specialty,
        },
        lastReviewed: reviewedDate,
      },
      {
        "@type": "Person",
        name: reviewer.name,
        jobTitle: reviewer.title,
        knowsAbout: reviewer.specialty,
        worksFor: {
          "@type": "Organization",
          name: "TreatAxis",
        },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
          Treatment page
        </p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-slate-950 sm:text-6xl">
          {treatment.name}
        </h1>
        <p className="mt-6 text-base leading-8 text-[var(--muted)]">{treatment.summary}</p>
        <div className="mt-3 inline-flex rounded-full border border-[var(--line)] bg-white px-4 py-2 text-xs font-semibold text-slate-700">
          Reviewed by {reviewer.name} ({reviewer.credential}) on {new Date(reviewedDate).toLocaleDateString("en-GB")}
        </div>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          For this pathway, compare <Link href={`/destinations/india?treatment=${encodeURIComponent(treatment.name)}`} className="font-semibold text-[var(--brand)] hover:underline">city-level hospital options in India</Link>, review the matching <Link href={`/blog/${treatment.slug}`} className="font-semibold text-[var(--brand)] hover:underline">treatment planning blog</Link>, and then submit your <Link href="/#inquiry-form" className="font-semibold text-[var(--brand)] hover:underline">estimate request</Link>.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <TreatmentPriceModal
            defaultTreatment={treatment.name}
            buttonLabel={`Check price for ${treatment.name}`}
            buttonClassName="inline-flex rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark)]"
          />
          <Link
            href={`/destinations/india?treatment=${encodeURIComponent(treatment.name)}`}
            className="inline-flex rounded-full border border-[var(--line)] bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
          >
            Compare city options
          </Link>
        </div>
      </header>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[1.6rem] border border-[var(--line)] bg-[linear-gradient(160deg,#ffffff_0%,#eef7ff_100%)] p-6 lg:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">
            Illness and recovery guide
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
            Understand {treatment.name.toLowerCase()}, treatment pathway, and recovery before traveling abroad.
          </h2>
          <p className="mt-4 text-sm leading-8 text-slate-700">{education.illnessOverview}</p>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Patients from <Link href="/africa/ghana" className="font-semibold text-[var(--brand)] hover:underline">Ghana</Link>, <Link href="/africa/nigeria" className="font-semibold text-[var(--brand)] hover:underline">Nigeria</Link>, <Link href="/africa/kenya" className="font-semibold text-[var(--brand)] hover:underline">Kenya</Link>, <Link href="/africa/ethiopia" className="font-semibold text-[var(--brand)] hover:underline">Ethiopia</Link>, <Link href="/africa/egypt" className="font-semibold text-[var(--brand)] hover:underline">Egypt</Link>, and <Link href="/africa/maldives" className="font-semibold text-[var(--brand)] hover:underline">Maldives</Link> typically ask for timeline clarity and recovery planning before final booking.
          </p>
          <ul className="mt-5 space-y-2 text-sm leading-7 text-slate-800">
            {education.illnessEducation.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>

        <TreatmentInlineAi treatmentName={treatment.name} />
      </section>

      <section className="mt-10 rounded-[1.6rem] border border-[var(--line)] bg-white/85 p-6 lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">Budget before travel</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">How much budget should you plan for {treatment.name.toLowerCase()}?</h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          Typical budget band for international patients: <span className="font-semibold text-slate-900">{budgetGuide.totalRangeUsd}</span>. Final cost depends on severity,
          clinical complexity, and recovery response.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {budgetGuide.cityEstimate.map((item) => (
            <article key={item.city} className="rounded-xl border border-[var(--line)] bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">{item.city}</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{item.range}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-[var(--line)] bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Usually included</p>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
              {budgetGuide.includes.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-xl border border-[var(--line)] bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Plan separately for</p>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
              {budgetGuide.shouldPlanFor.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {isKidneyTransplant ? (
        <section className="mt-10 rounded-[1.6rem] border border-[var(--line)] bg-white/85 p-6 lg:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Kidney transplant journey explained simply</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-[var(--line)] bg-white p-4">
              <div className="flex items-center gap-3">
                <Image src="/infographics/kidney-transplant.svg" alt="Kidney transplant icon" width={46} height={46} />
                <p className="text-sm font-semibold text-slate-900">How surgery works</p>
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                <li>• Donor kidney is placed in the lower abdomen.</li>
                <li>• Blood vessels are connected to recipient vessels.</li>
                <li>• Ureter is connected to bladder for urine flow.</li>
                <li>• Native kidneys are often left in place unless medically required.</li>
              </ul>
            </article>

            <article className="rounded-xl border border-[var(--line)] bg-white p-4">
              <div className="flex items-center gap-3">
                <Image src="/infographics/transplant-recovery.svg" alt="Transplant recovery icon" width={46} height={46} />
                <p className="text-sm font-semibold text-slate-900">After transplant and recovery</p>
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                <li>• Lifelong immunosuppressants are required to reduce rejection risk.</li>
                <li>• Common medicine classes include tacrolimus/cyclosporine and mycophenolate-based protocols.</li>
                <li>• Follow-up checks monitor infection, clot risk, and graft function.</li>
                <li>• Many patients report better energy, fewer diet limits, and improved daily life after stable recovery.</li>
              </ul>
            </article>
          </div>
        </section>
      ) : null}

      <section className="mt-10 rounded-[1.6rem] border border-[var(--line)] bg-white/85 p-6 lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">All treatments</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Explore all treatment pathways</h2>
        <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
          Current page treatment is highlighted as your primary selection.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {treatments.map((item) => {
            const isCurrent = item.slug === slug;
            return (
              <Link
                key={item.slug}
                href={`/treatments/${item.slug}`}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  isCurrent
                    ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                    : "border-[var(--line)] bg-white text-slate-800 hover:border-[var(--brand)] hover:text-[var(--brand)]"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <article className="rounded-[1.6rem] border border-[var(--line)] bg-white/80 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Why patients research this</h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{treatment.candidateProfile}</p>
          <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-800">
            {treatment.keyBenefits.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-[1.6rem] border border-[var(--line)] bg-white/80 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Typical pathway timeline</h2>
          <ol className="mt-6 space-y-3 text-sm leading-7 text-slate-800">
            {treatment.timeline.map((item, index) => (
              <li key={item}>
                {index + 1}. {item}
              </li>
            ))}
          </ol>
        </article>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <article className="rounded-[1.6rem] border border-[var(--line)] bg-white/85 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">What to prepare before treatment abroad</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-800">
            <li>• Keep diagnosis reports from the last 6-12 months in one PDF folder.</li>
            <li>• Carry current medicine list with dose timing and allergy details.</li>
            <li>• Confirm who will travel as attendant and where you will stay after discharge.</li>
            <li>• Ask if you should stop or continue blood thinners, diabetes, or BP medicines pre-procedure.</li>
            <li>• Confirm follow-up window needed in India before return flight booking.</li>
          </ul>
        </article>

        <article className="rounded-[1.6rem] border border-[var(--line)] bg-white/85 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Questions to ask your care coordinator</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-800">
            <li>• What is the most likely treatment pathway for my current reports?</li>
            <li>• Which doctor team will lead my case and who covers emergencies?</li>
            <li>• What can increase my cost above the initial estimate?</li>
            <li>• How many days should I stay in the city after discharge?</li>
            <li>• What warning signs after discharge require urgent re-evaluation?</li>
          </ul>
        </article>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <article className="rounded-[1.6rem] border border-[var(--line)] bg-white/85 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">How to choose the right hospital</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-800">
            {education.hospitalGuide.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-[1.6rem] border border-[var(--line)] bg-white/85 p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Doctors you may meet</h2>
          <div className="mt-4 space-y-3">
            {education.doctorGuide.map((item) => (
              <div key={item.role} className="rounded-xl border border-[var(--line)] bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">{item.role}</p>
                <p className="mt-1 text-sm leading-7 text-slate-700">{item.detail}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-10 rounded-[1.6rem] border border-[var(--line)] bg-white/85 p-6 lg:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Expected treatment duration</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {education.durationGuide.map((item) => (
            <article key={item.stage} className="rounded-xl border border-[var(--line)] bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">{item.stage}</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{item.duration}</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{item.detail}</p>
            </article>
          ))}
        </div>
        <p className="mt-5 text-sm leading-8 text-slate-700">{education.hopeNote}</p>
      </section>

      <section className="mt-10 rounded-[1.6rem] border border-[var(--line)] bg-slate-950 p-6 text-white">
        <p className="text-sm uppercase tracking-[0.26em] text-amber-300">Primary SEO keyword</p>
        <p className="mt-3 text-xl font-semibold">{treatment.intentKeyword}</p>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Use this page to rank treatment-specific intent and route users into the homepage inquiry flow.
        </p>
        <div className="mt-6">
          <TreatmentPriceModal
            defaultTreatment={treatment.name}
            buttonLabel={`Check price for ${treatment.name}`}
            buttonClassName="inline-flex rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
          />
        </div>
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
      </section>

      <section className="mt-10 rounded-[1.6rem] border border-[var(--line)] bg-white/85 p-6 lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand)]">Related resources</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Continue researching this treatment pathway</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <article className="rounded-xl border border-[var(--line)] bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Related treatment pages</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedTreatments.map((item) => (
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
            <p className="text-sm font-semibold text-slate-900">Related blog guides</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedTreatments.map((item) => (
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

          <article className="rounded-xl border border-[var(--line)] bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Destination hubs</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={`/destinations/india?treatment=${encodeURIComponent(treatment.name)}`}
                className="rounded-full border border-[var(--line)] px-3 py-2 text-xs font-semibold text-slate-800 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                India hospitals for {treatment.name}
              </Link>
              {indiaDestination?.cities.slice(0, 2).map((city) => (
                <Link
                  key={city.slug}
                  href={`/destinations/india/${city.slug}`}
                  className="rounded-full border border-[var(--line)] px-3 py-2 text-xs font-semibold text-slate-800 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                >
                  {city.city}
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
