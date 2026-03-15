import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  ResourceNotFoundException,
  waitUntilTableExists,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatRequest = {
  sessionId?: unknown;
  message?: unknown;
  profile?: {
    whatsappNumber?: unknown;
    careTier?: unknown;
    treatment?: unknown;
    budgetRangeUsd?: unknown;
    country?: unknown;
    ageGroup?: unknown;
    travelMonth?: unknown;
    reportsAvailable?: unknown;
    attendantRequired?: unknown;
  };
};

type CareOption = {
  id: "low-cost" | "mid-range" | "premium";
  label: string;
};

type IndiaHospitalOption = {
  city: string;
  hospitals: string[];
  secondOpinionRangeUsd: string;
  mriConsultRangeUsd: string;
  stayBudgetPerDayUsd: string;
  notes: string;
};

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function includesIndia(value: string) {
  return value.toLowerCase().includes("india");
}

function normalizeTreatmentLabel(treatment: string, question: string) {
  const combined = `${treatment} ${question}`.toLowerCase();

  if (combined.includes("head") || combined.includes("migraine") || combined.includes("neuro")) {
    return "Neurology second opinion";
  }

  if (combined.includes("kidney") || combined.includes("renal") || combined.includes("transplant")) {
    return "Kidney transplant evaluation";
  }

  return treatment || "Second opinion";
}

function getIndiaOptionsByTier(careTier: string): IndiaHospitalOption[] {
  if (careTier === "low-cost") {
    return [
      {
        city: "Delhi NCR",
        hospitals: ["AIIMS (public route)", "Safdarjung linked referral path", "Max Smart (budget slots)"],
        secondOpinionRangeUsd: "$40 - $120",
        mriConsultRangeUsd: "$140 - $320",
        stayBudgetPerDayUsd: "$22 - $45",
        notes: "Strong for budget-first evaluation if dates are planned early.",
      },
      {
        city: "Chennai",
        hospitals: ["Govt-super-specialty referral path", "SIMS (economy consult)", "Dr. Rela group OP pathways"],
        secondOpinionRangeUsd: "$35 - $110",
        mriConsultRangeUsd: "$130 - $300",
        stayBudgetPerDayUsd: "$20 - $40",
        notes: "Often good cost-to-quality balance for neurology reviews.",
      },
    ];
  }

  if (careTier === "premium") {
    return [
      {
        city: "Mumbai",
        hospitals: ["Kokilaben Dhirubhai Ambani", "Nanavati Max", "H N Reliance"],
        secondOpinionRangeUsd: "$180 - $420",
        mriConsultRangeUsd: "$420 - $980",
        stayBudgetPerDayUsd: "$70 - $170",
        notes: "Fast appointments and concierge-style international support.",
      },
      {
        city: "Delhi NCR",
        hospitals: ["Medanta", "Fortis Escorts", "BLK-Max"],
        secondOpinionRangeUsd: "$170 - $380",
        mriConsultRangeUsd: "$380 - $900",
        stayBudgetPerDayUsd: "$65 - $150",
        notes: "Premium workflows with tighter turnaround for reports.",
      },
    ];
  }

  return [
    {
      city: "Bengaluru",
      hospitals: ["Manipal", "Aster CMI", "Narayana Health"],
      secondOpinionRangeUsd: "$90 - $220",
      mriConsultRangeUsd: "$250 - $540",
      stayBudgetPerDayUsd: "$35 - $75",
      notes: "Balanced option for specialist access and predictable costs.",
    },
    {
      city: "Hyderabad",
      hospitals: ["Apollo", "Yashoda", "KIMS"],
      secondOpinionRangeUsd: "$85 - $210",
      mriConsultRangeUsd: "$220 - $500",
      stayBudgetPerDayUsd: "$30 - $68",
      notes: "Good middle path for diagnostics + specialist consultation.",
    },
  ];
}

function buildIndiaTravelSupportBlock() {
  return [
    "Travel support checklist (simple):",
    "1. Medical visa: Usually e-Medical or paper medical visa based on nationality.",
    "2. Interpreter: Hindi, Tamil, Arabic, French interpreters are usually available with pre-booking.",
    "3. Hotel stay: Book near hospital within 20-30 minutes drive.",
    "4. Local transport: App cab + one backup hospital cab contact.",
    "5. Food: Soft, low-spice meals near hospital for headache cases.",
    "6. Post-visit: Keep digital copies of scans and doctor notes before return.",
  ].join("\n");
}

function buildIndiaCarePlan(payload: {
  careTier: string;
  treatment: string;
  question: string;
  budgetRangeUsd: string;
  ageGroup: string;
  travelMonth: string;
  reportsAvailable: string;
  attendantRequired: string;
}) {
  const treatmentLabel = normalizeTreatmentLabel(payload.treatment, payload.question);
  const tierLabel =
    payload.careTier === "low-cost"
      ? "Low-cost"
      : payload.careTier === "mid-range"
        ? "Mid-range"
        : "Premium";

  const options = getIndiaOptionsByTier(payload.careTier);

  const optionsBlock = options
    .map((option, index) => {
      return [
        `${index + 1}. ${option.city}`,
        `Hospitals: ${option.hospitals.join(", ")}`,
        `Second-opinion consult: ${option.secondOpinionRangeUsd}`,
        `Consult + MRI package (approx): ${option.mriConsultRangeUsd}`,
        `Hotel/day near hospital: ${option.stayBudgetPerDayUsd}`,
        `Note: ${option.notes}`,
      ].join("\n");
    })
    .join("\n\n");

  const missingOneNextStep = !payload.travelMonth
    ? "Next small step: share expected travel month."
    : !payload.reportsAvailable
      ? "Next small step: confirm if reports are available (yes/no)."
      : !payload.attendantRequired
        ? "Next small step: confirm if an attendant will travel (yes/no)."
        : "Next small step: share passport nationality so visa type can be narrowed.";

  return [
    `Understood. You selected ${tierLabel} hospitals for ${treatmentLabel} in India.`,
    `Budget noted: ${payload.budgetRangeUsd || "not shared"}. Age group: ${payload.ageGroup || "not shared"}.`,
    "Recommended options:",
    optionsBlock,
    buildIndiaTravelSupportBlock(),
    missingOneNextStep,
  ].join("\n\n");
}

function getAppRegion() {
  return (
    process.env.APP_REGION ||
    process.env.APP_DEFAULT_REGION ||
    process.env.AWS_REGION ||
    process.env.AWS_DEFAULT_REGION ||
    ""
  );
}

function getChatTableName() {
  return process.env.DDB_CHAT_TABLE_NAME || process.env.AWS_CHAT_TABLE_NAME || "";
}

function shouldAutoCreateTables() {
  return process.env.AUTO_CREATE_DYNAMO_TABLES === "true";
}

let ddbClient: DynamoDBClient | null = null;
let ddbDocClient: DynamoDBDocumentClient | null = null;
let chatTableEnsured = false;

function getDocClient() {
  const region = getAppRegion();

  if (!region) {
    return null;
  }

  if (!ddbClient) {
    ddbClient = new DynamoDBClient({ region });
  }

  if (!ddbDocClient) {
    ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
  }

  return ddbDocClient;
}

async function ensureChatTableExists() {
  const tableName = getChatTableName();

  if (!tableName || !shouldAutoCreateTables() || chatTableEnsured) {
    return;
  }

  const region = getAppRegion();

  if (!region) {
    return;
  }

  if (!ddbClient) {
    ddbClient = new DynamoDBClient({ region });
  }

  try {
    await ddbClient.send(new DescribeTableCommand({ TableName: tableName }));
    chatTableEnsured = true;
    return;
  } catch (error) {
    if (!(error instanceof ResourceNotFoundException)) {
      throw error;
    }
  }

  await ddbClient.send(
    new CreateTableCommand({
      TableName: tableName,
      BillingMode: "PAY_PER_REQUEST",
      AttributeDefinitions: [{ AttributeName: "chatId", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "chatId", KeyType: "HASH" }],
    }),
  );

  await waitUntilTableExists(
    { client: ddbClient, maxWaitTime: 30 },
    { TableName: tableName },
  );

  chatTableEnsured = true;
}

async function saveChatRecord(record: {
  chatId: string;
  sessionId: string;
  userMessage: string;
  assistantMessage: string;
  whatsappNumber: string;
  careTier: string;
  treatment: string;
  budgetRangeUsd: string;
  country: string;
  ageGroup: string;
  travelMonth: string;
  reportsAvailable: string;
  attendantRequired: string;
  createdAt: string;
}) {
  const tableName = getChatTableName();
  const client = getDocClient();

  if (!tableName || !client) {
    return;
  }

  await ensureChatTableExists();

  await client.send(
    new PutCommand({
      TableName: tableName,
      Item: record,
    }),
  );
}

function buildFallbackMessage(payload: {
  whatsappNumber: string;
  careTier: string;
  treatment: string;
  budgetRangeUsd: string;
  country: string;
  ageGroup: string;
  travelMonth: string;
  reportsAvailable: string;
  attendantRequired: string;
  question: string;
}) {
  if (!payload.budgetRangeUsd) {
    return "What is your budget in USD?";
  }

  if (!payload.treatment) {
    return "What treatment or health issue do you need help with?";
  }

  if (!payload.country) {
    return "Which country are you traveling from?";
  }

  const missingOptionalPrompt =
    !payload.travelMonth
      ? "What month do you want to travel?"
      : !payload.reportsAvailable
        ? "Do you have medical reports? yes or no"
        : !payload.attendantRequired
          ? "Will someone travel with the patient? yes or no"
          : "";

  const treatment = payload.treatment || "your required treatment";
  const budget = payload.budgetRangeUsd || "your budget";
  const country = payload.country || "your country";
  const ageGroup = payload.ageGroup || "not shared";
  const careTier = payload.careTier || "";

  if (careTier) {
    const tierLabel =
      careTier === "low-cost"
        ? "low-cost"
        : careTier === "mid-range"
          ? "mid-range"
          : "premium";

    return [
      "Understood. I will keep this simple.",
      `Selected option: ${tierLabel} hospitals in India.`,
      `Need: ${treatment}. Budget: ${budget}. Country: ${country}. Age: ${ageGroup}.`,
      payload.whatsappNumber ? "" : "If you want callback support, share your WhatsApp number with country code any time.",
      payload.question
        ? `For your question: ${payload.question}`
        : "Please ask your main medical question in one sentence.",
      missingOptionalPrompt
        ? `Next: ${missingOptionalPrompt}`
        : "No more basic details needed. Ask anything and I will answer in simple words.",
    ].join("\n");
  }

  return [
    "I understand this can feel stressful. I will guide you step by step.",
    `Need: ${treatment}. Budget: ${budget}. Country: ${country}. Age: ${ageGroup}.`,
    payload.whatsappNumber ? "" : "If you want callback support, share your WhatsApp number with country code any time.",
    "Please choose hospital type using the options shown below.",
    payload.question
      ? `For your question: ${payload.question}`
      : "Please ask your main medical question in one sentence.",
    missingOptionalPrompt ? `Next: ${missingOptionalPrompt}` : "You can now ask any question and I will keep answers short.",
  ].join("\n");
}

async function generateAssistantMessage(input: {
  whatsappNumber: string;
  careTier: string;
  question: string;
  treatment: string;
  budgetRangeUsd: string;
  country: string;
  ageGroup: string;
  travelMonth: string;
  reportsAvailable: string;
  attendantRequired: string;
}) {
  const indiaIntent = includesIndia(input.country) || includesIndia(input.question);

  if (indiaIntent && input.careTier) {
    return buildIndiaCarePlan({
      careTier: input.careTier,
      treatment: input.treatment,
      question: input.question,
      budgetRangeUsd: input.budgetRangeUsd,
      ageGroup: input.ageGroup,
      travelMonth: input.travelMonth,
      reportsAvailable: input.reportsAvailable,
      attendantRequired: input.attendantRequired,
    });
  }

  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    return buildFallbackMessage(input);
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
            "You are TREA medical travel assistant. Use empathetic, simple language for families and elderly users. Keep answers short. Ask only one small follow-up question at a time. Never ask for details already provided in context. If country or query is India, include 3 options in this order: low-cost, mid-range, premium only when care tier is not yet selected.",
        },
        {
          role: "user",
          content: `Question: ${input.question}\nWhatsApp: ${input.whatsappNumber}\nCare tier selected: ${input.careTier}\nTreatment: ${input.treatment}\nBudget: ${input.budgetRangeUsd}\nCountry: ${input.country}\nAge group: ${input.ageGroup}\nTravel month: ${input.travelMonth}\nReports available: ${input.reportsAvailable}\nAttendant required: ${input.attendantRequired}`,
        },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    return buildFallbackMessage(input);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content || "";

  let output = content || buildFallbackMessage(input);

  if (input.travelMonth) {
    output = output.replace(/\b(what month do you want to travel\?|expected travel month\??|share your expected travel month\.?)/gi, "");
  }

  output = output.replace(/India has 3 practical options:[\s\S]*?(premium hospitals\.?)/i, "");
  output = output.replace(/1\.\s*Low-cost hospitals[\s\S]*?3\.\s*Premium hospitals\.?/i, "");

  return output.trim();
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ChatRequest | null;

  if (!body) {
    return NextResponse.json({ message: "Invalid chat payload." }, { status: 400 });
  }

  const sessionId = normalizeString(body.sessionId) || crypto.randomUUID();
  const question = normalizeString(body.message);
  const whatsappNumber = normalizeString(body.profile?.whatsappNumber);
  const careTier = normalizeString(body.profile?.careTier);
  const treatment = normalizeString(body.profile?.treatment);
  const budgetRangeUsd = normalizeString(body.profile?.budgetRangeUsd);
  const country = normalizeString(body.profile?.country);
  const ageGroup = normalizeString(body.profile?.ageGroup);
  const travelMonth = normalizeString(body.profile?.travelMonth);
  const reportsAvailable = normalizeString(body.profile?.reportsAvailable);
  const attendantRequired = normalizeString(body.profile?.attendantRequired);

  if (!question) {
    return NextResponse.json({ message: "Please ask a question." }, { status: 400 });
  }

  const assistantMessage = await generateAssistantMessage({
    whatsappNumber,
    careTier,
    question,
    treatment,
    budgetRangeUsd,
    country,
    ageGroup,
    travelMonth,
    reportsAvailable,
    attendantRequired,
  });

  await saveChatRecord({
    chatId: crypto.randomUUID(),
    sessionId,
    userMessage: question,
    assistantMessage,
    whatsappNumber,
    careTier,
    treatment,
    budgetRangeUsd,
    country,
    ageGroup,
    travelMonth,
    reportsAvailable,
    attendantRequired,
    createdAt: new Date().toISOString(),
  }).catch((error) => {
    console.error("Unable to save chat record", error);
  });

  const indiaIntent = includesIndia(country) || includesIndia(question);

  const careOptions: CareOption[] = indiaIntent && !careTier
    ? [
        { id: "low-cost", label: "Low-cost hospitals" },
        { id: "mid-range", label: "Mid-range hospitals" },
        { id: "premium", label: "Premium hospitals" },
      ]
    : [];

  const finalReply =
    careOptions.length > 0
      ? `${assistantMessage}\n\nPlease tap one hospital option below.`
      : assistantMessage;

  return NextResponse.json({
    sessionId,
    reply: finalReply,
    careOptions,
  });
}
