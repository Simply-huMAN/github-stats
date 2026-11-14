## What's Changed in v0.3.5

### Fixed
- **Google Search Favicon & Web App Manifest**:
  - Implemented multi-format favicon system meeting Google's strict `Googlebot-Image` search result requirements:
    - Root `public/favicon.ico` with multi-resolution embeds (16x16, 32x32, 48x48).
    - Explicit `public/icon-48.png` conforming to Google's preferred multiple-of-48px square requirement.
    - `public/apple-touch-icon.png` (180x180) for iOS and Google mobile results.
    - `public/icon-192.png` and `public/icon-512.png` for Progressive Web App (PWA) splash screens.
    - Added static `public/manifest.json` configured in `app/layout.tsx`.

### Added
- **AI Search Engine (GEO) Knowledge Graph & Context**:
  - Added `public/llms-full.txt` containing full architectural details, deterministic scoring formulas, city theme specifications, and endpoint documentation for Perplexity, ChatGPT Search, and Claude.
  - Linked GitHub repository (`https://github.com/Simply-huMAN/github-stats`) and author identity in Schema.org `WebApplication` structured data (`sameAs` & `author`) to unify search engine entity knowledge graphs.
