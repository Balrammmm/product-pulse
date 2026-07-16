import type { ProductPulseAnalysis } from "@/lib/mockAnalysis";

const lanes = [
  { key: "now", title: "Now", detail: "Reliability fixes", badge: "P0" },
  { key: "next", title: "Next", detail: "Workflow expansion", badge: "P1" },
  { key: "later", title: "Later", detail: "Platform leverage", badge: "P2" },
] as const;

export function Roadmap({ roadmap }: { roadmap: ProductPulseAnalysis["roadmap"] }) {
  return (
    <section className="dark-strategy-panel rounded-2xl p-6 text-linen sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="small-caps text-[0.68rem] font-semibold text-sage">Roadmap</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.01em]">Sequenced product bets</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-linen/70">
          Recommended order based on review frequency, customer urgency, and strategic leverage.
        </p>
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {lanes.map((lane) => (
          <div
            key={lane.key}
            className="interactive-surface rounded-2xl border border-white/[0.055] bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] hover:-translate-y-1 hover:border-sage/20 hover:bg-white/[0.055] hover:shadow-[0_18px_44px_rgba(0,0,0,0.18)] active:scale-[0.995]"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em]">{lane.title}</p>
                <p className="mt-1 text-xs text-sage/80">{lane.detail}</p>
              </div>
              <span className="premium-badge rounded-full px-2.5 py-1 text-[0.65rem] font-semibold">
                {lane.badge}
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {roadmap[lane.key].map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="rounded-xl border border-white/[0.045] bg-white/[0.025] p-3 text-sm leading-6 text-linen/82 transition duration-200 hover:border-sage/20 hover:bg-white/[0.045]"
                >
                  <span className="mr-2 rounded-full bg-sage/10 px-2 py-0.5 text-[0.65rem] font-semibold text-sage">
                    {lane.badge}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
