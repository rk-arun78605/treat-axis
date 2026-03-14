export type FaqItem = {
  question: string;
  answer: string;
};

export type Treatment = {
  slug: string;
  name: string;
  summary: string;
  intentKeyword: string;
  keyBenefits: string[];
  candidateProfile: string;
  timeline: string[];
  focusDestinations: string[];
  faqs: FaqItem[];
};

export type DestinationCity = {
  slug: string;
  city: string;
  highlights: string[];
  bestFor: string[];
  faqs: FaqItem[];
};

export type DestinationCountry = {
  slug: string;
  country: string;
  seoSummary: string;
  whyChoose: string[];
  faqs: FaqItem[];
  cities: DestinationCity[];
};

export const treatments: Treatment[] = [
  {
    slug: "cardiac-care-abroad",
    name: "Cardiac Care Abroad",
    summary: "Compare planned cardiac treatment pathways abroad with report-first review and coordinated follow-up planning.",
    intentKeyword: "cardiac care abroad",
    keyBenefits: [
      "Initial documentation triage before travel planning",
      "Transparent pathway selection for planned heart procedures",
      "Recovery and follow-up planning across borders",
    ],
    candidateProfile: "For patients and families researching elective or non-emergency cardiac interventions abroad.",
    timeline: [
      "Share reports and current diagnosis context",
      "Receive pathway shortlist and destination fit",
      "Confirm travel window and procedure planning",
      "Coordinate follow-up milestones after discharge",
    ],
    focusDestinations: ["india", "united-arab-emirates"],
    faqs: [
      {
        question: "Is cardiac treatment abroad suitable for planned cases?",
        answer: "Yes, planned cardiac journeys can be coordinated effectively when diagnostics and follow-up requirements are mapped in advance.",
      },
      {
        question: "What records should patients prepare first?",
        answer: "Recent scans, physician notes, medications, and symptom history help build faster and more accurate pathway recommendations.",
      },
    ],
  },
  {
    slug: "orthopedic-surgery-abroad",
    name: "Orthopedic Surgery Abroad",
    summary: "Explore orthopedic surgery abroad for knees, hips, spine, and sports injuries with rehabilitation-ready planning.",
    intentKeyword: "orthopedic surgery abroad",
    keyBenefits: [
      "Procedure matching based on diagnosis and mobility goals",
      "Travel windows aligned with rehabilitation milestones",
      "Structured pre-op and post-op guidance",
    ],
    candidateProfile: "For patients comparing value, surgeon access, and recovery support for planned orthopedic procedures.",
    timeline: [
      "Submit diagnosis and imaging",
      "Review options by city and treatment fit",
      "Lock treatment and rehab schedule",
      "Continue remote follow-up with care coordination",
    ],
    focusDestinations: ["india", "thailand"],
    faqs: [
      {
        question: "Can joint replacement plans be done before travel?",
        answer: "Yes, the planning phase can be completed remotely, including medical review, scheduling, and recovery expectations.",
      },
      {
        question: "How long should travel stay include after surgery?",
        answer: "Stay duration depends on procedure complexity and mobility progress, so plans should include rehab and follow-up checkpoints.",
      },
    ],
  },
  {
    slug: "ivf-fertility-treatment-abroad",
    name: "IVF and Fertility Treatment Abroad",
    summary: "Plan IVF treatment abroad with cycle-sensitive travel windows, confidential communication, and structured care guidance.",
    intentKeyword: "ivf treatment abroad",
    keyBenefits: [
      "Cycle-aware travel and treatment planning",
      "Privacy-first process communication",
      "Destination-fit comparison for repeat visits",
    ],
    candidateProfile: "For individuals and couples evaluating fertility pathways across multiple destinations.",
    timeline: [
      "Share treatment history and priorities",
      "Evaluate destination and process compatibility",
      "Align cycles and travel dates",
      "Manage post-cycle follow-up and next decisions",
    ],
    focusDestinations: ["thailand", "malaysia"],
    faqs: [
      {
        question: "Can IVF preparation start remotely?",
        answer: "Yes, many fertility pathways start with remote case review and cycle planning before travel is finalized.",
      },
      {
        question: "Why does destination choice matter in IVF?",
        answer: "Destination affects clinic protocols, travel convenience, legal context, and visit cadence.",
      },
    ],
  },
  {
    slug: "dental-implants-abroad",
    name: "Dental Implants Abroad",
    summary: "Compare dental implants abroad with stage-wise treatment planning, restorative timelines, and follow-up continuity.",
    intentKeyword: "dental implants abroad",
    keyBenefits: [
      "Clear staging for immediate or phased plans",
      "Cross-border communication for restorative steps",
      "Recovery and revisit planning support",
    ],
    candidateProfile: "For patients exploring restorative dental pathways that require predictable sequencing.",
    timeline: [
      "Share scans and dental history",
      "Confirm treatment stage options",
      "Complete procedure and interim care",
      "Finalize restoration and long-term checks",
    ],
    focusDestinations: ["turkey", "thailand"],
    faqs: [
      {
        question: "Are dental implants always a single trip?",
        answer: "Not always. Some patients complete treatment in one visit while others require staged follow-up visits.",
      },
      {
        question: "What influences timeline length?",
        answer: "Bone condition, treatment approach, and restoration strategy typically determine how many stages are required.",
      },
    ],
  },
  {
    slug: "hair-transplant-abroad",
    name: "Hair Transplant Abroad",
    summary: "Plan hair transplant treatment abroad with clinic shortlisting, graft strategy discussions, and realistic timeline expectations.",
    intentKeyword: "hair transplant abroad",
    keyBenefits: [
      "Provider and approach comparison support",
      "Procedure-day and recovery timeline clarity",
      "Post-procedure care communication",
    ],
    candidateProfile: "For patients considering elective hair restoration with a focus on process transparency.",
    timeline: [
      "Initial inquiry with photos and expectations",
      "Technique and clinic pathway review",
      "Travel, procedure, and immediate recovery",
      "Long-term growth follow-up checkpoints",
    ],
    focusDestinations: ["turkey", "united-arab-emirates"],
    faqs: [
      {
        question: "How can patients compare clinics effectively?",
        answer: "Use a structured comparison of approach, consultation process, expected outcomes, and aftercare guidance.",
      },
      {
        question: "Is post-procedure follow-up important?",
        answer: "Yes, follow-up guidance is key to tracking recovery progress and managing long-term expectations.",
      },
    ],
  },
  {
    slug: "cosmetic-surgery-abroad",
    name: "Cosmetic Surgery Abroad",
    summary: "Compare cosmetic surgery abroad with emphasis on consultation quality, realistic outcomes, and recovery-focused planning.",
    intentKeyword: "cosmetic surgery abroad",
    keyBenefits: [
      "Expectation alignment before procedure confirmation",
      "Destination and facility fit evaluation",
      "Recovery-safe travel planning",
    ],
    candidateProfile: "For elective care seekers who prioritize clear communication, safety planning, and recovery environment.",
    timeline: [
      "Share aesthetic goals and medical context",
      "Receive consultation pathway options",
      "Finalize travel and procedure plan",
      "Monitor recovery with staged follow-up",
    ],
    focusDestinations: ["turkey", "thailand"],
    faqs: [
      {
        question: "How should patients evaluate cosmetic travel options?",
        answer: "Focus on consultation depth, procedure suitability, recovery logistics, and realistic post-procedure expectations.",
      },
      {
        question: "What improves elective travel outcomes?",
        answer: "Good pre-op planning, clear communication, and sufficient post-procedure rest time significantly improve outcomes.",
      },
    ],
  },
  {
    slug: "weight-loss-surgery-abroad",
    name: "Weight Loss Surgery Abroad",
    summary: "Review bariatric surgery abroad options with integrated pathway guidance, nutrition milestones, and follow-up support.",
    intentKeyword: "weight loss surgery abroad",
    keyBenefits: [
      "Procedure pathway explanation for bariatric candidates",
      "Pre-op and post-op milestone planning",
      "Long-term behavior and follow-up guidance",
    ],
    candidateProfile: "For patients seeking structured bariatric treatment plans with clear milestones.",
    timeline: [
      "Eligibility and report review",
      "Procedure and destination matching",
      "Travel and operation planning",
      "Nutritional and follow-up progression support",
    ],
    focusDestinations: ["india", "malaysia"],
    faqs: [
      {
        question: "Is pre-op preparation necessary before traveling?",
        answer: "Yes, pre-op readiness and documentation checks are essential for safer and smoother treatment planning.",
      },
      {
        question: "How is follow-up handled after returning home?",
        answer: "Most plans include remote milestone reviews and symptom monitoring guidance.",
      },
    ],
  },
  {
    slug: "spine-surgery-abroad",
    name: "Spine Surgery Abroad",
    summary: "Evaluate spine surgery abroad with pathway-specific recovery planning and coordinated rehabilitation considerations.",
    intentKeyword: "spine surgery abroad",
    keyBenefits: [
      "Case-fit pathway selection with specialist review",
      "Recovery planning integrated with travel length",
      "Structured post-op communication",
    ],
    candidateProfile: "For patients with chronic spine issues comparing procedural options and rehabilitation context.",
    timeline: [
      "Submit imaging and symptom summary",
      "Review options and care recommendations",
      "Plan travel and procedure milestones",
      "Execute rehab and progress check-ins",
    ],
    focusDestinations: ["india", "united-arab-emirates"],
    faqs: [
      {
        question: "Can spine patients travel for planned surgery?",
        answer: "Yes, for selected cases with proper pre-travel assessment and clear postoperative rehabilitation planning.",
      },
      {
        question: "What affects the rehabilitation timeline?",
        answer: "Procedure type, baseline mobility, and adherence to rehab milestones typically influence recovery duration.",
      },
    ],
  },
  {
    slug: "oncology-second-opinion-abroad",
    name: "Oncology Second Opinion Abroad",
    summary: "Get oncology second-opinion support abroad with structured report review and treatment pathway clarification.",
    intentKeyword: "oncology second opinion abroad",
    keyBenefits: [
      "Structured case compilation for review",
      "Clear communication of pathway options",
      "Decision support before treatment commitment",
    ],
    candidateProfile: "For families seeking confidence before selecting a major oncology treatment pathway.",
    timeline: [
      "Compile reports and imaging",
      "Request specialist review and comparison",
      "Discuss option fit and travel need",
      "Proceed with chosen pathway planning",
    ],
    focusDestinations: ["india", "united-arab-emirates"],
    faqs: [
      {
        question: "Can second opinions be handled remotely first?",
        answer: "Yes, many second-opinion pathways begin remotely with report review before travel is considered.",
      },
      {
        question: "What information improves second-opinion quality?",
        answer: "Complete pathology, imaging, treatment history, and recent physician notes usually improve review quality.",
      },
    ],
  },
  {
    slug: "executive-health-check-abroad",
    name: "Executive Health Check Abroad",
    summary: "Plan executive health checkups abroad with bundled diagnostics, specialist consults, and short-stay scheduling.",
    intentKeyword: "executive health check abroad",
    keyBenefits: [
      "Short-window diagnostic planning",
      "Specialist consultation sequencing",
      "Post-check recommendations and next steps",
    ],
    candidateProfile: "For professionals seeking preventive screening with high convenience and coordinated reporting.",
    timeline: [
      "Select checkup focus and destination",
      "Schedule tests and consultations",
      "Complete assessments during travel window",
      "Review report summary and follow-up recommendations",
    ],
    focusDestinations: ["united-arab-emirates", "malaysia"],
    faqs: [
      {
        question: "Are executive checks usually short-stay programs?",
        answer: "Yes, many are designed for short travel windows with bundled diagnostics and same-visit specialist reviews.",
      },
      {
        question: "What should be prepared before arrival?",
        answer: "Prior history, current medication information, and specific screening goals help create a personalized checkup plan.",
      },
    ],
  },
];

export const destinations: DestinationCountry[] = [
  {
    slug: "india",
    country: "India",
    seoSummary: "India is a leading destination for planned surgeries, specialist access, and value-oriented treatment pathways.",
    whyChoose: [
      "Wide specialist and tertiary care ecosystem",
      "Strong value proposition for planned interventions",
      "Broad city-level treatment capacity",
    ],
    faqs: [
      {
        question: "Why do patients choose India for treatment abroad?",
        answer: "Patients often choose India for specialist depth, procedural coverage, and coordinated medical travel infrastructure.",
      },
      {
        question: "Which treatments are commonly researched for India?",
        answer: "Cardiac, orthopedic, oncology, and complex planned surgeries are among the most researched pathways.",
      },
    ],
    cities: [
      {
        slug: "delhi",
        city: "Delhi",
        highlights: [
          "Multi-specialty tertiary hospitals",
          "International patient service desks",
          "Strong transport and stay options",
        ],
        bestFor: ["Cardiac care", "Orthopedics", "Oncology consultations"],
        faqs: [
          {
            question: "Is Delhi suitable for complex planned surgery?",
            answer: "Delhi is frequently considered for complex planned procedures due to specialist density and tertiary infrastructure.",
          },
          {
            question: "How should patients prepare for Delhi treatment travel?",
            answer: "Prepare full records, define treatment goals, and confirm a stay window that includes recovery and follow-up time.",
          },
        ],
      },
      {
        slug: "mumbai",
        city: "Mumbai",
        highlights: [
          "Advanced specialty centers",
          "Premium accommodation and logistics options",
          "Consultant availability in major hubs",
        ],
        bestFor: ["Cardiac procedures", "Complex diagnostics", "Specialist consultations"],
        faqs: [
          {
            question: "What makes Mumbai a strong medical destination?",
            answer: "Mumbai combines specialist hospitals, travel access, and premium support services for international patients.",
          },
          {
            question: "Can patients combine diagnosis and treatment in one trip?",
            answer: "Many pathways can be sequenced for a single travel window when the case is pre-reviewed in advance.",
          },
        ],
      },
    ],
  },
  {
    slug: "turkey",
    country: "Turkey",
    seoSummary: "Turkey is widely researched for elective care pathways, procedural volume, and city-based treatment clusters.",
    whyChoose: [
      "High demand for elective treatment pathways",
      "Strong destination brand for cosmetic and dental care",
      "Convenient access across Europe and Middle East",
    ],
    faqs: [
      {
        question: "Why is Turkey popular in medical tourism searches?",
        answer: "Turkey has strong visibility for elective procedures and established city-level provider ecosystems.",
      },
      {
        question: "Is Turkey mainly for elective treatment types?",
        answer: "It is especially popular for elective pathways, though suitability always depends on case type and planning needs.",
      },
    ],
    cities: [
      {
        slug: "istanbul",
        city: "Istanbul",
        highlights: [
          "Large elective treatment ecosystem",
          "High hospitality readiness",
          "Strong procedural visibility",
        ],
        bestFor: ["Cosmetic surgery", "Dental treatment", "Hair restoration"],
        faqs: [
          {
            question: "What is Istanbul best known for in treatment abroad?",
            answer: "Istanbul is highly searched for elective procedures including cosmetic pathways and restorative care.",
          },
          {
            question: "Can consultation and treatment be planned tightly in Istanbul?",
            answer: "Yes, with pre-arranged reviews, many treatment paths can be organized around efficient travel windows.",
          },
        ],
      },
      {
        slug: "antalya",
        city: "Antalya",
        highlights: [
          "Recovery-friendly destination context",
          "Elective treatment visibility",
          "Strong hospitality options",
        ],
        bestFor: ["Dental pathways", "Cosmetic procedures", "Post-treatment recovery"],
        faqs: [
          {
            question: "Why do patients compare Antalya for elective procedures?",
            answer: "Patients often compare Antalya for its recovery-friendly environment and treatment travel experience.",
          },
          {
            question: "Is Antalya suitable for shorter treatment trips?",
            answer: "Many elective pathways can be structured for short visits when case planning is completed before travel.",
          },
        ],
      },
    ],
  },
  {
    slug: "thailand",
    country: "Thailand",
    seoSummary: "Thailand is recognized for hospitality-led patient journeys and strong international care experience.",
    whyChoose: [
      "Strong patient service orientation",
      "International familiarity for planned care",
      "Balanced treatment and recovery environment",
    ],
    faqs: [
      {
        question: "Why is Thailand considered for medical travel?",
        answer: "Thailand combines treatment infrastructure with a hospitality-led patient experience and broad travel accessibility.",
      },
      {
        question: "What kind of patients research Thailand most?",
        answer: "Patients evaluating elective pathways, diagnostics, and recovery-oriented journeys often compare Thailand.",
      },
    ],
    cities: [
      {
        slug: "bangkok",
        city: "Bangkok",
        highlights: [
          "Large international patient ecosystem",
          "Multi-specialty hospital clusters",
          "Excellent global connectivity",
        ],
        bestFor: ["Orthopedics", "General surgery", "Health check pathways"],
        faqs: [
          {
            question: "Is Bangkok suitable for planned multi-specialty care?",
            answer: "Bangkok is often selected for planned care requiring coordinated diagnostics and specialist consultations.",
          },
          {
            question: "Can treatment and recovery plans be customized in Bangkok?",
            answer: "Yes, city-level options allow tailored schedules for treatment, stay duration, and follow-up.",
          },
        ],
      },
      {
        slug: "phuket",
        city: "Phuket",
        highlights: [
          "Recovery-oriented destination context",
          "Elective treatment demand",
          "Travel-friendly accommodation options",
        ],
        bestFor: ["Dental care", "Cosmetic pathways", "Post-treatment stays"],
        faqs: [
          {
            question: "What makes Phuket different from Bangkok for patients?",
            answer: "Phuket is frequently preferred by patients seeking a quieter recovery-led environment after elective care.",
          },
          {
            question: "Is Phuket good for staged dental travel plans?",
            answer: "Phuket can work well for staged elective plans when timeline and follow-up expectations are clearly defined.",
          },
        ],
      },
    ],
  },
  {
    slug: "united-arab-emirates",
    country: "United Arab Emirates",
    seoSummary: "The UAE is preferred for premium specialist access, short-haul travel convenience, and high-service treatment journeys.",
    whyChoose: [
      "Premium care positioning",
      "High specialist consultation access",
      "Convenient travel windows for many regions",
    ],
    faqs: [
      {
        question: "Why do international patients choose the UAE?",
        answer: "The UAE is often chosen for premium patient experience, specialist access, and convenient travel logistics.",
      },
      {
        question: "Is the UAE mainly for consultations or procedures too?",
        answer: "Patients use the UAE for both specialist consultations and selected planned treatment pathways.",
      },
    ],
    cities: [
      {
        slug: "dubai",
        city: "Dubai",
        highlights: [
          "Premium provider network",
          "High-end hospitality integration",
          "Fast international accessibility",
        ],
        bestFor: ["Executive health", "Elective procedures", "Specialist consults"],
        faqs: [
          {
            question: "Is Dubai suitable for executive health check planning?",
            answer: "Dubai is frequently researched for executive health pathways due to speed, access, and premium patient services.",
          },
          {
            question: "Can Dubai work for short treatment windows?",
            answer: "Yes, especially for consultation-first pathways and planned elective care with compact scheduling.",
          },
        ],
      },
      {
        slug: "abu-dhabi",
        city: "Abu Dhabi",
        highlights: [
          "Structured specialist programs",
          "High-quality care infrastructure",
          "Patient experience focus",
        ],
        bestFor: ["Follow-up pathways", "Planned surgery", "Rehabilitation planning"],
        faqs: [
          {
            question: "Why compare Abu Dhabi for planned care?",
            answer: "Abu Dhabi is often considered for structured specialist care and high-consistency patient experience.",
          },
          {
            question: "How does Abu Dhabi support planned surgery travel?",
            answer: "Patients can plan surgery travel with coordinated diagnostics, admission timelines, and post-care guidance.",
          },
        ],
      },
    ],
  },
  {
    slug: "malaysia",
    country: "Malaysia",
    seoSummary: "Malaysia is increasingly researched for elective procedures, preventive pathways, and value-conscious treatment planning.",
    whyChoose: [
      "Growing international patient ecosystem",
      "Competitive elective treatment visibility",
      "Strong urban care infrastructure",
    ],
    faqs: [
      {
        question: "Why are patients adding Malaysia to destination comparisons?",
        answer: "Patients compare Malaysia for elective care, preventive programs, and practical travel logistics.",
      },
      {
        question: "Which treatment types are often researched in Malaysia?",
        answer: "Fertility care, preventive checkups, and selected planned surgeries are commonly researched pathways.",
      },
    ],
    cities: [
      {
        slug: "kuala-lumpur",
        city: "Kuala Lumpur",
        highlights: [
          "Large urban treatment network",
          "International patient familiarity",
          "Strong diagnostics and specialist access",
        ],
        bestFor: ["Fertility planning", "Health checks", "Elective surgeries"],
        faqs: [
          {
            question: "Is Kuala Lumpur suitable for fertility travelers?",
            answer: "Kuala Lumpur is often shortlisted by fertility travelers seeking structured pathways and urban convenience.",
          },
          {
            question: "Can preventive checkups be done in short visits?",
            answer: "Yes, many programs are built for compact travel windows with bundled diagnostics and reports.",
          },
        ],
      },
      {
        slug: "penang",
        city: "Penang",
        highlights: [
          "Recovery-friendly city pace",
          "Elective treatment visibility",
          "Strong hospitality infrastructure",
        ],
        bestFor: ["Dental pathways", "Preventive care", "Elective consultations"],
        faqs: [
          {
            question: "What type of treatment planning is common in Penang?",
            answer: "Penang is often researched for elective and preventive pathways with comfortable recovery-oriented stays.",
          },
          {
            question: "How should patients choose between Kuala Lumpur and Penang?",
            answer: "Compare based on treatment need, provider accessibility, and preferred recovery environment.",
          },
        ],
      },
    ],
  },
];

export const treatmentBySlug = Object.fromEntries(treatments.map((item) => [item.slug, item]));
export const destinationByCountrySlug = Object.fromEntries(destinations.map((item) => [item.slug, item]));

export const allCities = destinations.flatMap((country) =>
  country.cities.map((city) => ({
    ...city,
    countrySlug: country.slug,
    countryName: country.country,
  })),
);

export function getRelatedTreatments(currentSlug: string, count = 4) {
  return treatments.filter((item) => item.slug !== currentSlug).slice(0, count);
}

export function getCountryBySlug(slug: string) {
  return destinations.find((item) => item.slug === slug);
}
