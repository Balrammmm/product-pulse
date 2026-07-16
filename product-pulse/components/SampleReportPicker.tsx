"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { sampleReports } from "@/lib/sampleReports";

type SampleReportPickerProps = {
  label?: string;
  variant?: "primary" | "secondary" | "ghost" | "link";
  className?: string;
};

function triggerClass(variant: SampleReportPickerProps["variant"]) {
  if (variant === "primary") return "btn-primary rounded-full px-6 py-3.5 text-sm font-semibold";
  if (variant === "link") {
    return "text-sm font-semibold text-sage underline-offset-4 transition hover:text-linen hover:underline active:scale-95";
  }
  if (variant === "ghost") return "btn-ghost rounded-full px-4 py-2";
  return "btn-secondary rounded-full px-6 py-3.5 text-sm font-semibold";
}

export function SampleReportPicker({
  label = "Sample report",
  variant = "secondary",
  className = "",
}: SampleReportPickerProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function chooseSample(id: string) {
    const sample = sampleReports.find((item) => item.id === id) ?? sampleReports[0];
    window.localStorage.setItem("productpulse-report", JSON.stringify(sample.report));
    window.localStorage.setItem("productpulse-toast", `${sample.title} loaded.`);
    window.sessionStorage.setItem(
      "productpulse-report-access",
      `sample:${sample.report.dataset_id ?? sample.id}:${Date.now()}`,
    );
    window.dispatchEvent(
      new CustomEvent("productpulse-report-selected", {
        detail: {
          report: sample.report,
          toast: `${sample.title} loaded.`,
        },
      }),
    );
    setOpen(false);
    router.push("/report");
  }

  const modal =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Choose a sample report"
          >
            <div
              className="flex min-h-screen items-center justify-center p-4 sm:p-6"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setOpen(false);
              }}
            >
              <div className="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-ink/[0.08] bg-linen shadow-[0_40px_110px_rgba(0,0,0,0.32)]">
                <div className="flex flex-none items-start justify-between gap-4 border-b border-ink/[0.08] px-5 py-5 sm:px-6">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink">
                      Choose a sample report
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-graphite">
                      Explore ProductPulse across different review datasets.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="btn-secondary flex-none rounded-full px-4 py-2 text-sm font-semibold"
                    aria-label="Close sample report picker"
                  >
                    Close
                  </button>
                </div>

                <div className="overflow-y-auto px-5 py-5 sm:px-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {sampleReports.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => chooseSample(sample.id)}
                        className="interactive-card min-h-[190px] rounded-2xl p-5 text-left"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="small-caps text-[0.62rem] font-semibold text-moss">
                              {sample.category}
                            </p>
                            <h3 className="mt-2 text-lg font-semibold tracking-[-0.01em] text-ink">
                              {sample.title}
                            </h3>
                          </div>
                          <span className="premium-badge flex-none rounded-full px-3 py-1 text-xs font-semibold">
                            {sample.reviewCount.toLocaleString()} reviews
                          </span>
                        </div>
                        <div className="mt-5 rounded-xl border border-ink/[0.07] bg-linen/70 p-4">
                          <p className="small-caps text-[0.62rem] font-semibold text-graphite">
                            Key risk
                          </p>
                          <p className="mt-1 text-sm font-semibold text-ink">{sample.keyRisk}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${triggerClass(variant)} ${className}`}
      >
        {label}
      </button>
      {modal}
    </>
  );
}
