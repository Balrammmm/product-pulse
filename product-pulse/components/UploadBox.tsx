"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  detectRatingColumn,
  detectReviewColumn,
  getAnalysisMode,
  prepareCompactReviewsForRequest,
} from "@/lib/analysisPrep";
import { demoCSVColumns, type DemoCSV } from "@/lib/demoCSVs";
import { parseCSV } from "@/lib/parseCSV";
import type { ReportPayload } from "@/lib/sampleData";
import { DemoCSVPicker } from "./DemoCSVPicker";
import { ReviewPreviewTable } from "./ReviewPreviewTable";
import { Toast } from "./Toast";

const loadingSteps = [
  "Reading review patterns",
  "Grouping recurring friction",
  "Building roadmap recommendations",
];

export function UploadBox() {
  const router = useRouter();
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [reviewColumn, setReviewColumn] = useState("");
  const [ratingColumn, setRatingColumn] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [toast, setToast] = useState("");
  const [selectedDemo, setSelectedDemo] = useState<DemoCSV | null>(null);
  const isDemoCsv = Boolean(selectedDemo);

  useEffect(() => {
    if (!isAnalyzing) return;
    const timer = window.setInterval(() => {
      setLoadingIndex((current) => (current + 1) % loadingSteps.length);
    }, 1150);
    return () => window.clearInterval(timer);
  }, [isAnalyzing]);

  const detectedReviewColumn = useMemo(() => detectReviewColumn(columns), [columns]);
  const detectedRatingColumn = useMemo(() => detectRatingColumn(columns), [columns]);
  const analysisMode = useMemo(() => getAnalysisMode(rows.length), [rows.length]);
  const canAnalyze = rows.length > 0 && Boolean(reviewColumn) && !isAnalyzing;

  async function loadFile(file: File) {
    setError("");
    setSelectedDemo(null);
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Upload a CSV file to continue.");
      return;
    }

    try {
      const parsed = await parseCSV(file);
      hydrateParsedCsv(parsed.rows, parsed.columns, file.name);
      setToast("CSV parsed successfully.");
    } catch (csvError) {
      setError(csvError instanceof Error ? csvError.message : "Could not parse CSV.");
    }
  }

  function hydrateParsedCsv(parsedRows: Record<string, string>[], parsedColumns: string[], name: string) {
    setRows(parsedRows);
    setColumns(parsedColumns);
    setFileName(name);
    const preferredReview = detectReviewColumn(parsedColumns);
    const preferredRating = detectRatingColumn(parsedColumns);
    setReviewColumn(preferredReview);
    setRatingColumn(preferredRating);
  }

  function loadDemoCsv(demo: DemoCSV) {
    setError("");
    setSelectedDemo(demo);
    hydrateParsedCsv(demo.rows, demoCSVColumns, `${demo.name}.csv`);
    setReviewColumn("review_text");
    setRatingColumn("rating");
    setToast(`Demo CSV loaded: ${demo.name}.`);
  }

  async function analyze() {
    setError("");

    if (rows.length === 0) {
      setError("Upload a CSV or use the sample file before analyzing.");
      return;
    }

    if (!reviewColumn) {
      setError("Select the column that contains the review text.");
      return;
    }

    const reviewCount = rows.filter((row) => String(row[reviewColumn] ?? "").trim()).length;
    if (reviewCount === 0) {
      setError("The selected review text column is empty.");
      return;
    }

    setIsAnalyzing(true);
    setLoadingIndex(0);
    window.localStorage.removeItem("productpulse-report");
    window.localStorage.removeItem("productpulse-toast");
    window.sessionStorage.removeItem("productpulse-report-access");

    try {
      const compactPayload = prepareCompactReviewsForRequest(rows, reviewColumn, ratingColumn || undefined);
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: compactPayload.rows,
          reviewColumn: compactPayload.reviewColumn,
          ratingColumn: compactPayload.ratingColumn,
          input_review_count: compactPayload.inputReviewCount,
          processed_review_count: compactPayload.processedReviewCount,
          product_name: compactPayload.productName,
          rating_summary: compactPayload.ratingSummary,
          analysis_mode: compactPayload.analysisMode,
        }),
      });

      const responseText = await response.text();
      let result: {
        report?: ReportPayload;
        error?: string;
      };

      try {
        result = JSON.parse(responseText) as typeof result;
      } catch {
        throw new Error(
          "This CSV is too large for one request. ProductPulse will sample reviews before analysis.",
        );
      }

      if (!response.ok || !result.report) {
        throw new Error(result.error ?? "Analysis failed.");
      }

      window.localStorage.setItem("productpulse-report", JSON.stringify(result.report));
      window.localStorage.setItem("productpulse-toast", "Strategy memo generated.");
      window.sessionStorage.setItem(
        "productpulse-report-access",
        `upload:${result.report.dataset_id ?? Date.now()}`,
      );
      router.push("/report");
    } catch (analysisError) {
      const message =
        analysisError instanceof Error
          ? analysisError.message
          : "The analysis could not be completed. Please try again.";
      setError(message);
      setToast(message);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.88fr_1.12fr]">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
      <section className="elevated-card rounded-2xl p-6 sm:p-7">
        <p className="section-label">Upload reviews</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink md:text-4xl">
          Start with a customer review CSV.
        </h1>
        <p className="mt-4 text-sm leading-6 text-graphite">
          ProductPulse reads customer review exports, detects the right columns, and turns the
          dataset into a memo-style strategy report. Large CSVs are processed using smart sampling
          and batch synthesis to keep results fast.
        </p>
        <p className="mt-3 rounded-xl border border-moss/15 bg-sage/25 px-4 py-3 text-sm leading-6 text-graphite">
          Auto-detects likely review and rating columns. Large CSVs are intelligently sampled for
          fast strategy synthesis.
        </p>

        <label
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            const file = event.dataTransfer.files?.[0];
            if (file) void loadFile(file);
          }}
          className={`group mt-7 flex min-h-[230px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center transition duration-300 ${
            isDragging
              ? "scale-[1.01] border-moss bg-sage/60 shadow-lift ring-4 ring-moss/10"
              : "border-ink/18 bg-paper/60 hover:-translate-y-1 hover:border-moss/70 hover:bg-sage/20 hover:shadow-card active:scale-[0.995]"
          }`}
        >
          <input
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void loadFile(file);
            }}
          />
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest text-sm font-semibold text-linen shadow-card transition duration-200 group-hover:scale-105">
            CSV
          </span>
          <span className="mt-5 text-base font-semibold text-ink">
            Drop a CSV here or browse files
          </span>
          <span className="mt-2 text-sm text-graphite">
            Optimized for CSV review datasets with optional rating, date, product name, and user ID.
          </span>
        </label>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <DemoCSVPicker onSelect={loadDemoCsv} />
          {fileName && (
            <span className="premium-badge badge-in rounded-full px-3 py-1 text-xs font-semibold">
              {fileName}
            </span>
          )}
        </div>

        {fileName && (
          <div className="mt-5 grid gap-3 rounded-2xl border border-ink/[0.07] bg-cream/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:grid-cols-2 xl:grid-cols-5">
            <div>
              <p className="small-caps text-[0.62rem] font-semibold text-graphite">Rows detected</p>
              <p className="mt-1 text-sm font-semibold text-ink">{rows.length}</p>
            </div>
            <div>
              <p className="small-caps text-[0.62rem] font-semibold text-graphite">Columns detected</p>
              <p className="mt-1 text-sm font-semibold text-ink">{columns.length}</p>
            </div>
            <div>
              <p className="small-caps text-[0.62rem] font-semibold text-graphite">Review column detected</p>
              <p className="mt-1 text-sm font-semibold text-ink">{reviewColumn || "Select one"}</p>
            </div>
            <div>
              <p className="small-caps text-[0.62rem] font-semibold text-graphite">Rating column</p>
              <p className="mt-1 text-sm font-semibold text-ink">{ratingColumn || "Not provided"}</p>
            </div>
            <div>
              <p className="small-caps text-[0.62rem] font-semibold text-graphite">Analysis mode</p>
              <p className="mt-1 text-sm font-semibold text-ink">{analysisMode}</p>
            </div>
          </div>
        )}

        {isDemoCsv && (
          <div className="mt-5 rounded-2xl border border-moss/15 bg-sage/25 p-4 text-sm leading-6 text-graphite">
            <p className="font-semibold text-ink">Dataset: {selectedDemo?.name}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <p>Rows: {selectedDemo?.rows.length}</p>
              <p>Columns: review_text, rating, date, product_name, user_id</p>
              <p className="sm:col-span-2">
                Purpose: Test ProductPulse without uploading your own file.
              </p>
            </div>
          </div>
        )}

        {columns.length > 0 && (
          <div className="mt-7 space-y-4 border-t border-ink/10 pt-6">
            {detectedReviewColumn ? (
              <div className="rounded-xl border border-moss/20 bg-sage/35 p-4 text-sm leading-6 text-graphite">
                We detected this automatically. You can change it if needed.
              </div>
            ) : (
              <div className="rounded-xl border border-amber/25 bg-amber/10 p-4 text-sm leading-6 text-graphite">
                We could not detect a review column. Please choose the column with customer
                comments.
              </div>
            )}
            <label className="block">
              <span className="text-sm font-semibold text-ink">
                Choose the column that contains written customer feedback.
              </span>
              <span className="mt-1 block text-xs leading-5 text-graphite">
                Example: "Delivery was late", "App crashed after payment".
              </span>
              <select
                value={reviewColumn}
                onChange={(event) => setReviewColumn(event.target.value)}
                className="mt-2 w-full rounded-xl border border-ink/12 bg-white px-3 py-3 text-sm text-ink outline-none transition duration-200 hover:border-moss/35 focus:border-moss focus:ring-4 focus:ring-moss/10"
              >
                <option value="">Select review column</option>
                {columns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </label>
            <label className="block rounded-2xl border border-ink/[0.06] bg-white/50 p-4">
              <span className="text-sm font-semibold text-ink">
                Optional: choose the column with star rating or score.
              </span>
              {detectedRatingColumn && (
                <span className="mt-1 block text-xs leading-5 text-graphite">
                  Detected rating column:{" "}
                  <span className="font-semibold text-ink">{detectedRatingColumn}</span>
                </span>
              )}
              <select
                value={ratingColumn}
                onChange={(event) => setRatingColumn(event.target.value)}
                className="mt-2 w-full rounded-xl border border-ink/12 bg-white px-3 py-3 text-sm text-ink outline-none transition duration-200 hover:border-moss/35 focus:border-moss focus:ring-4 focus:ring-moss/10"
              >
                <option value="">No rating column</option>
                {columns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-xl border border-clay/25 bg-clay/10 p-4 text-sm leading-6 text-clay shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={analyze}
          disabled={!canAnalyze}
          className="btn-primary mt-7 w-full rounded-full px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {isAnalyzing ? (
            <span className="flex w-full flex-col items-center justify-center gap-2">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-linen/85" />
                {loadingSteps[loadingIndex]}
              </span>
              <span className="loading-stepper relative h-1 w-40 overflow-hidden rounded-full bg-linen/15">
                <span className="absolute inset-y-0 left-0 block w-14 rounded-full bg-linen/75" />
              </span>
            </span>
          ) : (
            "Analyze Reviews"
          )}
        </button>
      </section>

      <section className="min-w-0">
        {rows.length === 0 ? (
          <div className="elevated-card rounded-2xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="small-caps text-xs font-semibold text-moss">CSV requirements</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">What ProductPulse reads</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ["Auto-detects", "review, comment, feedback, text, customer_review"],
                ["Optional", "rating, stars, score, date, product_name"],
                ["Scale", "built for hundreds to thousands of reviews"],
                ["Output", "sentiment, friction, feature asks, roadmap"],
              ].map(([label, value]) => (
                <div key={label} className="feature-tile interactive-card rounded-2xl p-4">
                  <p className="small-caps text-[0.64rem] font-semibold text-moss">{label}</p>
                  <p className="mt-2 text-sm font-semibold text-ink">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-graphite">
              Use a demo CSV to test a product category, or upload your own customer review export.
              Not sure? We will auto-detect likely review and rating columns.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="small-caps text-xs font-semibold text-moss">Preview</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">First 10 rows</h2>
              </div>
              <span className="rounded-full border border-ink/10 bg-white px-3 py-1 text-xs font-semibold text-graphite">
                {rows.length} rows loaded
              </span>
            </div>
            <ReviewPreviewTable rows={rows.slice(0, 10)} columns={columns} />
          </div>
        )}
      </section>
    </div>
  );
}
