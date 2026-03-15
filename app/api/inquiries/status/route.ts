import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const appRegionConfigured = Boolean(
    process.env.APP_REGION ||
      process.env.APP_DEFAULT_REGION ||
      process.env.AWS_REGION ||
      process.env.AWS_DEFAULT_REGION,
  );

  const config = {
    appRegion: appRegionConfigured,
    ddbInquiriesTableName: Boolean(
      process.env.DDB_INQUIRIES_TABLE_NAME || process.env.AWS_INQUIRIES_TABLE_NAME,
    ),
    ddbChatTableName: Boolean(
      process.env.DDB_CHAT_TABLE_NAME || process.env.AWS_CHAT_TABLE_NAME,
    ),
    autoCreateDynamoTables: process.env.AUTO_CREATE_DYNAMO_TABLES === "true",
    perplexityConfigured: Boolean(process.env.PERPLEXITY_API_KEY),
    leadWebhookUrl: Boolean(process.env.LEAD_WEBHOOK_URL),
    whatsappWebhookUrl: Boolean(process.env.WHATSAPP_WEBHOOK_URL),
    googleSheetsWebhookUrl: Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL),
    crmWebhookUrl: Boolean(process.env.CRM_WEBHOOK_URL),
    resendConfigured: Boolean(
      process.env.RESEND_API_KEY &&
        process.env.LEAD_EMAIL_FROM &&
        process.env.LEAD_EMAIL_TO,
    ),
    hubspotConfigured: Boolean(process.env.HUBSPOT_PRIVATE_APP_TOKEN),
  };

  const channelsDetected =
    config.appRegion ||
    config.ddbInquiriesTableName ||
    config.leadWebhookUrl ||
    config.whatsappWebhookUrl ||
    config.googleSheetsWebhookUrl ||
    config.crmWebhookUrl ||
    config.resendConfigured ||
    config.hubspotConfigured;

  return NextResponse.json({
    ok: channelsDetected,
    message: channelsDetected
      ? "At least one delivery channel configuration was detected."
      : "No delivery channels detected. Set app/db or webhook/email/CRM env vars.",
    config,
  });
}
