import type { Recommendation } from "@/lib/mockAnalysis";

const priorityTone: Record<Recommendation["priority"], string> = {
  High: "premium-badge",
  Medium: "bronze-badge",
  Low: "border-ink/10 bg-cream text-graphite",
};

const priorityLabel: Record<Recommendation["priority"], string> = {
  High: "P0",
  Medium: "P1",
  Low: "P2",
};

export function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const confidence = recommendation.confidence ?? (recommendation.priority === "High" ? 82 : 68);

  return (
    <article className="interactive-card group rounded-2xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`badge-in rounded-full px-3 py-1 text-xs font-semibold ${priorityTone[recommendation.priority]}`}
            >
              {priorityLabel[recommendation.priority]}
            </span>
            <span className="text-xs font-semibold text-graphite">
              {confidence}% confidence
              {recommendation.frequency ? ` / ${recommendation.frequency}` : ""}
            </span>
          </div>
          <h3 className="mt-3 max-w-3xl text-lg font-semibold tracking-[-0.01em] text-ink">
            {recommendation.title}
          </h3>
        </div>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-moss to-bronze transition-all duration-500 group-hover:saturate-125"
          style={{ width: `${Math.min(confidence, 100)}%` }}
        />
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_0.95fr]">
        <div className="rounded-xl border border-ink/[0.06] bg-white/55 p-4">
          <p className="small-caps text-[0.68rem] font-semibold text-graphite">Reason</p>
          <p className="mt-2 text-sm leading-6 text-graphite">{recommendation.reason}</p>
        </div>
        <div className="rounded-xl border border-ink/[0.06] bg-cream/45 p-4">
          <p className="small-caps text-[0.68rem] font-semibold text-graphite">Impact</p>
          <p className="mt-2 text-sm leading-6 text-graphite">{recommendation.impact}</p>
        </div>
      </div>
      {recommendation.evidence && (
        <div className="quote-block mt-4 rounded-xl px-4 py-3">
          <p className="small-caps text-[0.64rem] font-semibold text-moss">Evidence</p>
          <p className="mt-1 text-sm leading-6 text-graphite">"{recommendation.evidence}"</p>
        </div>
      )}
    </article>
  );
}
