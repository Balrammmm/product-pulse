"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InsightSection } from "@/components/InsightSection";
import { MetricCard } from "@/components/MetricCard";
import { Navbar } from "@/components/Navbar";
import { PDFExportButton } from "@/components/PDFExportButton";
import { RecommendationCard } from "@/components/RecommendationCard";
import { ReportHeader } from "@/components/ReportHeader";
import { Roadmap } from "@/components/Roadmap";
import { SampleReportPicker } from "@/components/SampleReportPicker";
import { SentimentChart } from "@/components/SentimentChart";
import { Toast } from "@/components/Toast";
import { sampleReport, type ReportPayload } from "@/lib/sampleData";

function compactText(value: string, maxLength = 74) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
}

type ReportSelectedEvent = CustomEvent<{
  report: ReportPayload;
  toast?: string;
}>;

export default function ReportPage() {
  const router = useRouter();
  const [report, setReport] = useState<ReportPayload | null>(null);
  const [toast, setToast] = useState("");
  const hasAuthorizedReportLoad = useRef(false);

  useEffect(() => {
    function handleReportSelected(event: Event) {
      const { report: selectedReport, toast: selectedToast } = (event as ReportSelectedEvent).detail;
      setReport(selectedReport);
      if (selectedToast) setToast(selectedToast);
    }

    function clearReportAccessOnUnload() {
      window.sessionStorage.removeItem("productpulse-report-access");
    }

    window.addEventListener("productpulse-report-selected", handleReportSelected);
    window.addEventListener("beforeunload", clearReportAccessOnUnload);

    const reportAccess = window.sessionStorage.getItem("productpulse-report-access");

    if (!reportAccess && !hasAuthorizedReportLoad.current) {
      window.sessionStorage.removeItem("productpulse-report-access");
      window.localStorage.removeItem("productpulse-toast");
      router.replace("/");
      return () => {
        window.removeEventListener("productpulse-report-selected", handleReportSelected);
        window.removeEventListener("beforeunload", clearReportAccessOnUnload);
      };
    }

    if (reportAccess) {
      hasAuthorizedReportLoad.current = true;
      window.sessionStorage.removeItem("productpulse-report-access");
    }

    const pendingToast = window.localStorage.getItem("productpulse-toast");
    if (pendingToast) {
      setToast(pendingToast);
      window.localStorage.removeItem("productpulse-toast");
    }

    const storedReport = window.localStorage.getItem("productpulse-report");
    if (storedReport) {
      try {
        const parsedReport = JSON.parse(storedReport) as ReportPayload;
        if (parsedReport.source === "sample" && parsedReport.totalReviews < 100) {
          setReport(sampleReport);
          window.localStorage.setItem("productpulse-report", JSON.stringify(sampleReport));
        } else {
          setReport(parsedReport);
        }
      } catch {
        setReport(null);
      }
    } else {
      setReport(null);
    }

    return () => {
      window.removeEventListener("productpulse-report-selected", handleReportSelected);
      window.removeEventListener("beforeunload", clearReportAccessOnUnload);
    };
  }, [router]);

  if (!report) {
    return (
      <main className="min-h-screen report-grid">
        {toast && <Toast message={toast} onClose={() => setToast("")} />}
        <Navbar />
        <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
          <div className="elevated-card rounded-[1.35rem] p-8 text-center">
            <p className="section-label">No active report</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-ink">
              Start with a CSV or sample report.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-graphite">
              ProductPulse did not find an active analysis in this browser session. Upload reviews
              or open a sample report to generate a product strategy memo.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/upload" className="btn-primary rounded-full px-5 py-3 text-sm font-semibold">
                Analyze Reviews
              </Link>
              <SampleReportPicker label="Sample report" variant="secondary" className="px-5 py-3" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  const sentiment = report.analysis.sentiment;
  const strongestPositive = compactText(report.analysis.loved_features[0] ?? "No positive theme found");
  const biggestRisk = compactText(report.analysis.pain_points[0] ?? "No risk theme found");

  return (
    <main className="min-h-screen report-grid">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
      <Navbar />
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8">
        <div className="elevated-card rounded-[1.35rem] p-5 sm:p-8 lg:p-10">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
            <ReportHeader
              productName={report.productName}
              totalReviews={report.totalReviews}
              generatedAt={report.generatedAt}
              source={report.source}
              analysisSource={report.analysis_source}
              analysisMode={report.analysisMode}
              processedReviewCount={report.processed_review_count ?? report.sampledReviews}
            />
            <div className="flex flex-wrap gap-3 lg:pt-1">
              <Link
                href="/upload"
                className="btn-secondary rounded-full px-5 py-3 text-sm font-semibold"
              >
                New analysis
              </Link>
              <SampleReportPicker label="Sample report" variant="secondary" className="px-5 py-3" />
              <PDFExportButton report={report} />
            </div>
          </div>

          <section className="mt-8 grid gap-4 md:grid-cols-4">
            <MetricCard
              label="Reviews analyzed"
              value={`${report.totalReviews}`}
              detail="Records included in this strategy memo."
            />
            <MetricCard
              label="Avg rating"
              value={report.averageRating ? `${report.averageRating}/5` : "n/a"}
              detail="Calculated when a rating column is available."
            />
            <MetricCard
              label="Strongest positive"
              value="Speed"
              detail={strongestPositive}
            />
            <MetricCard
              label="Biggest risk"
              value="Trust"
              detail={biggestRisk}
            />
          </section>

          <section className="premium-card mt-8 rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-card">
            <p className="small-caps text-[0.68rem] font-semibold text-moss">Executive summary</p>
            <p className="mt-4 max-w-5xl text-lg leading-8 tracking-[-0.005em] text-ink">
              {report.analysis.summary}
            </p>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Positive sentiment"
              value={`${sentiment.positive}%`}
              detail="Customers with clear signals of satisfaction, advocacy, or product trust."
            />
            <MetricCard
              label="Neutral sentiment"
              value={`${sentiment.neutral}%`}
              detail="Reviews with mixed, transactional, or low-emotion feedback."
            />
            <MetricCard
              label="Negative sentiment"
              value={`${sentiment.negative}%`}
              detail="Reviews that indicate friction, disappointment, or adoption risk."
            />
          </section>

          <section className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="premium-card rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-card">
              <p className="small-caps text-[0.68rem] font-semibold text-moss">Sentiment</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.01em] text-ink">
                Review tone distribution
              </h2>
              <div className="mt-6">
                <SentimentChart sentiment={sentiment} />
              </div>
            </div>
            <InsightSection
              eyebrow="Primary risks"
              title="Pain points"
              items={report.analysis.pain_points}
              evidence={report.analysis.evidence_snippets}
            />
          </section>

          <section className="mt-8 grid gap-8 lg:grid-cols-2">
            <InsightSection
              eyebrow="Expansion signals"
              title="Loved features"
              items={report.analysis.loved_features}
            />
            <InsightSection
              eyebrow="Customer asks"
              title="Feature requests"
              items={report.analysis.feature_requests}
            />
          </section>

          <section className="mt-10">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="small-caps text-xs font-semibold text-moss">Recommended action</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-ink">
                  Prioritized product moves
                </h2>
              </div>
            </div>
            <div className="grid gap-4">
              {report.analysis.recommendations.map((recommendation, index) => (
                <RecommendationCard
                  key={`${recommendation.title}-${index}`}
                  recommendation={recommendation}
                />
              ))}
            </div>
          </section>

          <div className="mt-10">
            <Roadmap roadmap={report.analysis.roadmap} />
          </div>
        </div>
      </section>
    </main>
  );
}
