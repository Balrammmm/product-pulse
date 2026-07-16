"use client";

import { useEffect, useState } from "react";

const recommendations = [
  {
    priority: "P0",
    mentions: "214 mentions",
    title: "Fix ETA accuracy before expanding loyalty surfaces.",
    detail:
      "Tracking confidence is the fastest path to lower cancellations, support load, and negative delivery reviews.",
    evidence: "The tracker stayed at 8 minutes for half an hour.",
  },
  {
    priority: "P1",
    mentions: "176 mentions",
    title: "Add refund visibility and owner status before scaling support automation.",
    detail:
      "Customers need settlement date, owner, and escalation state before generic automation can feel trustworthy.",
    evidence: "Refund approved but nobody could tell me when it would arrive.",
  },
  {
    priority: "P2",
    mentions: "92 mentions",
    title: "Benchmark delivery quality by city, dark store, and courier route.",
    detail:
      "Operational scorecards can turn review clusters into recurring quality governance across markets.",
    evidence: "Some stores are always fast, others miss items every week.",
  },
];

export function HeroRecommendationCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % recommendations.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const active = recommendations[activeIndex];
  const showPrevious = () =>
    setActiveIndex((index) => (index - 1 + recommendations.length) % recommendations.length);
  const showNext = () => setActiveIndex((index) => (index + 1) % recommendations.length);

  return (
    <div
      className="dark-strategy-panel stagger-in relative mt-4 overflow-hidden rounded-2xl p-5 text-linen"
      onTouchStart={(event) => setTouchStart(event.touches[0]?.clientX ?? null)}
      onTouchEnd={(event) => {
        if (touchStart === null) return;
        const delta = (event.changedTouches[0]?.clientX ?? touchStart) - touchStart;
        if (Math.abs(delta) > 36) {
          if (delta > 0) showPrevious();
          else showNext();
        }
        setTouchStart(null);
      }}
    >
      <div className="absolute right-5 top-5 h-16 w-16 rounded-full bg-sage/10 blur-2xl" />
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <p className="small-caps text-[0.64rem] font-semibold text-sage">Roadmap recommendation</p>
        <div className="flex items-center gap-2">
          <span className="premium-badge badge-in rounded-full px-2.5 py-1 text-xs font-semibold">
            {active.priority}
          </span>
          <span className="badge-in rounded-full border border-linen/10 px-2.5 py-1 text-xs font-semibold text-linen/75">
            {active.mentions}
          </span>
        </div>
      </div>

      <div key={active.priority} className="relative transition-all duration-300 ease-out">
        <p className="mt-4 max-w-xl animate-[fadeUp_300ms_ease_both] text-lg font-semibold leading-snug tracking-[-0.01em]">
          {active.title}
        </p>
        <p className="mt-3 animate-[fadeUp_340ms_ease_both] text-sm leading-6 text-linen/68">
          {active.detail}
        </p>
        <div className="mt-5 animate-[fadeUp_380ms_ease_both] rounded-xl border border-white/[0.06] bg-white/[0.035] p-3 text-xs leading-5 text-linen/72">
          "{active.evidence}"
        </div>
      </div>

      <div className="relative mt-5 flex gap-2">
        {recommendations.map((item, index) => (
          <button
            key={item.priority}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition duration-200 hover:-translate-y-0.5 active:scale-95 ${
              activeIndex === index
                ? "bg-linen text-ink shadow-card"
                : "border border-linen/10 text-linen/70 hover:border-sage/30 hover:text-linen"
            }`}
            aria-pressed={activeIndex === index}
          >
            {item.priority}
          </button>
        ))}
      </div>
    </div>
  );
}
