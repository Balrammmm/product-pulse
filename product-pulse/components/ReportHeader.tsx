type ReportHeaderProps = {
  productName: string;
  totalReviews: number;
  generatedAt: string;
  source?: string;
  analysisSource?: "openai" | "gemini" | "groq" | "local_fallback" | "sample";
  analysisMode?: string;
  processedReviewCount?: number;
};

export function ReportHeader({
  productName,
  totalReviews,
  generatedAt,
  source,
  analysisSource,
  analysisMode,
  processedReviewCount,
}: ReportHeaderProps) {
  const date = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(generatedAt));
  const sourceLabel =
    analysisSource === "sample" || source === "sample"
      ? "Sample report"
      : analysisSource === "openai"
        ? "AI analysis: OpenAI"
        : analysisSource === "gemini"
          ? "AI analysis: Gemini"
          : analysisSource === "groq"
            ? "AI analysis: Groq"
            : analysisSource === "local_fallback" || source === "local_fallback"
              ? "Local analysis"
              : "Uploaded dataset";
  const compactSource =
    analysisSource === "sample" || source === "sample"
      ? "Sample"
      : analysisSource === "openai"
        ? "AI / OpenAI"
        : analysisSource === "gemini"
          ? "AI / Gemini"
          : analysisSource === "groq"
            ? "AI / Groq"
            : analysisSource === "local_fallback" || source === "local_fallback"
              ? "Local"
              : "Uploaded";

  return (
    <section className="relative w-full overflow-hidden rounded-2xl border border-ink/[0.07] bg-linen/70 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
      <div className="absolute right-8 top-6 h-28 w-28 rounded-full bg-sage/55 blur-3xl" />
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="relative">
          <p className="section-label">Product strategy memo</p>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.025em] text-ink md:text-5xl">
            {productName || "Customer review intelligence"}
          </h1>
        </div>
        {source && (
          <span className="premium-badge rounded-full px-3 py-1 text-xs font-semibold">
            {sourceLabel}
          </span>
        )}
      </div>
      <div className="mt-7 flex flex-wrap gap-8 text-sm text-graphite">
        <span>
          Source: <strong className="font-semibold text-ink">{compactSource}</strong>
        </span>
        <span>
          <strong className="font-semibold text-ink">{totalReviews}</strong> reviews analyzed
        </span>
        <span>Generated {date}</span>
      </div>
      <details className="mt-5 max-w-3xl rounded-xl border border-ink/[0.07] bg-white/45 px-4 py-3 text-sm text-graphite">
        <summary className="cursor-pointer select-none font-semibold text-ink">
          Analysis metadata
        </summary>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 leading-6">
          <span>Uploaded rows: {totalReviews.toLocaleString()}</span>
          {processedReviewCount && <span>Processed rows: {processedReviewCount}</span>}
          {analysisMode && <span>Mode: {analysisMode}</span>}
          <span>Generated: {date}</span>
        </div>
      </details>
      {analysisSource === "local_fallback" && (
        <p className="mt-4 max-w-3xl rounded-xl border border-amber/20 bg-amber/10 px-4 py-3 text-sm leading-6 text-graphite">
          AI key not configured. Showing local analysis from your CSV.
        </p>
      )}
    </section>
  );
}
