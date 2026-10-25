# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
  - Minimalist verified text watermark in the bottom-right corner (`gitstats.dev • verified tier`).
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
