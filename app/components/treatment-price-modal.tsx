"use client";

import { useState } from "react";
import { TreatmentQuickInquiryForm } from "./treatment-quick-inquiry-form";

type Props = {
  defaultTreatment: string;
  buttonLabel: string;
  buttonClassName: string;
  formCopy?: {
    kicker?: string;
    title?: string;
    description?: string;
    submitLabel?: string;
    inquiryMessage?: string;
  };
};

export function TreatmentPriceModal({ defaultTreatment, buttonLabel, buttonClassName, formCopy }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClassName}>
        {buttonLabel}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label="Treatment inquiry form"
        >
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.6rem] border border-[var(--line)] bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.35)] sm:p-8">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close form"
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-white text-lg leading-none text-slate-700 transition hover:text-slate-950"
            >
              ×
            </button>
            <TreatmentQuickInquiryForm
              defaultTreatment={defaultTreatment}
              mode="modal"
              copy={formCopy}
              onSuccess={() => setOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
