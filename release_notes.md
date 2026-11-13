## What's Changed in v0.3.3

### Added
- **Multi-Route Navigation Architecture**:
  - Introduced clean separation of concerns: `/` (Platform Landing Page), `/card` (Dedicated Stats Card Builder Studio), and `/wrapped` (Annual Wrapped Portal).
  - Added seamless backwards compatibility routing redirecting legacy `/?user={handle}` query URLs directly to `/card?user={handle}`.
- **Search Engine Optimization & Indexing (SEO)**:
  - Added dynamic XML sitemap generation ([`app/sitemap.ts`](app/sitemap.ts)) with weekly update frequencies and priority routing.
  - Added search crawler directive rules ([`app/robots.ts`](app/robots.ts)) welcoming Googlebot, Bingbot, and AI crawlers while disallowing internal image caching endpoints.
  - Added dedicated route metadata layouts ([`app/card/layout.tsx`](app/card/layout.tsx), [`app/wrapped/layout.tsx`](app/wrapped/layout.tsx)) with canonical links.
- **Generative Engine Optimization (GEO) & AI Discovery**:
  - Implemented `public/llms.txt` standard for LLM search engines (Perplexity, ChatGPT Search, Claude).
  - Integrated Schema.org `WebApplication` and `FAQPage` JSON-LD structured data into the root layout ([`app/layout.tsx`](app/layout.tsx)) for Google Rich Snippets and AI Overviews.
- **Social Discovery & Dynamic Open Graph Banner**:
  - Implemented edge-rendered dynamic Open Graph preview image ([`app/opengraph-image.tsx`](app/opengraph-image.tsx)) generating 1200×630px high-contrast preview cards for Twitter/X, LinkedIn, Discord, and Slack.
