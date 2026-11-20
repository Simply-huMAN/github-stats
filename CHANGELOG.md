# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.4.0] - 2026-11-21

### Added
- **Developer Showdown (2-User Head-to-Head Comparison)**:
  - Launched `/compare` comparison hub and `/compare/[user1]/vs/[user2]` battle arena.
  - Compares two GitHub developers across 6 key metrics:
    - Overall Performance Tier & Deterministic Score (Mythic, Gold, Bronze).
    - Star Power (Total Repository Stars).
    - Follower Reach.
    - Active 90-Day Contribution Velocity.
    - Public Repository Footprint.
    - GitHub Seniority & Account Longevity.
  - Calculates round wins, score deltas, and automated match headlines (e.g., *"Decisive Victory for @torvalds"* or *"Tied Battle"*).
  - High-res PNG battle card export powered by `html-to-image` for sharing on social platforms.
- **Strict Pre-Validation (`lib/validation.ts`)**:
  - Implemented GitHub username validation conforming to GitHub's official pattern `/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i`.
  - Rejects invalid characters, consecutive hyphens, leading/trailing hyphens, and self-comparisons prior to outbound API calls.
  - Deterministic canonical pair ordering for SEO indexation (`user1` vs `user2` ordered alphabetically).
- **Edge CDN Optimization (`lib/statsFetcher.ts`, `app/api/compare/route.ts`)**:
  - Configured caching directives `Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200`, `CDN-Cache-Control: max-age=86400`, and `Cloudflare-CDN-Cache-Control: max-age=86400`.
  - Serves repeat showdowns directly from Cloudflare Edge without hitting GitHub API quotas or backend servers.
- **Dynamic OpenGraph Battle Cards (`next/og`)**:
  - Edge-rendered 1200×630 showdown images at `/compare/[user1]/vs/[user2]/opengraph-image` with Electric Indigo (`#6366f1`) and Amber (`#f59e0b`) contender palettes, dual-ring VS badge, and dynamic text sizing.
  - Static hub banner at `/compare/opengraph-image`.
  - Click-through-rate optimized OpenGraph & Twitter Card metadata.
- **Responsive Mobile Layout**:
  - Seamless mobile (<640px) stacked metric showdown view with clear contender winner trophies and percentage progress bars.

---

## [0.3.5] - 2026-11-14

### Fixed
- **Strictly Drop Trailing Slashes & Eliminate Bing Redirect Loops**:
  - Configured `trailingSlash: false` in [`next.config.mjs`](next.config.mjs) to enforce trailing slash removal across all routes, preventing 301/308 redirect loops reported by Bing Webmaster Tools.
  - Harmonized root and subpage canonical URLs (`/`, `/card`, `/wrapped`) in [`app/layout.tsx`](app/layout.tsx) and [`app/sitemap.ts`](app/sitemap.ts) ensuring clean 200 OK responses without trailing slashes.
- **Google Search Favicon & Web App Manifest**:
  - Implemented multi-format favicon system meeting Google's strict `Googlebot-Image` search result requirements:
    - Root `public/favicon.ico` with multi-resolution embeds (16x16, 32x32, 48x48).
    - Explicit `public/icon-48.png` conforming to Google's preferred multiple-of-48px square requirement.
    - `public/apple-touch-icon.png` (180x180) for iOS and Google mobile results.
    - `public/icon-192.png` and `public/icon-512.png` for Progressive Web App (PWA) splash screens.
    - Added static `public/manifest.json` configured in `app/layout.tsx`.

### Added
- **Google Search Brand Identity (`WebSite` Schema & `applicationName`)**:
  - Injected Schema.org `WebSite` JSON-LD structured data with `"name": "MyGitStats"`, `"alternateName": ["mygitstats.dev", "MyGitStats App"]`, and `sameAs` repository links inside [`app/layout.tsx`](app/layout.tsx) to establish the authoritative site name in Google SERPs.
  - Added `applicationName: "MyGitStats"` to root Next.js metadata.
- **Repository Branding & Inbound Anchor Strategy**:
  - Updated [`README.md`](README.md) to explicitly reinforce "MyGitStats" as a single combined brand word across all titles, badges, and code snippets.
  - Added [`docs/LAUNCH_POSTS.md`](docs/LAUNCH_POSTS.md) with copy-paste launch post templates for Dev.to, Hashnode, Reddit, and Hacker News using the exact anchor text `[MyGitStats](https://mygitstats.dev)`.
- **AI Search Engine (GEO) Knowledge Graph & Context**:
  - Added `public/llms-full.txt` containing full architectural details, deterministic scoring formulas, city theme specifications, and endpoint documentation for Perplexity, ChatGPT Search, and Claude.
  - Linked GitHub repository (`https://github.com/Simply-huMAN/github-stats`) and author identity in Schema.org `WebApplication` structured data (`sameAs` & `author`) to unify search engine entity knowledge graphs.

---

## [0.3.4] - 2026-11-14

### Added
- **52-Week Commit Activity Heatmap**:
  - Implemented an inline vector SVG heatmap component ([`components/ContributionHeatmap.tsx`](components/ContributionHeatmap.tsx)) rendering the full calendar year of commit activity across 52 columns and 7 weekday rows.
  - Added month indicators (Jan–Dec), weekday labels (Mon, Wed, Fri), commit summary badge, and an intensity level legend (Less $\to$ More).
- **City-Themed Heatmap Palettes**:
  - Integrated dynamic color mapping to harmonize dot intensities across all city palettes (Tokyo, Bangalore, Hyderabad, Berlin, San Francisco, Paris, Frankfurt, Shanghai) as well as tier fallbacks and classic GitHub green.
- **Interactive Heatmap Customizer Toggle**:
  - Added a dedicated 1-click `[Heatmap: ON / OFF]` button to the builder toolbar ([`components/builder/CustomizerToolbar.tsx`](components/builder/CustomizerToolbar.tsx)).
  - Dynamically renders or completely removes the heatmap from card canvas previews and 3x retina PNG exports ([`components/StatsCard.tsx`](components/StatsCard.tsx)).
  - Preserves toggle preference across deep-link sharing URLs (`?heatmap=false`).
- **Resilient 3-Tier Contribution Data Ingestion**:
  - Built multi-tier data resolution in [`lib/contributions.ts`](lib/contributions.ts): queries the official GitHub GraphQL `contributionsCollection` when `GITHUB_TOKEN` is present, falls back to a public mirror API, and defaults to a deterministic synthetic 52-week activity generator seeded from user activity metrics.
- **SEO & Backlink Flywheel in README**:
  - Added live domain badges (`mygitstats.dev`), direct studio navigation links, and a copy-paste GitHub profile README embed code snippet in [`README.md`](README.md).

### Fixed
- **WhatsApp & Social Link Previews**:
  - Resolved missing preview image on WhatsApp, iMessage, and Telegram by adding an optimized static banner at [`public/og-image.png`](public/og-image.png) (85.7 KB, well under WhatsApp's 300 KB limit).
  - Added explicit `type: "image/png"` to Open Graph image metadata in [`app/layout.tsx`](app/layout.tsx).

---

## [0.3.3] - 2026-11-13

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

---

## [0.3.2] - 2026-11-13

### Added
- **Domain Branding & Metadata**:
  - Configured `metadataBase` to point to production domain `https://mygitstats.dev`.
  - Added comprehensive OpenGraph, Twitter card metadata, and SVG favicon links in [`app/layout.tsx`](app/layout.tsx).
- **Multi-Page Repository Pagination**:
  - Enhanced GitHub repository star calculation in [`app/api/stats/route.ts`](app/api/stats/route.ts) to paginate up to 300 repositories (3 pages) concurrently, resolving star truncation for developers with >100 public repositories.

### Changed
- **Card Watermark Domain**:
  - Updated card export watermark from Render hosting URL to `mygitstats.dev` across live canvas previews and generated PNGs ([`components/StatsCard.tsx`](components/StatsCard.tsx)).
- **Project Documentation**:
  - Added repository audit, review notes, decision log, and session tracker to `docs/`.

### Removed
- **Redundant Theme Styles**:
  - Removed duplicate `lib/themes/frameStyles.ts` in favor of `lib/themes/frameStyles.tsx`.

---

## [0.3.1] - 2026-10-26

### Added
- **Microsoft Clarity Analytics Integration**:
  - Integrated Microsoft Clarity tracking script into the root HTML `<head>` ([`app/layout.tsx`](app/layout.tsx)) using Next.js `next/script` with `strategy="afterInteractive"`.
  - Enables user session recordings, visual click and scroll heatmaps, and user experience analytics without impacting core Web Vitals or page load performance.

---

## [0.3.0] - 2026-10-26

### Fixed
- **Browser-Agnostic Image Export (Brave Washed-Out Fix)**:
  - Configured solid foundation background colors (`baseBgColor`) and linear gradients (`linearGradient`) across all city themes and tier configurations.
  - Multi-layered card backgrounds with `backgroundColor`, `backgroundImage: ${ambientBg}, ${linearGradient}`, and explicit `colorScheme: 'dark'`, eliminating transparency alpha leakage that caused cards to appear washed out in Brave browser.
  - Enabled `skipFonts: true` and solid canvas background in `components/DownloadButton.tsx` so Brave Shields doesn't stall or wash out exports.
- **Avatar Cache Isolation in Export Engine**:
  - Resolved `html-to-image` memory caching bug where exporting a new user reused the previous user's cached avatar due to query parameter stripping in cache keys.
  - Enabled `includeQueryParams: true` in `DownloadButton.tsx`.
  - Added unique user path segments to avatar proxy (`/api/avatar/[username]`) and React `key={user.username}` on image nodes to enforce 100% avatar freshness on consecutive searches and downloads.
- **Theme Text Visibility in ForeignObject Canvas**:
  - Replaced `-webkit-background-clip: text` with vibrant, solid, high-contrast text colors and glow drop-shadows across all 8 city themes and 3 performance tiers.
  - Guarantees Rank Classification score and tier titles are crisp and visible across all browsers (Brave, Chrome, Safari, Firefox) and SVG canvas exports.
- **Brave Shields / Ad-Blocker Request Blocking Fix**:
  - Added `/api/developer` route alias so ad-blockers and privacy shields (which filter out URL patterns matching `*stats*` as telemetry/analytics) do not silently block developer fetch calls.
  - Sanitized search inputs to automatically strip leading `@` symbols (e.g. `@torvalds` -> `torvalds`) and extract handles from full profile URLs.

### Added
- **Rich Error & Notification System (`components/NotificationAlert.tsx`)**:
  - Specialized alert treatments for 404 (Developer Not Found with typo guidance and quick sample handles), 403 (GitHub Rate Limit with reset timers and token instructions), 504 (Request Timeout with retry button), and offline network errors.
  - Built-in 10-second client-side `AbortController` timeout and 8-second upstream API timeout so requests never hang indefinitely.

### Changed
- Streamlined GitHub Actions release notes generation to strictly publish only the changes for the current release version from `CHANGELOG.md` (`generate_release_notes: false`).

---

## [0.2.0] - 2026-10-26

### Added
- **Custom Card Builder & 8 City Themes (`components/builder/CustomizerToolbar.tsx`, `lib/themes/`)**:
  - 8 handcrafted city-inspired visual theme palettes: Tokyo (cyberpunk neon), Berlin (underground techno monochrome), Bangalore (tech hub saffron/emerald), Hyderabad (regal gold & cyan), San Francisco (foggy ocean teal), Paris (champagne lavender), Frankfurt (financial high-tech slate), and Shanghai (high-contrast red & gold neon).
  - Modular Avatar Frame shapes: Squircle, Circle, Cyber Hexagon, Neon Ring, and Brushed Metal.
  - Custom Avatar Badges: Performance Tier Rank, Minimal Shield, Star Contributor, and Neon Sparkle.
  - Card Background Textures: Ambient Glow, Cyber Grid pattern, Dot Matrix, and Glassmorphic blur.
  - Deep linking & sharing support via URL query parameters (`?user=...&theme=...&frame=...&badge=...&bg=...`).
- **Mobile-First Responsive Design**:
  - Fluid padding and responsive typography across all card and toolbar components for seamless viewing on mobile and tablet devices.
  - Full-width touch targets and iOS Safari auto-zoom prevention on input focus.
  - Next.js 14 `viewport` metadata configuration (`width: device-width`, `initialScale: 1`).

### Changed
- Preserved authentic GitHub developer performance tier in badge label (`MYTHIC TIER`, `GOLD TIER`, `BRONZE TIER`) while applying custom city styling palettes.
- Updated card watermark URL to live deployment domain (`github-stats-s3gs.onrender.com • verified tier`).
- Upgraded Docker standalone container to Node 22 Alpine matching GitHub Actions CI.
- Hardened release and deployment workflows to be strictly governed by `main`.

---

## [0.1.0] - MVP Release - 2026-10-25

### Added
- **GitHub Stats API Endpoint (`/app/api/stats/route.ts`)**:
  - Ingests user profile (`login`, `name`, `bio`, `avatar_url`, `created_at`).
  - Aggregates stargazer count across public user repositories.
  - Queries GitHub Public Events API to calculate active 90-day contributions (commits, PRs, issues).
  - Built-in rate-limit headers detection (`x-ratelimit-remaining`) and optional `GITHUB_TOKEN` environment variable support.
- **Deterministic Performance Tier Engine (`lib/tier.ts`)**:
  - Weighted developer score formula:
    $$\text{Score} = (\text{Total Stars} \times 3.0) + (\text{Followers} \times 1.5) + (\min(\text{Public Repos}, 50) \times 1.0) + (\text{Active Contributions} \times 0.5)$$
  - **Bronze Tier** (`< 100` pts): Brushed metallic zinc gradient and silver badges.
  - **Gold Tier** (`100 - 499` pts): Luminous amber/honey outer glow and gold accents.
  - **Mythic Tier** (`>= 500` pts): Cosmic indigo/neon holographic gradients with cyan/magenta shimmer.
- **Client Stats Card Component (`components/StatsCard.tsx`)**:
  - Responsive, retina-ready card design with forwardRef for DOM capture.
  - CORS-compliant avatar rendering (`crossOrigin="anonymous"`).
  - Minimalist verified text watermark in the bottom-right corner.
- **Retina PNG Export Engine (`components/DownloadButton.tsx`)**:
  - Integrates `html-to-image` rendering at 3x pixel ratio for print and social media sharing.
  - Automated download trigger with dynamic naming convention: `${username}-github-${tier}-card.png`.
- **Interactive Test Harness (`app/page.tsx`)**:
  - Search input with quick-load presets (`@torvalds`, `@shadcn`, `@kentcdodds`, `@octocat`).
  - Live tier preview switcher enabling instant preview of all three themes.
- **Production DevOps & CI/CD**:
  - Multi-stage `Dockerfile` leveraging Next.js `output: 'standalone'` for ultra-lean memory footprint on Render.
  - Render Blueprint specification (`render.yaml`) for zero-touch cloud deployment.
  - GitHub Actions `release.yml` and `snapshot.yml` mirroring the workflow pattern from `Simply-huMAN/quizo`, featuring automated artifact packaging, semantic release tagging, and Render webhook dispatch.
