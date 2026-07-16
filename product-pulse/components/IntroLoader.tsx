"use client";

import { useEffect, useState } from "react";

export function IntroLoader() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || window.sessionStorage.getItem("productpulse-intro-seen")) return;

    setShow(true);
    window.sessionStorage.setItem("productpulse-intro-seen", "true");

    const leaveTimer = window.setTimeout(() => setLeaving(true), 1250);
    const hideTimer = window.setTimeout(() => setShow(false), 1650);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-linen transition duration-500 ${
        leaving ? "pointer-events-none opacity-0 blur-sm" : "opacity-100"
      }`}
    >
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-ink/10 bg-white shadow-lift">
          <svg
            aria-hidden="true"
            className="logo-pulse h-7 w-7 text-moss"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M3 13h3.2l2.1-5.5 3.5 10 3-13 2.6 8.5H21"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </div>
        <p className="mt-5 text-lg font-semibold tracking-[-0.01em] text-ink">ProductPulse</p>
        <p className="mt-2 text-sm text-graphite">Turning reviews into product strategy</p>
      </div>
    </div>
  );
}
