import { NextResponse } from "next/server";
import { scoreHtml } from "../../../lib/seo-audit";

type AuditRequest = {
  url?: string;
};

function normalizeUrl(input: string): string | null {
  try {
    const parsed = new URL(input.startsWith("http") ? input : `https://${input}`);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AuditRequest;
    const normalized = normalizeUrl(body.url || "");

    if (!normalized) {
      return NextResponse.json({ error: "Please provide a valid URL." }, { status: 400 });
    }

    const response = await fetch(normalized, {
      headers: {
        "User-Agent": "TreatAxisAuditBot/1.0 (+https://www.treataxis.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Unable to fetch URL. HTTP status ${response.status}.` },
        { status: 400 },
      );
    }

    const html = await response.text();
    const result = scoreHtml(normalized, html);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Audit failed. Ensure the page is publicly accessible and try again." },
      { status: 500 },
    );
  }
}