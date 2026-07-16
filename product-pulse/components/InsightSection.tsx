type InsightSectionProps = {
  title: string;
  eyebrow: string;
  items: string[];
  evidence?: string[];
};

export function InsightSection({ title, eyebrow, items, evidence }: InsightSectionProps) {
  return (
    <section className="premium-card rounded-2xl border border-ink/[0.08] bg-white/82 p-6 shadow-card">
      <p className="small-caps text-[0.68rem] font-semibold text-moss">{eyebrow}</p>
      <h2 className="mt-3 text-xl font-semibold tracking-[-0.01em] text-ink">{title}</h2>
      <div className="mt-5 space-y-3">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="rounded-xl border border-transparent p-3 transition duration-200 hover:border-ink/[0.06] hover:bg-linen/60"
          >
            <div className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-moss shadow-[0_0_0_5px_rgba(35,79,60,0.08)]" />
              <p className="text-sm leading-6 text-graphite">{item}</p>
            </div>
            {evidence?.[index] && (
              <p className="quote-block mt-3 rounded-xl px-4 py-3 text-sm leading-6 text-graphite">
                <span className="small-caps mr-2 text-[0.62rem] font-semibold text-moss">
                  Evidence
                </span>
                "{evidence[index]}"
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
