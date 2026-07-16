export type AnalysisMode = "Full analysis" | "Smart batch synthesis";

const REVIEW_COLUMN_CANDIDATES = [
  "review_text",
  "review",
  "comment",
  "feedback",
  "text",
  "body",
  "customer_review",
];

const RATING_COLUMN_CANDIDATES = [
  "rating",
  "stars",
  "score",
  "review_rating",
  "product_rating",
  "overall_rating",
];

const DATE_COLUMN_CANDIDATES = ["date", "created_at", "review_date", "submitted_at"];

const SMALL_DATASET_LIMIT = 300;
const SAFE_SAMPLE_SIZE = 300;
const MAX_REVIEW_TEXT_LENGTH = 800;
const MAX_COMPACT_REVIEW_CHARS = 90000;

export type RatingSummary = {
  average?: number;
  positive: number;
  neutral: number;
  negative: number;
  ratedCount: number;
};

export type CompactAnalysisRow = {
  review_text: string;
  rating?: string;
  date?: string;
  product_name?: string;
};

function normalizeColumn(column: string) {
  return column.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function findLikelyColumn(columns: string[], candidates: string[]) {
  return (
    columns.find((column) => candidates.includes(normalizeColumn(column))) ??
    columns.find((column) =>
      candidates.some((candidate) => normalizeColumn(column).includes(candidate)),
    ) ??
    ""
  );
}

export function detectReviewColumn(columns: string[]) {
  return findLikelyColumn(columns, REVIEW_COLUMN_CANDIDATES);
}

export function detectRatingColumn(columns: string[]) {
  return findLikelyColumn(columns, RATING_COLUMN_CANDIDATES);
}

export function detectDateColumn(columns: string[]) {
  return findLikelyColumn(columns, DATE_COLUMN_CANDIDATES);
}

export function getAnalysisMode(rowCount: number): AnalysisMode {
  return rowCount <= SMALL_DATASET_LIMIT ? "Full analysis" : "Smart batch synthesis";
}

function truncateReview(text: string) {
  const cleaned = text.trim().replace(/\s+/g, " ");
  if (cleaned.length <= MAX_REVIEW_TEXT_LENGTH) return cleaned;
  return `${cleaned.slice(0, MAX_REVIEW_TEXT_LENGTH).trim()}...`;
}

function parseRating(value: unknown) {
  const rating = Number.parseFloat(String(value ?? ""));
  return Number.isFinite(rating) ? rating : null;
}

function ratingBucket(row: Record<string, string>, ratingColumn?: string) {
  const rating = ratingColumn ? parseRating(row[ratingColumn]) : null;
  if (rating === null) return "unrated";
  if (rating >= 4) return "positive";
  if (rating === 3) return "neutral";
  return "negative";
}

function calculateRatingSummary(rows: Record<string, string>[], ratingColumn?: string): RatingSummary | undefined {
  if (!ratingColumn) return undefined;

  const ratings = rows
    .map((row) => parseRating(row[ratingColumn]))
    .filter((rating): rating is number => rating !== null);

  if (ratings.length === 0) return undefined;

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

function distributeQuota(keys: string[], total: number) {
  if (keys.length === 0) return new Map<string, number>();
  const base = Math.max(1, Math.floor(total / keys.length));
  let remainder = Math.max(0, total - base * keys.length);
  const quotas = new Map<string, number>();

  keys.forEach((key) => {
    quotas.set(key, base + (remainder > 0 ? 1 : 0));
    remainder -= 1;
  });

  return quotas;
}

function pickEvenly<T>(items: T[], count: number) {
  if (items.length <= count) return items;
  if (count <= 1) return [items[0]];

  return Array.from({ length: count }, (_, index) => {
    const position = Math.round((index * (items.length - 1)) / (count - 1));
    return items[position];
  });
}

export function prepareReviewsForAnalysis(
  rows: Record<string, string>[],
  reviewColumn: string,
  ratingColumn?: string,
) {
  const validRows = rows.filter((row) => String(row[reviewColumn] ?? "").trim());
  const mode = getAnalysisMode(validRows.length);

  if (mode === "Full analysis") {
    return {
      rowsForPrompt: validRows,
      rowsForReport: validRows,
      mode,
      dateColumn: detectDateColumn(Object.keys(validRows[0] ?? {})),
    };
  }

  const dateColumn = detectDateColumn(Object.keys(validRows[0] ?? {}));
  const datedRows = dateColumn
    ? [...validRows].sort(
        (a, b) =>
          new Date(String(a[dateColumn] ?? "")).getTime() -
          new Date(String(b[dateColumn] ?? "")).getTime(),
      )
    : validRows;

  const byRating = new Map<string, Record<string, string>[]>();
  datedRows.forEach((row) => {
    const rating = ratingColumn ? String(row[ratingColumn] ?? "unrated").trim() || "unrated" : "all";
    const bucket = byRating.get(rating) ?? [];
    bucket.push(row);
    byRating.set(rating, bucket);
  });

  const ratingKeys = [...byRating.keys()].sort((a, b) => Number(a) - Number(b));
  const quotas = distributeQuota(ratingKeys, SAFE_SAMPLE_SIZE);
  const sampled = ratingKeys.flatMap((key) =>
    pickEvenly(byRating.get(key) ?? [], quotas.get(key) ?? 0),
  );

  if (sampled.length >= SAFE_SAMPLE_SIZE) {
    return {
      rowsForPrompt: sampled.slice(0, SAFE_SAMPLE_SIZE),
      rowsForReport: validRows,
      mode,
      dateColumn,
    };
  }

  const selected = new Set(sampled);
  const remainder = pickEvenly(
    datedRows.filter((row) => !selected.has(row)),
    SAFE_SAMPLE_SIZE - sampled.length,
  );

  return {
    rowsForPrompt: [...sampled, ...remainder],
    rowsForReport: validRows,
    mode,
    dateColumn,
  };
}

export function prepareCompactReviewsForRequest(
  rows: Record<string, string>[],
  reviewColumn: string,
  ratingColumn?: string,
) {
  const validRows = rows.filter((row) => String(row[reviewColumn] ?? "").trim());
  const dateColumn = detectDateColumn(Object.keys(validRows[0] ?? {}));
  const productName =
    validRows.find((row) => String(row.product_name ?? "").trim())?.product_name?.trim() ??
    "Uploaded product";
  const mode = getAnalysisMode(validRows.length);
  const ratingSummary = calculateRatingSummary(validRows, ratingColumn);

  const sortedRows = dateColumn
    ? [...validRows].sort(
        (a, b) =>
          new Date(String(a[dateColumn] ?? "")).getTime() -
          new Date(String(b[dateColumn] ?? "")).getTime(),
      )
    : validRows;

  let sampledRows = sortedRows;

  if (validRows.length > SAFE_SAMPLE_SIZE) {
    const buckets = new Map<string, Record<string, string>[]>();

    sortedRows.forEach((row) => {
      const key = ratingBucket(row, ratingColumn);
      const bucket = buckets.get(key) ?? [];
      bucket.push(row);
      buckets.set(key, bucket);
    });

    const preferredOrder = ["negative", "neutral", "positive", "unrated"];
    const bucketKeys = [
      ...preferredOrder.filter((key) => buckets.has(key)),
      ...[...buckets.keys()].filter((key) => !preferredOrder.includes(key)),
    ];
    const quotas = distributeQuota(bucketKeys, SAFE_SAMPLE_SIZE);
    const sampled = bucketKeys.flatMap((key) =>
      pickEvenly(buckets.get(key) ?? [], quotas.get(key) ?? 0),
    );

    if (sampled.length < SAFE_SAMPLE_SIZE) {
      const selected = new Set(sampled);
      sampled.push(
        ...pickEvenly(
          sortedRows.filter((row) => !selected.has(row)),
          SAFE_SAMPLE_SIZE - sampled.length,
        ),
      );
    }

    sampledRows = sampled.slice(0, SAFE_SAMPLE_SIZE);
  }

  let compactTextTotal = 0;
  const compactRows: CompactAnalysisRow[] = [];

  sampledRows.forEach((row) => {
    const reviewText = truncateReview(String(row[reviewColumn] ?? ""));
    if (!reviewText) return;
    if (compactRows.length > 0 && compactTextTotal + reviewText.length > MAX_COMPACT_REVIEW_CHARS) {
      return;
    }

    compactTextTotal += reviewText.length;
    compactRows.push({
      review_text: reviewText,
      ...(ratingColumn && row[ratingColumn] ? { rating: String(row[ratingColumn]).trim() } : {}),
      ...(dateColumn && row[dateColumn] ? { date: String(row[dateColumn]).trim() } : {}),
      ...(row.product_name ? { product_name: String(row.product_name).trim() } : {}),
    });
  });

  return {
    rows: compactRows,
    inputReviewCount: validRows.length,
    processedReviewCount: compactRows.length,
    reviewColumn: "review_text",
    ratingColumn: ratingColumn ? "rating" : undefined,
    productName,
    ratingSummary,
    analysisMode: mode,
  };
}
