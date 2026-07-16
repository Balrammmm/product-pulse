import type { ReportPayload } from "./sampleData";

export type SampleReportCase = {
  id: string;
  title: string;
  category: string;
  reviewCount: number;
  keyRisk: string;
  report: ReportPayload;
};

const generatedAt = new Date().toISOString();

export const sampleReports: SampleReportCase[] = [
  {
    id: "quickcommerce",
    title: "QuickCommerce App Review Report",
    category: "Quick commerce",
    reviewCount: 1248,
    keyRisk: "Stale delivery tracking",
    report: {
      productName: "QuickCommerce App Review Report",
      totalReviews: 1248,
      generatedAt,
      generated_at: generatedAt,
      source: "sample",
      analysis_source: "sample",
      input_review_count: 1248,
      processed_review_count: 360,
      dataset_id: "sample-quickcommerce",
      averageRating: 3.7,
      analysisMode: "Smart batch synthesis",
      analysis: {
        summary:
          "Customers reward the app for speed, discounts, and repeat checkout, but post-order trust is the growth constraint. The strongest roadmap move is to stabilize ETA accuracy, refund visibility, and checkout recovery before expanding loyalty surfaces.",
        sentiment: { positive: 56, neutral: 19, negative: 25 },
        pain_points: [
          "Delivery tracking is described as stale or jumpy, especially when ETAs change during the final handoff.",
          "Refund status is unclear after missing or damaged items, creating repeated support contacts.",
          "Checkout crashes and payment retries create anxiety during sale periods and high-intent baskets.",
          "Support replies feel generic when customers need order-specific recovery context.",
        ],
        loved_features: [
          "Fast delivery remains the clearest loyalty driver for urgent grocery and snack missions.",
          "Discounts, wallet offers, and repeat baskets make frequent small orders feel worthwhile.",
          "Saved addresses and simple checkout reduce effort when payment flows succeed.",
        ],
        feature_requests: [
          "Real-time rider map with clearer location updates and ETA explanation.",
          "Refund tracker with approval, processing, settlement date, and escalation owner.",
          "Substitution controls for unavailable items before dispatch.",
          "Wishlist and recurring basket tools for weekly essentials.",
        ],
        evidence_snippets: [
          "The tracker stayed at 8 minutes for half an hour and then the rider called from another road.",
          "Refund approved but no date, no bank status, and support kept saying wait.",
          "Payment went through, app crashed, and my cart disappeared during the sale.",
          "I asked about missing vegetables and got the same template three times.",
        ],
        recommendations: [
          {
            title: "Fix ETA accuracy before expanding loyalty surfaces",
            reason:
              "Late-order frustration appears even in otherwise positive reviews, turning the speed promise into a trust problem.",
            impact:
              "Lowers cancellation anxiety, reduces WISMO support volume, and protects delivery-led retention.",
            priority: "High",
            confidence: 91,
            frequency: "214 mentions",
            evidence: "Map showed 10 minutes for almost 30 minutes.",
          },
          {
            title: "Make refunds observable end to end",
            reason:
              "Refund complaints are driven by missing status, ownership, and settlement visibility rather than policy alone.",
            impact:
              "Improves service recovery and reduces repeat contacts after failed or incomplete orders.",
            priority: "High",
            confidence: 86,
            frequency: "176 mentions",
            evidence: "Refund was approved but nobody could tell me when it would arrive.",
          },
          {
            title: "Add pre-dispatch substitution controls",
            reason:
              "Customers tolerate stockouts when they can choose replacements or decline substitutions before delivery.",
            impact:
              "Protects basket value while reducing support escalations and poor-quality replacement reviews.",
            priority: "Medium",
            confidence: 74,
            frequency: "92 mentions",
            evidence: "Please ask before replacing baby food with a random brand.",
          },
        ],
        roadmap: {
          now: [
            "Stabilize ETA updates, rider location freshness, and checkout crash recovery.",
            "Launch refund tracker with owner, settlement date, and escalation state.",
            "Tag review clusters by delayed delivery, missing items, payment failure, and support template.",
          ],
          next: [
            "Introduce substitution preferences, wishlist saves, and repeat basket flows.",
            "Route support macros through live order and refund context.",
            "Segment reliability by city, dark store density, delivery window, and basket value.",
          ],
          later: [
            "Predict late-order review risk before support escalation.",
            "Benchmark fulfillment quality by dark store and courier route.",
            "Create executive quality scorecards for product, growth, and operations.",
          ],
        },
      },
    },
  },
  {
    id: "fintech",
    title: "Fintech App Review Report",
    category: "Consumer finance",
    reviewCount: 3870,
    keyRisk: "Verification and failed transfer trust",
    report: {
      productName: "Fintech App Review Report",
      totalReviews: 3870,
      generatedAt,
      generated_at: generatedAt,
      source: "sample",
      analysis_source: "sample",
      input_review_count: 3870,
      processed_review_count: 360,
      dataset_id: "sample-fintech",
      averageRating: 3.9,
      analysisMode: "Smart batch synthesis",
      analysis: {
        summary:
          "The fintech app is trusted for fast balance checks, clean bill payment, and rewards, but onboarding and failed-transfer recovery are suppressing advocacy. Customers need clearer verification states, reversal timelines, and human escalation when money movement fails.",
        sentiment: { positive: 61, neutral: 17, negative: 22 },
        pain_points: [
          "KYC verification can stall without a clear next step, causing customers to abandon onboarding.",
          "Failed bank transfers trigger high anxiety when reversal timelines are vague or hidden.",
          "Support handoffs repeat identity checks and do not reference the latest transaction state.",
          "Reward eligibility rules are perceived as unclear when cashback does not appear instantly.",
        ],
        loved_features: [
          "Fast balance checks and simple bill payment are repeatedly described as dependable daily utilities.",
          "Clean transaction history makes budgeting and merchant review easier.",
          "Cashback and fee reminders create a strong value perception when rules are transparent.",
        ],
        feature_requests: [
          "KYC progress tracker with exact pending document or verification owner.",
          "Failed transfer status page with reversal date and bank reference ID.",
          "Dispute timeline with evidence upload and next action.",
          "Cashback eligibility preview before payment confirmation.",
        ],
        evidence_snippets: [
          "KYC says under review for four days and I do not know what document is wrong.",
          "Transfer failed, money debited, and there is no reversal date in the app.",
          "Support asked me to verify again even though the transaction screen had all details.",
          "Cashback banner was shown but the reward never appeared after payment.",
        ],
        recommendations: [
          {
            title: "Make money movement recovery explicit",
            reason:
              "Failed transfer reviews are emotionally severe because customers cannot see reversal ownership or bank status.",
            impact:
              "Protects trust, reduces escalations, and improves retention among active payment users.",
            priority: "High",
            confidence: 89,
            frequency: "326 mentions",
            evidence: "Money debited, transfer failed, and no reversal date is visible.",
          },
          {
            title: "Add a KYC progress tracker",
            reason:
              "Verification stalls are a major onboarding blocker, especially when the next required action is unclear.",
            impact:
              "Improves activation conversion and reduces support tickets from pending users.",
            priority: "High",
            confidence: 84,
            frequency: "241 mentions",
            evidence: "KYC pending with no reason and no button to fix it.",
          },
          {
            title: "Preview cashback eligibility before confirmation",
            reason:
              "Rewards disappointment comes from expectation mismatch rather than lack of offers.",
            impact:
              "Reduces low-star reviews after successful payments and increases promo trust.",
            priority: "Medium",
            confidence: 72,
            frequency: "138 mentions",
            evidence: "Offer showed before payment but cashback did not come.",
          },
        ],
        roadmap: {
          now: [
            "Add failed-transfer state, reversal ETA, and bank reference ID to transaction detail.",
            "Expose KYC blocker reason and next customer action.",
            "Give support agents transaction-state context before chat starts.",
          ],
          next: [
            "Launch dispute timeline with evidence upload and resolution SLA.",
            "Preview cashback eligibility and exclusion rules before payment.",
            "Segment failed-payment reviews by bank, payment rail, app version, and amount.",
          ],
          later: [
            "Predict high-anxiety money movement failures and trigger proactive recovery.",
            "Build trust scorecards by banking partner and payment rail.",
            "Automate personalized recovery messages for stalled KYC and transfer reversals.",
          ],
        },
      },
    },
  },
  {
    id: "food-delivery",
    title: "Food Delivery Review Report",
    category: "Marketplace delivery",
    reviewCount: 924,
    keyRisk: "Cold food and refund recovery",
    report: {
      productName: "Food Delivery Review Report",
      totalReviews: 924,
      generatedAt,
      generated_at: generatedAt,
      source: "sample",
      analysis_source: "sample",
      input_review_count: 924,
      processed_review_count: 360,
      dataset_id: "sample-food-delivery",
      averageRating: 3.5,
      analysisMode: "Smart batch synthesis",
      analysis: {
        summary:
          "Customers love restaurant breadth, deals, and quick reorder, but trust breaks when food arrives cold, items are missing, or refunds feel discretionary. The roadmap should prioritize delivery quality visibility and recovery rules before adding more discovery surfaces.",
        sentiment: { positive: 49, neutral: 23, negative: 28 },
        pain_points: [
          "Cold or late food drives low ratings even when restaurant selection is praised.",
          "Missing-item refunds are perceived as inconsistent across restaurants and agents.",
          "Driver location updates lag during multi-order batches.",
          "Restaurant substitution or cancellation details arrive too late for customers to react.",
        ],
        loved_features: [
          "Wide restaurant choice and cuisine filters help customers discover reliable meals.",
          "Discounts and free-delivery subscriptions increase repeat order intent.",
          "Easy reorder and saved addresses make weekday meal routines efficient.",
        ],
        feature_requests: [
          "Temperature or freshness promise with clear recovery path.",
          "Refund tracker for missing items and partial credits.",
          "Better batching transparency when a courier has multiple stops.",
          "Restaurant reliability score by packaging, timing, and item accuracy.",
        ],
        evidence_snippets: [
          "Food was cold and the app only offered a small coupon instead of a refund.",
          "One item was missing and support kept asking for photos after I already uploaded them.",
          "Courier map did not move, then showed two stops before mine.",
          "Restaurant cancelled an item after pickup and I could not choose a replacement.",
        ],
        recommendations: [
          {
            title: "Create a delivery quality recovery standard",
            reason:
              "Cold-food and missing-item reviews show inconsistent recovery, which customers interpret as unfair.",
            impact:
              "Improves trust after failed orders and reduces churn among frequent diners.",
            priority: "High",
            confidence: 87,
            frequency: "188 mentions",
            evidence: "Cold food got a coupon, not a refund, even though it was late.",
          },
          {
            title: "Expose courier batching and ETA confidence",
            reason:
              "Customers become more tolerant of delays when the app explains multi-stop routing honestly.",
            impact:
              "Reduces delivery anxiety and support contacts for late-but-moving orders.",
            priority: "Medium",
            confidence: 76,
            frequency: "103 mentions",
            evidence: "The map froze and then suddenly showed the rider going somewhere else.",
          },
          {
            title: "Build restaurant reliability scoring",
            reason:
              "Selection breadth is valuable, but customers need quality signals beyond rating averages.",
            impact:
              "Improves marketplace trust and shifts demand toward dependable partners.",
            priority: "Low",
            confidence: 69,
            frequency: "71 mentions",
            evidence: "Same restaurant keeps missing items but still appears recommended.",
          },
        ],
        roadmap: {
          now: [
            "Define recovery rules for cold food, missing items, and late delivery.",
            "Add refund tracker for partial credits and photo review status.",
            "Improve ETA confidence when couriers have multiple active stops.",
          ],
          next: [
            "Show courier batching transparency and restaurant preparation delay reasons.",
            "Add restaurant reliability labels for packaging, timing, and item accuracy.",
            "Segment review risk by restaurant, cuisine, courier route, and subscription status.",
          ],
          later: [
            "Predict orders likely to arrive cold and trigger proactive credits.",
            "Use marketplace quality scores to influence ranking and incentives.",
            "Create executive quality reports for supply, logistics, and support teams.",
          ],
        },
      },
    },
  },
  {
    id: "edtech",
    title: "EdTech App Review Report",
    category: "Learning platform",
    reviewCount: 2416,
    keyRisk: "Live class reliability",
    report: {
      productName: "EdTech App Review Report",
      totalReviews: 2416,
      generatedAt,
      generated_at: generatedAt,
      source: "sample",
      analysis_source: "sample",
      input_review_count: 2416,
      processed_review_count: 360,
      dataset_id: "sample-edtech",
      averageRating: 4.1,
      analysisMode: "Smart batch synthesis",
      analysis: {
        summary:
          "Learners value structured lessons, recorded classes, and exam practice, but live-session reliability and doubt resolution determine whether they renew. The strongest product move is to protect class continuity, then improve personalized practice and parent-visible progress.",
        sentiment: { positive: 64, neutral: 18, negative: 18 },
        pain_points: [
          "Live classes buffer or disconnect during peak evening sessions.",
          "Doubt resolution is slow after class, especially for paid test-prep cohorts.",
          "Progress reporting feels too generic for parents and serious learners.",
          "Downloaded videos sometimes fail offline, reducing commute and revision usage.",
        ],
        loved_features: [
          "Structured lesson paths and recorded classes help students catch up independently.",
          "Mock tests and practice questions are considered useful for exam preparation.",
          "Teacher quality is a strong positive theme when classes run smoothly.",
        ],
        feature_requests: [
          "Live class health indicator and automatic reconnect.",
          "Doubt queue with expected response time and teacher owner.",
          "Personalized revision plan from weak concepts and test history.",
          "Parent dashboard with attendance, practice, and improvement trend.",
        ],
        evidence_snippets: [
          "The teacher was good but the class froze three times before the quiz.",
          "I asked a doubt after class and got an answer two days later.",
          "Parents need a clearer view than just completed percentage.",
          "Downloaded lecture would not play on the bus without internet.",
        ],
        recommendations: [
          {
            title: "Protect live class continuity before adding new content formats",
            reason:
              "Reliability issues undermine teacher quality and paid-course trust during the core learning moment.",
            impact:
              "Improves attendance, renewal confidence, and perceived value of live cohorts.",
            priority: "High",
            confidence: 90,
            frequency: "284 mentions",
            evidence: "Class froze during the quiz and I missed the teacher's explanation.",
          },
          {
            title: "Make doubt resolution visible and owned",
            reason:
              "Students tolerate waiting better when they can see queue position, owner, and expected response.",
            impact:
              "Raises trust in paid support and reduces complaints from exam-focused learners.",
            priority: "Medium",
            confidence: 79,
            frequency: "162 mentions",
            evidence: "My doubt was unanswered for two days before the test.",
          },
          {
            title: "Turn progress into personalized revision plans",
            reason:
              "Generic completion metrics do not help learners decide what to study next.",
            impact:
              "Increases engagement depth and gives parents a clearer reason to renew.",
            priority: "Medium",
            confidence: 74,
            frequency: "119 mentions",
            evidence: "It shows progress but not which chapter I am weak in.",
          },
        ],
        roadmap: {
          now: [
            "Add live class health monitoring, reconnect states, and post-drop recovery.",
            "Create doubt queue visibility with teacher owner and expected response time.",
            "Improve offline playback reliability for downloaded videos.",
          ],
          next: [
            "Generate personalized revision plans from weak concepts and mock-test history.",
            "Launch parent dashboard with attendance, practice streak, and improvement trend.",
            "Segment class reliability by device, network, cohort size, and time of day.",
          ],
          later: [
            "Predict learners at risk of churn from class drops and unresolved doubts.",
            "Build teacher quality scorecards combining reviews, outcomes, and reliability.",
            "Create cohort-level strategy reports for academic operations and product teams.",
          ],
        },
      },
    },
  },
  {
    id: "ecommerce",
    title: "E-commerce Product Reviews",
    category: "Retail marketplace",
    reviewCount: 1680,
    keyRisk: "Quality mismatch and return delays",
    report: {
      productName: "E-commerce Product Reviews",
      totalReviews: 1680,
      generatedAt,
      generated_at: generatedAt,
      source: "sample",
      analysis_source: "sample",
      input_review_count: 1680,
      processed_review_count: 360,
      dataset_id: "sample-ecommerce",
      averageRating: 3.6,
      analysisMode: "Smart batch synthesis",
      analysis: {
        summary:
          "Marketplace reviews show a strong value proposition around assortment, discounts, and delivery speed, but confidence drops when product quality does not match photos, size guidance is unreliable, and returns feel unpredictable. The roadmap should prioritize expectation-setting and return transparency before heavier personalization.",
        sentiment: { positive: 52, neutral: 21, negative: 27 },
        pain_points: [
          "Product quality mismatch appears when photos, descriptions, or seller claims do not match the delivered item.",
          "Size and fit guidance is unreliable for apparel categories, creating avoidable returns and exchanges.",
          "Return pickup and refund timing are unclear, especially when inspection or replacement inventory is involved.",
          "Review trust is weakened by vague, fake-looking, or low-quality customer reviews.",
        ],
        loved_features: [
          "Discounts and price-drop alerts make customers feel they are getting strong value.",
          "Fast delivery and reliable packaging create confidence for repeat purchases.",
          "Broad product variety and useful filters help customers compare options quickly.",
        ],
        feature_requests: [
          "Fit predictor based on previous purchases and customer photos.",
          "Return tracker with pickup, inspection, refund, and replacement milestones.",
          "Seller reliability score visible before checkout.",
          "Verified review quality signals and stronger customer-photo filtering.",
        ],
        evidence_snippets: [
          "The photos looked premium but the actual fabric was much thinner.",
          "Medium fits like small and now exchange pickup keeps getting rescheduled.",
          "Refund has no settlement date after return inspection.",
          "I trust customer photos more than these generic five-star reviews.",
        ],
        recommendations: [
          {
            title: "Improve product expectation-setting before checkout",
            reason:
              "Quality mismatch and photo trust issues show customers need clearer evidence before buying.",
            impact:
              "Reduces returns, protects marketplace trust, and improves conversion quality for high-consideration categories.",
            priority: "High",
            confidence: 88,
            frequency: "312 mentions",
            evidence: "The photos looked premium but the actual fabric was much thinner.",
          },
          {
            title: "Make return and exchange status predictable",
            reason:
              "Return frustration is driven by missing pickup, inspection, replacement, and refund milestones.",
            impact:
              "Reduces support escalation and increases customer willingness to buy uncertain sizes or sellers.",
            priority: "High",
            confidence: 84,
            frequency: "226 mentions",
            evidence: "Return pickup was rescheduled three times and no one explained why.",
          },
          {
            title: "Add seller and review trust signals",
            reason:
              "Customers want stronger proof that ratings, seller quality, and product photos are reliable.",
            impact:
              "Improves trust in marketplace discovery and shifts demand toward dependable sellers.",
            priority: "Medium",
            confidence: 76,
            frequency: "144 mentions",
            evidence: "Please show seller reliability before checkout, not only after ordering.",
          },
        ],
        roadmap: {
          now: [
            "Tighten product photo, description, and quality checks for high-return categories.",
            "Expose return pickup, inspection, replacement, and refund milestones.",
            "Flag sellers and listings with repeated quality mismatch complaints.",
          ],
          next: [
            "Launch fit guidance using size feedback, previous purchases, and customer photos.",
            "Add verified review quality signals and stronger customer-photo filters.",
            "Surface seller reliability before checkout for delivery, quality, and returns.",
          ],
          later: [
            "Use review trust and return-risk signals to influence marketplace ranking.",
            "Predict size and quality mismatch before purchase.",
            "Create category-level quality scorecards for merchandising and seller operations.",
          ],
        },
      },
    },
  },
];

export const defaultSampleReport = sampleReports[0].report;

export function getSampleReportById(id: string) {
  return sampleReports.find((sample) => sample.id === id) ?? sampleReports[0];
}
