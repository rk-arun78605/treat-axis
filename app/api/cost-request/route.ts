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
  return process.env.DDB_INQUIRIES_TABLE_NAME || process.env.AWS_INQUIRIES_TABLE_NAME || "";
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
    return NextResponse.json({ message: "Invalid cost request." }, { status: 400 });
  }

  const phone = normalizeString(body.phone);
  const promptId = normalizeString(body.promptId);
  const treatmentQuery = normalizeString(body.treatmentQuery);
  const state = normalizeString(body.state);
  const city = normalizeString(body.city);
  const hospital = normalizeString(body.hospital);

  if (!phone || !hospital) {
    return NextResponse.json(
      { message: "Phone number and hospital are required." },
      { status: 400 },
    );
  }

  const client = getDocClient();
  const tableName = getInquiriesTableName();

  if (client && tableName) {
    await ensureInquiryTableExists();
    await client.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          inquiryId: crypto.randomUUID(),
          requestType: "cost-request",
          phone,
          promptId,
          treatmentQuery,
          state,
          city,
          hospital,
          source: "hero-ai",
          submittedAt: new Date().toISOString(),
        },
      }),
    );
  }

  return NextResponse.json({
    message: "Cost request received. TREA team can contact you with the exact estimate.",
  });
}
