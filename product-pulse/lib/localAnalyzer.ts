import type { AnalysisMode } from "./analysisPrep";
import type { ProductPulseAnalysis, Recommendation } from "./mockAnalysis";

type LocalAnalyzerMetadata = {
  productName?: string;
  inputReviewCount?: number;
  processedReviewCount?: number;
  analysisMode?: AnalysisMode;
};

type ReviewRecord = {
  text: string;
  rating: number | undefined;
  sentiment: "positive" | "neutral" | "negative";
  row: Record<string, string>;
};

type ThemeDefinition = {
  id: string;
  label: string;
  painLabel: string;
  lovedLabel: string;
  requestLabel: string;
  recommendationTitle: string;
  recommendationReason: string;
  recommendationImpact: string;
  nowAction: string;
  nextAction: string;
  laterAction: string;
  keywords: string[];
};

type ThemeScore = ThemeDefinition & {
  total: number;
  negative: number;
  positive: number;
  requests: number;
  evidence: string[];
  negativeEvidence: string[];
  positiveEvidence: string[];
  requestEvidence: string[];
};

const positiveKeywords = [
  "good",
  "great",
  "excellent",
  "love",
  "fast",
  "easy",
  "smooth",
  "useful",
  "helpful",
  "satisfied",
  "reliable",
  "clear",
  "quick",
  "convenient",
  "best",
];

const negativeKeywords = [
  "bad",
  "poor",
  "slow",
  "late",
  "crash",
  "issue",
  "refund",
  "delay",
  "broken",
  "stuck",
  "worst",
  "support",
  "failed",
  "missing",
  "cold",
  "wrong",
  "pending",
  "confusing",
];

const requestTriggers = [
  "add",
  "need",
  "please",
  "should",
  "wish",
  "want",
  "allow",
  "show",
  "make",
  "let me",
  "feature",
];

const themes: ThemeDefinition[] = [
  {
    id: "delivery_tracking",
    label: "delivery tracking and ETA accuracy",
    painLabel: "Delivery tracking and ETA accuracy are creating trust gaps.",
    lovedLabel: "Fast delivery and clear order updates are driving loyalty.",
    requestLabel: "Customers want clearer real-time map and ETA controls.",
    recommendationTitle: "Improve delivery tracking confidence",
    recommendationReason:
      "Reviews repeatedly mention order location, delivery timing, or ETA uncertainty.",
    recommendationImpact:
      "Reduces delivery anxiety, support contacts, and late-order churn risk.",
    nowAction: "Stabilize ETA accuracy and live delivery status for active orders.",
    nextAction: "Explain ETA changes and courier routing during delayed orders.",
    laterAction: "Benchmark delivery reliability by location, route, and fulfillment partner.",
    keywords: [
      "delivery",
      "deliver",
      "delivered",
      "tracking",
      "tracker",
      "eta",
      "rider",
      "courier",
      "map",
      "late",
      "route",
      "handoff",
    ],
  },
  {
    id: "refund_payment",
    label: "refund and payment recovery",
    painLabel: "Refund or payment recovery lacks visible status and ownership.",
    lovedLabel: "Payments and checkout feel dependable when confirmation is clear.",
    requestLabel: "Customers want refund timelines, payment status, and recovery tracking.",
    recommendationTitle: "Make refund and payment recovery observable",
    recommendationReason:
      "Money-related reviews carry high trust risk when status, owner, or settlement date is missing.",
    recommendationImpact:
      "Improves recovery trust and reduces repeated support contacts after failed transactions.",
    nowAction: "Show refund or payment status, owner, and expected resolution date.",
    nextAction: "Add transaction recovery timeline with customer-visible milestones.",
    laterAction: "Predict high-risk payment failures and trigger proactive recovery messages.",
    keywords: [
      "refund",
      "payment",
      "paid",
      "charged",
      "debit",
      "transfer",
      "cashback",
      "wallet",
      "transaction",
      "reversal",
      "settlement",
      "money",
      "bank",
      "failed",
    ],
  },
  {
    id: "app_performance",
    label: "app reliability and performance",
    painLabel: "App crashes, freezes, or slow states are interrupting high-intent workflows.",
    lovedLabel: "A smooth app experience is a visible strength when flows complete quickly.",
    requestLabel: "Customers want more reliable sessions, retries, and saved progress.",
    recommendationTitle: "Harden critical app reliability paths",
    recommendationReason:
      "Performance complaints cluster around moments where users are trying to complete a task.",
    recommendationImpact:
      "Protects conversion, reduces duplicate attempts, and improves perceived product quality.",
    nowAction: "Fix crashes, freezes, and retry states in the highest-intent flows.",
    nextAction: "Preserve cart, quiz, form, or transaction progress after app recovery.",
    laterAction: "Track reliability by app version, device class, and workflow stage.",
    keywords: [
      "crash",
      "crashed",
      "freeze",
      "frozen",
      "slow",
      "bug",
      "broken",
      "stuck",
      "loading",
      "performance",
      "retry",
      "failed",
      "error",
      "logs me out",
      "disconnect",
      "buffer",
    ],
  },
  {
    id: "support_service",
    label: "customer support and escalation",
    painLabel: "Support interactions feel slow, generic, or disconnected from customer context.",
    lovedLabel: "Helpful support is a trust-builder when agents resolve the issue clearly.",
    requestLabel: "Customers want support ownership, timelines, and context-aware replies.",
    recommendationTitle: "Give support workflows more context and ownership",
    recommendationReason:
      "Support complaints indicate that customers cannot tell who owns the issue or what happens next.",
    recommendationImpact:
      "Improves recovery experience and reduces repeat contacts across failed journeys.",
    nowAction: "Expose support owner, ticket state, and next action for unresolved issues.",
    nextAction: "Feed live order, payment, course, or return context into support replies.",
    laterAction: "Prioritize escalations using sentiment, value, and unresolved issue age.",
    keywords: [
      "support",
      "customer service",
      "chat",
      "agent",
      "reply",
      "template",
      "ticket",
      "escalation",
      "help",
      "response",
      "closed",
      "wait",
    ],
  },
  {
    id: "pricing_discounts",
    label: "pricing, offers, and value perception",
    painLabel: "Pricing, fees, or offer rules are creating expectation mismatch.",
    lovedLabel: "Discounts, offers, and clear value are meaningful loyalty drivers.",
    requestLabel: "Customers want clearer fees, offer eligibility, and value signals.",
    recommendationTitle: "Clarify pricing and offer expectations",
    recommendationReason:
      "Value-related reviews show that unclear fees or offer rules can offset otherwise positive usage.",
    recommendationImpact:
      "Protects conversion and reduces disappointment after checkout or payment.",
    nowAction: "Clarify fee, offer, and discount eligibility before confirmation.",
    nextAction: "Add explanations for price changes, exclusions, and expired offers.",
    laterAction: "Personalize value messaging by customer mission and repeat behavior.",
    keywords: [
      "price",
      "pricing",
      "discount",
      "offer",
      "coupon",
      "cashback",
      "fee",
      "charges",
      "expensive",
      "value",
      "sale",
      "promo",
    ],
  },
  {
    id: "product_quality",
    label: "product quality and expectation match",
    painLabel: "Product quality or expectation mismatch is reducing trust.",
    lovedLabel: "Accurate quality and clear descriptions are driving satisfaction.",
    requestLabel: "Customers want better quality signals before purchase.",
    recommendationTitle: "Improve product quality expectation-setting",
    recommendationReason:
      "Quality reviews show a gap between what customers expected and what they received.",
    recommendationImpact:
      "Reduces returns, low-star reviews, and seller or item trust issues.",
    nowAction: "Tighten quality checks and make product expectations clearer before purchase.",
    nextAction: "Surface verified customer photos, quality labels, and seller reliability.",
    laterAction: "Use review quality signals to influence ranking, merchandising, and supply rules.",
    keywords: [
      "quality",
      "damaged",
      "fabric",
      "photo",
      "photos",
      "description",
      "wrong color",
      "mismatch",
      "seller",
      "packaging",
      "fake",
      "reviews",
      "actual",
    ],
  },
  {
    id: "returns_exchange",
    label: "returns and exchange workflow",
    painLabel: "Returns or exchanges lack predictable pickup, inspection, and refund states.",
    lovedLabel: "Clear return or exchange paths make customers more confident buying.",
    requestLabel: "Customers want return pickup, exchange, and inspection tracking.",
    recommendationTitle: "Make returns and exchanges predictable",
    recommendationReason:
      "Return workflow complaints point to uncertainty around pickup, inspection, replacement, and refund timing.",
    recommendationImpact:
      "Improves post-purchase trust and reduces support escalation after failed purchases.",
    nowAction: "Show pickup, inspection, replacement, and refund milestones in one flow.",
    nextAction: "Add proactive updates when return pickup or exchange inventory changes.",
    laterAction: "Score return friction by seller, category, and logistics partner.",
    keywords: [
      "return",
      "returns",
      "exchange",
      "pickup",
      "replacement",
      "size",
      "fit",
      "inspection",
      "refund",
    ],
  },
  {
    id: "onboarding_login_kyc",
    label: "onboarding, login, and verification",
    painLabel: "Onboarding, login, or verification steps are blocking activation.",
    lovedLabel: "Fast account access and clear setup make the product feel trustworthy.",
    requestLabel: "Customers want clearer verification states and login recovery.",
    recommendationTitle: "Reduce onboarding and verification uncertainty",
    recommendationReason:
      "Activation reviews mention stuck verification, repeated login steps, or missing next actions.",
    recommendationImpact:
      "Improves activation conversion and lowers support tickets from blocked users.",
    nowAction: "Expose the exact blocker and next action for verification or login failures.",
    nextAction: "Add retry-safe login and verification recovery flows.",
    laterAction: "Predict users likely to stall in onboarding and trigger guided recovery.",
    keywords: [
      "kyc",
      "verification",
      "verify",
      "login",
      "otp",
      "onboarding",
      "account",
      "face",
      "pending",
      "document",
      "session",
    ],
  },
  {
    id: "learning_content",
    label: "classes, learning content, and progress",
    painLabel: "Class reliability, content fit, or progress visibility is limiting learning trust.",
    lovedLabel: "Recorded lectures, practice, and mentor quality are clear learning strengths.",
    requestLabel: "Learners want better progress, doubt resolution, and revision guidance.",
    recommendationTitle: "Strengthen core learning continuity",
    recommendationReason:
      "Education reviews concentrate on whether classes, doubts, practice, and progress are dependable.",
    recommendationImpact:
      "Improves renewal confidence, learner engagement, and parent-visible value.",
    nowAction: "Protect live class continuity and unresolved doubt visibility.",
    nextAction: "Turn progress and test history into personalized revision guidance.",
    laterAction: "Create learning quality scorecards by cohort, teacher, device, and topic.",
    keywords: [
      "class",
      "classes",
      "lesson",
      "lecture",
      "teacher",
      "mentor",
      "doubt",
      "quiz",
      "test",
      "practice",
      "course",
      "chapter",
      "student",
      "parent",
      "progress",
      "offline",
      "download",
      "exam",
    ],
  },
  {
    id: "food_quality",
    label: "food quality and freshness",
    painLabel: "Food freshness, temperature, or item accuracy is driving dissatisfaction.",
    lovedLabel: "Reliable meals, restaurant variety, and reordering make the app sticky.",
    requestLabel: "Customers want freshness guarantees and clearer missing-item recovery.",
    recommendationTitle: "Tighten food quality recovery",
    recommendationReason:
      "Food reviews show that temperature, missing items, and packaging failures are high-emotion issues.",
    recommendationImpact:
      "Improves repeat order trust and reduces churn from failed meal experiences.",
    nowAction: "Define recovery rules for cold food, missing items, and packaging failures.",
    nextAction: "Expose restaurant reliability by freshness, item accuracy, and packaging.",
    laterAction: "Predict cold or missing-item risk before delivery completion.",
    keywords: [
      "food",
      "cold",
      "restaurant",
      "meal",
      "fries",
      "missing item",
      "combo",
      "packaging",
      "allergen",
      "menu",
      "cuisine",
      "fresh",
      "temperature",
    ],
  },
  {
    id: "search_discovery",
    label: "search, discovery, and filtering",
    painLabel: "Search and filtering gaps make it harder for customers to find the right option.",
    lovedLabel: "Strong search, filters, and discovery reduce decision effort.",
    requestLabel: "Customers want better filters, search, and reliability signals.",
    recommendationTitle: "Improve discovery precision",
    recommendationReason:
      "Search and discovery comments indicate customers need faster ways to narrow options confidently.",
    recommendationImpact:
      "Raises conversion quality and helps customers choose with less effort.",
    nowAction: "Fix high-friction search and filter gaps in the main browse flow.",
    nextAction: "Add reliability, quality, and fit signals to discovery surfaces.",
    laterAction: "Personalize discovery using previous behavior and stated preferences.",
    keywords: [
      "search",
      "filter",
      "filters",
      "discovery",
      "recommendation",
      "recommended",
      "compare",
      "comparison",
      "variety",
      "selection",
      "choice",
      "find",
    ],
  },
  {
    id: "wishlist_personalization",
    label: "wishlist, personalization, and repeat workflows",
    painLabel: "Repeat workflows and personalization are not yet matching customer routines.",
    lovedLabel: "Saved preferences, wishlist, and repeat actions reduce effort.",
    requestLabel: "Customers want wishlist, saved preferences, and smarter repeat tools.",
    recommendationTitle: "Invest in repeat workflow personalization",
    recommendationReason:
      "Requests show customers want the product to remember habits, preferences, and repeat tasks.",
    recommendationImpact:
      "Improves retention and basket quality by reducing repeated setup effort.",
    nowAction: "Add simple saved preferences for repeated customer missions.",
    nextAction: "Build wishlist, repeat basket, or saved learning/product workflows.",
    laterAction: "Personalize recommendations from prior purchases, courses, and preferences.",
    keywords: [
      "wishlist",
      "saved",
      "repeat",
      "personalized",
      "personalization",
      "preference",
      "preferences",
      "previous",
      "habit",
      "routine",
      "reorder",
      "streak",
      "alerts",
    ],
  },
];

function normalizeText(value: string) {
  return value.toLowerCase();
}

function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function clipEvidence(value: string) {
  const trimmed = value.replace(/\s+/g, " ").trim();
  return trimmed.length > 150 ? `${trimmed.slice(0, 147).trim()}...` : trimmed;
}

function parseRating(row: Record<string, string>, ratingColumn?: string) {
  if (!ratingColumn) return undefined;
  const value = Number.parseFloat(String(row[ratingColumn] ?? ""));
  return Number.isFinite(value) ? value : undefined;
}

function classifySentiment(text: string, rating?: number): ReviewRecord["sentiment"] {
  if (typeof rating === "number") {
    if (rating >= 4) return "positive";
    if (rating === 3) return "neutral";
    return "negative";
  }

  const normalized = normalizeText(text);
  const positiveScore = positiveKeywords.filter((keyword) => normalized.includes(keyword)).length;
  const negativeScore = negativeKeywords.filter((keyword) => normalized.includes(keyword)).length;

  if (positiveScore > negativeScore) return "positive";
  if (negativeScore > positiveScore) return "negative";
  return "neutral";
}

function isRequestLike(text: string) {
  const normalized = normalizeText(text);
  return includesAny(normalized, requestTriggers);
}

function toPercentages(records: ReviewRecord[]) {
  if (records.length === 0) return { positive: 0, neutral: 0, negative: 0 };

  const counts = records.reduce(
    (acc, record) => {
      acc[record.sentiment] += 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 },
  );

  const positive = Math.round((counts.positive / records.length) * 100);
  const neutral = Math.round((counts.neutral / records.length) * 100);
  const negative = Math.max(0, 100 - positive - neutral);

  return { positive, neutral, negative };
}

function getThemeScores(records: ReviewRecord[]): ThemeScore[] {
  return themes
    .map((theme) => {
      const score: ThemeScore = {
        ...theme,
        total: 0,
        negative: 0,
        positive: 0,
        requests: 0,
        evidence: [],
        negativeEvidence: [],
        positiveEvidence: [],
        requestEvidence: [],
      };

      records.forEach((record) => {
        const normalized = normalizeText(record.text);
        if (!includesAny(normalized, theme.keywords)) return;

        score.total += 1;
        score.evidence.push(record.text);

        if (record.sentiment === "negative") {
          score.negative += 1;
          score.negativeEvidence.push(record.text);
        }

        if (record.sentiment === "positive") {
          score.positive += 1;
          score.positiveEvidence.push(record.text);
        }

        if (isRequestLike(record.text)) {
          score.requests += 1;
          score.requestEvidence.push(record.text);
        }
      });

      return score;
    })
    .filter((score) => score.total > 0)
    .sort((a, b) => b.total - a.total);
}

function firstEvidence(score: ThemeScore, kind: "negative" | "positive" | "request" | "any") {
  const source =
    kind === "negative"
      ? score.negativeEvidence
      : kind === "positive"
        ? score.positiveEvidence
        : kind === "request"
          ? score.requestEvidence
          : score.evidence;

  return clipEvidence(source[0] ?? score.evidence[0] ?? "");
}

function withFallback<T>(items: T[], fallback: T[]) {
  return items.length > 0 ? items : fallback;
}

function buildRecommendation(score: ThemeScore, index: number, totalRecords: number): Recommendation {
  const priority: Recommendation["priority"] = index === 0 ? "High" : index === 1 ? "Medium" : "Low";
  const frequency = `${score.total} ${score.total === 1 ? "mention" : "mentions"}`;
  const confidence = Math.min(92, Math.max(58, Math.round((score.total / totalRecords) * 100) + 58));

  return {
    title: score.recommendationTitle,
    reason: score.recommendationReason,
    impact: score.recommendationImpact,
    priority,
    evidence: firstEvidence(score, score.negative > 0 ? "negative" : "any"),
    confidence,
    frequency,
  };
}

function listThemes(scores: ThemeScore[], type: "pain" | "loved" | "request") {
  const scored =
    type === "pain"
      ? scores.filter((score) => score.negative > 0).sort((a, b) => b.negative - a.negative)
      : type === "loved"
        ? scores.filter((score) => score.positive > 0).sort((a, b) => b.positive - a.positive)
        : scores.filter((score) => score.requests > 0).sort((a, b) => b.requests - a.requests);

  return scored.slice(0, 4).map((score) => {
    if (type === "pain") return score.painLabel;
    if (type === "loved") return score.lovedLabel;
    return score.requestLabel;
  });
}

function topThemeNames(scores: ThemeScore[], count = 2) {
  return scores
    .slice(0, count)
    .map((score) => score.label)
    .join(" and ");
}

function firstUploadedEvidence(records: ReviewRecord[]) {
  return clipEvidence(records[0]?.text ?? "Review evidence was unavailable in the selected rows.");
}

export function analyzeLocally(
  rows: Record<string, string>[],
  reviewColumn: string,
  ratingColumn?: string,
  metadata: LocalAnalyzerMetadata = {},
): ProductPulseAnalysis {
  const records = rows
    .map((row) => {
      const text = String(row[reviewColumn] ?? "").trim();
      const rating = parseRating(row, ratingColumn);
      return text
        ? {
            text,
            rating,
            sentiment: classifySentiment(text, rating),
            row,
          }
        : null;
    })
    .filter((record): record is ReviewRecord => Boolean(record));

  const sentiment = toPercentages(records);
  const scores = getThemeScores(records);
  const negativeScores = scores
    .filter((score) => score.negative > 0)
    .sort((a, b) => b.negative - a.negative || b.total - a.total);
  const requestScores = scores
    .filter((score) => score.requests > 0)
    .sort((a, b) => b.requests - a.requests || b.total - a.total);
  const opportunityScores = scores
    .filter((score) => score.positive > 0 || score.requests > 0)
    .sort((a, b) => b.positive + b.requests - (a.positive + a.requests));

  const painPoints = withFallback(listThemes(scores, "pain"), [
    "No dominant negative theme was strong enough to isolate confidently from this dataset.",
  ]);
  const lovedFeatures = withFallback(listThemes(scores, "loved"), [
    "Positive reviews are present, but no recurring loved feature was strong enough to isolate confidently.",
  ]);
  const featureRequests = withFallback(listThemes(scores, "request"), [
    "Request-like language is limited; review more customer comments before committing roadmap scope.",
  ]);

  const recommendationScores = withFallback(
    [...negativeScores, ...requestScores.filter((score) => !negativeScores.includes(score))].slice(0, 3),
    scores.slice(0, 3),
  );

  const recommendations =
    recommendationScores.length > 0
      ? recommendationScores.map((score, index) =>
          buildRecommendation(score, index, Math.max(records.length, 1)),
        )
      : [
          {
            title: "Review the strongest repeated customer comments",
            reason:
              "The uploaded reviews did not match a predefined ProductPulse theme strongly enough for a narrow recommendation.",
            impact:
              "Creates an evidence-backed starting point for product triage without inventing unsupported themes.",
            priority: "Medium" as const,
            evidence: firstUploadedEvidence(records),
            confidence: 58,
            frequency: `${records.length} ${records.length === 1 ? "review" : "reviews"} scanned`,
          },
        ];

  const nowScores = withFallback(negativeScores.slice(0, 2), scores.slice(0, 2));
  const nextScores = withFallback(
    [...negativeScores.slice(2, 3), ...requestScores.slice(0, 2)].slice(0, 2),
    scores.slice(1, 3),
  );
  const laterScores = withFallback(opportunityScores.slice(0, 2), scores.slice(2, 4));

  const evidenceSnippets = painPoints.map((_, index) => {
    const score = negativeScores[index] ?? scores[index] ?? scores[0];
    return score ? firstEvidence(score, "negative") : firstUploadedEvidence(records);
  });

  const leadingTheme = topThemeNames(scores, 2) || "the available review themes";
  const product = metadata.productName ? `${metadata.productName} reviews` : "the uploaded CSV";
  const processedNote =
    metadata.processedReviewCount && metadata.inputReviewCount
      ? ` It synthesized ${metadata.processedReviewCount.toLocaleString()} of ${metadata.inputReviewCount.toLocaleString()} usable reviews.`
      : "";

  return {
    summary: `Local analysis generated from uploaded CSV because AI analysis is unavailable. ${product} shows ${sentiment.positive}% positive, ${sentiment.neutral}% neutral, and ${sentiment.negative}% negative sentiment, with the clearest product signals around ${leadingTheme}.${processedNote}`,
    sentiment,
    pain_points: painPoints,
    loved_features: lovedFeatures,
    feature_requests: featureRequests,
    evidence_snippets: evidenceSnippets.filter(Boolean),
    recommendations,
    roadmap: {
      now: withFallback(
        nowScores.map((score) => score.nowAction),
        ["Review the highest-risk negative comments and define the first recovery workflow."],
      ),
      next: withFallback(
        nextScores.map((score) => score.nextAction),
        ["Translate repeated requests into one scoped product improvement."],
      ),
      later: withFallback(
        laterScores.map((score) => score.laterAction),
        ["Instrument review themes by segment so future roadmap decisions are evidence-led."],
      ),
    },
  };
}
