## What's Changed in v0.4.0

### Added
- **Developer Showdown — Head-to-Head 2-User Comparison**:
  - New comparison arena at `/compare` and dynamic showdown routes at `/compare/[user1]/vs/[user2]`.
  - Side-by-side metric battle across 6 dimensions: Performance Tier Score, Star Power, Followers, 90-Day Contribution Velocity, Public Repos, and GitHub Seniority.
  - Contender color system: Electric Indigo (`#6366f1`) for Contender 1 vs Yellow-Orange / Amber (`#f59e0b`) for Contender 2 with matching winner trophies.
  - High-res battle card PNG export for social sharing.
- **Pre-Validation & Edge CDN Caching**:
  - Strict pre-validation (`/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i`) drops invalid queries before making upstream API calls.
  - Cloudflare Edge CDN cache headers (`s-maxage=86400`) ensure repeated comparisons are served from the edge.
- **Dynamic OpenGraph Battle Cards**:
  - Edge-rendered dynamic 1200×630 social share cards (`/compare/[user1]/vs/[user2]/opengraph-image`) with rich previews for Twitter / X, LinkedIn, Discord, and Slack.
- **Mobile-Responsive UI**:
  - Stacked mobile metrics view with dedicated trophy indicators and percentage comparison bars.

---

## What's Changed in v0.3.5

### Fixed
- **Strictly Drop Trailing Slashes & Eliminate Bing Redirect Loops**:
  - Configured `trailingSlash: false` in `next.config.mjs` to enforce trailing slash removal across all routes, preventing 301/308 redirect loops reported by Bing Webmaster Tools.
  - Harmonized root and subpage canonical URLs (`/`, `/card`, `/wrapped`) in `app/layout.tsx` and `app/sitemap.ts` ensuring clean 200 OK responses without trailing slashes.
- **Google Search Favicon & Web App Manifest**:
  - Implemented multi-format favicon system meeting Google's strict `Googlebot-Image` search result requirements:
    - Root `public/favicon.ico` with multi-resolution embeds (16x16, 32x32, 48x48).
    - Explicit `public/icon-48.png` conforming to Google's preferred multiple-of-48px square requirement.
    - `public/apple-touch-icon.png` (180x180) for iOS and Google mobile results.
    - `public/icon-192.png` and `public/icon-512.png` for Progressive Web App (PWA) splash screens.
    - Added static `public/manifest.json` configured in `app/layout.tsx`.

### Added
- **Google Search Brand Identity (`WebSite` Schema & `applicationName`)**:
  - Injected Schema.org `WebSite` JSON-LD structured data with `"name": "MyGitStats"` and `"alternateName": ["mygitstats.dev", "MyGitStats App"]` inside `app/layout.tsx` to establish the authoritative site name in Google SERPs.
  - Added `applicationName: "MyGitStats"` to root Next.js metadata.
- **Repository Branding & Inbound Anchor Strategy**:
  - Updated `README.md` to explicitly reinforce "MyGitStats" as a single combined brand word across all titles, badges, and code snippets.
  - Added `docs/LAUNCH_POSTS.md` with copy-paste launch post templates for Dev.to, Hashnode, Reddit, and Hacker News using the exact anchor text `[MyGitStats](https://mygitstats.dev)`.
- **AI Search Engine (GEO) Knowledge Graph & Context**:
  - Added `public/llms-full.txt` containing full architectural details, deterministic scoring formulas, city theme specifications, and endpoint documentation for Perplexity, ChatGPT Search, and Claude.
  - Linked GitHub repository (`https://github.com/Simply-huMAN/github-stats`) and author identity in Schema.org `WebApplication` structured data (`sameAs` & `author`) to unify search engine entity knowledge graphs.
