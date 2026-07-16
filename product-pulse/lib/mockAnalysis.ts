export type Recommendation = {
  title: string;
  reason: string;
  impact: string;
  priority: "High" | "Medium" | "Low";
  evidence?: string;
  confidence?: number;
  frequency?: string;
};

export type ProductPulseAnalysis = {
  summary: string;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  pain_points: string[];
  loved_features: string[];
  feature_requests: string[];
  evidence_snippets?: string[];
  recommendations: Recommendation[];
  roadmap: {
    now: string[];
    next: string[];
    later: string[];
  };
};
