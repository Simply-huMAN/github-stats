# Architecture & Product Decisions Log

> Track key decisions made during the GitStats → `mygitstats.dev` launch sprint.
> Update this file whenever a significant decision is made so future sessions have context.

---

## Decision Log

### D1: Domain Name
- **Date:** November 12, 2026
- **Decision:** `mygitstats.dev`
- **Rationale:** Personal feel ("my git stats"), `.dev` enforces HTTPS and signals developer credibility, descriptive URL, works for both Stats Cards and Wrapped products. ~$10-12/yr.
- **Status:** ✅ Purchased

### D2: Launch Date
- **Date:** November 12, 2026
- **Decision:** December 10, 2026 (public launch)
- **Rationale:** Second week of December gives 28 days. Year-end timing aligns with Wrapped concept. Feature freeze Dec 2 to allow hardening.
- **Status:** ✅ Committed

### D3: Hero Product
- **Date:** November 13, 2026
- **Decision:** GitHub Wrapped is the hero, Stats Cards is the supporting feature
- **Rationale:** Wrapped has viral potential (seasonal, shareable, built-in year-end deadline). Stats Cards are a great utility but not time-sensitive. Don't invest days polishing cards before Wrapped is solid.
- **Status:** 🟡 Recommended (awaiting confirmation)

### D4: GitHub API Strategy for Wrapped
- **Date:** November 13, 2026
- **Decision:** Use GraphQL API with server-side PAT (not user OAuth)
- **Rationale:** REST Events API only covers ~90 days — insufficient for year-in-review. GraphQL `contributionsCollection` provides full annual data (commits, PRs, issues, calendar). Server-side PAT requires no special OAuth scopes for public profile data. Skip user OAuth to reduce complexity and friction.
- **Status:** 🟡 Recommended (awaiting confirmation)

### D5: Persistence Strategy
- **Date:** November 13, 2026 (audit)
- **Decision:** TBD — options are Vercel KV / Upstash Redis / URL-encoded state
- **Rationale:** Need caching for Wrapped aggregation and potentially share pages. Full database is overkill for launch. URL-encoded state eliminates persistence entirely for MVP share links.
- **Status:** ⏳ Pending decision

### D6: Image Generation Architecture
- **Date:** November 13, 2026 (audit)
- **Decision:** TBD — options are `@vercel/og` (Satori) / keep `html-to-image` client-side only
- **Rationale:** `html-to-image` works for client-side card export but can't generate server-side OG images for social previews. `@vercel/og` is the pragmatic choice if deploying on Vercel.
- **Status:** ⏳ Pending decision

### D7: Hosting Platform
- **Date:** November 13, 2026 (audit)
- **Decision:** TBD — currently on Render free plan (Docker), evaluating Vercel
- **Rationale:** Render free plan has 30+ second cold starts. Vercel's free tier offers better cold-start performance for serverless, native Next.js support, and built-in OG image generation.
- **Status:** ⏳ Pending decision

---

## How to Use This File

When starting a new session on this project, read:
1. `docs/DECISIONS.md` (this file) — for context on what's been decided
2. `docs/PHASE0_AUDIT.md` — for full codebase understanding
3. `docs/PLAN_REVIEW.md` — for critique and recommendations
4. `GitStats_Launch_Execution_Plan.md` — for the full phase-by-phase plan
5. `docs/SESSION_LOG.md` — for what's been implemented so far

---

## Pending Decisions (Action Required)

| # | Decision | Options | Blocking |
|---|---|---|---|
| D3 | Hero product confirmation | Wrapped-first vs. equal weight | Phase 2-3 prioritization |
| D5 | Persistence strategy | Vercel KV / Upstash / URL state | Phase 3-4 (caching, share pages) |
| D6 | OG image generation | `@vercel/og` / client-only | Phase 4 (social sharing) |
| D7 | Hosting platform | Render / Vercel / Cloudflare | Phase 1 (DNS, deployment) |
