"use client";

import { useEffect } from "react";

const TARGET_ID = "cardiac-care-abroad";

export function DoctorsInitialScroll() {
  useEffect(() => {
    if (window.location.hash) {
      return;
    }

    let attempts = 0;
    let timeoutId = 0;

    const tryScroll = () => {
      const target = document.getElementById(TARGET_ID);

      if (!target) {
        attempts += 1;

        if (attempts < 8) {
          timeoutId = window.setTimeout(tryScroll, 120);
        }

        return;
      }

      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      const offset = window.innerHeight * 0.2;
      const destination = Math.max(0, targetTop - offset);

      window.scrollTo({ top: destination, behavior: "smooth" });
    };

    timeoutId = window.setTimeout(tryScroll, 220);

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return null;
}
