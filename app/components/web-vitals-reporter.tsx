"use client";

import { useReportWebVitals } from "next/web-vitals";

type WebVitalsMetric = {
  id: string;
  name: "CLS" | "FCP" | "INP" | "LCP" | "TTFB";
  value: number;
  rating?: "good" | "needs-improvement" | "poor";
};

type WindowWithAnalytics = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: Array<Record<string, unknown>>;
};

function toAnalyticsValue(metric: WebVitalsMetric) {
  if (metric.name === "CLS") {
    return Math.round(metric.value * 1000);
  }

  return Math.round(metric.value);
}

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    const coreMetric = metric as WebVitalsMetric;
    const value = toAnalyticsValue(coreMetric);

    if (typeof window === "undefined") {
      return;
    }

    const win = window as WindowWithAnalytics;

    if (typeof win.gtag === "function") {
      win.gtag("event", coreMetric.name, {
        event_category: "Core Web Vitals",
        event_label: coreMetric.id,
        value,
        non_interaction: true,
        metric_id: coreMetric.id,
        metric_value: coreMetric.value,
        metric_rating: coreMetric.rating || "unknown",
      });
      return;
    }

    win.dataLayer = win.dataLayer || [];
    win.dataLayer.push({
      event: "core_web_vital",
      metric_name: coreMetric.name,
      metric_id: coreMetric.id,
      metric_value: coreMetric.value,
      metric_rating: coreMetric.rating || "unknown",
      value,
      non_interaction: true,
      timestamp: new Date().toISOString(),
    });
  });

  return null;
}
