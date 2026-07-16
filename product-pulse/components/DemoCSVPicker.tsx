"use client";

import { useEffect, useRef, useState } from "react";
import { demoCSVs, type DemoCSV } from "@/lib/demoCSVs";

type DemoCSVPickerProps = {
  onSelect: (demo: DemoCSV) => void;
};

export function DemoCSVPicker({ onSelect }: DemoCSVPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function closeOnOutsideClick(event: MouseEvent) {
      if (!pickerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  function selectDemo(demo: DemoCSV) {
    onSelect(demo);
    setIsOpen(false);
  }

  return (
    <div ref={pickerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="btn-secondary rounded-full px-4 py-2 text-sm font-semibold"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        Load demo CSV
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Choose demo CSV"
          className="absolute left-0 top-full z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-ink/10 bg-white/95 shadow-[0_24px_70px_rgba(31,37,35,0.18)] backdrop-blur"
        >
          <div className="border-b border-ink/[0.07] bg-cream/75 px-4 py-3">
            <p className="text-sm font-semibold text-ink">Choose a demo CSV</p>
            <p className="mt-1 text-xs leading-5 text-graphite">
              Test ProductPulse with realistic review exports.
            </p>
          </div>

          <div className="max-h-[24rem] overflow-y-auto p-2">
            {demoCSVs.map((demo) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => selectDemo(demo)}
                className="group flex w-full items-start justify-between gap-4 rounded-xl px-3 py-3 text-left transition duration-200 hover:bg-sage/35 active:scale-[0.99]"
              >
                <span>
                  <span className="block text-sm font-semibold text-ink transition duration-200 group-hover:text-moss">
                    {demo.name}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-graphite">
                    {demo.category}
                  </span>
                </span>
                <span className="shrink-0 rounded-full border border-moss/15 bg-sage/35 px-2.5 py-1 text-xs font-semibold text-moss">
                  {demo.rows.length} rows
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
