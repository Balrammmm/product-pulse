import { NextResponse } from "next/server";
import {
  analyzeWithGemini,
  analyzeWithGroq,
  analyzeWithOpenAI,
  type AIProviderInput,
} from "@/lib/aiProviders";
import { prepareReviewsForAnalysis, type RatingSummary } from "@/lib/analysisPrep";
import { analyzeLocally } from "@/lib/localAnalyzer";
import type { ProductPulseAnalysis } from "@/lib/mockAnalysis";
import type { ReportPayload } from "@/lib/sampleData";

export const runtime = "nodejs";
export const maxDuration = 60;

type AnalyzeRequest = {
  rows?: Record<string, string>[];
  reviewColumn?: string;
  ratingColumn?: string;
  input_review_count?: number;
  processed_review_count?: number;
  product_name?: string;
  rating_summary?: RatingSummary;
  analysis_mode?: ReportPayload["analysisMode"];
};

const MAX_REQUEST_BYTES = 950_000;
const MAX_COMPACT_ROWS = 350;

function createDatasetId() {
  return `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function logDebug(_message: string, _payload: Record<string, unknown>) {
  // Reserved for temporary local diagnostics during development.
}

function buildReport(input: {
  analysis: ProductPulseAnalysis;
  rows: Record<string, string>[];
  rowsForPrompt: Record<string, string>[];
  source: ReportPayload["source"];
  analysisSource: NonNullable<ReportPayload["analysis_source"]>;
  ratingColumn?: string;
  analysisMode?: ReportPayload["analysisMode"];
  datasetId: string;
  inputReviewCount?: number;
  productName?: string;
  ratingSummary?: RatingSummary | null;
}): ReportPayload {
  const productName =
    input.productName ??
    input.rows.find((row) => String(row.product_name ?? "").trim())?.product_name ??
    "Uploaded product";
  const ratings = input.ratingColumn
    ? input.rows
        .map((row) => Number.parseFloat(String(row[input.ratingColumn ?? ""] ?? "")))
        .filter((rating) => Number.isFinite(rating))
    : [];
  const averageRating =
    input.ratingSummary?.average ??
    (ratings.length > 0
      ? Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10
      : undefined);
  const totalReviews = input.inputReviewCount ?? input.rows.length;

  const generatedAt = new Date().toISOString();

  return {
    analysis: input.analysis,
    productName,
    totalReviews,
    generatedAt,
    generated_at: generatedAt,
    source: input.source,
    analysis_source: input.analysisSource,
    input_review_count: totalReviews,
    processed_review_count: input.rowsForPrompt.length,
    dataset_id: input.datasetId,
    averageRating,
    analysisMode: input.analysisMode,
    sampledReviews: input.rowsForPrompt.length,
  };
}

function calculateRatingSummary(rows: Record<string, string>[], ratingColumn?: string): RatingSummary | null {
  if (!ratingColumn) return null;

  const ratings = rows
    .map((row) => Number.parseFloat(String(row[ratingColumn] ?? "")))
    .filter((rating) => Number.isFinite(rating));

  if (ratings.length === 0) return null;

  const counts = ratings.reduce(
    (acc, rating) => {
      if (rating >= 4) acc.positive += 1;
      else if (rating === 3) acc.neutral += 1;
      else acc.negative += 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 },
  );

  const positive = Math.round((counts.positive / ratings.length) * 100);
  const neutral = Math.round((counts.neutral / ratings.length) * 100);
  const negative = Math.max(0, 100 - positive - neutral);
  const average =
    Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10;

  return { average, positive, neutral, negative, ratedCount: ratings.length };
}

function buildLocalAnalysis(input: {
  rows: Record<string, string>[];
  rowsForPrompt: Record<string, string>[];
  reviewColumn: string;
  ratingColumn?: string;
  productName?: string;
  analysisMode?: ReportPayload["analysisMode"];
  inputReviewCount?: number;
}): ProductPulseAnalysis {
  return analyzeLocally(input.rowsForPrompt, input.reviewColumn, input.ratingColumn, {
    productName: input.productName,
    inputReviewCount: input.inputReviewCount ?? input.rows.length,
    processedReviewCount: input.rowsForPrompt.length,
    analysisMode: input.analysisMode,
  });
}

function repairProviderAnalysis(
  analysis: ProductPulseAnalysis,
  ratingSummary: ReturnType<typeof calculateRatingSummary>,
) {
  const sentimentTotal =
    analysis.sentiment.positive + analysis.sentiment.neutral + analysis.sentiment.negative;

  if (!ratingSummary || sentimentTotal > 0) return analysis;

  return {
    ...analysis,
    sentiment: {
      positive: ratingSummary.positive,
      neutral: ratingSummary.neutral,
      negative: ratingSummary.negative,
    },
  };
}

export async function GET() {
  return NextResponse.json({
    name: "ProductPulse Analyze API",
    status: "ready",
    method: "POST",
    path: "/api/analyze",
    input: {
      rows: "Record<string, string>[]",
      reviewColumn: "string",
      ratingColumn: "string optional",
    },
    datasetHandling: {
      mode: "Full analysis for smaller files; representative smart batch synthesis for larger CSV exports.",
    },
    output:
      "JSON report with summary, sentiment, pain points, loved features, feature requests, recommendations, and roadmap.",
  });
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

async function readAnalyzeRequest(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return {
      error:
        "This CSV is too large for one request. ProductPulse will sample reviews before analysis.",
      status: 413,
    } as const;
  }

  const rawBody = await request.text();
  if (rawBody.length > MAX_REQUEST_BYTES) {
    return {
      error:
        "This CSV is too large for one request. ProductPulse will sample reviews before analysis.",
      status: 413,
    } as const;
  }

  try {
    return { body: JSON.parse(rawBody) as AnalyzeRequest } as const;
  } catch {
    return { error: "Could not read the analysis request. Please try again.", status: 400 } as const;
  }
}

export async function POST(request: Request) {
  try {
    const parsed = await readAnalyzeRequest(request);
    if ("error" in parsed) {
      return jsonError(parsed.error ?? "Could not read the analysis request.", parsed.status);
    }

    const body = parsed.body;
    const rows = Array.isArray(body.rows) ? body.rows : [];
    const reviewColumn = body.reviewColumn;
    const datasetId = createDatasetId();

    if (!reviewColumn) {
      return jsonError("Select a review text column.");
    }

    if (rows.length > MAX_COMPACT_ROWS) {
      return jsonError(
        "This CSV is too large for one request. ProductPulse will sample reviews before analysis.",
        413,
      );
    }

    const prepared = prepareReviewsForAnalysis(rows, reviewColumn, body.ratingColumn);
    const reviews = prepared.rowsForPrompt
      .map((row) => String(row[reviewColumn] ?? "").trim())
      .filter(Boolean);

    if (reviews.length === 0) {
      return jsonError("The selected review text column is empty.");
    }

    const rowsForReport = prepared.rowsForReport;
    const productName =
      body.product_name ?? rowsForReport.find((row) => row.product_name)?.product_name;
    const ratingSummary =
      body.rating_summary ?? calculateRatingSummary(rowsForReport, body.ratingColumn);
    const inputReviewCount = body.input_review_count ?? rowsForReport.length;
    const analysisMode = body.analysis_mode ?? prepared.mode;

    logDebug("Analyze request prepared", {
      datasetId,
      rowCount: inputReviewCount,
      compactRowsReceived: rows.length,
      validReviewRows: rowsForReport.length,
      reviewColumn,
      ratingColumn: body.ratingColumn ?? null,
      reviewsSentToApi: reviews.length,
      analysisMode,
    });

    const ratings = body.ratingColumn
      ? prepared.rowsForPrompt.map((row) => String(row[body.ratingColumn ?? ""] ?? "").trim())
      : undefined;
    const providerInput: AIProviderInput = {
      reviews,
      ratingColumn: body.ratingColumn,
      ratings,
      totalRows: inputReviewCount,
      sampledRows: prepared.rowsForPrompt.length,
      analysisMode,
      productName,
      ratingSummary: ratingSummary ?? undefined,
    };
    const providerAttempts = [
      { enabled: Boolean(process.env.OPENAI_API_KEY), name: "OpenAI", analyze: analyzeWithOpenAI },
      { enabled: Boolean(process.env.GEMINI_API_KEY), name: "Gemini", analyze: analyzeWithGemini },
      { enabled: Boolean(process.env.GROQ_API_KEY), name: "Groq", analyze: analyzeWithGroq },
    ];

    for (const provider of providerAttempts) {
      if (!provider.enabled) continue;

      try {
        const providerResult = await provider.analyze(providerInput);
        const repairedAnalysis = repairProviderAnalysis(providerResult.analysis, ratingSummary);
        logDebug(`${provider.name} analysis returned`, {
          datasetId,
          analysisSource: providerResult.provider,
          sentiment: repairedAnalysis.sentiment,
        });
        return NextResponse.json({
          report: buildReport({
            analysis: repairedAnalysis,
            rows: rowsForReport,
            rowsForPrompt: prepared.rowsForPrompt,
            source: "upload",
            analysisSource: providerResult.provider,
            ratingColumn: body.ratingColumn,
            analysisMode,
            datasetId,
            inputReviewCount,
            productName,
            ratingSummary,
          }),
          analysis_source: providerResult.provider,
          input_review_count: inputReviewCount,
          processed_review_count: prepared.rowsForPrompt.length,
          dataset_id: datasetId,
          generated_at: new Date().toISOString(),
        });
      } catch (error) {
        logDebug(`${provider.name} analysis failed; trying next provider or local fallback.`, {
          message: error instanceof Error ? error.message : "Unknown provider error",
        });
      }
    }

    const localAnalysis = buildLocalAnalysis({
      rows: rowsForReport,
      rowsForPrompt: prepared.rowsForPrompt,
      reviewColumn,
      ratingColumn: body.ratingColumn,
      productName,
      analysisMode,
      inputReviewCount,
    });
    logDebug("Local analysis returned", {
      datasetId,
      analysisSource: "local_fallback",
      sentiment: localAnalysis.sentiment,
    });
    return NextResponse.json({
      report: buildReport({
        analysis: localAnalysis,
        rows: rowsForReport,
        rowsForPrompt: prepared.rowsForPrompt,
        source: "local_fallback",
        analysisSource: "local_fallback",
        ratingColumn: body.ratingColumn,
        analysisMode,
        datasetId,
        inputReviewCount,
        productName,
        ratingSummary,
      }),
      analysis_source: "local_fallback",
      input_review_count: inputReviewCount,
      processed_review_count: prepared.rowsForPrompt.length,
      dataset_id: datasetId,
      generated_at: new Date().toISOString(),
      warning: "No AI provider completed analysis. Showing local analysis from your CSV.",
    });
  } catch {
    return jsonError("Analysis could not be completed. Please try again.", 500);
  }
}
