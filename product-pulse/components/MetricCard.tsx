type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
};

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <div className="metric-card premium-card relative overflow-hidden rounded-2xl p-4">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-moss via-bronze/60 to-transparent" />
      <div className="flex items-start justify-between gap-4">
        <span className="mt-1 block h-2.5 w-2.5 rounded-full bg-moss shadow-[0_0_0_5px_rgba(35,79,60,0.08)]" />
        <span className="h-px flex-1 bg-gradient-to-r from-ink/[0.08] to-transparent" />
      </div>
      <p className="small-caps text-[0.68rem] font-semibold text-moss">{label}</p>
      <p className="mt-3 text-[1.7rem] font-semibold leading-none tracking-[-0.02em] text-ink">{value}</p>
      <p className="mt-2 text-sm leading-6 text-graphite">{detail}</p>
    </div>
  );
}
