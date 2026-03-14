export type Treatment = {
  slug: string;
  name: string;
  summary: string;
  intentKeyword: string;
  keyBenefits: string[];
  candidateProfile: string;
  timeline: string[];
  faqs: Array<{ question: string; answer: string }>;
};

export type DestinationCity = {
  slug: string;
  city: string;
  highlights: string[];
  bestFor: string[];
};

export type DestinationCountry = {
  slug: string;
  country: string;
  seoSummary: string;
  whyChoose: string[];
  cities: DestinationCity[];
};

export const treatments: Treatment[] = [
  {
    slug: "cardiac-care-abroad",
    name: "Cardiac Care Abroad",
    summary:
      "Compare cardiac surgery pathways, expected timelines, and cross-border recovery planning for planned heart procedures.",
    intentKeyword: "cardiac care abroad",
    keyBenefits: [
      "Pre-travel case review and report organization",
      "Clear estimate ranges before travel confirmation",
      "Structured post-procedure follow-up planning",
    ],
    candidateProfile:
      "Best for patients planning elective or non-emergency cardiac interventions who need clarity on total care coordination.",
    timeline: [
      "Initial inquiry and report sharing",
      "Specialist review and treatment pathway shortlisting",
      "Travel readiness and admission coordination",
      "Procedure, recovery, and remote follow-up planning",
    ],
    faqs: [
      {
        question: "Can patients travel for planned cardiac procedures?",
        answer:
          "Yes, planned procedures are commonly coordinated through structured pre-assessment and medical travel timelines.",
      },
      {
        question: "What documents improve case review speed?",
        answer:
          "Recent scans, physician notes, medication history, and current symptoms help coordinators route the case faster.",
      },
    ],
  },
  {
    slug: "orthopedic-surgery-abroad",
    name: "Orthopedic Surgery Abroad",
    summary:
      "Explore orthopedic treatment abroad for joint replacement, spine procedures, and rehabilitation-focused care journeys.",
    intentKeyword: "orthopedic surgery abroad",
    keyBenefits: [
      "Procedure pathways mapped with recovery expectations",
      "Destination and facility comparisons for planned surgery",
      "Rehabilitation-focused aftercare planning",
    ],
    candidateProfile:
      "Ideal for patients comparing joint, spine, or sports injury procedures with transparent travel and rehab planning.",
    timeline: [
      "Submit inquiry with imaging and diagnosis context",
      "Review treatment options and destination-fit",
      "Confirm surgery dates and pre-op instructions",
      "Complete rehab milestones and remote check-ins",
    ],
    faqs: [
      {
        question: "Is treatment abroad suitable for knee replacement?",
        answer:
          "Many patients evaluate treatment abroad for planned joint replacement when timelines and recovery support are clearly structured.",
      },
      {
        question: "How long should recovery travel plans include?",
        answer:
          "Recovery windows vary by procedure and patient profile, but most plans include inpatient care, assisted mobility days, and follow-up checks.",
      },
    ],
  },
  {
    slug: "ivf-fertility-treatment-abroad",
    name: "IVF and Fertility Treatment Abroad",
    summary:
      "Plan IVF and fertility treatment abroad with confidential support, cycle planning, and destination-specific care coordination.",
    intentKeyword: "ivf treatment abroad",
    keyBenefits: [
      "Confidential care pathway guidance and documentation support",
      "Cycle timing alignment with travel windows",
      "Transparent step-by-step communication",
    ],
    candidateProfile:
      "Designed for individuals and couples comparing fertility options across destinations and clinic ecosystems.",
    timeline: [
      "Share treatment history and preferred timeline",
      "Review destination options and clinical process fit",
      "Plan cycle-linked travel and treatment dates",
      "Continue post-cycle communication and guidance",
    ],
    faqs: [
      {
        question: "Can IVF planning be done before traveling?",
        answer:
          "Yes, most planning can begin remotely with document review, specialist coordination, and cycle timeline preparation.",
      },
      {
        question: "How does destination choice impact IVF planning?",
        answer:
          "Destination affects scheduling flexibility, legal context, clinic style, and travel convenience for repeat visits.",
      },
    ],
  },
  {
    slug: "dental-implants-abroad",
    name: "Dental Implants Abroad",
    summary:
      "Compare destinations for dental implants abroad, including treatment sequencing, recovery windows, and follow-up planning.",
    intentKeyword: "dental implants abroad",
    keyBenefits: [
      "Treatment sequence clarity for single-trip or staged plans",
      "Cross-border care communication support",
      "Transparent pathway for restorative outcomes",
    ],
    candidateProfile:
      "Suitable for patients planning restorative dental procedures who need a clear treatment sequence and timeline.",
    timeline: [
      "Initial dental records review and inquiry",
      "Confirm procedure pathway and visit schedule",
      "Complete treatment stage and interim care",
      "Schedule follow-up and final restoration checks",
    ],
    faqs: [
      {
        question: "Are dental implant plans always one trip?",
        answer:
          "Some cases are completed in one trip while others require staged visits depending on bone health and treatment approach.",
      },
      {
        question: "What improves treatment predictability?",
        answer:
          "Accurate diagnostic imaging, realistic timeline planning, and consistent follow-up guidance improve outcomes.",
      },
    ],
  },
  {
    slug: "oncology-treatment-abroad",
    name: "Oncology Treatment Abroad",
    summary:
      "Explore cancer treatment abroad with multidisciplinary planning, treatment sequencing, and supportive recovery guidance.",
    intentKeyword: "oncology treatment abroad",
    keyBenefits: [
      "Tumor-board style case planning before travel",
      "Sequenced surgery, chemo, radiation pathway clarity",
      "Supportive care guidance for nutrition and monitoring",
    ],
    candidateProfile:
      "Suitable for patients seeking planned oncology consultation or treatment sequence planning in a tertiary setting.",
    timeline: [
      "Report and pathology review",
      "Oncology team recommendation and staging",
      "Treatment block planning and admission",
      "Follow-up roadmap and remote continuity support",
    ],
    faqs: [
      {
        question: "Can oncology planning begin before traveling?",
        answer:
          "Yes, case documents can be reviewed first to define staging needs and the likely treatment block.",
      },
      {
        question: "Why is multidisciplinary planning important?",
        answer:
          "It aligns surgery, medical oncology, and radiation decisions so treatment sequence is safer and clearer.",
      },
    ],
  },
  {
    slug: "neurosurgery-abroad",
    name: "Neurosurgery Abroad",
    summary:
      "Compare neurosurgery pathways abroad for brain and nerve conditions with imaging-led planning and post-op monitoring.",
    intentKeyword: "neurosurgery abroad",
    keyBenefits: [
      "Pre-travel imaging and risk discussion support",
      "Neurosurgical center comparison across major cities",
      "Structured ICU and post-op recovery pathway visibility",
    ],
    candidateProfile:
      "Useful for patients with planned neurosurgical needs requiring specialist review and monitored recovery planning.",
    timeline: [
      "Case records and imaging transfer",
      "Specialist opinion and operative suitability review",
      "Procedure scheduling and inpatient recovery",
      "Discharge readiness and remote neurological follow-up",
    ],
    faqs: [
      {
        question: "How do patients compare neurosurgery options abroad?",
        answer:
          "Most patients compare specialist experience, ICU readiness, technology support, and post-op follow-up plans.",
      },
      {
        question: "Are second opinions common before neurosurgery?",
        answer:
          "Yes, second opinions are frequently requested to validate diagnosis and treatment approach before travel.",
      },
    ],
  },
  {
    slug: "spine-surgery-abroad",
    name: "Spine Surgery Abroad",
    summary:
      "Plan spine surgery abroad for disc, stenosis, and instability concerns with rehab-focused post-treatment timelines.",
    intentKeyword: "spine surgery abroad",
    keyBenefits: [
      "Imaging-led decision support for conservative vs surgical pathways",
      "Hospital and surgeon fit for complex spine procedures",
      "Mobility and rehab milestones explained clearly",
    ],
    candidateProfile:
      "Ideal for patients with persistent back or neck symptoms considering planned spine intervention abroad.",
    timeline: [
      "MRI and symptom review",
      "Surgical recommendation and travel prep",
      "Procedure and early mobility phase",
      "Rehab continuation and remote review",
    ],
    faqs: [
      {
        question: "How long do patients usually stay for spine surgery abroad?",
        answer:
          "Stay length depends on surgery type and mobility goals, often including inpatient care plus monitored rehab days.",
      },
      {
        question: "Can rehab planning be arranged before travel?",
        answer:
          "Yes, rehab expectations can be mapped before admission to improve post-op preparedness.",
      },
    ],
  },
  {
    slug: "kidney-transplant-abroad",
    name: "Kidney Transplant Abroad",
    summary:
      "Review kidney transplant abroad pathways with donor evaluation steps, legal coordination, and long-term follow-up planning.",
    intentKeyword: "kidney transplant abroad",
    keyBenefits: [
      "Transparent transplant workflow and evaluation milestones",
      "Donor-recipient legal and medical checklist clarity",
      "Post-transplant medicine and monitoring guidance",
    ],
    candidateProfile:
      "For patients and families evaluating planned kidney transplant pathways with coordinated medical and legal processes.",
    timeline: [
      "Preliminary transplant eligibility review",
      "Donor and recipient workup",
      "Procedure and intensive monitoring",
      "Immunosuppression follow-up and long-term protocol",
    ],
    faqs: [
      {
        question: "What is critical before planning transplant travel?",
        answer:
          "Comprehensive recipient reports, donor compatibility steps, and compliance with legal requirements are essential.",
      },
      {
        question: "Why is follow-up planning so important after transplant?",
        answer:
          "Regular lab checks and medicine adherence are central to graft safety and long-term outcomes.",
      },
    ],
  },
  {
    slug: "liver-transplant-abroad",
    name: "Liver Transplant Abroad",
    summary:
      "Understand liver transplant abroad pathways including recipient assessment, donor evaluation, and recovery monitoring.",
    intentKeyword: "liver transplant abroad",
    keyBenefits: [
      "Multispecialty transplant board planning",
      "Clear pre-op risk and readiness communication",
      "Structured post-op ICU to step-down recovery pathway",
    ],
    candidateProfile:
      "Best for families considering planned transplant evaluation with tertiary-center support and long-term follow-up needs.",
    timeline: [
      "Transplant eligibility and severity review",
      "Donor assessment and legal documentation",
      "Transplant procedure and ICU care",
      "Recovery milestones and medicine continuation plan",
    ],
    faqs: [
      {
        question: "Can liver transplant cases be reviewed remotely first?",
        answer:
          "Yes, hospitals generally review reports before travel to confirm evaluation steps and expected timelines.",
      },
      {
        question: "How do attendants prepare for transplant journeys?",
        answer:
          "Attendants should plan extended stay, medication logistics, and post-discharge support requirements.",
      },
    ],
  },
  {
    slug: "bariatric-surgery-abroad",
    name: "Bariatric Surgery Abroad",
    summary:
      "Compare bariatric surgery abroad for weight and metabolic conditions with nutrition-led follow-up planning.",
    intentKeyword: "bariatric surgery abroad",
    keyBenefits: [
      "Procedure fit guidance across sleeve and bypass pathways",
      "Nutrition, psychology, and lifestyle planning integration",
      "Post-procedure milestone tracking for sustained outcomes",
    ],
    candidateProfile:
      "Designed for patients evaluating metabolic surgery with clear readiness criteria and follow-up commitment.",
    timeline: [
      "Eligibility screening and counseling",
      "Procedure planning and admission",
      "Early recovery and diet transition",
      "Long-term nutrition and progress follow-up",
    ],
    faqs: [
      {
        question: "Is follow-up necessary after bariatric surgery abroad?",
        answer:
          "Yes, sustained outcomes depend on nutrition adherence, regular reviews, and guided lifestyle changes.",
      },
      {
        question: "What support improves recovery confidence?",
        answer:
          "Pre-op counseling, clear diet phases, and remote follow-up communication improve confidence and adherence.",
      },
    ],
  },
  {
    slug: "cosmetic-surgery-abroad",
    name: "Cosmetic Surgery Abroad",
    summary:
      "Plan cosmetic surgery abroad with realistic expectation setting, procedure safety checks, and recovery timeline clarity.",
    intentKeyword: "cosmetic surgery abroad",
    keyBenefits: [
      "Procedure suitability and expectation alignment support",
      "Safety-first clinic and surgeon evaluation checklist",
      "Aftercare instructions and staged recovery planning",
    ],
    candidateProfile:
      "For adults seeking elective cosmetic procedures with emphasis on informed planning and safe follow-up.",
    timeline: [
      "Consultation and aesthetic planning",
      "Procedure booking and pre-op preparation",
      "Surgery and monitored recovery",
      "Follow-up care and healing reviews",
    ],
    faqs: [
      {
        question: "How should patients compare cosmetic surgery providers abroad?",
        answer:
          "Review credentials, clinical setting, revision policy, and aftercare support before deciding.",
      },
      {
        question: "Why is realistic expectation setting important?",
        answer:
          "Clear expectation alignment improves decision confidence and satisfaction with recovery outcomes.",
      },
    ],
  },
  {
    slug: "urology-surgery-abroad",
    name: "Urology Surgery Abroad",
    summary:
      "Explore urology surgery abroad for prostate, kidney, and urinary conditions with procedure and recovery planning.",
    intentKeyword: "urology surgery abroad",
    keyBenefits: [
      "Condition-specific pathway explanation from diagnosis to discharge",
      "Hospital and surgeon shortlist support for planned urology care",
      "Post-procedure monitoring and medication guidance",
    ],
    candidateProfile:
      "Appropriate for patients evaluating planned urology procedures with specialist and follow-up coordination needs.",
    timeline: [
      "Diagnostics and specialist review",
      "Procedure recommendation and scheduling",
      "Inpatient treatment and stabilization",
      "Follow-up checks and symptom monitoring",
    ],
    faqs: [
      {
        question: "Can patients plan urology procedures abroad without rushing?",
        answer:
          "Yes, most planned urology cases can be structured with pre-travel review and staged decision making.",
      },
      {
        question: "What matters in post-procedure planning?",
        answer:
          "Clear instructions for hydration, medicines, symptom watch, and follow-up timing are key.",
      },
    ],
  },
  {
    slug: "ent-surgery-abroad",
    name: "ENT Surgery Abroad",
    summary:
      "Compare ENT surgery abroad for sinus, throat, and ear pathways with practical travel and recovery guidance.",
    intentKeyword: "ent surgery abroad",
    keyBenefits: [
      "Procedure-level clarity for common ENT surgical indications",
      "Recovery expectations mapped for speech, breathing, and comfort",
      "Follow-up plan support for safe return travel",
    ],
    candidateProfile:
      "Suitable for patients considering planned ENT intervention and looking for clear recovery timelines.",
    timeline: [
      "ENT consultation and diagnostics",
      "Procedure planning and preparation",
      "Surgery and short-stay recovery",
      "Follow-up and travel clearance",
    ],
    faqs: [
      {
        question: "Do ENT surgeries usually need long stays abroad?",
        answer:
          "Many are short-stay pathways, but duration varies by procedure complexity and recovery needs.",
      },
      {
        question: "Can follow-up continue after returning home?",
        answer:
          "Yes, many centers support remote follow-up based on reports and symptom updates.",
      },
    ],
  },
  {
    slug: "ophthalmology-surgery-abroad",
    name: "Ophthalmology Surgery Abroad",
    summary:
      "Plan eye treatment and ophthalmology surgery abroad with diagnostics, procedure guidance, and follow-up planning.",
    intentKeyword: "ophthalmology surgery abroad",
    keyBenefits: [
      "Vision-focused diagnostic pathway clarity",
      "Procedure comparison for cataract and refractive options",
      "Post-procedure monitoring and safety guidance",
    ],
    candidateProfile:
      "Useful for patients seeking planned eye procedures and clear advice on recovery and follow-up visits.",
    timeline: [
      "Vision assessment and specialist consult",
      "Procedure planning and suitability confirmation",
      "Treatment and immediate observation",
      "Short-interval follow-up and recovery review",
    ],
    faqs: [
      {
        question: "How quickly can patients travel back after eye surgery?",
        answer:
          "Travel timing depends on procedure type and surgeon advice after early follow-up assessment.",
      },
      {
        question: "What improves eye surgery planning abroad?",
        answer:
          "Accurate diagnostics, realistic expectations, and strict follow-up adherence improve outcomes.",
      },
    ],
  },
  {
    slug: "general-surgery-abroad",
    name: "General Surgery Abroad",
    summary:
      "Explore general surgery abroad for planned abdominal and soft-tissue procedures with safe pathway planning.",
    intentKeyword: "general surgery abroad",
    keyBenefits: [
      "Procedure-specific admission and discharge planning",
      "Hospital capability checks for elective surgeries",
      "Post-op care and return travel readiness guidance",
    ],
    candidateProfile:
      "For patients considering elective general surgery with preference for structured pre-op and post-op planning.",
    timeline: [
      "Consultation and diagnostics",
      "Surgical pathway confirmation",
      "Procedure and in-hospital recovery",
      "Discharge support and follow-up",
    ],
    faqs: [
      {
        question: "Can elective general surgery be planned smoothly abroad?",
        answer:
          "Yes, with a clear diagnosis, hospital shortlist, and staged preparation, planning is usually straightforward.",
      },
      {
        question: "What should attendants prepare for?",
        answer:
          "Attendants should prepare for medication support, mobility assistance, and follow-up coordination.",
      },
    ],
  },
];

export const destinations: DestinationCountry[] = [
  {
    slug: "india",
    country: "India",
    seoSummary:
      "India remains a major destination for planned surgery, specialist access, and integrated medical travel support.",
    whyChoose: [
      "Large specialist ecosystem across major metros",
      "Strong value perception for planned interventions",
      "Broad treatment coverage from tertiary care providers",
    ],
    cities: [
      {
        slug: "delhi",
        city: "Delhi",
        highlights: [
          "Multi-specialty tertiary hospitals",
          "International patient coordinators",
          "Strong airport and hotel infrastructure",
        ],
        bestFor: ["Cardiac care", "Orthopedics", "Oncology consultations"],
      },
      {
        slug: "mumbai",
        city: "Mumbai",
        highlights: [
          "Advanced specialty programs",
          "Premium accommodation options",
          "High consultant availability",
        ],
        bestFor: ["Cardiac procedures", "Cancer care planning", "Complex diagnostics"],
      },
      {
        slug: "chennai",
        city: "Chennai",
        highlights: [
          "Established medical tourism ecosystem",
          "Structured rehabilitation options",
          "Procedure-focused tertiary care",
        ],
        bestFor: ["Orthopedics", "Transplant planning", "Spine surgery"],
      },
    ],
  },
];

export const treatmentBySlug = Object.fromEntries(
  treatments.map((item) => [item.slug, item]),
);

export const destinationByCountrySlug = Object.fromEntries(
  destinations.map((item) => [item.slug, item]),
);
