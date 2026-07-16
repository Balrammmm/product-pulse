import Link from "next/link";
import { HeroRecommendationCarousel } from "@/components/HeroRecommendationCarousel";
import { LandingStorageReset } from "@/components/LandingStorageReset";
import { Navbar } from "@/components/Navbar";
import { SampleReportPicker } from "@/components/SampleReportPicker";
import { landingInsights } from "@/lib/sampleData";

const transformations = [
  {
    complaint: "Delivery is always late and the map never moves.",
    signal: "Tracking confidence gap",
    action: "Fix ETA accuracy before loyalty features.",
  },
  {
    complaint: "Refund approved, but no one tells me when it arrives.",
    signal: "Recovery visibility gap",
    action: "Ship a refund tracker with owner and settlement date.",
  },
  {
    complaint: "The app crashed after payment and support sent templates.",
    signal: "Checkout trust break",
    action: "Prioritize crash recovery and support context.",
  },
];

const reportOutputs = [
  {
    title: "Sentiment readout",
    description: "A calibrated positive, neutral, and negative split.",
    accent: "bg-moss",
  },
  {
    title: "Pain-point clusters",
    description: "Recurring friction grouped into product language.",
    accent: "bg-clay",
  },
  {
    title: "Feature requests",
    description: "Customer asks separated from general complaints.",
    accent: "bg-bronze",
  },
  {
    title: "P0/P1/P2 roadmap",
    description: "A priority sequence your team can discuss.",
    accent: "bg-ink",
  },
  {
    title: "Evidence snippets",
    description: "Source quotes attached to the strategic claims.",
    accent: "bg-moss",
  },
];

const heroStats = ["Handles large review exports", "JSON insights", "PDF memo export"];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <LandingStorageReset />
      <Navbar />

      <section className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 pb-14 pt-12 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:pb-20 lg:pt-16">
        <div className="fade-up max-w-2xl">
          <p className="section-label">
            Review intelligence for product leaders
          </p>
          <h1 className="mt-6 text-[2.65rem] font-semibold leading-[1.02] text-ink md:text-5xl lg:text-[3.45rem]">
            Turn customer reviews into product strategy.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-graphite md:text-lg">
            Upload raw reviews and get an executive-ready strategy memo with sentiment, recurring
            friction, customer asks, and roadmap priorities.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/upload"
              className="btn-primary rounded-full px-6 py-3.5 text-sm font-semibold"
            >
              Analyze Reviews
            </Link>
            <SampleReportPicker label="Try Sample Report" />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {heroStats.map((stat) => (
              <span
                key={stat}
                className="premium-badge badge-in rounded-full px-3 py-1.5 text-xs font-semibold"
              >
                {stat}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-x-4 top-8 h-80 rounded-full bg-sage/40 blur-3xl" />
          <div className="absolute right-8 top-10 h-48 w-48 rounded-full bg-bronze/10 blur-3xl" />
          <div className="hero-preview-shell relative rounded-[1.35rem] p-4 sm:p-5">
            <div className="pointer-events-none absolute left-6 top-6 h-2 w-2 rounded-full bg-moss shadow-[0_0_0_6px_rgba(35,79,60,0.08)]" />
            <div className="memo-card stagger-in rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="small-caps text-[0.64rem] font-semibold text-moss">
                    Strategy memo
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.01em] text-ink">
                    QuickCommerce app reviews
                  </h2>
                  <p className="mt-2 text-xs leading-5 text-graphite">
                    Executive readout generated from high-friction review clusters.
                  </p>
                </div>
                <div className="premium-badge badge-in rounded-full px-3 py-1 text-xs font-semibold">
                  1,248 reviews
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  ["62%", "Positive", "bg-moss"],
                  ["18%", "Neutral", "bg-bronze"],
                  ["20%", "Negative", "bg-clay"],
                ].map(([value, label, tone]) => (
                  <div key={label} className="interactive-card rounded-xl px-4 py-3">
                    <span className={`mb-3 block h-1 w-8 rounded-full ${tone}`} />
                    <p className="text-2xl font-semibold leading-none text-ink">{value}</p>
                    <p className="mt-2 text-xs text-graphite">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="memo-card stagger-in relative z-10 mt-4 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="small-caps text-[0.64rem] font-semibold text-moss">
                  Insight signals
                </p>
                <span className="premium-badge badge-in rounded-full px-3 py-1 text-xs font-semibold">
                  Evidence attached
                </span>
              </div>
              <span className="insight-pulse mt-4 block h-1 w-16 origin-left rounded-full bg-moss/55" />
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {landingInsights.map((insight) => (
                  <div key={insight.label} className="rounded-xl border border-ink/[0.07] bg-linen/55 p-4 transition duration-200 hover:-translate-y-1 hover:border-moss/20 hover:bg-white">
                    <p className="small-caps text-[0.6rem] font-semibold text-moss">
                      {insight.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-5 text-ink">{insight.value}</p>
                    <p className="mt-2 text-xs leading-5 text-graphite">{insight.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <HeroRecommendationCarousel />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-12 sm:px-8 lg:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="small-caps text-xs font-semibold text-moss">
            From noisy reviews to roadmap decisions
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-ink md:text-4xl">
            Make the customer voice operational, not anecdotal.
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {transformations.map((item) => (
            <article
              key={item.signal}
              className="feature-tile interactive-card rounded-2xl p-5"
            >
              <p className="small-caps text-[0.62rem] font-semibold text-graphite">
                Raw complaint
              </p>
              <p className="mt-3 text-sm leading-6 text-ink">"{item.complaint}"</p>
              <div className="mt-5 border-t border-ink/[0.07] pt-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bronze/10 text-xs font-semibold text-bronze">-&gt;</span>
                  <p className="small-caps text-[0.62rem] font-semibold text-moss">
                    Product signal
                  </p>
                </div>
                <p className="mt-2 text-sm font-semibold leading-6 text-ink">{item.signal}</p>
              </div>
              <div className="mt-4 border-t border-ink/[0.07] pt-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-moss/10 text-xs font-semibold text-moss">-&gt;</span>
                  <p className="small-caps text-[0.62rem] font-semibold text-amber">
                    Roadmap action
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-graphite">{item.action}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-ink/[0.055] bg-linen/70 py-14">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="small-caps text-xs font-semibold text-moss">What the report gives you</p>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-ink md:text-4xl">
                A compact strategy memo built from raw customer language.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-graphite">
              ProductPulse turns unstructured CSV rows into a readout product, operations, and
              leadership teams can discuss in one meeting.
            </p>
          </div>
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {reportOutputs.map((item) => (
              <div
                key={item.title}
                className="feature-tile interactive-card rounded-2xl p-5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/[0.08] bg-white shadow-sm">
                  <span className={`block h-2.5 w-2.5 rounded-full ${item.accent}`} />
                </div>
                <p className="mt-5 text-sm font-semibold leading-6 text-ink">{item.title}</p>
                <p className="mt-2 text-xs leading-5 text-graphite">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8">
        <div className="dark-strategy-panel rounded-2xl px-6 py-8 text-linen sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="small-caps text-xs font-semibold text-sage">Ready for a product memo</p>
              <h2 className="mt-3 max-w-3xl text-2xl font-semibold leading-tight md:text-3xl">
                Have a CSV? Turn it into a product memo.
              </h2>
              <p className="mt-3 text-sm text-linen/62">
                No login. No database. Upload -&gt; analyze -&gt; export.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/upload"
                className="inline-flex w-fit rounded-full bg-linen px-6 py-3 text-sm font-semibold text-ink transition duration-200 hover:-translate-y-0.5 hover:bg-sage hover:shadow-card active:scale-95"
              >
                Analyze your reviews
              </Link>
              <SampleReportPicker label="View sample report" variant="link" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
