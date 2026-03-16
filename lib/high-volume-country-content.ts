export type HighVolumeCountryLanding = {
  slug: string;
  country: string;
  locale: string;
  marketFocus: string;
  primaryNeeds: string[];
  whyIndia: string[];
  travelNotes: string[];
  intentKeywords: string[];
  topTreatments: string[];
};

export const highVolumeCountries: HighVolumeCountryLanding[] = [
  {
    slug: "united-states",
    country: "United States",
    locale: "en-US",
    marketFocus:
      "Treatment-in-India planning support for patients from the US seeking cost clarity, specialist fit, and practical recovery timelines.",
    primaryNeeds: [
      "Procedure and specialist comparison with transparent treatment ranges",
      "Timeline planning for treatment, remote work, and return travel",
      "Structured review of records before international travel",
    ],
    whyIndia: [
      "High-volume tertiary centers for complex surgeries and planned care",
      "Broader specialist access with coordinated international patient desks",
      "Better value for elective and high-cost pathways with guided planning",
    ],
    travelNotes: [
      "Share imaging and treatment history before choosing city and hospital.",
      "Plan an attendant for discharge support and medicine coordination.",
      "Keep 4-7 buffer days for follow-up before return flights.",
    ],
    intentKeywords: [
      "medical treatment in india from usa",
      "best hospitals in india for us patients",
      "affordable surgery in india for americans",
      "ivf in india from usa",
    ],
    topTreatments: ["Cardiac Care Abroad", "Orthopedic Surgery Abroad", "IVF and Fertility Treatment Abroad"],
  },
  {
    slug: "united-kingdom",
    country: "United Kingdom",
    locale: "en-GB",
    marketFocus:
      "India treatment planning for UK residents comparing waiting-time relief, specialist options, and predictable private-care pathways.",
    primaryNeeds: [
      "Faster access to specialist-led elective procedures",
      "Clear pathway planning before committing to travel",
      "Practical stay and follow-up planning for patient and companion",
    ],
    whyIndia: [
      "Strong specialist coverage for cardiac, orthopedic, and fertility pathways",
      "Integrated diagnostics and treatment coordination in major cities",
      "International patient workflows built for planned medical travel",
    ],
    travelNotes: [
      "Request a pathway summary and estimate before ticket booking.",
      "Pick city by treatment depth and expected review schedule.",
      "Plan remote follow-up checkpoints after return to the UK.",
    ],
    intentKeywords: [
      "treatment in india from uk",
      "medical tourism uk to india",
      "orthopedic surgery in india for uk patients",
      "private treatment abroad india from uk",
    ],
    topTreatments: ["Orthopedic Surgery Abroad", "Cardiac Care Abroad", "Bariatric Surgery Abroad"],
  },
  {
    slug: "united-arab-emirates",
    country: "United Arab Emirates",
    locale: "en-AE",
    marketFocus:
      "Medical travel coordination from UAE to India focused on faster specialist access, predictable budgets, and family-friendly recovery planning.",
    primaryNeeds: [
      "Specialist matching by condition complexity",
      "Transparent treatment and stay costs before travel",
      "Coordinated attendant and recovery logistics",
    ],
    whyIndia: [
      "Short travel corridor with broad tertiary-care options",
      "High-volume teams across oncology, cardiac, and transplant pathways",
      "Better treatment planning continuity from inquiry to discharge",
    ],
    travelNotes: [
      "Share current prescriptions, scans, and diagnosis summary in one file set.",
      "Prefer city options with strong post-procedure follow-up infrastructure.",
      "Keep schedule flexibility for extended monitoring if needed.",
    ],
    intentKeywords: [
      "treatment in india from uae",
      "medical tourism uae to india",
      "cancer treatment in india from dubai",
      "cardiac surgery in india for uae patients",
    ],
    topTreatments: ["Oncology Treatment Abroad", "Cardiac Care Abroad", "Kidney Transplant Abroad"],
  },
  {
    slug: "saudi-arabia",
    country: "Saudi Arabia",
    locale: "en-SA",
    marketFocus:
      "Specialist-led treatment-in-India support for patients from Saudi Arabia seeking structured care pathways and pre-travel clarity.",
    primaryNeeds: [
      "Clear treatment pathways and expected duration",
      "Hospital and doctor fit validation before travel",
      "Family-oriented coordination for post-treatment needs",
    ],
    whyIndia: [
      "Comprehensive specialty networks in Delhi, Bengaluru, and Chennai",
      "Strong multidisciplinary planning for complex surgeries",
      "Detailed pre-travel case review and estimate workflows",
    ],
    travelNotes: [
      "Confirm expected admission and discharge windows in advance.",
      "Prepare attendant plan for medicines and follow-up visits.",
      "Finalize local recovery accommodation close to the hospital.",
    ],
    intentKeywords: [
      "treatment in india from saudi arabia",
      "medical tourism saudi to india",
      "liver transplant in india for saudi patients",
      "best hospitals in india for saudi patients",
    ],
    topTreatments: ["Liver Transplant Abroad", "Neurosurgery Abroad", "Cardiac Care Abroad"],
  },
  {
    slug: "canada",
    country: "Canada",
    locale: "en-CA",
    marketFocus:
      "India medical travel planning for Canadian patients who want specialist access, predictable scheduling, and complete treatment-journey visibility.",
    primaryNeeds: [
      "Specialty comparison for planned procedures and second opinions",
      "Reliable timeline planning for leave and return",
      "Upfront cost visibility for procedures and recovery",
    ],
    whyIndia: [
      "Broad specialist programs across major treatment cities",
      "Strong support for international patient documentation",
      "Competitive value for elective and complex planned care",
    ],
    travelNotes: [
      "Provide diagnostic reports early for faster specialist mapping.",
      "Build a full trip plan around inpatient and review windows.",
      "Plan medication continuity before return to Canada.",
    ],
    intentKeywords: [
      "treatment in india from canada",
      "medical tourism canada to india",
      "knee replacement in india from canada",
      "ivf treatment in india for canadian patients",
    ],
    topTreatments: ["Orthopedic Surgery Abroad", "IVF and Fertility Treatment Abroad", "Spine Surgery Abroad"],
  },
  {
    slug: "australia",
    country: "Australia",
    locale: "en-AU",
    marketFocus:
      "Treatment-abroad guidance from Australia to India for patients comparing specialist quality, treatment speed, and total journey planning.",
    primaryNeeds: [
      "Hospital comparison by treatment type and expected outcomes",
      "Full budget planning across treatment and stay",
      "Clear post-discharge and remote follow-up roadmap",
    ],
    whyIndia: [
      "High-volume specialists for orthopedic, cardiac, and oncology care",
      "Integrated care pathways for diagnostics, surgery, and follow-up",
      "Experienced international desks for travel-linked treatment coordination",
    ],
    travelNotes: [
      "Include previous procedures and medication history with initial inquiry.",
      "Keep flexible return dates for additional follow-up if advised.",
      "Confirm tele-follow-up steps before flying back to Australia.",
    ],
    intentKeywords: [
      "treatment in india from australia",
      "medical tourism australia to india",
      "oncology treatment in india for australian patients",
      "heart surgery in india from australia",
    ],
    topTreatments: ["Oncology Treatment Abroad", "Cardiac Care Abroad", "Orthopedic Surgery Abroad"],
  },
];

export const highVolumeCountryBySlug = Object.fromEntries(
  highVolumeCountries.map((country) => [country.slug, country]),
) as Record<string, HighVolumeCountryLanding>;