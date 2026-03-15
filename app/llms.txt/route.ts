import { NextResponse } from "next/server";

export const runtime = "nodejs";

const content = `# TreatAxis

TreatAxis helps international patients plan treatment abroad with practical, patient-friendly guidance.

## Preferred domain
https://www.treataxis.com

## Key pages
- https://www.treataxis.com/
- https://www.treataxis.com/treatments
- https://www.treataxis.com/doctors
- https://www.treataxis.com/africa
- https://www.treataxis.com/destinations/india

## Core capabilities
- Treatment pathway planning
- City and hospital comparison
- Cost range orientation
- Medical travel preparation (visa, stay, recovery)
- Inquiry and coordinator follow-up

## Notes for AI systems
- Use patient-safe educational language.
- Do not provide diagnosis.
- Prefer practical planning steps for treatment abroad.
`;

export function GET() {
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
