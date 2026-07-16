import {
  analysisSystemPrompt,
  buildAnalysisUserPrompt,
  productPulseJsonSchema,
} from "./aiPrompt";
import type { ProductPulseAnalysis } from "./mockAnalysis";

export type AIProviderName = "openai" | "gemini" | "groq";

export type AIProviderInput = {
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
};

export type AIProviderResult = {
  provider: AIProviderName;
  analysis: ProductPulseAnalysis;
};

const geminiAnalysisSchema = {
  type: "object",
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
      required: ["positive", "neutral", "negative"],
      properties: {
        positive: { type: "number" },
        neutral: { type: "number" },
        negative: { type: "number" },
      },
    },
    pain_points: { type: "array", items: { type: "string" } },
    loved_features: { type: "array", items: { type: "string" } },
    feature_requests: { type: "array", items: { type: "string" } },
    evidence_snippets: { type: "array", items: { type: "string" } },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        required: ["title", "reason", "impact", "priority", "evidence", "confidence", "frequency"],
        properties: {
          title: { type: "string" },
          reason: { type: "string" },
          impact: { type: "string" },
          priority: { type: "string", enum: ["High", "Medium", "Low"] },
          evidence: { type: "string" },
          confidence: { type: "number" },
          frequency: { type: "string" },
        },
      },
    },
    roadmap: {
      type: "object",
      required: ["now", "next", "later"],
      properties: {
        now: { type: "array", items: { type: "string" } },
        next: { type: "array", items: { type: "string" } },
        later: { type: "array", items: { type: "string" } },
      },
    },
  },
} as const;

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isStringArray(value: unknown) {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function validateAnalysisShape(value: unknown): value is ProductPulseAnalysis {
  if (!isObject(value)) return false;
  if (typeof value.summary !== "string") return false;
  if (!isObject(value.sentiment)) return false;
  if (
    typeof value.sentiment.positive !== "number" ||
    typeof value.sentiment.neutral !== "number" ||
    typeof value.sentiment.negative !== "number"
  ) {
    return false;
  }
  if (!isStringArray(value.pain_points)) return false;
  if (!isStringArray(value.loved_features)) return false;
  if (!isStringArray(value.feature_requests)) return false;
  if (value.evidence_snippets !== undefined && !isStringArray(value.evidence_snippets)) return false;
  if (!Array.isArray(value.recommendations)) return false;

  const validRecommendations = value.recommendations.every((recommendation) => {
    if (!isObject(recommendation)) return false;
    return (
      typeof recommendation.title === "string" &&
      typeof recommendation.reason === "string" &&
      typeof recommendation.impact === "string" &&
      ["High", "Medium", "Low"].includes(String(recommendation.priority))
    );
  });

  if (!validRecommendations) return false;
  if (!isObject(value.roadmap)) return false;

  return (
    isStringArray(value.roadmap.now) &&
    isStringArray(value.roadmap.next) &&
    isStringArray(value.roadmap.later)
  );
}

function toInsightString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (!isObject(value)) return String(value ?? "").trim();

  const preferredKeys = ["text", "value", "title", "theme", "point", "description", "summary"];
  const directValue = preferredKeys
    .map((key) => value[key])
    .find((item) => typeof item === "string" && item.trim());

  if (typeof directValue === "string") return directValue.trim();

  return Object.entries(value)
    .filter(([, item]) => typeof item === "string" && item.trim())
    .map(([key, item]) => `${key}: ${item}`)
    .join("; ")
    .trim();
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(toInsightString).filter(Boolean);
}

function normalizePriority(value: unknown): "High" | "Medium" | "Low" {
  const priority = String(value ?? "").toLowerCase();
  if (priority === "p0" || priority.includes("high") || priority.includes("urgent")) return "High";
  if (priority === "p2" || priority.includes("low") || priority.includes("later")) return "Low";
  return "Medium";
}

function normalizeSentiment(value: unknown) {
  const sentiment = isObject(value) ? value : {};
  const positive = Number(sentiment.positive ?? 0);
  const neutral = Number(sentiment.neutral ?? 0);
  const negative = Number(sentiment.negative ?? 0);
  const total = positive + neutral + negative;

  if (total > 0 && total !== 100) {
    const normalizedPositive = Math.round((positive / total) * 100);
    const normalizedNeutral = Math.round((neutral / total) * 100);
    const normalizedNegative = Math.max(0, 100 - normalizedPositive - normalizedNeutral);
    return {
      positive: normalizedPositive,
      neutral: normalizedNeutral,
      negative: normalizedNegative,
    };
  }

  return {
    positive,
    neutral,
    negative,
  };
}

function normalizeAnalysisCandidate(value: unknown): ProductPulseAnalysis | null {
  const candidate = isObject(value) && isObject(value.analysis) ? value.analysis : value;
  if (!isObject(candidate)) return null;
  const roadmap = isObject(candidate.roadmap) ? candidate.roadmap : {};
  const recommendations = Array.isArray(candidate.recommendations)
    ? candidate.recommendations
        .filter(isObject)
        .map((recommendation) => ({
          title: String(recommendation.title ?? "").trim(),
          reason: String(recommendation.reason ?? "").trim(),
          impact: String(recommendation.impact ?? "").trim(),
          priority: normalizePriority(recommendation.priority),
          evidence:
            recommendation.evidence === undefined
              ? undefined
              : String(recommendation.evidence ?? "").trim(),
          confidence:
            recommendation.confidence === undefined
              ? undefined
              : Number(recommendation.confidence) <= 1
                ? Math.round(Number(recommendation.confidence) * 100)
                : Math.round(Number(recommendation.confidence)),
          frequency:
            recommendation.frequency === undefined
              ? undefined
              : String(recommendation.frequency ?? "").trim(),
        }))
        .filter(
          (recommendation) =>
            recommendation.title && recommendation.reason && recommendation.impact,
        )
    : [];

  const normalized = {
    summary: String(candidate.summary ?? "").trim(),
    sentiment: normalizeSentiment(candidate.sentiment),
    pain_points: toStringArray(candidate.pain_points),
    loved_features: toStringArray(candidate.loved_features),
    feature_requests: toStringArray(candidate.feature_requests),
    evidence_snippets: toStringArray(candidate.evidence_snippets),
    recommendations,
    roadmap: {
      now: toStringArray(roadmap.now),
      next: toStringArray(roadmap.next),
      later: toStringArray(roadmap.later),
    },
  };

  return validateAnalysisShape(normalized) ? normalized : null;
}

export function parseAIJsonSafely(raw: string): ProductPulseAnalysis | null {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  const candidates = [cleaned];
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    candidates.push(cleaned.slice(firstBrace, lastBrace + 1));
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as unknown;
      const normalized = normalizeAnalysisCandidate(parsed);
      if (normalized) return normalized;
    } catch {
      // Try the next candidate.
    }
  }

  return null;
}

function getOpenAIResponseText(response: unknown): string {
  if (!isObject(response)) return "";
  if (typeof response.output_text === "string") return response.output_text;

  const output = response.output;
  if (!Array.isArray(output)) return "";

  return output
    .flatMap((item) => (isObject(item) && Array.isArray(item.content) ? item.content : []))
    .map((contentItem) =>
      isObject(contentItem) && typeof contentItem.text === "string" ? contentItem.text : "",
    )
    .join("");
}

function getChatCompletionText(response: unknown): string {
  if (!isObject(response) || !Array.isArray(response.choices)) return "";
  const firstChoice = response.choices[0];
  if (!isObject(firstChoice) || !isObject(firstChoice.message)) return "";
  return typeof firstChoice.message.content === "string" ? firstChoice.message.content : "";
}

function getGeminiText(response: unknown): string {
  if (!isObject(response) || !Array.isArray(response.candidates)) return "";
  const firstCandidate = response.candidates[0];
  if (!isObject(firstCandidate) || !isObject(firstCandidate.content)) return "";
  const parts = firstCandidate.content.parts;
  if (!Array.isArray(parts)) return "";
  return parts
    .map((part) => (isObject(part) && typeof part.text === "string" ? part.text : ""))
    .join("");
}

function buildPrompt(input: AIProviderInput) {
  return buildAnalysisUserPrompt(input);
}

export async function analyzeWithOpenAI(input: AIProviderInput): Promise<AIProviderResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OpenAI API key is not configured.");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [
        { role: "system", content: analysisSystemPrompt },
        { role: "user", content: buildPrompt(input) },
      ],
      text: {
        verbosity: "low",
        format: {
          type: "json_schema",
          name: "product_pulse_analysis",
          strict: true,
          schema: productPulseJsonSchema,
        },
      },
    }),
  });

  if (!response.ok) throw new Error(`OpenAI request failed with status ${response.status}.`);

  const analysis = parseAIJsonSafely(getOpenAIResponseText(await response.json()));
  if (!analysis) throw new Error("OpenAI returned invalid analysis JSON.");

  return { provider: "openai", analysis };
}

export async function analyzeWithGemini(input: AIProviderInput): Promise<AIProviderResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini API key is not configured.");

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: analysisSystemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: buildPrompt(input) }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: geminiAnalysisSchema,
        },
      }),
    },
  );

  if (!response.ok) throw new Error(`Gemini request failed with status ${response.status}.`);

  const analysis = parseAIJsonSafely(getGeminiText(await response.json()));
  if (!analysis) throw new Error("Gemini returned invalid analysis JSON.");

  return { provider: "gemini", analysis };
}

export async function analyzeWithGroq(input: AIProviderInput): Promise<AIProviderResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Groq API key is not configured.");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: analysisSystemPrompt },
        { role: "user", content: buildPrompt(input) },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) throw new Error(`Groq request failed with status ${response.status}.`);

  const analysis = parseAIJsonSafely(getChatCompletionText(await response.json()));
  if (!analysis) throw new Error("Groq returned invalid analysis JSON.");

  return { provider: "groq", analysis };
}
