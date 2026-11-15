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
