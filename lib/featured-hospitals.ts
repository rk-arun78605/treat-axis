export type FeaturedHospital = {
  id: string;
  name: string;
  city: "Delhi" | "Bangalore" | "Kochi";
  location: string;
  rating: number;
  accreditations: string[];
  specialties: string[];
  sampleTreatments: string[];
  imagePath: string;
  doctorProfiles: Array<{
    role: string;
    detail: string;
  }>;
};

export const indiaFeaturedHospitals: FeaturedHospital[] = [
  {
    id: "apollo-delhi",
    name: "Apollo Hospitals Delhi",
    city: "Delhi",
    location: "Delhi, India",
    rating: 4.8,
    accreditations: ["JCI", "NABH", "ISO 9001:2015"],
    specialties: ["Cardiology", "Oncology", "Orthopedics", "Transplant"],
    sampleTreatments: [
      "Cardiac Bypass Surgery - $3,500 - $6,000",
      "Hip Replacement - $5,000 - $8,000",
      "Kidney Transplant - $13,000 - $22,000",
      "IVF and Fertility Treatment - $2,200 - $5,500",
    ],
    imagePath: "/hospitals/apollo-hospitals-delhi.svg",
    doctorProfiles: [
      {
        role: "Senior Cardiac Surgeon",
        detail: "High-volume CABG and valve surgery pathways for international patients.",
      },
      {
        role: "Transplant Nephrology Lead",
        detail: "Donor-recipient workup planning with post-transplant medicine protocols.",
      },
    ],
  },
  {
    id: "max-saket",
    name: "Max Super Speciality Hospital",
    city: "Delhi",
    location: "Delhi, India",
    rating: 4.7,
    accreditations: ["JCI", "NABH"],
    specialties: ["Neurosurgery", "Gastroenterology", "Urology", "Oncology"],
    sampleTreatments: [
      "Liver Transplant - $20,000 - $45,000",
      "Brain Tumor Surgery - $6,500 - $12,000",
      "Urology Surgery - $3,000 - $6,500",
    ],
    imagePath: "/hospitals/max-super-speciality-hospital.svg",
    doctorProfiles: [
      {
        role: "Neurosurgery Consultant",
        detail: "Skull-base and neuro-oncology surgery experience with ICU-backed recovery.",
      },
      {
        role: "Hepato-Biliary and Transplant Team",
        detail: "Multidisciplinary transplant pathway including pre-op and post-op protocols.",
      },
    ],
  },
  {
    id: "fortis-escorts",
    name: "Fortis Escorts Heart Institute",
    city: "Delhi",
    location: "Delhi, India",
    rating: 4.9,
    accreditations: ["JCI", "NABH", "NABL"],
    specialties: ["Cardiac Sciences", "Interventional Cardiology", "Cardiac Surgery"],
    sampleTreatments: [
      "Angioplasty - $4,000 - $6,500",
      "Heart Valve Replacement - $7,000 - $12,500",
      "Pediatric Cardiac Surgery - $5,500 - $10,500",
    ],
    imagePath: "/hospitals/fortis-escorts-heart-institute.svg",
    doctorProfiles: [
      {
        role: "Interventional Cardiologist",
        detail: "Complex angioplasty and structural heart pathways with rapid diagnostics.",
      },
      {
        role: "Cardiac ICU Specialist",
        detail: "Post-procedure stabilization and discharge planning for medical travelers.",
      },
    ],
  },
  {
    id: "manipal-blr",
    name: "Manipal Hospital",
    city: "Bangalore",
    location: "Bangalore, India",
    rating: 4.7,
    accreditations: ["NABH", "NABL"],
    specialties: ["Neuro Sciences", "Orthopedics", "Oncology", "Urology", "Fertility & IVF"],
    sampleTreatments: [
      "Spine Surgery - $4,500 - $9,500",
      "Knee Replacement - $5,000 - $8,500",
      "Urology Surgery - $3,500 - $7,000",
      "IVF and Fertility Treatment - $2,400 - $5,900",
    ],
    imagePath: "/hospitals/manipal-hospital-bangalore.svg",
    doctorProfiles: [
      {
        role: "Orthopedic Surgeon",
        detail: "Joint replacement pathways with rehab-oriented discharge milestones.",
      },
      {
        role: "Neuro Specialist",
        detail: "Advanced imaging-led neurology and neurosurgery care planning.",
      },
    ],
  },
  {
    id: "aster-kochi",
    name: "Aster Medcity",
    city: "Kochi",
    location: "Kochi, India",
    rating: 4.8,
    accreditations: ["JCI", "NABH"],
    specialties: ["Transplant", "Cardiac Sciences", "Nephrology", "Gastro", "Fertility & IVF"],
    sampleTreatments: [
      "Kidney Transplant - $12,500 - $21,000",
      "Liver Transplant - $19,500 - $40,000",
      "CABG - $3,800 - $6,800",
    ],
    imagePath: "/hospitals/aster-medcity-kochi.svg",
    doctorProfiles: [
      {
        role: "Transplant Surgeon",
        detail: "Living and deceased donor transplant pathways with structured follow-up.",
      },
      {
        role: "Nephrology Consultant",
        detail: "Recipient optimization and post-transplant medication monitoring.",
      },
    ],
  },
  {
    id: "amrita-kochi",
    name: "Amrita Hospital Kochi",
    city: "Kochi",
    location: "Kochi, India",
    rating: 4.6,
    accreditations: ["NABH", "NABL"],
    specialties: ["Neurosurgery", "Cardiology", "Oncology", "Critical Care"],
    sampleTreatments: [
      "Brain Surgery - $6,000 - $11,500",
      "Cardiac Surgery - $4,000 - $7,200",
      "Oncology Pathway - $2,500 - $9,000",
    ],
    imagePath: "/hospitals/amrita-hospital-kochi.svg",
    doctorProfiles: [
      {
        role: "Neurosurgery Lead",
        detail: "Complex neuro pathways with perioperative critical care integration.",
      },
      {
        role: "Medical Oncologist",
        detail: "Stage-wise oncology plan with surgery-chemo-radiation coordination.",
      },
    ],
  },
];
