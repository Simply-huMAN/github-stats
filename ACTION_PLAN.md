# Implementation Action Plan: GitHub Stats & Performance Tier Card

This plan outlines the architecture and phased implementation for building the GitHub Stats Card generator with Next.js App Router, TypeScript, and Tailwind CSS.

---

## Phased Execution Roadmap

### Phase 1: Project Setup & Type Definitions
- `types/stats.ts`: Interfaces for GitHub user profile, repository stars aggregator, tier definitions (`Bronze`, `Gold`, `Mythic`), and API response payload.
- `lib/tier.ts`: Pure scoring function and metadata lookup mapping scores to tier themes, badges, and descriptions.

### Phase 2: API Route Implementation (`app/api/stats/route.ts`)
- Sanitize and validate `username` query parameter.
- Query `https://api.github.com/users/{username}` for core profile and follower count.
- Query user repositories (`/users/{username}/repos?per_page=100&sort=pushed`) to sum stargazers across public repositories.
- Query public events (`/users/{username}/events/public?per_page=100`) to estimate active contributions.
- Compute performance tier score using `calculateTier(stats)`.
- Return standardized JSON response with cache headers and error handling.

### Phase 3: Styled Tier Card Component (`components/StatsCard.tsx`)
- Bronze: Subtle slate/zinc metallic gradient.
- Gold: Radiant amber/yellow glow with warm highlights.
- Mythic: Dark neon/indigo holographic styling with iridescent borders.
- Watermark: Minimalist text in bottom corner (`gitstats.dev • verified tier`).

### Phase 4: Download Engine (`components/DownloadButton.tsx`)
- Leverages `html-to-image` with `pixelRatio: 3` and CORS handling.

### Phase 5: Interactive Preview Page (`app/page.tsx`)
- Live preview, sample handles, and theme preview toggles.
