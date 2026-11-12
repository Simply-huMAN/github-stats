# GitStats — Launch Execution Plan

> **Target:** Public, traffic-ready launch by **December 10, 2026** (second week of December)  
> **Current application:** https://github-stats-s3gs.onrender.com  
> **Product:** GitHub Stats Cards + GitHub Wrapped  
> **Execution style:** Phase-by-phase, LLM-assisted implementation  
> **Plan created:** November 12, 2026

---

## 1. Product direction

GitStats should become a polished developer-facing platform with two complementary experiences:

1. **Stats Card Generator** — a fast utility for generating attractive, customizable GitHub profile/stat cards.
2. **GitHub Wrapped** — the flagship year-in-review experience that turns a developer's GitHub activity into a visually engaging, shareable story.

The product should have a clear value proposition:

> Turn your GitHub activity into beautiful developer stats, profile cards, and a year-in-review worth sharing.

### Product principles

- Make the first successful generation fast and obvious.
- Treat sharing as a core product feature, not an afterthought.
- Keep the initial Wrapped experience free to encourage adoption.
- Clearly distinguish public GitHub data from data requiring authorization.
- Build for mobile sharing as well as desktop use.
- Prioritize reliability, performance, accessibility, and trust over adding many features.
- Preserve existing useful functionality instead of rebuilding it without evidence.

### Existing functionality to audit and preserve

The current product has included:

- GitHub username lookup.
- Developer statistics and performance tiers.
- City themes, frames, and badges.
- High-resolution PNG export.
- Shareable stats cards.

During Phase 0, verify which of these are currently implemented, stable, and used. Do not assume every feature is production-ready.

---

## 2. Launch goals and success criteria

### Launch outcomes

By December 10:

- A memorable custom domain is live.
- The application runs on reliable production hosting.
- Existing Stats Card functionality works end-to-end.
- A useful, polished GitHub Wrapped MVP is publicly accessible.
- Users can generate, view, download, and share their results.
- Important landing pages are indexable and have appropriate metadata.
- Mobile layouts work well.
- Analytics, error monitoring, rate limits, and basic operational safeguards are in place.
- A real-user beta has been completed and critical issues have been fixed.

### Suggested launch metrics

Instrument these before launch so the product can be improved using evidence.

| Metric | What it tells us |
|---|---|
| Landing page visitors | Acquisition |
| GitHub username submissions | Intent |
| Successful generations | Core product activation |
| Generation success rate | Reliability |
| Time to first result | User experience |
| Wrapped share clicks | Virality |
| Card downloads | Utility |
| Referral visits | Organic distribution |
| Return visitors | Retention |
| API requests and cost per generation | Operating cost |

Do not invent targets before measuring a baseline. Set realistic initial targets after beta testing.

### Definition of launch-ready

A feature is not complete merely because it works on the developer's machine. It must have:

- A clear user flow.
- Loading, empty, success, and error states.
- Input validation.
- Mobile-friendly presentation.
- Tests for important logic.
- Appropriate API failure handling.
- No known critical or high-severity defects.
- Basic instrumentation where relevant.

---

## 3. Timeline overview

| Phase | Dates | Main outcome | Priority |
|---|---|---|---|
| 0. Audit and scope lock | Nov 12 | Verified baseline, architecture, backlog | P0 |
| 1. Domain and infrastructure | Nov 12–18 | Production domain and reliable deployment | P0 |
| 2. Stats Card Studio polish | Nov 12–18 | Stable, polished existing generator | P0 |
| 3. GitHub Wrapped MVP | Nov 19–25 | Complete year-in-review experience | P0 |
| 4. Sharing and growth loop | Nov 26–Dec 2 | Shareable pages, images, referral loop | P0 |
| 5. SEO and discoverability | Nov 19–Dec 2 | Search-ready landing pages and indexing setup | P0 |
| 6. Performance, security, and beta | Dec 3–7 | Tested, observable, production-ready app | P0 |
| 7. Launch and distribution | Dec 8–10 | Public launch and active distribution | P0 |
| 8. Post-launch iteration | Dec 11 onward | Improve conversion, retention, and reach | P1 |

**Schedule rule:** Phases can overlap when independent, but dependencies must be respected. Infrastructure and existing product stability come before aggressive acquisition.

**Scope rule:** No major new feature should enter the launch scope after December 2 unless it fixes a critical defect or removes a launch blocker.

---

# Phase 0 — Repository audit and scope lock

**Dates:** November 12  
**Priority:** P0  
**Outcome:** Know exactly what exists, what is broken, and what must be built.

## Tasks

### 0.1 Understand the current application

Ask the LLM to inspect the complete repository and document:

- Frontend framework, version, build tooling, and routing.
- Backend framework, runtime, and API structure.
- Database and persistence requirements, if any.
- GitHub API integration and authentication approach.
- Existing routes and pages.
- Existing card-generation and export implementation.
- Deployment configuration and environment variables.
- External dependencies and third-party services.
- Current tests and their coverage.
- Known errors, TODOs, and technical debt.

### 0.2 Map existing user journeys

Document the current flows:

1. Landing page → enter GitHub username.
2. Username submission → fetch GitHub information.
3. Statistics display → customize card.
4. Card generation → PNG download.
5. Share or embed, if supported.

Identify friction, confusing interactions, and missing states.

### 0.3 Create a feature inventory

Classify every existing feature:

- Keep — working and valuable.
- Fix — valuable but broken or incomplete.
- Improve — working but needs polish.
- Defer — not required for December launch.
- Remove — unnecessary or harmful to the core experience.

### 0.4 Create the technical delivery plan

Produce:

- Architecture diagram.
- Route and API inventory.
- Frontend component inventory.
- Environment variable inventory (names only; never expose secrets).
- Deployment map.
- Risk register.
- Prioritized issue backlog.
- Proposed implementation sequence.

## Acceptance criteria

- [ ] Existing functionality is documented.
- [ ] Current architecture is understood.
- [ ] Critical dependencies and risks are identified.
- [ ] Launch scope is agreed upon.
- [ ] No implementation begins before the audit findings and plan are reviewed.

## LLM execution prompt

```text
You are acting as a senior full-stack engineer joining the GitStats project.

The target is a public launch by December 10, 2026.

Current deployment:
https://github-stats-s3gs.onrender.com

This phase is AUDIT ONLY. Do not modify files or implement features.

Inspect the repository thoroughly. Identify the frontend, backend, APIs,
data model, GitHub integration, routes, card-generation flow, deployment,
environment variables, tests, and existing user experience.

Produce:
1. Current architecture and a Mermaid architecture diagram.
2. Existing feature inventory classified as Keep, Fix, Improve, Defer, Remove.
3. Current user journeys and UX gaps.
4. API and route inventory.
5. Deployment and infrastructure assessment.
6. Security, reliability, performance, and SEO risks.
7. A prioritized P0/P1/P2 backlog.
8. A realistic implementation plan aligned with the December 10 launch.

Do not guess when repository evidence is available. Reference actual file
paths and relevant code. Do not reveal secret values.

End with the top launch blockers and the smallest viable launch scope.
Wait for approval before making changes.
```

---

# Phase 1 — Domain, hosting, and production foundation

**Dates:** November 12–18  
**Priority:** P0  
**Outcome:** A stable production foundation.

## 1.1 Choose and configure a domain

A custom domain is strongly recommended before the SEO and distribution push.

Possible naming directions to investigate:

- `devwrapped.com`
- `gitwrapped.dev`
- `githubwrapped.io`

These are ideas, not verified availability or trademark clearance. Check domain availability, renewal pricing, trademark conflicts, and social handle availability before purchasing.

Selection criteria:

- Easy to remember and spell.
- Clearly connected to developers or GitHub Wrapped.
- Suitable for the broader Stats Card product too.
- Short enough to share in social posts.
- Does not imply an official GitHub affiliation.

Do not use GitHub branding in a way that suggests official endorsement.

## 1.2 Hosting strategy

Recommended starting architecture:

| Layer | Direction |
|---|---|
| Frontend | Vercel or Cloudflare Pages |
| Backend | Reliable managed application hosting appropriate to the existing backend |
| Database | Retain the existing database if suitable; avoid unnecessary migration |
| DNS | Domain registrar DNS or Cloudflare |
| Static assets | CDN-backed delivery |
| Monitoring | Error tracking and uptime monitoring |

The current Render deployment can remain during migration and testing. Do not switch hosting simply for the sake of switching. Compare actual cold-start behavior, uptime, resource limits, pricing, build support, and backend compatibility.

## 1.3 Production configuration

- Separate development and production environment configuration.
- Keep secrets out of source control and frontend bundles.
- Configure production CORS allowlists.
- Configure HTTPS.
- Configure health/readiness checks where applicable.
- Configure logs and error reporting.
- Set sensible API timeouts.
- Ensure deployment failures can be detected and rolled back.
- Document how to deploy and roll back.

## 1.4 Domain migration

- Point the custom domain to production.
- Configure HTTPS and canonical host.
- Redirect old URLs to equivalent new URLs where possible.
- Preserve query parameters during redirects.
- Add canonical URLs to important pages.
- Update sitemap, robots rules, OAuth callback URLs, and external configuration.
- Keep redirects in place rather than abandoning the old domain.

## Acceptance criteria

- [ ] Custom domain resolves correctly.
- [ ] HTTPS works without certificate warnings.
- [ ] Production frontend and backend communicate successfully.
- [ ] Environment variables are configured securely.
- [ ] Health checks and logs are usable.
- [ ] Old URLs redirect appropriately.
- [ ] Existing user journeys work on the production domain.
- [ ] Rollback procedure is documented.

## LLM execution prompt

```text
Implement Phase 1 of the GitStats launch plan.

First inspect the current deployment and repository configuration.
Do not migrate frameworks or rewrite the backend.

Propose the minimum safe infrastructure changes needed to support a
December 10 public launch.

Evaluate the current Render deployment and the proposed frontend/backend
hosting arrangement. Explain trade-offs before making changes.

Implement only approved changes:
- Production environment configuration.
- Domain and HTTPS configuration guidance.
- CORS and API configuration.
- Health checks and deployment reliability improvements.
- Redirect and canonical URL configuration where applicable.
- Deployment and rollback documentation.

Never hardcode secrets. Never expose server-side credentials to the
frontend. Do not break the existing deployment.

Test the production flow and provide a change log, validation results,
remaining manual steps, and rollback instructions.
```

---

# Phase 2 — Stats Card Studio polish

**Dates:** November 12–18  
**Priority:** P0  
**Outcome:** The existing generator becomes a reliable, attractive utility.

This phase should improve the existing product rather than replace it.

## 2.1 Core user journey

The user should be able to:

1. Enter a GitHub username.
2. See validation and loading feedback.
3. View their fetched statistics.
4. Select a card design or theme.
5. Preview the card.
6. Download a high-quality image.
7. Share the result.
8. Copy an embed/README snippet if supported.

## 2.2 UX and visual polish

Audit and improve:

- Landing page clarity.
- Username input and validation.
- Loading skeletons.
- Empty and error states.
- Card previews.
- Theme selection.
- Frames and badges.
- Responsive layouts.
- Mobile controls.
- Download feedback.
- Accessibility and keyboard navigation.

Keep the UI consistent across the Stats Card and Wrapped experiences.

## 2.3 Export quality

Prioritize:

- High-resolution PNG.
- SVG export only if the existing rendering architecture can support it reliably.
- Correct dimensions and text rendering.
- No clipped content.
- Consistent font loading.
- Background and transparency behavior.
- Export testing across browsers.

## 2.4 README integration

Where technically feasible, offer:

- Copyable Markdown image snippet.
- Copyable HTML snippet.
- A stable card URL suitable for embedding.
- Clear instructions for adding the card to a GitHub README.

Ensure embed URLs do not expose private information or sensitive tokens.

## Acceptance criteria

- [ ] Username lookup works for valid and invalid usernames.
- [ ] API failures show useful messages.
- [ ] Existing themes and card functionality are preserved.
- [ ] Preview matches downloaded output.
- [ ] PNG export works on desktop and mobile.
- [ ] README snippet can be copied successfully, if included.
- [ ] Important flows have automated or documented manual tests.

## LLM execution prompt

```text
Implement Phase 2: Stats Card Studio polish.

Start by examining the existing card-generation implementation and its
dependencies. Preserve existing working features and visual identity.

Improve the complete journey from username input to preview, customization,
download, and sharing.

Prioritize:
1. Input validation and error handling.
2. Loading, empty, and success states.
3. Responsive card previews.
4. Theme, frame, and badge selection.
5. High-resolution PNG export.
6. Export consistency with the preview.
7. README/Markdown embed snippet if supported by the architecture.
8. Accessibility and mobile usability.

Do not add unrelated features or rewrite working modules without a reason.

Before coding, provide an implementation plan with files to change.
After implementation, test valid users, invalid users, API failures,
slow responses, export quality, and mobile layouts.

Report completed work, tests, known issues, and remaining tasks.
```

---

# Phase 3 — GitHub Wrapped MVP

**Dates:** November 19–25  
**Priority:** P0 — flagship feature  
**Outcome:** A complete, shareable developer year-in-review.

Do not attempt to build every possible Wrapped feature. Deliver a coherent MVP with a strong visual story.

## 3.1 Wrapped user journey

1. User opens the GitHub Wrapped landing page.
2. User selects the year.
3. User enters a GitHub username.
4. Application fetches and aggregates available activity.
5. User sees a loading/progress state.
6. User views a sequence of Wrapped slides.
7. User can download and share the result.
8. A public share page can be opened by others.

## 3.2 Recommended MVP screens

| Screen | Content |
|---|---|
| 1. Introduction | Developer identity, username, selected year |
| 2. Activity overview | Contributions/activity available from supported data |
| 3. Coding profile | Languages and repository breakdown |
| 4. Highlights | Top repositories and notable activity |
| 5. Developer personality | A fun, clearly labelled interpretation based on available data |
| 6. Final summary | Shareable summary card and CTA |

The exact metrics must be based on data the application can reliably retrieve. Do not fabricate contribution totals or claim complete coverage when the API does not provide it.

## 3.3 Data and GitHub API strategy

Investigate GitHub REST API and GraphQL API capabilities before deciding the implementation.

Explicitly document:

- Which fields are available publicly.
- Which fields require OAuth authorization.
- API rate limits and failure behavior.
- Historical data limitations.
- Data freshness and caching rules.
- How missing or partial data is represented.

Important distinction:

**Public-only mode**
- Fetch only data available without authorization.
- Label limitations clearly.
- Never imply that private contributions are included.

**Authorized mode**
- Request the minimum necessary OAuth permissions.
- Explain why authorization is needed.
- Never store access tokens insecurely.
- Do not make OAuth mandatory if a useful public-only experience is possible.

## 3.4 Data aggregation and caching

- Cache year-specific summaries.
- Avoid refetching identical data unnecessarily.
- Use sensible cache expiry.
- Handle rate limits and transient API failures.
- Keep aggregation logic separate from UI rendering.
- Record the data source and coverage for each metric.
- Ensure a partially available metric does not break the entire Wrapped.

## 3.5 Visual experience

- Strong typography and visual hierarchy.
- Consistent theme and colors.
- Smooth but restrained transitions.
- Progress indicator and navigation.
- Mobile-first slide dimensions.
- Downloadable summary.
- Social-friendly final card.

Avoid excessive animation that harms performance or accessibility.

## Acceptance criteria

- [ ] Year selection works.
- [ ] Valid GitHub usernames produce a Wrapped experience.
- [ ] Invalid and unavailable users are handled gracefully.
- [ ] Data limitations are explained.
- [ ] No fabricated metrics.
- [ ] All six screens work on desktop and mobile.
- [ ] Navigation and progress indicators work.
- [ ] Summary can be downloaded.
- [ ] API errors and rate limits do not crash the experience.
- [ ] Cached summaries are consistent with their year and user.

## LLM execution prompt

```text
Implement Phase 3: GitHub Wrapped MVP.

This is the flagship GitStats launch feature. Build a coherent and polished
year-in-review experience, not a large collection of disconnected widgets.

Before implementation:
1. Inspect the current GitHub API integration.
2. Identify reliable public and authorized data fields.
3. Document historical-data limitations and API rate limits.
4. Propose the data model and aggregation strategy.
5. Propose the six-screen user journey and component structure.
6. Identify any OAuth changes required and explain the permissions.

MVP screens:
1. Introduction.
2. Activity overview.
3. Coding profile and languages.
4. Repository highlights.
5. Data-driven developer personality.
6. Final shareable summary.

Requirements:
- Year selector.
- Username lookup.
- Loading, error, empty, and partial-data states.
- Mobile-first responsive slides.
- Accurate metrics only.
- Explicit public-only versus authorized data coverage.
- Year-specific caching.
- Downloadable final summary.
- Reusable components and testable aggregation logic.

Do not fabricate missing GitHub data. Do not request excessive OAuth
permissions. Do not expose access tokens.

First provide the technical design and wait for approval.
After approval, implement incrementally and test each screen and API flow.

At completion, provide a metric-by-metric data provenance table and
document known limitations.
```

---

# Phase 4 — Sharing and organic growth loop

**Dates:** November 26–December 2  
**Priority:** P0  
**Outcome:** Every successful generation creates an opportunity for discovery.

## 4.1 Public share pages

Create stable, shareable URLs for generated Wrapped summaries.

Consider:

- Unique share identifiers.
- Server-side or statically generated metadata where appropriate.
- Public/private visibility controls.
- Expiration or deletion controls if appropriate.
- No exposure of private GitHub information.
- Protection against enumeration and abuse.

Do not put OAuth tokens or sensitive data in URLs.

## 4.2 Social sharing

Support:

- Copy link.
- Download image.
- Share to LinkedIn.
- Share to X.
- Native mobile share where supported.

Sharing should include a concise product attribution without making the result look like an advertisement.

## 4.3 Open Graph metadata

Each public share page should have suitable:

- `og:title`
- `og:description`
- `og:image`
- `og:url`
- Twitter/X card metadata

Verify how the metadata appears when links are pasted into common social platforms. Client-only metadata may not be sufficient for all crawlers.

## 4.4 Referral loop

A shared Wrapped should lead viewers back to GitStats with an obvious CTA:

> Create your GitHub Wrapped.

Track referral visits and successful generations from shared pages.

## 4.5 Viral asset formats

Prioritize the formats that can be implemented reliably:

- Final Wrapped summary image.
- Individual slide image downloads if feasible.
- Stats card image.
- A compact social preview.

Avoid building a complex video exporter before launch.

## Acceptance criteria

- [ ] Share URLs open correctly.
- [ ] Public share pages render without login where intended.
- [ ] Social preview metadata is correct.
- [ ] Downloaded images are legible and correctly sized.
- [ ] Sharing works on mobile and desktop.
- [ ] Private information is not exposed.
- [ ] Referral visits and share actions are measurable.

## LLM execution prompt

```text
Implement Phase 4: Sharing and organic growth.

Inspect the Wrapped and Stats Card implementations before designing
the sharing system.

Implement:
1. Stable public share URLs.
2. Share-page rendering.
3. Open Graph and Twitter/X metadata.
4. Downloadable social images.
5. Copy-link functionality.
6. LinkedIn and X sharing links.
7. Native share support where available.
8. A clear CTA for visitors to generate their own Wrapped.
9. Analytics events for shares, referrals, and downloads.

Security requirements:
- Never expose OAuth tokens or private repository data.
- Prevent predictable share-ID enumeration where applicable.
- Validate all share identifiers.
- Do not assume client-rendered metadata will be read by every crawler.
- Document deletion, expiry, and visibility behavior.

Test previews using actual social-sharing/debugging tools where possible.
Provide evidence of successful preview rendering and a list of limitations.
```

---

# Phase 5 — SEO and discoverability

**Dates:** November 19–December 2  
**Priority:** P0  
**Outcome:** Search engines can understand, discover, and index the product.

The goal is not to publish hundreds of thin pages. Build a small number of useful pages that satisfy clear search intent.

## 5.1 Target landing pages

Recommended initial pages:

| Route | Search intent |
|---|---|
| `/` | GitHub stats and developer tools |
| `/github-wrapped` | GitHub Wrapped |
| `/github-wrapped-2026` | GitHub Wrapped 2026 |
| `/github-readme-card` | GitHub README stats card |
| `/github-stats-card` | GitHub stats card generator |

Adjust routes to match the existing architecture and avoid duplicate pages targeting the same intent.

## 5.2 On-page SEO

For every important page:

- Unique title tag.
- Useful meta description.
- One clear H1.
- Logical H2/H3 structure.
- Descriptive internal links.
- Canonical URL.
- Open Graph metadata.
- Helpful explanatory content.
- Clear CTA.

The content should explain what the tool does, how it works, what data it uses, and its limitations.

## 5.3 Technical SEO

- Generate XML sitemap.
- Configure robots.txt.
- Ensure important pages return correct HTTP status codes.
- Avoid indexing empty or useless generated pages.
- Use canonical URLs.
- Avoid duplicate title and description tags.
- Ensure mobile usability.
- Avoid blocking important assets from crawlers.
- Validate structured data only where it accurately describes the page.

## 5.4 Google Search Console

- Verify the custom domain property.
- Submit the sitemap.
- Inspect key landing pages.
- Monitor indexing and crawl errors.
- Track impressions, clicks, CTR, and queries.
- Fix technical issues surfaced by Search Console.

## 5.5 Content strategy

Publish useful content that directly supports the product:

- What is GitHub Wrapped?
- How to generate a GitHub Wrapped.
- How to add GitHub stats to a README.
- Understanding GitHub contribution and language statistics.
- A launch announcement with screenshots and examples.

Do not mass-produce low-value AI pages. Content must be accurate, original, and useful.

## Acceptance criteria

- [ ] Landing pages have unique metadata.
- [ ] Canonicals point to the correct domain.
- [ ] Sitemap is valid and submitted.
- [ ] Robots rules are correct.
- [ ] Important pages are crawlable.
- [ ] No accidental indexing of private or empty pages.
- [ ] Search Console is configured.
- [ ] Mobile performance and usability are checked.

## LLM execution prompt

```text
Implement Phase 5: SEO and discoverability.

Audit the existing routes, rendering architecture, metadata, and crawlability.

Prioritize these pages:
- /
- /github-wrapped
- /github-wrapped-2026
- /github-readme-card
- /github-stats-card

Adapt the routes to the existing architecture where needed.

Implement:
1. Unique title and description metadata.
2. Correct canonical URLs.
3. Open Graph and social metadata.
4. Useful H1/H2/H3 page structure.
5. Internal links and clear CTAs.
6. XML sitemap.
7. robots.txt.
8. Correct index/noindex behavior.
9. Appropriate structured data only where justified.
10. Search Console setup instructions.

Write useful, product-specific content. Do not generate thin or repetitive
SEO pages. Do not claim rankings or traffic improvements without evidence.

Check rendered HTML and crawler visibility. Provide a route-by-route SEO
audit with pass/fail status and remaining manual tasks.
```

---

# Phase 6 — Performance, security, and beta testing

**Dates:** December 3–7  
**Priority:** P0  
**Outcome:** A stable application ready for public traffic.

## 6.1 Performance

Measure before optimizing.

Check:

- Largest Contentful Paint (LCP).
- Interaction to Next Paint (INP).
- Cumulative Layout Shift (CLS).
- Initial JavaScript bundle size.
- API response time.
- Image generation time.
- Time to first Wrapped result.
- Mobile network performance.

Potential improvements:

- Lazy-load noncritical components.
- Optimize images and fonts.
- Avoid unnecessary API calls.
- Cache aggregated GitHub data.
- Reduce expensive rendering operations.
- Avoid blocking the initial page render.

Use real measurements rather than arbitrary optimization.

## 6.2 Reliability and API protection

- Configure request timeouts.
- Handle GitHub rate limits.
- Add bounded retries where safe.
- Add rate limiting to public endpoints.
- Validate request inputs.
- Prevent duplicate expensive generation requests.
- Set reasonable payload and file-size limits.
- Avoid unbounded caching or memory growth.
- Provide graceful fallback states.

## 6.3 Security review

Review:

- OAuth flow and redirect validation.
- Token storage and access.
- CORS.
- XSS risks in user-generated content.
- Injection risks.
- Share-page access controls.
- Secrets and environment variables.
- Dependency vulnerabilities.
- Logging of personal or sensitive data.
- Abuse of public generation endpoints.

## 6.4 Beta testing

Invite a small group of developers to test:

- First-time visitor experience.
- Username lookup.
- Stats card customization.
- Wrapped generation.
- Data accuracy.
- Downloads.
- Social previews.
- Mobile usability.
- Error handling.

Collect feedback in a structured issue tracker.

## Acceptance criteria

- [ ] No unresolved critical/high-severity launch blocker.
- [ ] Main user flows pass regression tests.
- [ ] Mobile and desktop checks pass.
- [ ] API rate limits and errors are handled.
- [ ] Monitoring and error reporting work.
- [ ] Security review is completed.
- [ ] Beta feedback is triaged.
- [ ] Rollback procedure is tested or validated.

## LLM execution prompt

```text
Implement Phase 6: production hardening and beta readiness.

Do not add new product features in this phase unless they fix a launch blocker.

Audit and test:
- Frontend performance.
- Backend latency and API reliability.
- GitHub API rate-limit behavior.
- Caching.
- Request validation.
- Rate limiting.
- OAuth and token handling.
- CORS and redirect validation.
- XSS and injection risks.
- Dependency vulnerabilities.
- Logging and error monitoring.
- Mobile and desktop responsiveness.

Run regression tests for:
1. Landing page.
2. Username lookup.
3. Stats card generation and download.
4. Wrapped generation.
5. Public share pages.
6. Social metadata.
7. API failures and rate limits.

Provide measured performance results, security findings, severity levels,
and recommended fixes.

Do not declare launch readiness while critical or high-severity issues
remain unresolved.
```

---

# Phase 7 — Launch execution

**Dates:** December 8–10  
**Priority:** P0  
**Outcome:** Public launch.

## December 8 — Release candidate

- Freeze feature development.
- Deploy release candidate.
- Run smoke tests on production.
- Validate DNS, HTTPS, redirects, and canonical URLs.
- Test generation and downloads.
- Test share pages and social metadata.
- Verify analytics events.
- Verify error monitoring.
- Check mobile layouts.
- Confirm support/contact path.

## December 9 — Final validation

- Fix launch-blocking bugs only.
- Re-run regression tests.
- Check Search Console and sitemap availability.
- Prepare launch screenshots and demo GIF/video.
- Prepare launch posts.
- Confirm rollback process.
- Confirm no secrets or debug configuration are exposed.

## December 10 — Public launch

- Publish the launch announcement.
- Share a working demo.
- Explain the product in one sentence.
- Show actual example outputs.
- Invite developers to generate and share their Wrapped.
- Monitor errors, generation success, and feedback.
- Respond to genuine user feedback.
- Record issues rather than making risky production changes.

## Launch checklist

- [ ] Custom domain works.
- [ ] HTTPS works.
- [ ] Landing page works.
- [ ] Stats Card Generator works.
- [ ] GitHub Wrapped works.
- [ ] Downloads work.
- [ ] Share links work.
- [ ] Social previews work.
- [ ] Mobile experience works.
- [ ] SEO metadata and sitemap are correct.
- [ ] Analytics events are visible.
- [ ] Error monitoring is active.
- [ ] Rate limits are configured.
- [ ] Privacy and data usage explanations are available.
- [ ] Contact/feedback path is available.
- [ ] Rollback procedure is documented.

## LLM execution prompt

```text
Prepare GitStats for the December 10, 2026 public launch.

This is a release phase, not a feature-development phase.

Run the production launch checklist:
- Domain, DNS, HTTPS, redirects.
- Landing page and all critical routes.
- Stats Card generation and download.
- GitHub Wrapped generation.
- Public share pages and social previews.
- Mobile and desktop flows.
- SEO metadata, robots.txt, sitemap.
- Analytics and error monitoring.
- Rate limiting and API error handling.
- Privacy and data disclosure.
- Production logs and deployment health.

Classify all findings as:
- Blocker: launch cannot proceed.
- Critical: must fix before launch.
- Noncritical: can be scheduled after launch.

Do not introduce new features. Do not make risky infrastructure changes
without explaining the impact and rollback path.

Produce a release report with evidence for every checklist item.
Recommend GO or NO-GO based on actual results.
```

---

# Phase 8 — Post-launch growth and iteration

**Start:** December 11 onward  
**Priority:** P1  
**Outcome:** Turn launch traffic into a sustainable product.

## 8.1 First 72 hours

Monitor:

- Uptime and error rate.
- Generation success rate.
- API rate-limit failures.
- Time to generate.
- Share activity.
- User feedback.
- Unexpected hosting/API costs.

Fix reliability issues before adding features.

## 8.2 First 30 days

Use analytics to identify:

- Where users abandon the flow.
- Which landing pages bring visitors.
- Which cards and Wrapped slides are shared.
- Which devices have poor conversion.
- Which GitHub API calls are expensive.
- Whether users return.

Prioritize improvements based on observed behavior.

## 8.3 Potential next features

Only consider these after validating demand:

- More card themes and layouts.
- More social image formats.
- Additional Wrapped years.
- Better repository insights.
- More detailed language and activity breakdowns.
- Optional authorized data for additional metrics.
- Customization and branding.
- User accounts or saved histories if there is a clear need.

## 8.4 Monetization

Keep the basic Wrapped experience free initially.

Do not introduce a paywall before understanding usage and willingness to pay. Potential future experiments include premium themes, advanced exports, or creator-oriented customization, but validate demand first.

---

# 4. Distribution plan

SEO takes time. Do not depend on Google rankings alone for a December launch. Use developer communities and shareable outputs to generate early discovery.

## Channels

| Channel | Content | Timing |
|---|---|---|
| X | Short demo, screenshots, build-in-public updates | During beta and launch |
| LinkedIn | Product story, launch post, example Wrapped | Launch week |
| Reddit | Relevant developer communities, genuine feedback requests | After checking community rules |
| Hacker News | Show HN with a working demo and honest technical story | Launch |
| Dev.to / Hashnode | Build story and GitHub Wrapped guide | Launch week |
| GitHub | Public repository/docs if appropriate, examples, README | Before launch |
| Developer communities | Ask for beta feedback and share useful examples | Beta period |

### Distribution rules

- Do not spam communities.
- Follow each community's self-promotion rules.
- Lead with the useful output, not generic marketing.
- Share real examples with permission.
- Make the product easy to try without unnecessary signup.
- Respond to comments and bug reports.
- Reuse user feedback to improve onboarding and product clarity.

## Launch messaging

Core message:

> Your GitHub year, wrapped. Turn your coding activity into a shareable developer story with GitStats.

Supporting messages:

- Generate beautiful GitHub stats cards.
- Create a year-in-review from available GitHub activity.
- Download and share your developer story.
- Add stats cards to your GitHub README.

Avoid implying that GitStats is officially affiliated with GitHub.

---

# 5. Project execution protocol for LLMs

Use this protocol for every phase. It is intended to prevent uncontrolled rewrites and superficial implementations.

## Before implementation

The LLM must:

1. Read the relevant phase in this document.
2. Inspect the existing codebase and current architecture.
3. Identify reusable components and services.
4. List files it expects to modify or create.
5. Explain the implementation approach.
6. Identify risks, dependencies, and migration requirements.
7. Define test cases and acceptance criteria.
8. Wait for approval before substantial changes.

## During implementation

The LLM must:

- Work in small, reviewable increments.
- Preserve existing working behavior.
- Follow existing project conventions unless there is a clear reason not to.
- Avoid unnecessary dependencies.
- Avoid unrelated refactoring.
- Never hardcode secrets.
- Never fabricate GitHub metrics.
- Add tests for important logic.
- Keep documentation and configuration updated.
- Report blockers rather than silently working around them.

## After implementation

The LLM must provide:

1. Summary of completed work.
2. Files created, changed, or deleted.
3. Important implementation decisions.
4. Tests executed and their results.
5. Manual validation steps.
6. Known issues and limitations.
7. Security/performance implications.
8. Deployment or migration steps.
9. Acceptance criteria checklist.
10. Recommendation: complete, partially complete, or blocked.

**Do not start the next phase automatically.** Review the report, validate the work, and explicitly instruct the LLM to proceed.

---

# 6. Global project instructions

Use this as the persistent instruction when working with an LLM on GitStats.

```text
You are the senior engineer and technical product partner for GitStats.

PRODUCT
GitStats provides:
1. GitHub Stats Card Generator.
2. GitHub Wrapped — a developer year-in-review experience.

LAUNCH DEADLINE
December 10, 2026.

PRIMARY OBJECTIVE
Deliver a polished, reliable, mobile-friendly product that real developers
can use and share. Prioritize a successful launch over feature count.

ENGINEERING RULES
- Inspect before modifying.
- Reuse existing working functionality.
- Do not rewrite the application without strong technical justification.
- Keep changes small and reviewable.
- Follow the existing architecture and coding conventions.
- Keep secrets on the server.
- Validate all external input.
- Handle GitHub API limits and failures.
- Cache expensive aggregation safely.
- Do not fabricate or overstate metrics.
- Clearly distinguish public-only and authorized GitHub data.
- Add tests for important business logic and user flows.
- Preserve SEO, accessibility, and mobile usability.
- Document configuration and deployment changes.

PRODUCT RULES
- Optimize for time to first successful generation.
- Keep the basic Wrapped experience free initially.
- Make sharing and referrals easy.
- Avoid unnecessary signup friction.
- Do not add features that jeopardize the launch deadline.
- Prefer a complete, polished MVP over a broad incomplete product.

WORKFLOW
For each phase:
1. Read the phase requirements.
2. Audit relevant code.
3. Propose implementation.
4. Wait for approval.
5. Implement incrementally.
6. Run tests.
7. Report evidence and remaining issues.
8. Wait for explicit approval to continue.

SCOPE CONTROL
After December 2, do not add major features unless required to fix a
critical defect or launch blocker.

Be honest about what is implemented, tested, and deployed.
Never claim success without evidence.
```

---

# 7. Master launch tracker

Update this tracker after each phase. Use the repository's issue tracker or project board as the operational source of truth.

| Phase | Status | Completion evidence | Owner | Notes |
|---|---|---|---|---|
| 0. Audit and scope lock | Not started | Architecture and backlog reviewed | | |
| 1. Domain and infrastructure | Not started | Production deployment validated | | |
| 2. Stats Card Studio | Not started | Card journey and exports tested | | |
| 3. GitHub Wrapped MVP | Not started | Six-screen flow and metrics validated | | |
| 4. Sharing and growth | Not started | Share URLs and social previews tested | | |
| 5. SEO | Not started | Landing pages and indexing setup validated | | |
| 6. Hardening and beta | Not started | Regression, security, and beta report | | |
| 7. Public launch | Not started | GO decision and production checks | | |
| 8. Post-launch | Not started | Metrics reviewed and next backlog prioritized | | |

Suggested status values: `Not started`, `In progress`, `In review`, `Blocked`, `Complete`.

---

# 8. Critical priorities — if time becomes constrained

If the schedule slips, protect these in order:

1. Reliable domain and production deployment.
2. Existing Stats Card flow must continue to work.
3. A complete, accurate, visually polished Wrapped MVP.
4. Download and share functionality.
5. Mobile usability.
6. Basic SEO foundations and Search Console.
7. Monitoring, rate limiting, and essential security.
8. Launch content and developer distribution.

Defer complex animations, video exports, accounts, paid plans, elaborate personalization, and large collections of SEO pages.

**Do not sacrifice data accuracy, security, or core reliability to meet the date.** If a feature cannot be completed safely, reduce its scope and communicate the limitation.

---

# 9. Immediate next actions — November 12

Start here. Do not jump directly into Wrapped implementation.

- [ ] Create a launch branch or confirm the team's branching/release strategy.
- [ ] Run Phase 0 audit using the supplied prompt.
- [ ] Review the existing application and feature inventory.
- [ ] Confirm the smallest viable December launch scope.
- [ ] Shortlist and verify domain options.
- [ ] Assess current Render deployment against alternatives.
- [ ] Create a project board using the phases above.
- [ ] Start Phase 1 and Phase 2 only after the audit is reviewed.

## Final launch principle

**GitStats does not need to become a massive platform by December 10. It needs to become a product that a developer can discover, understand, use successfully, and proudly share.**

Ship the complete core experience. Measure real behavior. Improve from evidence.
