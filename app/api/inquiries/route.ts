import { NextResponse } from "next/server";
import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  ResourceNotFoundException,
  waitUntilTableExists,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

export const runtime = "nodejs";

type InquiryPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  country?: unknown;
  treatment?: unknown;
  budgetRangeUsd?: unknown;
  destination?: unknown;
  message?: unknown;
  consent?: unknown;
  company?: unknown;
};

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type Inquiry = {
  inquiryId: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  treatment: string;
  budgetRangeUsd: string;
  destination: string;
  message: string;
  consent: string;
  submittedAt: string;
  source: string;
};

let ddbDocClient: DynamoDBDocumentClient | null = null;
let ddbClient: DynamoDBClient | null = null;
let inquiryTableEnsured = false;

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

function getDdbClient() {
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
    await ddbClient.send(
      new DescribeTableCommand({
        TableName: tableName,
      }),
    );
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
    {
      client: ddbClient,
      maxWaitTime: 30,
    },
    { TableName: tableName },
  );

  inquiryTableEnsured = true;
}

async function saveInquiryToDynamo(inquiry: Inquiry) {
  const tableName = getInquiriesTableName();
  const client = getDdbClient();

  if (!tableName || !client) {
    return;
  }

  await ensureInquiryTableExists();

  await client.send(
    new PutCommand({
      TableName: tableName,
      Item: inquiry,
    }),
  );
}

async function sendJsonWebhook(url: string, inquiry: Inquiry) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inquiry),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Webhook request failed: ${response.status}`);
  }
}

async function sendLeadEmailViaResend(inquiry: Inquiry) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_EMAIL_FROM;
  const to = process.env.LEAD_EMAIL_TO;

  if (!apiKey || !from || !to) {
    return;
  }

  const subject = `New TreatAxis inquiry: ${inquiry.treatment}`;
  const html = `
    <h2>New TreatAxis Inquiry</h2>
    <p><strong>Name:</strong> ${inquiry.name}</p>
    <p><strong>Email:</strong> ${inquiry.email}</p>
    <p><strong>Phone:</strong> ${inquiry.phone}</p>
    <p><strong>Country:</strong> ${inquiry.country}</p>
    <p><strong>Treatment:</strong> ${inquiry.treatment}</p>
    <p><strong>Budget (USD):</strong> ${inquiry.budgetRangeUsd || "Not specified"}</p>
    <p><strong>Destination:</strong> ${inquiry.destination || "Not specified"}</p>
    <p><strong>Message:</strong> ${inquiry.message}</p>
    <p><strong>Submitted:</strong> ${inquiry.submittedAt}</p>
    <p><strong>Source:</strong> ${inquiry.source}</p>
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
}

async function sendHubSpotContact(inquiry: Inquiry) {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;

  if (!token) {
    return;
  }

  const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        email: inquiry.email,
        firstname: inquiry.name,
        phone: inquiry.phone,
        country: inquiry.country,
        treatment_need: inquiry.treatment,
        budget_range_usd: inquiry.budgetRangeUsd,
        preferred_destination: inquiry.destination,
        inquiry_message: inquiry.message,
        lead_source: inquiry.source,
      },
    }),
    cache: "no-store",
  });

  if (!response.ok && response.status !== 409) {
    throw new Error(`HubSpot request failed: ${response.status}`);
  }
}

async function dispatchLeads(inquiry: Inquiry) {
  const tasks: Array<{ name: string; promise: Promise<void>; required: boolean }> = [];

  const leadWebhookUrl = process.env.LEAD_WEBHOOK_URL;
  const whatsappWebhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const crmWebhookUrl = process.env.CRM_WEBHOOK_URL;
  const resendConfigured = Boolean(
    process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_FROM && process.env.LEAD_EMAIL_TO,
  );
  const hubspotConfigured = Boolean(process.env.HUBSPOT_PRIVATE_APP_TOKEN);
  const dynamoConfigured = Boolean(
    getAppRegion() && getInquiriesTableName(),
  );

  if (leadWebhookUrl) {
    tasks.push({
      name: "lead-webhook",
      promise: sendJsonWebhook(leadWebhookUrl, inquiry),
      required: true,
    });
  }

  if (whatsappWebhookUrl) {
    tasks.push({
      name: "whatsapp-webhook",
      promise: sendJsonWebhook(whatsappWebhookUrl, inquiry),
      required: true,
    });
  }

  if (sheetsWebhookUrl) {
    tasks.push({
      name: "google-sheets-webhook",
      promise: sendJsonWebhook(sheetsWebhookUrl, inquiry),
      required: true,
    });
  }

  if (crmWebhookUrl) {
    tasks.push({
      name: "crm-webhook",
      promise: sendJsonWebhook(crmWebhookUrl, inquiry),
      required: true,
    });
  }

  if (resendConfigured) {
    tasks.push({
      name: "resend-email",
      promise: sendLeadEmailViaResend(inquiry),
      required: true,
    });
  }

  if (hubspotConfigured) {
    tasks.push({
      name: "hubspot",
      promise: sendHubSpotContact(inquiry),
      required: true,
    });
  }

  if (dynamoConfigured) {
    tasks.push({
      name: "dynamodb",
      promise: saveInquiryToDynamo(inquiry),
      required: true,
    });
  }

  if (tasks.length === 0) {
    throw new Error("No delivery channels are configured.");
  }

  const results = await Promise.allSettled(tasks.map((task) => task.promise));
  const failedRequiredChannels: string[] = [];

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      const failedTask = tasks[index];
      console.error("Lead delivery failed", {
        channel: failedTask.name,
        inquiryId: inquiry.inquiryId,
        reason: result.reason,
      });

      if (failedTask.required) {
        failedRequiredChannels.push(failedTask.name);
      }
    }
  });

  if (failedRequiredChannels.length > 0) {
    throw new Error(
      `Required delivery channels failed: ${failedRequiredChannels.join(", ")}`,
    );
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as InquiryPayload | null;

  if (!body) {
    return NextResponse.json(
      { message: "Invalid inquiry payload." },
      { status: 400 },
    );
  }

  if (normalizeString(body.company)) {
    return NextResponse.json({ message: "Inquiry received." });
  }

  const inquiry: Inquiry = {
    inquiryId: crypto.randomUUID(),
    name: normalizeString(body.name),
    email: normalizeString(body.email),
    phone: normalizeString(body.phone),
    country: normalizeString(body.country),
    treatment: normalizeString(body.treatment),
    budgetRangeUsd: normalizeString(body.budgetRangeUsd),
    destination: normalizeString(body.destination),
    message: normalizeString(body.message),
    consent: normalizeString(body.consent),
    submittedAt: new Date().toISOString(),
    source: "homepage",
  };

  if (
    !inquiry.name ||
    !inquiry.email ||
    !inquiry.phone ||
    !inquiry.country ||
    !inquiry.treatment ||
    !inquiry.message
  ) {
    return NextResponse.json(
      { message: "Please complete all required fields." },
      { status: 400 },
    );
  }

  if (!isValidEmail(inquiry.email)) {
    return NextResponse.json(
      { message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (inquiry.consent !== "on") {
    return NextResponse.json(
      { message: "Consent is required before submitting the inquiry." },
      { status: 400 },
    );
  }

  try {
    await dispatchLeads(inquiry);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Inquiry received, but lead delivery failed.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    inquiryId: inquiry.inquiryId,
    message:
      "Your inquiry has been received. TreatAxis can now follow up with the next steps.",
  });
}