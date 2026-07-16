import type { AnalysisMode } from "./analysisPrep";
import { defaultSampleReport } from "./sampleReports";
import type { ProductPulseAnalysis } from "./mockAnalysis";

export type ReportPayload = {
  analysis: ProductPulseAnalysis;
  productName: string;
  totalReviews: number;
  generatedAt: string;
  source?: "sample" | "upload" | "local_fallback";
  analysis_source?: "openai" | "gemini" | "groq" | "local_fallback" | "sample";
  input_review_count?: number;
  processed_review_count?: number;
  dataset_id?: string;
  generated_at?: string;
  averageRating?: number;
  analysisMode?: AnalysisMode;
  sampledReviews?: number;
};

export const sampleCsv = `review_text,rating,date,product_name,user_id
"Delivery was fast and the checkout was easy, but the map stopped updating near my building.",4,2026-04-03,Zepto Review Intelligence,U-1049
"Refund was approved after a missing item but I still cannot see when the money will come back.",2,2026-04-04,Zepto Review Intelligence,U-1050
"Discounts are great and I use the app almost every week for snacks and milk.",5,2026-04-05,Zepto Review Intelligence,U-1051
"The app crashed right after payment and I was scared the order charged twice.",2,2026-04-06,Zepto Review Intelligence,U-1052
"Please show the rider on a real map. The ETA jumps from 6 minutes to 22 minutes.",3,2026-04-07,Zepto Review Intelligence,U-1053
"Checkout is smooth and repeat orders save me a lot of time.",5,2026-04-08,Zepto Review Intelligence,U-1054
"Customer support kept sending automated replies when my vegetables were missing.",1,2026-04-09,Zepto Review Intelligence,U-1055
"The delivery was genuinely quick, but substitutions should ask me first.",4,2026-04-10,Zepto Review Intelligence,U-1056
"I want a wishlist for monthly groceries and baby products.",4,2026-04-11,Zepto Review Intelligence,U-1057
"Refund tracker is badly needed. I should not have to contact support three times.",2,2026-04-12,Zepto Review Intelligence,U-1058
"Good prices, fast delivery, and saved address make it very convenient.",5,2026-04-13,Zepto Review Intelligence,U-1059
"Payment failed twice at checkout during a sale and then my cart emptied.",2,2026-04-14,Zepto Review Intelligence,U-1060`;

export const sampleReport: ReportPayload = defaultSampleReport;

export const landingInsights = [
  {
    label: "Detected friction",
    value: "Tracking confidence",
    detail:
      "Late-order reviews repeatedly mention stale rider location, shifting ETAs, and generic support replies.",
  },
  {
    label: "Customer ask",
    value: "Refund visibility",
    detail:
      "Refund complaints are less about eligibility and more about missing status, owner, and settlement date.",
  },
  {
    label: "Roadmap bet",
    value: "Post-order trust",
    detail:
      "Resolve the highest-evidence trust gaps before expanding lower-confidence growth surfaces.",
  },
];
