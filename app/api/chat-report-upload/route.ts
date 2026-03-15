import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_REPORT_SIZE_BYTES = 2 * 1024 * 1024;

function getAppRegion() {
  return (
    process.env.APP_REGION ||
    process.env.APP_DEFAULT_REGION ||
    process.env.AWS_REGION ||
    process.env.AWS_DEFAULT_REGION ||
    ""
  );
}

function getReportsBucketName() {
  return (
    process.env.APP_REPORTS_BUCKET_NAME ||
    process.env.REPORTS_BUCKET_NAME ||
    "treataxis-reports-prod-011422533024"
  );
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return NextResponse.json({ message: "Invalid upload payload." }, { status: 400 });
  }

  const file = formData.get("file");
  const sessionId = String(formData.get("sessionId") || "").trim() || crypto.randomUUID();

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Please upload one PDF file." }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ message: "Only PDF files are allowed." }, { status: 400 });
  }

  if (file.size > MAX_REPORT_SIZE_BYTES) {
    return NextResponse.json({ message: "PDF must be 2 MB or smaller." }, { status: 400 });
  }

  const region = getAppRegion();
  const bucket = getReportsBucketName();

  if (!region || !bucket) {
    return NextResponse.json({
      message: "Report upload is not configured yet. Continuing without upload.",
      uploaded: false,
      configured: false,
    });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const objectKey = `chat-reports/${sessionId}/${Date.now()}-${safeName}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const s3Client = new S3Client({ region });

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: buffer,
      ContentType: "application/pdf",
    }),
  );

  return NextResponse.json({
    message: "Report uploaded successfully.",
    uploaded: true,
    configured: true,
    key: objectKey,
  });
}
