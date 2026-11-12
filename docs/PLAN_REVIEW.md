# GitStats Launch Plan — Review & Critique

> **Reviewed:** November 13, 2026
> **Domain chosen:** `mygitstats.dev`
> **Reviewer:** AI audit session (Phase 0)

## Overall Verdict: **Strong plan. Ready to execute with a few adjustments.**

This is a well-structured, pragmatic execution plan. It demonstrates real product thinking — not just a feature list. The phased approach, the "audit before building" philosophy, the LLM execution prompts, the scope-control rules, and the prioritized fallback list (Section 8) are all signs of mature planning. Here's the detailed breakdown.

---

## ✅ What's Good (and should stay exactly as-is)

### 1. Phase 0 Audit First
Starting with an audit before touching code is the single most important decision in this plan. Most solo developers skip this and end up rewriting things that already work. The feature inventory classification (Keep / Fix / Improve / Defer / Remove) is excellent.

### 2. "Definition of Launch-Ready" (Section 2)
> *"A feature is not complete merely because it works on the developer's machine."*

This is gold. The requirement for loading/empty/success/error states, mobile support, and input validation as *completion criteria* (not nice-to-haves) will prevent the classic "it works on my localhost" launch.

### 3. Scope Control Cutoff (Dec 2)
A hard feature freeze 8 days before launch is smart. Many projects fail because they keep adding features until launch day and ship something untested.

### 4. Section 8 — Priority Triage
Having a pre-decided priority order for when time runs out is rare and extremely valuable. You won't waste mental energy deciding what to cut under pressure.

### 5. The LLM Execution Protocol (Section 5)
The "inspect → propose → wait for approval → implement → report" workflow is well-designed for LLM-assisted development. The explicit "do not start the next phase automatically" rule prevents runaway AI changes.

### 6. Product Principles
"Make sharing a core feature, not an afterthought" and "mobile sharing" — these show you understand that the growth loop *is* the product for Wrapped-style experiences.

---

## ⚠️ Concerns & Critiques

### 1. **Timeline is Aggressive — Acknowledge It**

You have **28 days** (Nov 12 → Dec 10) to go from a v0.3.1 stats card app to a polished, two-product platform with sharing, SEO, security hardening, and beta testing. This is doable for a focused solo developer with LLM assistance, but only if you're ruthless about scope.

**The risk:** Phases 3 (Wrapped MVP) and 4 (Sharing) are each allocated just 7 days. The Wrapped MVP alone — with 6 screens, GitHub API aggregation, caching, year selection, mobile slides, and downloadable summaries — is a substantial build.

**Recommendation:** Define a "Wrapped Lite" fallback — a single-page summary card (not 6 slides) that still looks great and is shareable. If the full slide experience isn't ready by Nov 28, ship the card version and iterate post-launch.

### 2. **Two Products = Split Focus**

The plan frames Stats Cards and GitHub Wrapped as "complementary experiences," but they're really two separate products sharing a domain. During the 28-day sprint, you'll be tempted to context-switch between polishing cards (Phase 2) and building Wrapped (Phase 3).

**Recommendation:** Pick one as the **hero product** for launch. GitHub Wrapped has more virality potential (it's seasonal, shareable, and has a built-in deadline with year-end). The Stats Card generator is a great utility but isn't time-sensitive. Consider:
- **Launch hero:** GitHub Wrapped 2026
- **Supporting feature:** Stats Card generator (keep it working, but don't invest days in "polish" before Wrapped is solid)

### 3. **No Database / Persistence Strategy Defined**

The current app appears to be a stateless Next.js app with API routes. The plan mentions caching, share pages with unique IDs, and potentially OAuth tokens — but there's no concrete decision on persistence.

**Questions you need to answer in Phase 0:**
- Where are share pages stored? (Database? Static files? KV store?)
- Where are cached Wrapped summaries stored?
- If you add OAuth, where do tokens live?
- Does Vercel's serverless model work for image generation (which can be CPU/memory intensive)?

**Recommendation:** For a 28-day launch, use **Vercel KV (Redis)** or **Upstash** for caching/share data. Avoid spinning up a full database. If share pages can be implemented as client-side state encoded in the URL (base64 or hash), that eliminates the persistence problem entirely for MVP.

### 4. **GitHub API Limitations Not Fully Confronted**

The plan correctly says "document what's available publicly" but underestimates how limiting the public GitHub API is for a "Wrapped" experience:

- **Public API gives you:** Repos, languages, recent events (last 90 days only via Events API), profile info
- **Public API does NOT give you:** Total commits in a year, contribution calendar data (the green squares), private repo activity, PR/issue counts across all repos
- **GraphQL API** can get contribution calendar data for public profiles, but it requires authentication (a server-side GitHub token, not user OAuth)

**This means your "Activity Overview" and "Highlights" screens may have very limited data without auth.** The plan mentions this risk but doesn't propose a concrete solution.

**Recommendation:**
- Use a **server-side GitHub Personal Access Token** (PAT) for GraphQL queries — this gives you contribution data for any public profile without requiring user OAuth
- Be very transparent: *"Based on your public GitHub activity"*
- For MVP, skip OAuth entirely. Server-side PAT + public data is enough for a good experience
- Consider scraping the contribution calendar from the public profile page as a fallback (GitHub renders it as SVG)

### 5. **Image Generation Architecture Needs Early Decision**

The current app uses `html-to-image` (client-side). This works for simple cards but has known issues:
- Font rendering inconsistencies across browsers
- Poor quality on some mobile browsers
- Can't generate OG images server-side (needed for social previews)

**For Wrapped, you'll likely need server-side image generation** (for share page OG images at minimum).

**Recommendation:** Decide early between:
- **Satori + @vercel/og** — Vercel's built-in OG image generation (works great on Vercel, limited CSS support)
- **Puppeteer/Playwright** — Full browser rendering server-side (heavy, but accurate; won't work on Vercel serverless)
- **Client-side only** — Simpler, but no server-rendered social previews

For a Vercel deployment, `@vercel/og` with Satori is the pragmatic choice. Plan for this in Phase 0.

### 6. **SEO Phase is Over-Scoped for Launch**

Phase 5 lists 5+ landing pages, structured data, XML sitemap, Search Console, and a content strategy. For a 28-day launch of a tool that lives or dies by social sharing (not SEO), this is too much.

**Recommendation:** Reduce to:
- Homepage with good metadata ✅
- `/wrapped` with good metadata ✅
- Basic `robots.txt` and sitemap ✅
- OG images (already covered in Phase 4) ✅
- Skip: Structured data, multiple SEO landing pages, content strategy articles — do these in Phase 8

### 7. **No Cost Estimation**

The plan mentions monitoring API costs but doesn't estimate them. For a viral product:
- **Vercel**: Free tier covers ~100K serverless invocations/month. Image generation can eat this fast.
- **GitHub API**: 5,000 req/hour with PAT, 60/hour unauthenticated. A viral launch day could exhaust this in minutes.
- **Domain**: $5–12/year depending on TLD
- **Total launch cost** should be estimated: hosting, domain, monitoring tools, potential API costs

**Recommendation:** Add rate limiting early (Phase 1, not Phase 6). Use aggressive caching — cache a user's Wrapped for 24 hours. Add a queue or "generating..." page that prevents duplicate requests.

### 8. **Beta Testing Plan is Vague**

Phase 6 says "invite a small group of developers" but doesn't specify how many, who, or through what channel.

**Recommendation:**
- 5–10 developer friends, targeted. Don't do a public beta — it'll burn your "launch moment"
- Give them a Google Form for structured feedback
- Test with at least 2 people who've never seen the product before (fresh-eyes test)

---

## 🎯 Summary of Recommendations

| # | Recommendation | Priority |
|---|---|---|
| 1 | Define a "Wrapped Lite" single-card fallback in case the 6-slide version isn't ready | High |
| 2 | Make Wrapped the hero, Stats Cards the supporting feature | High |
| 3 | Decide on persistence early (Vercel KV / URL-encoded state) | High |
| 4 | Use a server-side PAT for GitHub GraphQL API (skip user OAuth for MVP) | High |
| 5 | Decide on image generation architecture (recommend `@vercel/og` for Vercel) | High |
| 6 | Trim SEO scope — homepage + wrapped page + basics only | Medium |
| 7 | Add rate limiting and aggressive caching in Phase 1, not Phase 6 | Medium |
| 8 | Estimate hosting/API costs before launch | Medium |
| 9 | Concrete beta plan: 5–10 people, Google Form, fresh-eyes testers | Medium |
| 10 | Buy domain this week — DNS propagation + SSL setup take time | ✅ Done (`mygitstats.dev`) |

---

## Final Thought

This plan is in the **top 10%** of project plans I've seen for solo/small-team launches. The biggest risk isn't the plan — it's execution discipline. The plan is comprehensive enough that you might feel like you need to execute *all of it perfectly*. You don't.

The closing line of your plan is exactly right:

> *"GitStats does not need to become a massive platform by December 10. It needs to become a product that a developer can discover, understand, use successfully, and proudly share."*

Hold onto that. Ship the Wrapped card, make it beautiful, make it shareable. Everything else is iteration.
