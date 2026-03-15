"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "../../lib/analytics";

type Message = {
  role: "user" | "assistant";
  text: string;
};

type CareOption = {
  id: "low-cost" | "mid-range" | "premium";
  label: string;
};

type ProfileField =
  | "country"
  | "whatsappNumber"
  | "treatment"
  | "budgetRangeUsd"
  | "ageGroup"
  | "travelMonth"
  | "reportsAvailable";

type OnboardingStep = {
  field: ProfileField;
  question: string;
  required: boolean;
};

const onboardingSteps: OnboardingStep[] = [
  {
    field: "country",
    question: "Which country are you traveling from? You can type skip.",
    required: false,
  },
  {
    field: "whatsappNumber",
    question:
      "I understand this can feel stressful. Please share WhatsApp number only.",
    required: true,
  },
  {
    field: "treatment",
    question: "What treatment or health issue do you need help with?",
    required: true,
  },
  {
    field: "budgetRangeUsd",
    question: "Please select your budget in USD.",
    required: true,
  },
  {
    field: "ageGroup",
    question:
      "Please select age group: infant, toddler, child, adult, aged, or old age.",
    required: false,
  },
  {
    field: "travelMonth",
    question: "Expected travel month?",
    required: false,
  },
  {
    field: "reportsAvailable",
    question: "Do you have medical reports? (yes/no)",
    required: false,
  },
];

const initialMessages: Message[] = [
  {
    role: "assistant",
    text: onboardingSteps[0].question,
  },
];

function getStepChoices(field?: ProfileField) {
  if (!field) {
    return [] as string[];
  }

  if (field === "budgetRangeUsd") {
    return [
      "under-3000",
      "3000-7000",
      "7000-15000",
      "15000-30000",
      "above-30000",
    ];
  }

  if (field === "ageGroup") {
    return ["infant", "toddler", "child", "adult", "aged", "old age", "skip"];
  }

  if (field === "travelMonth") {
    const now = new Date();
    const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const nextMonthLabel = nextMonthDate.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });

    return [
      "<7 days",
      "7-15 days",
      `${nextMonthLabel}`,
      "within 2 months",
      "within 6 months",
      "next year",
      "skip",
    ];
  }

  if (field === "reportsAvailable") {
    return ["yes", "no", "skip"];
  }

  return [] as string[];
}

const dialCodeByRegion: Record<string, string> = {
  IN: "+91",
  GH: "+233",
  US: "+1",
  CA: "+1",
  GB: "+44",
  AE: "+971",
  SA: "+966",
  AU: "+61",
  NG: "+234",
};

const dialCodeByCountryName: Record<string, string> = {
  india: "+91",
  ghana: "+233",
  nigeria: "+234",
  kenya: "+254",
  tanzania: "+255",
  uganda: "+256",
  ethiopia: "+251",
  morocco: "+212",
  egypt: "+20",
  maldives: "+960",
  "united states": "+1",
  usa: "+1",
  canada: "+1",
  uk: "+44",
  "united kingdom": "+44",
  uae: "+971",
  "united arab emirates": "+971",
  "saudi arabia": "+966",
  australia: "+61",
};

function detectDialCode() {
  if (typeof navigator === "undefined") {
    return "+1";
  }

  const region = (navigator.language.match(/-([A-Za-z]{2})$/)?.[1] || "US").toUpperCase();
  return dialCodeByRegion[region] || "+1";
}

function normalizeWhatsappNumber(raw: string, dialCode: string) {
  const compact = raw.replace(/[\s()-]/g, "");

  if (compact.startsWith("+")) {
    return compact;
  }

  if (compact.startsWith("00")) {
    return `+${compact.slice(2)}`;
  }

  const digitsOnly = compact.replace(/\D/g, "");
  if (!digitsOnly) {
    return "";
  }

  const local = digitsOnly.startsWith("0") ? digitsOnly.slice(1) : digitsOnly;
  return `${dialCode}${local}`;
}

function getDialCodeFromCountry(country: string) {
  return dialCodeByCountryName[country.trim().toLowerCase()] || "";
}

function withDialCode(phone: string, dialCode: string) {
  const digits = phone.replace(/\D/g, "");
  const dialDigits = dialCode.replace(/\D/g, "");

  if (!digits || !dialDigits) {
    return phone;
  }

  if (digits.startsWith(dialDigits)) {
    return `+${digits}`;
  }

  const local = digits.startsWith("0") ? digits.slice(1) : digits;
  return `${dialCode}${local}`;
}

export function TreaChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string>(() => crypto.randomUUID());
  const [currentStep, setCurrentStep] = useState(0);
  const [careOptions, setCareOptions] = useState<CareOption[]>([]);
  const [detectedDialCode, setDetectedDialCode] = useState("+1");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [profile, setProfile] = useState({
    whatsappNumber: "",
    careTier: "",
    treatment: "",
    budgetRangeUsd: "",
    country: "",
    ageGroup: "",
    travelMonth: "",
    reportsAvailable: "",
  });
  const [requiresReportUpload, setRequiresReportUpload] = useState(false);
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportStatus, setReportStatus] = useState("");
  const [reportUploading, setReportUploading] = useState(false);

  function resetConversation() {
    setMessages(initialMessages);
    setInput("");
    setSessionId(crypto.randomUUID());
    setCurrentStep(0);
    setCareOptions([]);
    setProfile({
      whatsappNumber: "",
      careTier: "",
      treatment: "",
      budgetRangeUsd: "",
      country: "",
      ageGroup: "",
      travelMonth: "",
      reportsAvailable: "",
    });
    setRequiresReportUpload(false);
    setReportFile(null);
    setReportStatus("");
    setReportUploading(false);
  }

  const currentStepConfig =
    currentStep < onboardingSteps.length ? onboardingSteps[currentStep] : undefined;
  const stepChoices = getStepChoices(currentStepConfig?.field);

  useEffect(() => {
    setDetectedDialCode(detectDialCode());
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading, careOptions, currentStep, isOpen]);

  const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

  function buildCompletionMessage(nextProfile: {
    treatment: string;
    budgetRangeUsd: string;
    country: string;
    ageGroup: string;
  }) {
    return [
      "!!. Thank you for your details..!!",
      `I understand this can feel stressful. I will guide you step by step. Need: ${nextProfile.treatment || "not shared"}. Budget: ${nextProfile.budgetRangeUsd || "not shared"}. Country: ${nextProfile.country || "not shared"}. Age: ${nextProfile.ageGroup || "not shared"}. Please choose hospital type using the options shown below.`,
    ].join("\n");
  }

  function finalizeOnboarding(nextProfile: {
    treatment: string;
    budgetRangeUsd: string;
    country: string;
    ageGroup: string;
  }) {
    setMessages((previous) => [
      ...previous,
      {
        role: "assistant",
        text: buildCompletionMessage(nextProfile),
      },
    ]);

    setTimeout(() => {
      setIsOpen(false);
    }, 1800);
  }

  async function submitText(rawText: string) {
    const question = rawText.trim();

    if (!question || isLoading) {
      return;
    }

    setInput("");
    setMessages((previous) => [...previous, { role: "user", text: question }]);

    if (currentStep < onboardingSteps.length) {
      const step = onboardingSteps[currentStep];
      const normalizedAnswer = question.trim();
      const isSkip = normalizedAnswer.toLowerCase() === "skip";
      const lowerAnswer = normalizedAnswer.toLowerCase();

      if (step.required && isSkip) {
        setMessages((previous) => [
          ...previous,
          { role: "assistant", text: "This detail is required. Please share it." },
          { role: "assistant", text: step.question },
        ]);
        return;
      }

      const nextProfile = { ...profile };

      setProfile((previous) => {
        if (step.field === "whatsappNumber") {
          const fallbackDialCode = previous.country
            ? getDialCodeFromCountry(previous.country) || detectedDialCode
            : detectedDialCode;
          const normalizedWhatsapp = isSkip
            ? ""
            : normalizeWhatsappNumber(normalizedAnswer, fallbackDialCode);
          const digitsCount = normalizedWhatsapp.replace(/\D/g, "").length;

          if (!normalizedWhatsapp || digitsCount < 8) {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                text: "Please share a valid WhatsApp number once. You can type only digits.",
              },
            ]);
            return previous;
          }

          return {
            ...previous,
            whatsappNumber: normalizedWhatsapp,
          };
        }

        if (step.field === "country") {
          const countryValue = isSkip ? "" : normalizedAnswer;
          const countryDialCode = getDialCodeFromCountry(countryValue);

          if (!countryDialCode || !previous.whatsappNumber) {
            return {
              ...previous,
              country: countryValue,
            };
          }

          const updatedWhatsapp = previous.whatsappNumber.startsWith(detectedDialCode)
            ? withDialCode(previous.whatsappNumber, countryDialCode)
            : previous.whatsappNumber;

          return {
            ...previous,
            country: countryValue,
            whatsappNumber: updatedWhatsapp,
          };
        }

        return {
          ...previous,
          [step.field]: isSkip ? "" : normalizedAnswer,
        };
      });

      if (step.field === "country") {
        const countryValue = isSkip ? "" : normalizedAnswer;
        const countryDialCode = getDialCodeFromCountry(countryValue);
        nextProfile.country = countryValue;
        if (countryDialCode && profile.whatsappNumber) {
          nextProfile.whatsappNumber = withDialCode(profile.whatsappNumber, countryDialCode);
        }
      }

      if (step.field === "whatsappNumber") {
        const fallbackDialCode = profile.country
          ? getDialCodeFromCountry(profile.country) || detectedDialCode
          : detectedDialCode;
        nextProfile.whatsappNumber = isSkip
          ? ""
          : normalizeWhatsappNumber(normalizedAnswer, fallbackDialCode);
      }

      if (step.field === "treatment") {
        nextProfile.treatment = isSkip ? "" : normalizedAnswer;
      }

      if (step.field === "budgetRangeUsd") {
        nextProfile.budgetRangeUsd = isSkip ? "" : normalizedAnswer;
      }

      if (step.field === "ageGroup") {
        nextProfile.ageGroup = isSkip ? "" : normalizedAnswer;
      }

      if (step.field === "travelMonth") {
        nextProfile.travelMonth = isSkip ? "" : normalizedAnswer;
      }

      if (step.field === "reportsAvailable") {
        nextProfile.reportsAvailable = isSkip ? "" : lowerAnswer;
      }

      trackEvent("chat_onboarding_answer", {
        field: step.field,
        required: step.required,
      });

      const nextStep = currentStep + 1;

      if (step.field === "whatsappNumber") {
        const fallbackDialCode = profile.country
          ? getDialCodeFromCountry(profile.country) || detectedDialCode
          : detectedDialCode;
        const normalizedWhatsapp = normalizeWhatsappNumber(normalizedAnswer, fallbackDialCode);
        const digitsCount = normalizedWhatsapp.replace(/\D/g, "").length;

        if (!normalizedWhatsapp || digitsCount < 8) {
          return;
        }
      }

      if (step.field === "reportsAvailable" && lowerAnswer === "yes") {
        setCurrentStep(onboardingSteps.length);
        setRequiresReportUpload(true);
        setMessages((previous) => [
          ...previous,
          {
            role: "assistant",
            text: "Please upload one PDF medical report (max 2 MB).",
          },
        ]);
        return;
      }

      setCurrentStep(nextStep);

      if (nextStep < onboardingSteps.length) {
        setMessages((previous) => [
          ...previous,
          { role: "assistant", text: onboardingSteps[nextStep].question },
        ]);
      } else {
        finalizeOnboarding({
          treatment: nextProfile.treatment,
          budgetRangeUsd: nextProfile.budgetRangeUsd,
          country: nextProfile.country,
          ageGroup: nextProfile.ageGroup,
        });
      }

      return;
    }

    setIsLoading(true);
    trackEvent("chat_query_submitted", { source: "trea-widget" });

    try {
      const response = await fetch("/api/chat-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          message: question,
          profile,
        }),
      });

      const result = (await response.json()) as {
        reply?: string;
        sessionId?: string;
        message?: string;
        careOptions?: CareOption[];
      };

      if (!response.ok) {
        throw new Error(result.message || "Unable to process chat right now.");
      }

      if (result.sessionId) {
        setSessionId(result.sessionId);
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text:
            result.reply ||
            "Please share one more detail so I can guide better.",
        },
      ]);
      setCareOptions(Array.isArray(result.careOptions) ? result.careOptions : []);
      trackEvent("chat_query_success", { source: "trea-widget" });
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text:
            error instanceof Error
              ? error.message
              : "Unable to process chat right now.",
        },
      ]);
      trackEvent("chat_query_error", { source: "trea-widget" });
    } finally {
      setIsLoading(false);
    }
  }

  function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitText(input);
  }

  function handleQuickChoice(choice: string) {
    void submitText(choice);
  }

  function handleCareOptionChoice(option: CareOption) {
    trackEvent("chat_care_option_selected", { option: option.id });
    setCareOptions([]);
    setProfile((previous) => ({ ...previous, careTier: option.id }));
    void submitText(
      `I choose ${option.label}. Please explain this option in simple words for my case.`,
    );
  }

  async function handleReportUpload() {
    if (!reportFile || reportUploading) {
      return;
    }

    if (reportFile.type !== "application/pdf") {
      setReportStatus("Please upload only one PDF file.");
      return;
    }

    if (reportFile.size > 2 * 1024 * 1024) {
      setReportStatus("PDF must be 2 MB or smaller.");
      return;
    }

    setReportUploading(true);
    setReportStatus("");

    try {
      const formData = new FormData();
      formData.append("file", reportFile);
      formData.append("sessionId", sessionId);

      const response = await fetch("/api/chat-report-upload", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Unable to upload report right now.");
      }

      setReportStatus("Report uploaded successfully.");
      setRequiresReportUpload(false);
      finalizeOnboarding({
        treatment: profile.treatment,
        budgetRangeUsd: profile.budgetRangeUsd,
        country: profile.country,
        ageGroup: profile.ageGroup,
      });
    } catch (error) {
      setReportStatus(
        error instanceof Error ? error.message : "Unable to upload report right now.",
      );
    } finally {
      setReportUploading(false);
    }
  }

  function skipReportUpload() {
    setReportStatus("Report upload skipped. You can share it later.");
    setRequiresReportUpload(false);
    finalizeOnboarding({
      treatment: profile.treatment,
      budgetRangeUsd: profile.budgetRangeUsd,
      country: profile.country,
      ageGroup: profile.ageGroup,
    });
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[calc(100%-2.5rem)] max-w-sm">
      {isOpen ? (
        <div className="rounded-[1.6rem] border border-[var(--line)] bg-slate-950 p-4 text-white shadow-[0_24px_70px_rgba(15,23,42,0.35)]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-amber-300">TREA Bot</p>
              <p className="text-sm text-slate-300">Compassionate step-by-step medical travel guide</p>
              <p className="text-xs text-slate-400">Detected WhatsApp code: {detectedDialCode}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-white/20 px-3 py-1 text-xs"
            >
              Close
            </button>
          </div>

          <div className="mt-3 max-h-56 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-xl px-3 py-2 text-sm leading-6 ${
                  message.role === "user" ? "bg-amber-300/20 text-amber-100" : "bg-white/10 text-slate-200"
                }`}
              >
                {message.text}
              </div>
            ))}
            {isLoading ? <p className="text-xs text-slate-400">TREA is preparing your answer...</p> : null}
            <div ref={messagesEndRef} />
          </div>

          {currentStep < onboardingSteps.length && stepChoices.length > 0 ? (
            <div className="mt-3 flex flex-col gap-2">
              {stepChoices.map((choice) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => handleQuickChoice(choice)}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-left text-sm text-slate-100 transition hover:bg-white/20"
                >
                  {choice}
                </button>
              ))}
            </div>
          ) : null}

          {currentStep >= onboardingSteps.length && careOptions.length > 0 ? (
            <div className="mt-3 flex flex-col gap-2">
              {careOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleCareOptionChoice(option)}
                  className="w-full rounded-xl border border-amber-300/40 bg-amber-300/10 px-3 py-2 text-left text-sm font-semibold text-amber-100 transition hover:bg-amber-300/20"
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}

          {requiresReportUpload ? (
            <div className="mt-3 rounded-xl border border-white/15 bg-white/10 p-3">
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                Upload medical report (single PDF, max 2 MB)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(event) => setReportFile(event.target.files?.[0] || null)}
                className="mt-2 block w-full text-xs text-slate-200 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-300 file:px-3 file:py-2 file:font-semibold file:text-slate-950"
              />
              <button
                type="button"
                onClick={() => void handleReportUpload()}
                disabled={!reportFile || reportUploading}
                className="mt-3 w-full rounded-xl bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {reportUploading ? "Uploading..." : "Upload report"}
              </button>
              <button
                type="button"
                onClick={skipReportUpload}
                disabled={reportUploading}
                className="mt-2 w-full rounded-xl border border-white/20 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Skip upload for now
              </button>
              {reportStatus ? <p className="mt-2 text-xs text-slate-200">{reportStatus}</p> : null}
            </div>
          ) : null}

          <form onSubmit={handleSend} className="mt-3 flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={
                currentStep < onboardingSteps.length
                  ? "Type your answer"
                  : "Ask your question in simple words"
              }
              className="flex-1 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!canSend}
              className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            resetConversation();
            setIsOpen(true);
            trackEvent("chat_widget_open", { source: "trea-widget" });
          }}
          className="ml-auto flex items-center gap-3 rounded-full border border-[var(--line)] bg-slate-950 px-4 py-3 text-white shadow-[0_20px_60px_rgba(15,23,42,0.35)]"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-300 text-sm font-bold text-slate-900">
            T
          </span>
          <span className="text-sm font-semibold tracking-wide">TREA</span>
        </button>
      )}
    </div>
  );
}
