"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { trackEvent } from "../../lib/analytics";

type Prompt = {
  id: string;
  label: string;
  query: string;
};

type ItineraryOption = {
  id: string;
  location: string;
  hospital: string;
  imagePath: string;
  estimatedCostRange: string;
  treatmentTime: string;
  visa: string;
  flight: string;
  stay: string;
  postTreatmentCare: string;
  food: string;
  hotel: string;
  medicines: string;
  doctorProfiles: string[];
  summary: string;
};

type ResearchedItineraryOption = {
  location: string;
  estimatedCostRange: string;
  treatmentTime: string;
  visa: string;
  flight: string;
  stay: string;
  postTreatmentCare: string;
  food: string;
  hotel: string;
  medicines: string;
};

type CostRequestState = {
  openForId: string | null;
  countryCode: string;
  phone: string;
  submitting: boolean;
  message: string;
};

const promptSuggestions: Prompt[] = [
  {
    id: "neuro-second-opinion",
    label: "Neurology second opinion in India",
    query:
      "I need a second opinion in India for severe headache from the last 5 years.",
  },
  {
    id: "cardiac-review",
    label: "Cardiac treatment in India",
    query:
      "I want the best India options for planned cardiac treatment from East Africa.",
  },
  {
    id: "orthopedic-maldives",
    label: "Knee treatment in India",
    query:
      "Show India treatment options for long-term knee pain from Maldives.",
  },
];

const baseItineraryOptions: ItineraryOption[] = [
  {
    id: "delhi-neuro",
    location: "Delhi",
    hospital: "Max Super Speciality, Saket",
    imagePath: "/hospital%20image/max-del.jpg",
    estimatedCostRange: "$1,200 - $2,900",
    treatmentTime: "3-5 days for second opinion, scans, and review",
    visa: "Medical visa or e-Medical pathway depending on passport",
    flight: "Direct or one-stop flights to Delhi with medical-assist request support",
    stay: "6-8 days recommended for consultation and reports",
    postTreatmentCare: "2-4 weeks remote follow-up after return",
    food: "Soft low-spice meals and hotel dining near Saket",
    hotel: "Business hotel or serviced apartment within 20 minutes",
    medicines: "Prescription and pharmacy access on discharge day",
    doctorProfiles: [
      "Senior Neurology Consultant profile (15+ years, complex headache workups)",
      "Neuro-radiology specialist profile (MRI and stroke imaging focus)",
    ],
    summary:
      "Good for structured neurology review, fast diagnostics, and international patient coordination.",
  },
  {
    id: "bengaluru-neuro",
    location: "Bengaluru",
    hospital: "Manipal Hospital, Old Airport Road",
    imagePath: "/hospital%20image/manipal-blr.jpg",
    estimatedCostRange: "$1,400 - $3,200",
    treatmentTime: "4-6 days for consultation, neuro workup, and plan",
    visa: "Medical visa support with hospital documentation",
    flight: "One-stop major routes to Bengaluru with wheelchair-assist pre-booking",
    stay: "7-9 days for calm recovery and review scheduling",
    postTreatmentCare: "3-4 weeks follow-up with digital prescription support",
    food: "Mild meal options, continental and halal-friendly choices",
    hotel: "Mid-scale hotel near Indiranagar or hospital corridor",
    medicines: "Hospital pharmacy with clear discharge medicine schedule",
    doctorProfiles: [
      "Neurology consultant profile (movement and headache clinics)",
      "Rehab medicine profile (post-discharge neuro recovery planning)",
    ],
    summary:
      "Balanced option for specialist depth, smoother city experience, and recovery-friendly stay.",
  },
  {
    id: "kerala-neuro",
    location: "Kerala",
    hospital: "Aster Medcity, Kochi",
    imagePath: "/hospital%20image/aster-kochi.jpg",
    estimatedCostRange: "$1,300 - $3,000",
    treatmentTime: "5-7 days for consult, imaging, and recovery planning",
    visa: "Medical visa support through international desk",
    flight: "One-stop routes to Kochi with lower-stress arrival windows",
    stay: "8-10 days recommended if senior patient needs slower pace",
    postTreatmentCare: "3-6 weeks guided follow-up and medicine monitoring",
    food: "Patient-friendly meal plans and lighter dietary choices",
    hotel: "Hospital guest stay or waterfront hotel with easier recovery",
    medicines: "Medicine pickup before departure with dosage summary",
    doctorProfiles: [
      "Senior neurology profile (complex case second-opinion pathway)",
      "Internal medicine profile (elder-friendly co-morbidity monitoring)",
    ],
    summary:
      "Best for a slower, calmer recovery rhythm and senior-friendly stay planning.",
  },
];

const countryCodes = [
  "+233 Ghana",
  "+234 Nigeria",
  "+254 Kenya",
  "+255 Tanzania",
  "+256 Uganda",
  "+251 Ethiopia",
  "+212 Morocco",
  "+20 Egypt",
  "+960 Maldives",
  "+91 India",
];

const introMessage =
  "I can help with hospitals, visa, interpreter, hotel, food, stay, post-treatment care, and travel planning in India.";

export function TreaHeroAssistant() {
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([introMessage]);
  const [input, setInput] = useState("");
  const [itineraryOptions, setItineraryOptions] = useState<ItineraryOption[]>(baseItineraryOptions);
  const [itineraryLoading, setItineraryLoading] = useState(false);
  const [costRequest, setCostRequest] = useState<CostRequestState>({
    openForId: null,
    countryCode: countryCodes[0],
    phone: "",
    submitting: false,
    message: "",
  });

  const selectedPrompt = useMemo(
    () => promptSuggestions.find((item) => item.id === selectedPromptId) || null,
    [selectedPromptId],
  );
  const activeCostOption = useMemo(
    () => itineraryOptions.find((item) => item.id === costRequest.openForId) || null,
    [costRequest.openForId, itineraryOptions],
  );

  function inferIllnessCategory(query: string) {
    const normalized = query.toLowerCase();

    if (/(headache|migraine|neuro|brain|stroke|seizure)/.test(normalized)) {
      return "neurology";
    }

    if (/(heart|cardiac|bypass|angioplasty|chest pain)/.test(normalized)) {
      return "cardiac";
    }

    if (/(knee|joint|orthopedic|ortho|spine|hip|shoulder)/.test(normalized)) {
      return "orthopedic";
    }

    if (/(ivf|fertility|gyne|gynae|pregnan|embryo)/.test(normalized)) {
      return "fertility";
    }

    return "general";
  }

  function treatmentTimeByCategory(category: string, location: string) {
    if (category === "cardiac") {
      if (location === "Delhi") {
        return "5-7 days for cardiac consult and intervention planning";
      }

      if (location === "Bengaluru") {
        return "6-8 days for cardiac workup and treatment planning";
      }

      return "6-9 days for cardiac review with recovery-focused monitoring";
    }

    if (category === "orthopedic") {
      if (location === "Delhi") {
        return "4-6 days for orthopedic consult and imaging review";
      }

      if (location === "Bengaluru") {
        return "5-7 days for ortho consult and rehab planning";
      }

      return "6-8 days for orthopedic review with supportive stay";
    }

    if (category === "fertility") {
      if (location === "Delhi") {
        return "7-10 days for fertility baseline assessment and cycle planning";
      }

      if (location === "Bengaluru") {
        return "8-12 days for consult, diagnostics, and protocol setup";
      }

      return "9-14 days for fertility planning with lower-stress schedule";
    }

    if (category === "neurology") {
      if (location === "Delhi") {
        return "3-5 days for neurology second opinion and scans";
      }

      if (location === "Bengaluru") {
        return "4-6 days for neurology review and care planning";
      }

      return "5-7 days for neurology workup and slower recovery rhythm";
    }

    if (location === "Delhi") {
      return "4-6 days for specialist review and diagnostics";
    }

    if (location === "Bengaluru") {
      return "5-7 days for specialist review and treatment planning";
    }

    return "6-8 days for specialist review and recovery alignment";
  }

  function doctorProfilesByCategory(category: string, location: string) {
    if (category === "cardiac") {
      if (location === "Delhi") {
        return [
          "Interventional cardiologist profile (angiography and angioplasty planning)",
          "Cardiac surgeon profile (bypass and valve surgery pathway)",
        ];
      }

      if (location === "Bengaluru") {
        return [
          "Heart failure and imaging cardiology profile",
          "Cardiac anesthesia and ICU profile for high-risk cases",
        ];
      }

      return [
        "Senior cardiology profile (elective cardiac workup and stabilization)",
        "Cardiac rehab profile (post-procedure recovery planning)",
      ];
    }

    if (category === "orthopedic") {
      if (location === "Delhi") {
        return [
          "Orthopedic joint replacement surgeon profile",
          "Sports injury and arthroscopy profile",
        ];
      }

      if (location === "Bengaluru") {
        return [
          "Spine and deformity correction surgeon profile",
          "Orthopedic rehab profile (mobility recovery milestones)",
        ];
      }

      return [
        "Senior orthopedic trauma and reconstruction profile",
        "Pain and movement restoration profile",
      ];
    }

    if (category === "fertility") {
      if (location === "Delhi") {
        return [
          "IVF specialist profile (cycle planning and transfer strategy)",
          "Embryology lab profile (blastocyst and freezing protocols)",
        ];
      }

      if (location === "Bengaluru") {
        return [
          "Fertility endocrinology profile",
          "Reproductive medicine profile (complex fertility history)",
        ];
      }

      return [
        "Fertility consultant profile (patient counseling and cycle readiness)",
        "Women's health support profile (post-cycle follow-up)",
      ];
    }

    if (category === "neurology") {
      if (location === "Delhi") {
        return [
          "Senior neurology consultant profile (headache and seizure workups)",
          "Neuro-radiology profile (MRI and stroke imaging)",
        ];
      }

      if (location === "Bengaluru") {
        return [
          "Neurology consultant profile (movement and migraine clinics)",
          "Neuro rehab profile (post-discharge recovery)",
        ];
      }

      return [
        "Complex neurology second-opinion profile",
        "Internal medicine profile for co-morbidity monitoring",
      ];
    }

    return [
      "Senior specialist consultant profile",
      "Multidisciplinary care coordination profile",
    ];
  }

  function applyFallbackResearch(query: string) {
    const category = inferIllnessCategory(query);

    return baseItineraryOptions.map((item) => ({
      ...item,
      treatmentTime: treatmentTimeByCategory(category, item.location),
      doctorProfiles: doctorProfilesByCategory(category, item.location),
    }));
  }

  function mergeResearchedOptions(options: ResearchedItineraryOption[], query: string) {
    const byLocation = new Map(options.map((item) => [item.location.toLowerCase(), item]));
    const category = inferIllnessCategory(query);

    return baseItineraryOptions.map((item) => {
      const researched = byLocation.get(item.location.toLowerCase());

      if (!researched) {
        return {
          ...item,
          doctorProfiles: doctorProfilesByCategory(category, item.location),
        };
      }

      return {
        ...item,
        estimatedCostRange: researched.estimatedCostRange || item.estimatedCostRange,
        treatmentTime: researched.treatmentTime || item.treatmentTime,
        visa: researched.visa || item.visa,
        flight: researched.flight || item.flight,
        stay: researched.stay || item.stay,
        postTreatmentCare: researched.postTreatmentCare || item.postTreatmentCare,
        food: researched.food || item.food,
        hotel: researched.hotel || item.hotel,
        medicines: researched.medicines || item.medicines,
        doctorProfiles: doctorProfilesByCategory(category, item.location),
      };
    });
  }

  async function runItineraryResearch(query: string) {
    setItineraryLoading(true);

    try {
      const response = await fetch("/api/itinerary-research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const result = (await response.json()) as {
        options?: ResearchedItineraryOption[];
      };

      if (!response.ok || !Array.isArray(result.options) || result.options.length === 0) {
        setItineraryOptions(applyFallbackResearch(query));
        return;
      }

      setItineraryOptions(mergeResearchedOptions(result.options, query));
    } catch {
      setItineraryOptions(applyFallbackResearch(query));
    } finally {
      setItineraryLoading(false);
    }
  }

  function handlePromptSelect(prompt: Prompt) {
    setSelectedPromptId(prompt.id);
    setMessages([
      `TREA understood: ${prompt.query}`,
      "Researching illness-specific treatment time, stay, and recovery details for Delhi, Bengaluru, and Kerala.",
    ]);
    void runItineraryResearch(prompt.query);
    trackEvent("hero_prompt_selected", { prompt: prompt.id });
  }

  function handleCustomSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = input.trim();

    if (!question) {
      return;
    }

    setMessages([
      `TREA understood: ${question}`,
      "Researching illness-specific treatment time, stay, and recovery details for Delhi, Bengaluru, and Kerala.",
    ]);
    setSelectedPromptId("custom");
    setInput("");
    void runItineraryResearch(question);
    trackEvent("hero_custom_query", { source: "hero-ai" });
  }

  async function submitCostRequest(option: ItineraryOption) {
    if (!costRequest.phone.trim()) {
      setCostRequest((previous) => ({
        ...previous,
        message: "Please enter mobile number.",
      }));
      return;
    }

    setCostRequest((previous) => ({
      ...previous,
      submitting: true,
      message: "",
    }));

    try {
      const response = await fetch("/api/cost-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: `${costRequest.countryCode.split(" ")[0]}${costRequest.phone.trim()}`,
          promptId: selectedPromptId,
          treatmentQuery: selectedPrompt?.query || "Custom treatment request",
          state: option.location,
          city: option.location,
          hospital: option.hospital,
        }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Unable to request cost right now.");
      }

      setCostRequest({
        openForId: option.id,
        countryCode: countryCodes[0],
        phone: "",
        submitting: false,
        message: result.message || "Cost team will contact you shortly.",
      });
      trackEvent("hero_cost_request_success", { hospital: option.hospital });
    } catch (error) {
      setCostRequest((previous) => ({
        ...previous,
        submitting: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to request cost right now.",
      }));
      trackEvent("hero_cost_request_error", { hospital: option.hospital });
    }
  }

  const showOptions = selectedPromptId !== null;
  const comparisonRows = [
    {
      heading: "Treatment time",
      iconPath: "/infographics/treatment-time.svg",
      value: (option: ItineraryOption) => option.treatmentTime,
    },
    {
      heading: "Visa",
      iconPath: "/infographics/visa.svg",
      value: (option: ItineraryOption) => option.visa,
    },
    {
      heading: "Flight",
      iconPath: "/infographics/flight.svg",
      value: (option: ItineraryOption) => option.flight,
    },
    {
      heading: "Accommodation",
      iconPath: "/infographics/accommodation.svg",
      value: (option: ItineraryOption) => option.hotel,
    },
    {
      heading: "Stay",
      iconPath: "/infographics/stay.svg",
      value: (option: ItineraryOption) => option.stay,
    },
    {
      heading: "Recovery",
      iconPath: "/infographics/recovery.svg",
      value: (option: ItineraryOption) => option.postTreatmentCare,
    },
    {
      heading: "Food",
      iconPath: "/infographics/food.svg",
      value: (option: ItineraryOption) => option.food,
    },
    {
      heading: "Medicines",
      iconPath: "/infographics/medicines.svg",
      value: (option: ItineraryOption) => option.medicines,
    },
  ];

  return (
    <section className="rounded-[2rem] border border-[var(--line)] bg-slate-950 p-3 text-white shadow-[0_28px_100px_rgba(15,23,42,0.18)] lg:p-4">
      <div className="grid gap-4 xl:grid-cols-[0.88fr_1.12fr] xl:items-start">
        <div className="rounded-[1.5rem] bg-white/6 p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-300 text-lg font-bold text-slate-950">
              T
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-amber-300">TREA AI</p>
              <p className="text-sm text-slate-300">Hospital, visa, stay, and recovery planner for Africa and Maldives patients</p>
            </div>
          </div>

          <div className="mt-5 min-h-[16rem] rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
            <p className="text-base font-medium leading-7 text-slate-100">{messages[0]}</p>
            {messages[1] ? <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">{messages[1]}</p> : null}
          </div>

          <form onSubmit={handleCustomSubmit} className="mt-4">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask TREA about treatment, visa, stay, or hospital planning"
              className="w-full rounded-[1.3rem] border border-white/10 bg-black/25 px-4 py-4 text-sm text-white outline-none placeholder:text-slate-500"
            />
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Popular search keywords
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {promptSuggestions.map((prompt) => (
                <button
                  key={prompt.id}
                  type="button"
                  onClick={() => handlePromptSelect(prompt)}
                  className="rounded-full border border-white/15 bg-white/8 px-3 py-2 text-xs font-semibold tracking-[0.01em] text-slate-200 transition hover:border-amber-300 hover:text-amber-200"
                >
                  {prompt.label}
                </button>
              ))}
            </div>

          </form>
        </div>

        <div className="rounded-[1.5rem] bg-white/6 p-4 md:p-5 xl:min-h-full">
          {itineraryLoading ? (
            <div className="flex h-full min-h-[28rem] items-center justify-center rounded-[1.4rem] border border-dashed border-white/12 bg-black/20 px-6 text-center text-sm leading-7 text-slate-300">
              Researching treatment timelines and itinerary details based on illness.
            </div>
          ) : showOptions ? (
            <>
              <div className="grid gap-3 lg:grid-cols-3">
                {itineraryOptions.map((option) => {
                  return (
                    <article
                      key={option.id}
                      className="flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/20"
                    >
                      <div className="relative h-36 overflow-hidden border-b border-white/10">
                        <Image
                          src={option.imagePath}
                          alt={`${option.hospital} banner`}
                          fill
                          sizes="(max-width: 1280px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 px-3 py-3">
                        <p className="text-xl font-semibold tracking-[0.03em] text-white">
                          {option.location}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-200">{option.hospital}</p>
                        <button
                          type="button"
                          onClick={() =>
                            setCostRequest((previous) => ({
                              ...previous,
                              openForId: previous.openForId === option.id ? null : option.id,
                              message: "",
                            }))
                          }
                          className="mt-2 inline-flex h-7 items-center justify-center self-start whitespace-nowrap rounded-full bg-white/95 px-3 text-[10px] font-semibold text-slate-950 transition hover:bg-amber-100 sm:h-8 sm:text-[11px]"
                        >
                          Check price
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-4 overflow-hidden rounded-[1.2rem] border border-white/10 bg-white/6">
              <div className="grid grid-cols-[8.8rem_repeat(3,minmax(0,1fr))] border-b border-white/10 bg-black/20 px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Section
                </p>
                {itineraryOptions.map((item) => (
                  <p
                    key={`column-${item.id}`}
                    className="px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300"
                  >
                    {item.location}
                  </p>
                ))}
              </div>

              {comparisonRows.map((row) => (
                <div
                  key={row.heading}
                  className="grid grid-cols-[8.8rem_repeat(3,minmax(0,1fr))] border-b border-white/10 px-3 py-2 last:border-b-0"
                >
                  <div className="flex items-center gap-1.5">
                    <Image src={row.iconPath} alt={`${row.heading} icon`} width={16} height={16} />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                      {row.heading}
                    </p>
                  </div>
                  {itineraryOptions.map((item) => (
                    <p key={`${row.heading}-${item.id}`} className="px-2 text-xs leading-5 text-slate-200">
                      {row.value(item)}
                    </p>
                  ))}
                </div>
              ))}

                <div className="grid grid-cols-[8.8rem_repeat(3,minmax(0,1fr))] border-t border-white/10 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Doctor profiles
                  </p>
                  {itineraryOptions.map((item) => (
                    <div key={`doctors-${item.id}`} className="space-y-0.5 px-2 text-xs leading-5 text-slate-200">
                      {item.doctorProfiles.map((profile) => (
                        <p key={`${item.id}-${profile}`}>• {profile}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[28rem] items-center justify-center rounded-[1.4rem] border border-dashed border-white/12 bg-black/20 px-6 text-center text-sm leading-7 text-slate-400">
              Choose a prompt or ask a question. TREA will prepare Delhi, Bengaluru, and Kerala treatment itineraries here.
            </div>
          )}
        </div>
      </div>

      {activeCostOption ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-[1.4rem] border border-white/15 bg-slate-900 p-5 shadow-[0_20px_80px_rgba(2,6,23,0.65)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-300">
                  {activeCostOption.location}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  Share mobile number to receive exact cost range
                </h3>
                <p className="mt-2 text-sm text-slate-300">{activeCostOption.hospital}</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setCostRequest((previous) => ({
                    ...previous,
                    openForId: null,
                    message: "",
                  }))
                }
                className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-white/40"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-[0.42fr_0.58fr]">
              <select
                value={costRequest.countryCode}
                onChange={(event) =>
                  setCostRequest((previous) => ({
                    ...previous,
                    countryCode: event.target.value,
                  }))
                }
                className="rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white outline-none"
              >
                {countryCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              <input
                value={costRequest.phone}
                onChange={(event) =>
                  setCostRequest((previous) => ({
                    ...previous,
                    phone: event.target.value,
                  }))
                }
                placeholder="Mobile number"
                className="rounded-xl border border-white/10 bg-slate-950 px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <button
              type="button"
              disabled={costRequest.submitting}
              onClick={() => void submitCostRequest(activeCostOption)}
              className="mt-3 w-full rounded-xl bg-amber-300 px-4 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {costRequest.submitting ? "Submitting..." : "Send me the cost"}
            </button>

            {costRequest.message ? (
              <div className="mt-3 rounded-xl border border-emerald-300/25 bg-emerald-300/10 p-3">
                <p className="text-sm text-emerald-200">{costRequest.message}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.15em] text-emerald-100/90">
                  Estimated cost range for this illness
                </p>
                <div className="mt-2 space-y-2">
                  {itineraryOptions.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs"
                    >
                      <span className="font-semibold text-slate-100">{item.location}</span>
                      <span className="text-emerald-100">{item.estimatedCostRange}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
