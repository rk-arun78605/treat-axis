export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

type WindowWithDataLayer = Window & {
  dataLayer?: Array<Record<string, unknown>>;
};

export function trackEvent(event: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const data = {
    event,
    ...payload,
    timestamp: new Date().toISOString(),
  };

  const win = window as WindowWithDataLayer;
  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push(data);
  window.dispatchEvent(new CustomEvent("treataxis:analytics", { detail: data }));
}
