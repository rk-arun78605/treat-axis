import { NextResponse } from "next/server";
import { indiaFeaturedHospitals } from "../../../lib/featured-hospitals";

export const runtime = "nodejs";

type HospitalResearchRequest = {
  hospitalId?: unknown;
  treatment?: unknown;
};

type HospitalResearchResponse = {
  illnessOverview: string;
  treatmentAtHospital: string;
  specialtyFit: string;
  doctorInsights: string[];
  estimatedDuration: string;
  estimatedCostRange: string;
  nextStep: string;
};

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function inferIllnessCategory(value: string) {
  const normalized = value.toLowerCase();

  if (/(kidney|renal|dialysis|transplant)/.test(normalized)) {
    return "transplant";
  }

  if (/(heart|cardiac|bypass|angioplasty|valve)/.test(normalized)) {
    return "cardiac";
  }

  if (/(knee|hip|joint|spine|orthopedic|ortho)/.test(normalized)) {
    return "orthopedic";
  }

  if (/(brain|neuro|stroke|seizure|headache|tumor)/.test(normalized)) {
    return "neuro";
  }

  if (/(cancer|oncology|tumour|tumor|chemo|radiation)/.test(normalized)) {
    return "oncology";
  }

  if (/(ivf|fertility|embryo|pregnan|gyne|gynae)/.test(normalized)) {
    return "fertility";
  }

  return "general";
}

function doctorInsightsByCategory(
  category: string,
  treatment: string,
  hospitalName: string,
  hospitalProfiles: Array<{ role: string; detail: string }>,
) {
  const categorySpecific: Record<string, string[]> = {
    transplant: [
      `Transplant Surgeon: procedure planning and donor-recipient operative strategy for ${treatment}.`,
      "Transplant Nephrologist/Hepatologist: pre-op optimization and long-term graft monitoring.",
      "Immunology and Infection Team: immunosuppression balancing and rejection-risk monitoring.",
    ],
    cardiac: [
      `Interventional Cardiologist: angiography and minimally invasive pathway review for ${treatment}.`,
      "Cardiac Surgeon: open-heart procedure planning when surgical pathway is required.",
      "Cardiac ICU Team: immediate stabilization and discharge-readiness milestones.",
    ],
    orthopedic: [
      `Orthopedic Surgeon: imaging-led surgery planning for ${treatment}.`,
      "Rehab Specialist: mobility milestones and physiotherapy pathway after intervention.",
      "Pain Management Team: post-procedure pain control and recovery comfort.",
    ],
    neuro: [
      `Neuro Specialist/Neurosurgeon: diagnosis confirmation and intervention suitability for ${treatment}.`,
      "Neuro-Anesthesia and ICU Team: perioperative neurological stability monitoring.",
      "Neuro-Rehab Team: post-treatment function recovery and follow-up planning.",
    ],
    oncology: [
      `Medical Oncologist: stage-wise treatment strategy for ${treatment}.`,
      "Surgical Oncologist: operability evaluation and surgery sequencing.",
      "Radiation Oncology Team: targeted radiation plan and side-effect monitoring.",
    ],
    fertility: [
      `Fertility Specialist: cycle planning and treatment protocol selection for ${treatment}.`,
      "Embryology Team: lab-stage quality control and embryo pathway optimization.",
      "Fertility Counselor: expectation support and treatment decision guidance.",
    ],
  };

  const hospitalSpecific = hospitalProfiles.map(
    (doctor) => `${doctor.role} at ${hospitalName}: ${doctor.detail}`,
  );

  if (!categorySpecific[category]) {
    return hospitalSpecific;
  }

  return [...categorySpecific[category], ...hospitalSpecific.slice(0, 1)];
}

function buildFallback(hospitalId: string, treatment: string): HospitalResearchResponse | null {
  const hospital = indiaFeaturedHospitals.find((item) => item.id === hospitalId);

  if (!hospital) {
    return null;
  }

  const category = inferIllnessCategory(treatment);
  const baseIllness =
    category === "transplant"
      ? "Transplant cases need donor/recipient evaluation, legal readiness, and long-term medicine follow-up."
      : category === "cardiac"
        ? "Cardiac conditions often need imaging, risk assessment, and step-wise procedure planning before travel."
        : category === "orthopedic"
          ? "Orthopedic illness usually needs imaging-led diagnosis and rehabilitation planning after intervention."
          : category === "neuro"
            ? "Neurological illness requires specialist review, imaging, and careful post-treatment monitoring."
            : category === "oncology"
              ? "Oncology pathways are strongest when surgery, chemotherapy, and radiation are sequenced through multidisciplinary review."
              : category === "fertility"
                ? "Fertility pathways require cycle timing, lab quality, and clear counseling for expected outcomes."
                : "Treatment planning works best when diagnosis, specialist selection, and recovery timelines are clear before travel.";

  const duration =
    category === "transplant"
      ? "10-20 days including surgery and early monitored recovery"
      : category === "cardiac"
        ? "5-10 days including diagnostics, treatment, and discharge planning"
        : category === "orthopedic"
          ? "6-14 days depending on surgery and early mobility goals"
          : category === "neuro"
            ? "5-12 days depending on procedure complexity and observation needs"
            : category === "fertility"
              ? "10-18 days for evaluation and cycle-linked treatment window"
              : "4-10 days for specialist review and treatment pathway confirmation";

  const cost =
    hospital.sampleTreatments.find((item) => item.toLowerCase().includes(treatment.toLowerCase())) ||
    hospital.sampleTreatments[0] ||
    "Case-based estimate after clinical review";

  return {
    illnessOverview: baseIllness,
    treatmentAtHospital: `${hospital.name} in ${hospital.city} is commonly chosen for ${treatment} because of ${hospital.specialties.slice(0, 2).join(" and ")} support with international patient coordination.`,
    specialtyFit: `Core specialties at this hospital: ${hospital.specialties.join(", ")}. Accreditations: ${hospital.accreditations.join(", ")}.`,
    doctorInsights: doctorInsightsByCategory(category, treatment, hospital.name, hospital.doctorProfiles),
    estimatedDuration: duration,
    estimatedCostRange: cost,
    nextStep: "Share latest reports and timeline preference to get hospital-wise doctor plan and admission-ready estimate.",
  };
}

function extractJsonObject(text: string) {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return null;
  }

  return text.slice(firstBrace, lastBrace + 1);
}

function isValidResponseShape(value: unknown): value is HospitalResearchResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.illnessOverview === "string" &&
    typeof candidate.treatmentAtHospital === "string" &&
    typeof candidate.specialtyFit === "string" &&
    Array.isArray(candidate.doctorInsights) &&
    candidate.doctorInsights.every((item) => typeof item === "string") &&
    typeof candidate.estimatedDuration === "string" &&
    typeof candidate.estimatedCostRange === "string" &&
    typeof candidate.nextStep === "string"
  );
}

async function fetchPerplexityHospitalResearch(hospitalId: string, treatment: string) {
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    return null;
  }

  const hospital = indiaFeaturedHospitals.find((item) => item.id === hospitalId);

  if (!hospital) {
    return null;
  }

  const model = process.env.PERPLEXITY_MODEL || "sonar";

  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a medical travel research assistant. Give practical patient-safe educational guidance only. Do not diagnose.",
        },
        {
          role: "user",
          content: `Hospital profile: ${JSON.stringify(hospital)}\nTreatment query: ${treatment}\n\nReturn JSON only with this exact shape: {"illnessOverview":"...","treatmentAtHospital":"...","specialtyFit":"...","doctorInsights":["...","..."],"estimatedDuration":"...","estimatedCostRange":"...","nextStep":"..."}. Keep concise and patient-friendly.`,
        },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content || "";

  if (!text) {
    return null;
  }

  try {
    const parsed = JSON.parse(text) as unknown;
    if (isValidResponseShape(parsed)) {
      return parsed;
    }
  } catch {
    const extracted = extractJsonObject(text);
    if (!extracted) {
      return null;
    }

    try {
      const parsed = JSON.parse(extracted) as unknown;
      if (isValidResponseShape(parsed)) {
        return parsed;
      }
    } catch {
      return null;
    }
  }

  return null;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as HospitalResearchRequest | null;

  if (!body) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const hospitalId = normalizeString(body.hospitalId);
  const treatment = normalizeString(body.treatment);

  if (!hospitalId || !treatment) {
    return NextResponse.json(
      { message: "Hospital and treatment are required." },
      { status: 400 },
    );
  }

  const fallback = buildFallback(hospitalId, treatment);

  if (!fallback) {
    return NextResponse.json({ message: "Hospital not found." }, { status: 404 });
  }

  const aiResult = await fetchPerplexityHospitalResearch(hospitalId, treatment).catch(() => null);

  return NextResponse.json({
    result: aiResult || fallback,
  });
}
