# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
