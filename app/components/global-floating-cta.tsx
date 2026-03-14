"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { TreatmentQuickInquiryForm } from "./treatment-quick-inquiry-form";
import { treatments } from "../../lib/seo-content";

export function GlobalFloatingCta() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const pageCtaConfig = useMemo(() => {
    if (pathname.startsWith("/doctors")) {
      return {
        label: "Book appointment",
        defaultTreatment: "Doctor Consultation",
        copy: {
          kicker: "Appointment",
          title: "Share 4 details to book appointment support",
          description:
            "Submit your details and our care team will connect you with suitable specialist appointment options.",
          submitLabel: "Book appointment",
          inquiryMessage: "Appointment request from doctors page.",
        },
      };
    }

    if (pathname.startsWith("/treatments")) {
      const slug = pathname.split("/")[2] || "";
      const matchedTreatment = treatments.find((item) => item.slug === slug);

      return {
        label: pathname === "/treatments" ? "Check treatment price" : "Check price",
        defaultTreatment: matchedTreatment?.name || "Treatment Planning",
      };
    }

    if (pathname.startsWith("/destinations")) {
      return {
        label: "Get treatment estimate",
        defaultTreatment: "Treatment Planning",
        copy: {
          kicker: "Treatment Estimate",
          title: "Share 4 details to get your treatment estimate",
          description:
            "Submit your details and we will share hospital and treatment estimate options for your preferred destination.",
          submitLabel: "Get treatment estimate",
          inquiryMessage: "Treatment estimate request from destinations page.",
        },
      };
    }

    return {
      label: "Share details",
      defaultTreatment: "Treatment Planning",
    };
  }, [pathname]);

  if (pathname === "/") {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(15,118,110,0.35)] transition hover:bg-[var(--brand-dark)]"
      >
        {pageCtaConfig.label}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/65 px-4 py-6">
          <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[1.5rem] border border-[var(--line)] bg-white p-6 sm:p-8">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close form"
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] text-lg text-slate-700 transition hover:text-slate-900"
            >
              ×
            </button>
            <TreatmentQuickInquiryForm
              defaultTreatment={pageCtaConfig.defaultTreatment}
              mode="modal"
              copy={pageCtaConfig.copy}
              onSuccess={() => setOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
