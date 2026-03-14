import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ResearchRequest = {
  query?: unknown;
};

type IllnessCategory = "neurology" | "cardiac" | "orthopedic" | "fertility" | "transplant" | "general";

type ItineraryResearchOption = {
  location: "Delhi" | "Bengaluru" | "Kerala";
  estimatedCostRange: string;
  treatmentTime: string;
  visa: string;
  flight: string;
  stay: string;
  postTreatmentCare: string;
  food: string;
  hotel: string;
  medicines: string;
};

const baseOptions: ItineraryResearchOption[] = [
  {
    location: "Delhi",
    estimatedCostRange: "$900 - $1,900 (diagnostics and specialist pathway)",
    treatmentTime: "3-5 days for specialist review and core diagnostics",
    visa: "Medical visa or e-Medical pathway depending on passport",
    flight: "Direct or one-stop routes to Delhi with medical-assist request",
    stay: "6-8 days recommended for consult and report discussion",
    postTreatmentCare: "2-4 weeks remote follow-up after return",
    food: "Soft low-spice meals and hospital-adjacent dining",
    hotel: "Business hotel or serviced apartment within 20 minutes",
    medicines: "Prescription and pharmacy access on discharge day",
  },
  {
    location: "Bengaluru",
    estimatedCostRange: "$1,100 - $2,300 (consult, diagnostics, planning)",
    treatmentTime: "4-6 days for consultation, tests, and treatment plan",
    visa: "Medical visa support with hospital documentation",
    flight: "One-stop flight options to Bengaluru with wheelchair-assist pre-booking",
    stay: "7-9 days for smoother review and recovery pace",
    postTreatmentCare: "3-4 weeks digital follow-up with medication checks",
    food: "Mild meal options with halal-friendly and continental choices",
    hotel: "Mid-scale hotel near major hospital corridors",
    medicines: "Hospital pharmacy and follow-up prescription support",
  },
  {
    location: "Kerala",
    estimatedCostRange: "$1,000 - $2,100 (consult + slower recovery setup)",
    treatmentTime: "5-7 days for consult, imaging, and phased planning",
    visa: "Medical visa support through international patient desk",
    flight: "One-stop routes to Kochi with calmer arrival windows",
    stay: "8-10 days if patient needs slower recovery pace",
    postTreatmentCare: "3-6 weeks guided follow-up and medicine monitoring",
    food: "Patient-friendly meal plans with lighter dietary options",
    hotel: "Guest stay or nearby hotel for low-stress recovery",
    medicines: "Medicine pickup with clear dosage summary before departure",
  },
];

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function inferIllnessCategory(query: string): IllnessCategory {
  const normalized = query.toLowerCase();

  if (/(headache|migraine|neuro|brain|seizure|stroke)/.test(normalized)) {
    return "neurology";
  }

  if (/(heart|cardiac|angioplasty|bypass|chest pain)/.test(normalized)) {
    return "cardiac";
  }

  if (/(knee|joint|orthopedic|ortho|spine|hip|shoulder)/.test(normalized)) {
    return "orthopedic";
  }

  if (/(ivf|fertility|gyne|gynae|pregnan|embryo)/.test(normalized)) {
    return "fertility";
  }

  if (/(kidney|renal|transplant|dialysis)/.test(normalized)) {
    return "transplant";
  }

  return "general";
}

function treatmentTimeByCategory(category: IllnessCategory, location: ItineraryResearchOption["location"]) {
  if (category === "cardiac") {
    if (location === "Delhi") {
      return "5-7 days for cardiac consult, echo/angiography planning, and intervention review";
    }

    if (location === "Bengaluru") {
      return "6-8 days for cardiology workup, procedure planning, and discharge briefing";
    }

    return "6-9 days for cardiac review with slower recovery-focused planning";
  }

  if (category === "orthopedic") {
    if (location === "Delhi") {
      return "4-6 days for orthopedic consult, imaging review, and surgery planning";
    }

    if (location === "Bengaluru") {
      return "5-7 days for joint/spine assessment and rehabilitation pathway planning";
    }

    return "6-8 days for orthopedic review with supportive recovery pace";
  }

  if (category === "fertility") {
    if (location === "Delhi") {
      return "7-10 days for fertility baseline evaluation and cycle planning";
    }

    if (location === "Bengaluru") {
      return "8-12 days for fertility consult, diagnostics, and protocol finalization";
    }

    return "9-14 days for fertility planning with lower-stress stay schedule";
  }

  if (category === "neurology") {
    if (location === "Delhi") {
      return "3-5 days for neurology second opinion, scans, and treatment review";
    }

    if (location === "Bengaluru") {
      return "4-6 days for neurology consult, diagnostics, and plan confirmation";
    }

    return "5-7 days for neurology review with calmer recovery planning";
  }

  if (category === "transplant") {
    if (location === "Delhi") {
      return "10-16 days for transplant evaluation, surgery planning, and early recovery monitoring";
    }

    if (location === "Bengaluru") {
      return "12-18 days for transplant workup, surgery window, and medicine stabilization";
    }

    return "12-20 days for transplant pathway with slower recovery and follow-up readiness";
  }

  if (location === "Delhi") {
    return "4-6 days for specialist consult and primary diagnostics";
  }

  if (location === "Bengaluru") {
    return "5-7 days for specialist review and treatment planning";
  }

  return "6-8 days for specialist review and recovery-aligned planning";
}

function costRangeByCategory(category: IllnessCategory, location: ItineraryResearchOption["location"]) {
  if (category === "cardiac") {
    if (location === "Delhi") {
      return "$4,800 - $10,500 (cardiology review to intervention window)";
    }

    if (location === "Bengaluru") {
      return "$5,400 - $11,800 (cardiac diagnostics and procedure planning)";
    }

    return "$5,200 - $11,200 (cardiac pathway with recovery-focused stay)";
  }

  if (category === "orthopedic") {
    if (location === "Delhi") {
      return "$3,500 - $8,200 (orthopedic review to surgery planning)";
    }

    if (location === "Bengaluru") {
      return "$3,900 - $8,800 (assessment, surgery planning, rehab setup)";
    }

    return "$3,700 - $8,400 (ortho pathway with gradual recovery stay)";
  }

  if (category === "fertility") {
    if (location === "Delhi") {
      return "$2,200 - $5,400 (fertility workup and cycle planning)";
    }

    if (location === "Bengaluru") {
      return "$2,500 - $5,900 (protocol setup and treatment cycle planning)";
    }

    return "$2,300 - $5,600 (fertility pathway with extended stay comfort)";
  }

  if (category === "neurology") {
    if (location === "Delhi") {
      return "$1,200 - $2,900 (neurology second opinion and imaging)";
    }

    if (location === "Bengaluru") {
      return "$1,400 - $3,200 (neurology consult, diagnostics, care plan)";
    }

    return "$1,300 - $3,000 (neurology review with recovery support)";
  }

  if (category === "transplant") {
    if (location === "Delhi") {
      return "$13,500 - $23,000 (recipient workup, surgery, and early post-transplant care)";
    }

    if (location === "Bengaluru") {
      return "$14,800 - $24,500 (transplant pathway with monitored stabilization phase)";
    }

    return "$14,000 - $23,800 (transplant pathway with extended follow-up readiness)";
  }

  if (location === "Delhi") {
    return "$1,000 - $2,400 (specialist review and diagnostics)";
  }

  if (location === "Bengaluru") {
    return "$1,200 - $2,700 (specialist review and treatment planning)";
  }

  return "$1,100 - $2,500 (specialist pathway and recovery setup)";
}

function buildFallbackOptions(query: string) {
  const category = inferIllnessCategory(query);

  return baseOptions.map((option) => ({
    ...option,
    treatmentTime: treatmentTimeByCategory(category, option.location),
    estimatedCostRange: costRangeByCategory(category, option.location),
  }));
}

function extractJsonObject(text: string) {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return null;
  }

  return text.slice(firstBrace, lastBrace + 1);
}

function normalizeOpenAiOptions(value: unknown): ItineraryResearchOption[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const allowedLocations = new Set(["Delhi", "Bengaluru", "Kerala"]);
  const normalized = value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as Record<string, unknown>;
      const location = normalizeString(candidate.location) as ItineraryResearchOption["location"];

      if (!allowedLocations.has(location)) {
        return null;
      }

      return {
        location,
        estimatedCostRange: normalizeString(candidate.estimatedCostRange),
        treatmentTime: normalizeString(candidate.treatmentTime),
        visa: normalizeString(candidate.visa),
        flight: normalizeString(candidate.flight),
        stay: normalizeString(candidate.stay),
        postTreatmentCare: normalizeString(candidate.postTreatmentCare),
        food: normalizeString(candidate.food),
        hotel: normalizeString(candidate.hotel),
        medicines: normalizeString(candidate.medicines),
      };
    })
    .filter((item): item is ItineraryResearchOption => Boolean(item));

  return normalized.length > 0 ? normalized : null;
}

async function fetchOpenAiResearchOptions(query: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content:
            "You are a medical travel itinerary research assistant. Return concise, practical estimates and planning notes for international patients considering treatment in India.",
        },
        {
          role: "user",
          content: `Illness query: ${query}\n\nReturn JSON only with this shape: {\"options\":[{\"location\":\"Delhi\",\"estimatedCostRange\":\"...\",\"treatmentTime\":\"...\",\"visa\":\"...\",\"flight\":\"...\",\"stay\":\"...\",\"postTreatmentCare\":\"...\",\"food\":\"...\",\"hotel\":\"...\",\"medicines\":\"...\"},{\"location\":\"Bengaluru\",...},{\"location\":\"Kerala\",...}]}. Keep each field short and patient-friendly.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { output_text?: string };
  const outputText = data.output_text || "";

  if (!outputText) {
    return null;
  }

  try {
    const parsed = JSON.parse(outputText) as { options?: unknown };
    return normalizeOpenAiOptions(parsed.options);
  } catch {
    const extracted = extractJsonObject(outputText);

    if (!extracted) {
      return null;
    }

    try {
      const parsed = JSON.parse(extracted) as { options?: unknown };
      return normalizeOpenAiOptions(parsed.options);
    } catch {
      return null;
    }
  }
}

function mergeOptionsWithFallback(fallback: ItineraryResearchOption[], researched: ItineraryResearchOption[] | null) {
  if (!researched) {
    return fallback;
  }

  const byLocation = new Map(researched.map((item) => [item.location, item]));

  return fallback.map((item) => {
    const fromModel = byLocation.get(item.location);

    if (!fromModel) {
      return item;
    }

    return {
      location: item.location,
      estimatedCostRange: fromModel.estimatedCostRange || item.estimatedCostRange,
      treatmentTime: fromModel.treatmentTime || item.treatmentTime,
      visa: fromModel.visa || item.visa,
      flight: fromModel.flight || item.flight,
      stay: fromModel.stay || item.stay,
      postTreatmentCare: fromModel.postTreatmentCare || item.postTreatmentCare,
      food: fromModel.food || item.food,
      hotel: fromModel.hotel || item.hotel,
      medicines: fromModel.medicines || item.medicines,
    };
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ResearchRequest | null;

  if (!body) {
    return NextResponse.json({ message: "Invalid research payload." }, { status: 400 });
  }

  const query = normalizeString(body.query);

  if (!query) {
    return NextResponse.json({ message: "Please provide illness query." }, { status: 400 });
  }

  const fallback = buildFallbackOptions(query);
  const researched = await fetchOpenAiResearchOptions(query).catch(() => null);
  const options = mergeOptionsWithFallback(fallback, researched);

  return NextResponse.json({
    options,
    source: researched ? "openai" : "fallback",
  });
}
