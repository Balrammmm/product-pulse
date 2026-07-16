# ProductPulse

ProductPulse is a premium SaaS-style Next.js demo that turns customer review CSV files into product strategy insights: sentiment, pain points, loved features, feature requests, recommendations, and a roadmap.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Recharts
- PapaParse
- OpenAI, Gemini, or Groq server-side AI providers
- jsPDF

## Local Setup

```bash
cd product-pulse
npm install
npm run dev
```

Open `http://localhost:3000`.

## AI Provider Setup

Create a `.env.local` file in the `product-pulse` folder:

```bash
OPENAI_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=

OPENAI_MODEL=gpt-4.1-mini
GEMINI_MODEL=gemini-2.0-flash
GROQ_MODEL=llama-3.3-70b-versatile
```

ProductPulse tries providers in this order:

1. OpenAI when `OPENAI_API_KEY` exists
2. Gemini when `GEMINI_API_KEY` exists
3. Groq when `GROQ_API_KEY` exists
4. Local fallback when no provider is configured or every provider fails

API keys are only read inside the server-side `/api/analyze` route. They are never hardcoded or sent to the browser.

### Gemini Key Setup

To use Gemini, set this in `.env.local`:

```bash
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
```

If you only set `GEMINI_API_KEY`, ProductPulse will skip OpenAI and use Gemini automatically.

### Local Fallback

If no AI provider is available, ProductPulse still analyzes uploaded CSVs locally. The local analyzer calculates sentiment from ratings when available, detects recurring product themes from review text, extracts request-like language, and builds evidence-backed recommendations from the uploaded rows. This keeps demos functional without pretending the result came from an AI provider.

## REST API

ProductPulse exposes a Next.js route handler at `/api/analyze`.

```bash
curl http://localhost:3000/api/analyze
```

Analyze reviews:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"rows":[{"review_text":"Delivery was fast but tracking was wrong.","rating":"3","product_name":"QuickCommerce App"}],"reviewColumn":"review_text","ratingColumn":"rating"}'
```

## CSV Format

Recommended review column names:

- `review_text`
- `review`
- `comment`
- `feedback`
- `text`
- `customer_review`

Optional:

- `rating`
- `stars`
- `score`
- `date`
- `product_name`
- `user_id`

The upload page previews the first 10 rows, auto-detects likely review and rating columns, and lets advanced users adjust the selected columns manually. Smaller datasets are analyzed fully. Larger CSV exports use representative smart sampling across ratings and dates so strategy synthesis stays fast without sending an oversized prompt.

## Demo Notes

The sample report picker includes quick-commerce, fintech, food delivery, edtech, and e-commerce cases with realistic review counts and business-language recommendations. Sample reports load directly from local sample data and never call an AI provider. Any small Next.js dev indicator appears only during `npm run dev`; it is not present in production builds or Vercel deployments.

## Build

```bash
npm run build
```

## Deploy on Vercel

1. Push this folder to GitHub.
2. Import the project in Vercel.
3. Set the framework preset to Next.js.
4. Add one or more provider keys in Vercel Project Settings under Environment Variables:
   - `OPENAI_API_KEY`
   - `GEMINI_API_KEY`
   - `GROQ_API_KEY`
5. Optionally add model overrides:
   - `OPENAI_MODEL`
   - `GEMINI_MODEL`
   - `GROQ_MODEL`
6. Deploy.

## Resume Bullet

Built ProductPulse, a premium Next.js SaaS demo that analyzes customer review CSV files with OpenAI, Gemini, Groq, or deterministic local fallback, extracts sentiment and product strategy signals, visualizes insights with Recharts, and exports polished roadmap reports as PDFs.
