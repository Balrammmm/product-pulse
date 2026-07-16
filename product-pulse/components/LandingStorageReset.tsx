"use client";

import { useEffect } from "react";

export function LandingStorageReset() {
  useEffect(() => {
    window.sessionStorage.removeItem("productpulse-report-access");

    const storedReport = window.localStorage.getItem("productpulse-report");
    if (!storedReport) return;

    try {
      const report = JSON.parse(storedReport) as { analysis_source?: string; source?: string };
      if (report.analysis_source === "sample" || report.source === "sample") {
        window.localStorage.removeItem("productpulse-report");
        window.localStorage.removeItem("productpulse-toast");
      }
    } catch {
      window.localStorage.removeItem("productpulse-report");
      window.localStorage.removeItem("productpulse-toast");
    }
  }, []);

  return null;
}
