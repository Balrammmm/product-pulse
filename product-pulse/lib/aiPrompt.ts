export const analysisSystemPrompt = `You are ProductPulse, a senior product strategy analyst for a premium SaaS company.

Analyze customer reviews and return only strict JSON. Do not include markdown, commentary, or code fences.

Create business-ready product strategy insights:
- sentiment distribution as integer percentages that sum to 100
- concrete pain points, loved features, and feature requests
- recommendations with title, reason, impact, priority, evidence, confidence, and frequency
- a roadmap grouped into now, next, and later
- evidence snippets quoted from real provided reviews

Use concise, executive language. Avoid generic statements. Tie insights to observable review patterns.
Do not invent generic recommendations. Use only themes supported by the provided reviews.
Do not repeat sample report language unless the uploaded reviews actually support it.
Every pain point and recommendation must be grounded in a short real review quote from the provided data.`;

export function buildAnalysisUserPrompt(input: {
  reviews: string[];
  ratingColumn?: string;
  ratings?: string[];
  productName?: string;
  totalRows?: number;
  sampledRows?: number;
  analysisMode?: string;
  ratingSummary?: {
    average?: number;
    positive: number;
    neutral: number;
    negative: number;
    ratedCount: number;
  };
}) {
  const compactRows = input.reviews.map((review, index) => ({
    review_text: review,
    rating: input.ratings?.[index] ?? undefined,
  }));

  return JSON.stringify(
    {
      product_name: input.productName ?? "Unknown product",
      input_review_count: input.totalRows ?? input.reviews.length,
      processed_review_count: input.sampledRows ?? input.reviews.length,
      analysis_mode: input.analysisMode ?? "Full analysis",
      rating_column: input.ratingColumn ?? null,
      rating_summary: input.ratingSummary ?? null,
      instruction:
        "Generate dataset-specific output only. Use the supplied reviews as evidence. Do not include unsupported themes.",
      reviews: compactRows,
    },
    null,
    2,
  );
}

export const productPulseJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "summary",
    "sentiment",
    "pain_points",
    "loved_features",
    "feature_requests",
    "evidence_snippets",
    "recommendations",
    "roadmap",
  ],
  properties: {
    summary: { type: "string" },
    sentiment: {
      type: "object",
      additionalProperties: false,
      required: ["positive", "neutral", "negative"],
      properties: {
        positive: { type: "number" },
        neutral: { type: "number" },
        negative: { type: "number" },
      },
    },
    pain_points: {
      type: "array",
      items: { type: "string" },
    },
    loved_features: {
      type: "array",
      items: { type: "string" },
    },
    feature_requests: {
      type: "array",
      items: { type: "string" },
    },
    evidence_snippets: {
      type: "array",
      items: { type: "string" },
    },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "reason", "impact", "priority", "evidence", "confidence", "frequency"],
        properties: {
          title: { type: "string" },
          reason: { type: "string" },
          impact: { type: "string" },
          priority: {
            type: "string",
            enum: ["High", "Medium", "Low"],
          },
          evidence: { type: "string" },
          confidence: { type: "number" },
          frequency: { type: "string" },
        },
      },
    },
    roadmap: {
      type: "object",
      additionalProperties: false,
      required: ["now", "next", "later"],
      properties: {
        now: {
          type: "array",
          items: { type: "string" },
        },
        next: {
          type: "array",
          items: { type: "string" },
        },
        later: {
          type: "array",
          items: { type: "string" },
        },
      },
    },
  },
} as const;
