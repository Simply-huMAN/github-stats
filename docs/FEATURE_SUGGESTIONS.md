# Feature Suggestions & Product Backlog

This document tracks user suggestions, design ideas, and high-impact feature additions for **MyGitStats**.

---

## 1. GitHub-Style Commit Frequency Heatmap (Calendar Year Dots)

### Overview
A full calendar-year contribution activity grid (52 weeks of commit activity dots) displaying coding momentum, streak consistency, and commit velocity throughout the year.

### Key Capabilities & Requirements
- **Visual Presentation**:
  - Full 52-week horizontal calendar grid with day-of-week rows (Mon, Wed, Fri labels).
  - 4 to 5 contribution intensity tiers (from zero activity to high velocity).
  - **Dynamic Color Themes**:
    - Classic GitHub Emerald Green (`#0e4429`, `#006d32`, `#26a641`, `#39d353`).
    - City-Adaptive Palettes:
      - **Tokyo**: Electric Cyber Cyan & Magenta.
      - **Hyderabad**: Regal Imperial Amber & Gold.
      - **Bangalore**: Tech Hub Emerald & Saffron.
      - **Berlin**: High-contrast Techno Monochrome Slate.
      - **San Francisco**: Pacific Teal & Deep Ocean Blue.
- **Data Acquisition (Zero-OAuth Requirement)**:
  - Query public GitHub contribution data via the GitHub GraphQL API (`contributionsCollection.contributionCalendar`) or an unauthenticated public contribution calendar scraper endpoint.
  - Maintain the zero-login, privacy-first architecture without requiring users to grant repository access tokens.

---

## 2. Landscape Social Media Banner Generator (Twitter/X & LinkedIn)

### Overview
A specialized export format allowing developers to generate panoramic landscape banners showcasing their developer stats, tier rank, and commit activity for their social media profile headers.

### Supported Aspect Ratios & Dimensions
- **Twitter / X Header Banner**: `1500 × 500 px` (3:1 aspect ratio)
- **LinkedIn Profile Banner**: `1584 × 396 px` (4:1 aspect ratio)
- **GitHub Profile README Hero**: `1200 × 400 px` (custom wide banner)

### Visual Layout & Composition
- **Left Panel**:
  - Developer Avatar (with customizable frame: Squircle, Hexagon, Circle, Metal).
  - Name, `@handle`, Performance Tier Badge (Mythic / Gold / Bronze), and total score.
  - Core stats pills (Stars, Public Repos, Followers, Contribution Streak).
- **Right / Center Panel**:
  - The 52-week commit frequency heatmap dots embedded directly into the landscape flow.
  - Ambient city glow, subtle cyber grid, and dot-matrix background textures.
- **Footer Accent**:
  - Discreet watermark badge (`mygitstats.dev • verified tier`).
- **Export Engine**:
  - High-resolution 2x / 3x Retina PNG export using `html-to-image`.
  - Layered solid background colors (`baseBgColor`) and fallbacks to prevent Brave Shields / ad-blocker alpha transparency issues.

---

## 3. Compare 2 Usernames (Head-to-Head Developer Battle)

### Overview
A side-by-side developer comparison tool allowing users to enter two GitHub usernames and see an instant comparative breakdown across all key performance metrics.

### Key Capabilities & Requirements
- **Route & Experience**:
  - New route: `/compare` (or `/compare/[user1]/[user2]`).
  - Dual search input with quick-swap toggle (`User A ⇄ User B`).
- **Metric Comparison Breakdown**:
  - **Overall Performance Tier**: Tier badges and score comparison.
  - **Contribution Velocity**: Total commits, active contribution volume, and streak length.
  - **Community Impact**: Total repository stars, followers, and public repository counts.
  - **Radar / Matchup Visual**: "Winner" indicator badges per metric (e.g., higher stars, higher velocity).
- **Shareability**:
  - Exportable 2-player battle card PNG (perfect for social sharing and friendly dev rivalry).
  - OpenGraph card preview for comparison links.

---

## 4. Customizable Stat Metric Toggles in Card Builder

### Overview
Give developers granular control over which metrics appear on their stats card, supporting privacy, specialization, or minimal aesthetics.

### Key Capabilities & Requirements
- **Customizer Toolbar Toggles**:
  - `showStars`: Toggle total stars count.
  - `showFollowers`: Toggle follower count.
  - `showRepos`: Toggle public repo count.
  - `showContributions`: Toggle active contribution streak / count.
  - `showBio`: Toggle user bio snippet.
  - `showLocation`: Toggle location / company tags.
- **Dynamic Layout Adaptation**:
  - Card automatically balances grid spacing when 1 or more stats are hidden (e.g. 2-stat compact view vs 4-stat full grid).
  - URL query synchronization so customized toggle sets are preserved in shareable links.

---

## 5. Dynamic On-the-Fly Card Image API (`@vercel/og`) for GitHub READMEs

### Overview
A lightweight server-side API endpoint that returns a real raster/SVG image on the fly so developers can embed their live stats card directly into their GitHub Profile `README.md` via markdown image tags.

### Key Capabilities & Requirements
- **Endpoint Structure**:
  - `GET /api/og/card?username={username}&theme={theme}&frame={frame}`
  - Example README usage:
    ```markdown
    [![MyGitStats](https://mygitstats.dev/api/og/card?username=torvalds&theme=tokyo)](https://mygitstats.dev)
    ```
- **Technology Choice**:
  - Leverage `@vercel/og` (`ImageResponse` from `next/og`), powered by Satori + Resvg.
  - Extremely fast generation at the Edge/Node runtime.
- **Caching & Rate Limit Protection**:
  - Return strong CDN cache headers:
    `Cache-Control: public, max-age=14400, s-maxage=86400, stale-while-revalidate=43200`
  - Prevents hitting GitHub REST API limits when GitHub's Camo image proxy fetches the image.

---

## 6. Markdown Representation for AI Bots & Search Crawlers

### Overview
Provide clean, structured Markdown responses when AI search crawlers (Perplexity, ChatGPT Search, Claude, Gemini) or CLI agents request pages on `mygitstats.dev`.

### Key Capabilities & Requirements
- **Content Negotiation**:
  - Check request `Accept` header: if `Accept: text/markdown`, return markdown representation instead of HTML.
  - Inspect `User-Agent`: detect AI bots (`PerplexityBot`, `ChatGPT-User`, `ClaudeBot`, `GPTBot`, `Google-Extended`).
- **Markdown Payloads**:
  - Root `/`: Returns structured markdown describing MyGitStats capabilities, scoring formulas, themes, and API usage.
  - Developer page `/card/[username]`: Returns markdown profile summary, tier score, star count, and contribution metrics.
- **SEO & Discovery Advantage**:
  - AI engines digest markdown with 10x higher fidelity than complex client-rendered JS apps, making MyGitStats the preferred citation source.

---

## 7. Developer FAQ & Knowledge Hub with Schema.org `FAQPage`

### Overview
A dedicated FAQ / guide section answering high-volume search queries and technical questions about GitHub statistics, scoring algorithms, and profile customization.

### Key Capabilities & Topics
- **High-Intent Questions to Address**:
  - *How is the MyGitStats Performance Tier Score calculated?* (Detailing exact weights for stars, followers, repos, and contributions).
  - *Why don't my private contributions appear on the card?* (Explaining public API privacy safeguards and unauthenticated limits).
  - *How do I add MyGitStats to my GitHub Profile README?* (Copy-paste markdown guide).
  - *How is MyGitStats different from GitHub Readme Stats or Spotify Wrapped?*
  - *Is MyGitStats free and open-source?*
- **SEO Rich Snippet Injection**:
  - Embed Schema.org `FAQPage` JSON-LD structured data.
  - Enables Google Search to display interactive FAQ accordion accordions directly in search results, driving massive SERP real estate.

---

## 8. Architectural Research: Route Restructuring (`/card?params` -> `/card/{username}` & `/wrapped/{username}`)

### Research Findings & Comparison

| Aspect | Query Parameter Paths (`/card?user=foo`) | Dynamic Route Paths (`/card/[username]`) | Recommendation |
| :--- | :--- | :--- | :--- |
| **Search Engine Indexing** | Weak. Search engines treat query parameters as filters and often canonicalize to the root `/card`. | **Superior**. Google & Bing treat `/card/torvalds` as unique, crawlable public profile entities. | Dynamic Routes |
| **Social OpenGraph Previews** | Weak. Social crawlers (Twitterbot, LinkedInBot) don't run client-side JS; they see generic `/card` metadata. | **Superior**. Next.js `generateMetadata({ params })` can generate custom title, description, and dynamic OG preview image per user. | Dynamic Routes |
| **Page Load & Caching** | Client-side only. Requires browser hydration before fetching user stats. | Can leverage Next.js Server Components with ISR (`revalidate: 3600`) for near-instant edge responses. | Dynamic Routes |
| **Backward Compatibility** | Existing shared links use `?user=...`. | Seamlessly preserved via redirect middleware. | Must support 301 redirect |

### Proposed Routing Architecture
1. **Studio / Search Hub**:
   - `/card` remains the interactive builder studio (with default demo user).
   - `/wrapped` remains the Wrapped portal with year selection.
2. **Direct User Profiles**:
   - `/card/[username]` loads the custom card for that specific developer with pre-rendered server metadata.
   - `/wrapped/[username]` loads that developer's year-in-review experience.
3. **Redirect & Compatibility Strategy**:
   - In Next.js middleware or page root:
     If a request arrives at `/card?user={username}`, automatically issue a **301 Moved Permanently** redirect to `/card/{username}`.
   - Prevents breaking any bookmarks or links already shared.
4. **Safety & Sanitization**:
   - Sanitize `username` against reserved routes (`/card/api`, `/card/settings`).
   - Validate against GitHub username regex (`^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$`).

---

## 9. Dynamic OpenGraph (OG) Social Preview Image per Username

### Overview
Generate a hyper-engaging, personalized 1200×630 OpenGraph social card whenever a user shares `mygitstats.dev/card/{username}` or `mygitstats.dev/wrapped/{username}` on Twitter/X, LinkedIn, Discord, Slack, WhatsApp, Reddit, or iMessage.

### Viral Mechanics & Visual Design
- **Dimensions**: `1200 × 630 px` (standard 1.91:1 OpenGraph ratio).
- **Personalized Visual Composition**:
  - **Developer Identity**: High-res avatar with squircle/tier frame, full name, `@username`, and membership tenure.
  - **Tier Badge & Score**: Prominent glowing badge (`MYTHIC`, `GOLD`, `BRONZE`) with the calculated score.
  - **Metric Highlights**: 4 key stats (Total Stars, Followers, Repositories, Contributions) in glassmorphic badges.
  - **Aesthetic Backdrop**: City-themed ambient glow matching the user's selected theme or performance tier.
  - **Conversion Call-to-Action**: Bottom accent bar: *"mygitstats.dev • See how you rank on GitHub"*.
- **Technical Implementation**:
  - Next.js App Router dynamic OG convention: `app/card/[username]/opengraph-image.tsx` and `app/wrapped/[username]/opengraph-image.tsx`.
  - Built with `@vercel/og` (`ImageResponse` using Edge runtime and Satori).
  - Edge caching: `Cache-Control: public, immutable, no-transform, s-maxage=86400, max-age=86400`.
- **CTR & Click-Through Impact**:
  - When posted in developer feeds or Discord channels, users immediately see a high-status graphic showcasing the developer's tier, compelling viewers to click and generate their own card.

---

## 10. Master Backlog & Checklist

- [ ] **Heatmap & Social Banners**:
  - [ ] GitHub-style 52-week commit frequency heatmap calendar dots.
  - [ ] Landscape social banner generator (1500×500 for Twitter/X & 1584×396 for LinkedIn).
- [ ] **Core Platform Features**:
  - [x] Head-to-head compare 2 usernames battle feature (`/compare` & `/compare/[user1]/vs/[user2]`).
  - [ ] Customizer stat toggles in card builder (toggle stars, followers, repos, contributions, bio).
  - [ ] Dynamic `@vercel/og` image generation API (`/api/og/card`) for GitHub README embedding.
- [ ] **Viral & Social Media Growth**:
  - [ ] Personalized 1200×630 Dynamic OpenGraph (`opengraph-image.tsx`) preview cards per username for Twitter/X, LinkedIn, and Discord link shares.
- [ ] **SEO, AI & Discovery**:
  - [ ] Markdown response negotiation (`Accept: text/markdown`) for AI bots & crawlers.
  - [ ] FAQ & Knowledge Hub with Schema.org `FAQPage` rich snippet markup.
  - [ ] Route restructuring: Implement `/card/[username]` and `/wrapped/[username]` dynamic routes with 301 backward-compatibility redirects.



