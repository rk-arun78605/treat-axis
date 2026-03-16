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

type CostRequestPayload = {
  phone?: unknown;
  promptId?: unknown;
  treatmentQuery?: unknown;
  state?: unknown;
  city?: unknown;
  hospital?: unknown;
};

type CostRequestResponse = {
  message: string;
  inquiryId?: string;
  saved?: boolean;
  emailSent?: boolean;
  emailConfigured?: boolean;
  resolvedRegion?: string;
  resolvedTableName?: string;
};

function jsonResponse(payload: CostRequestResponse, status?: number) {
  if (typeof status === "number") {
    return NextResponse.json(payload, { status });
  }

  return NextResponse.json(payload);
}

async function sendCostRequestEmailViaResend(payload: {
  inquiryId: string;
  phone: string;
  treatmentQuery: string;
  hospital: string;
  city: string;
  state: string;
  promptId: string;
  submittedAt: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_EMAIL_FROM;
  const to = process.env.LEAD_EMAIL_TO;

  if (!apiKey || !from || !to) {
    return false;
  }

  const subject = `New TreatAxis check-price request: ${payload.hospital}`;
  const html = `
    <h2>New Check Price Request</h2>
    <p><strong>Inquiry ID:</strong> ${payload.inquiryId}</p>
    <p><strong>Phone:</strong> ${payload.phone}</p>
    <p><strong>Treatment Query:</strong> ${payload.treatmentQuery || "Not specified"}</p>
    <p><strong>Hospital:</strong> ${payload.hospital}</p>
    <p><strong>City:</strong> ${payload.city || "Not specified"}</p>
    <p><strong>State:</strong> ${payload.state || "Not specified"}</p>
    <p><strong>Prompt ID:</strong> ${payload.promptId || "Not specified"}</p>
    <p><strong>Submitted At:</strong> ${payload.submittedAt}</p>
    <p><strong>Source:</strong> hero-ai</p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Resend request failed: ${response.status}`);
  }

  return true;
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
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

function getInquiriesTableName() {
  return (
    process.env.DDB_INQUIRIES_TABLE_NAME ||
    process.env.AWS_INQUIRIES_TABLE_NAME ||
    "treataxis-inquiries-prod"
  );
}

function shouldAutoCreateTables() {
  return process.env.AUTO_CREATE_DYNAMO_TABLES === "true";
}

let ddbClient: DynamoDBClient | null = null;
let ddbDocClient: DynamoDBDocumentClient | null = null;
let inquiryTableEnsured = false;

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

async function ensureInquiryTableExists() {
  const tableName = getInquiriesTableName();

  if (!tableName || !shouldAutoCreateTables() || inquiryTableEnsured) {
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
    inquiryTableEnsured = true;
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
      AttributeDefinitions: [{ AttributeName: "inquiryId", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "inquiryId", KeyType: "HASH" }],
    }),
  );

  await waitUntilTableExists(
    { client: ddbClient, maxWaitTime: 30 },
    { TableName: tableName },
  );

  inquiryTableEnsured = true;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CostRequestPayload | null;

  if (!body) {
    return jsonResponse({ message: "Invalid cost request." }, 400);
  }

  const phone = normalizeString(body.phone);
  const promptId = normalizeString(body.promptId);
  const treatmentQuery = normalizeString(body.treatmentQuery);
  const state = normalizeString(body.state);
  const city = normalizeString(body.city);
  const hospital = normalizeString(body.hospital);
  const inquiryId = crypto.randomUUID();
  const submittedAt = new Date().toISOString();
  const resolvedRegion = getAppRegion();
  const emailConfigured = Boolean(
    process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_FROM && process.env.LEAD_EMAIL_TO,
  );

  if (!phone || !hospital) {
    return jsonResponse({
      message: "Phone number and hospital are required.",
    }, 400);
  }

  const client = getDocClient();
  const tableName = getInquiriesTableName();

  if (!client || !tableName) {
    console.error("Cost request storage not configured", {
      hasClient: Boolean(client),
      hasTableName: Boolean(tableName),
      resolvedRegion,
      resolvedTableName: tableName,
    });

    return jsonResponse({
      message:
        "Storage is not configured. Please set APP_REGION and DDB_INQUIRIES_TABLE_NAME in Amplify.",
      inquiryId,
      saved: false,
      resolvedRegion,
      resolvedTableName: tableName,
    }, 503);
  }

  try {
    await ensureInquiryTableExists();
    await client.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          inquiryId,
          requestType: "cost-request",
          phone,
          promptId,
          treatmentQuery,
          state,
          city,
          hospital,
          source: "hero-ai",
          submittedAt,
        },
      }),
    );
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown DynamoDB write failure.";
    console.error("Failed to save cost request", {
      reason,
      inquiryId,
      tableName,
      resolvedRegion,
    });

    return jsonResponse({
      message: "Unable to save your request right now. Please try again shortly.",
      inquiryId,
      saved: false,
      resolvedRegion,
      resolvedTableName: tableName,
    }, 502);
  }

  let emailSent = false;
  if (emailConfigured) {
    emailSent = await sendCostRequestEmailViaResend({
      inquiryId,
      phone,
      treatmentQuery,
      hospital,
      city,
      state,
      promptId,
      submittedAt,
    }).catch((error) => {
      console.error("Failed to send cost request email", {
        inquiryId,
        reason: error instanceof Error ? error.message : "Unknown email failure.",
      });
      return false;
    });
  }

  return jsonResponse({
    message: "Cost request saved. TREA team can contact you with the exact estimate.",
    inquiryId,
    saved: true,
    emailSent,
    emailConfigured,
    resolvedRegion,
    resolvedTableName: tableName,
  });
}
