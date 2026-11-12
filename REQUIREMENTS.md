# GitHub Stats & Performance Tier Card Generator
## Product Requirements Document (PRD)

---

### 1. Overview & Objective
The **GitHub Stats Card Generator** is a Next.js (App Router), TypeScript, and Tailwind CSS web application. It allows users to input any GitHub username, fetches verified public metrics via GitHub APIs, calculates a weighted performance tier (**Bronze**, **Gold**, or **Mythic**), renders a tier-styled developer card with an elegant watermark, and enables exporting the card as a high-fidelity PNG image via `html-to-image`.

---

### 2. Functional Requirements

#### 2.1 GitHub Stats Ingestion (`/api/stats`)
- **Input**: Query parameter `username` (string, required, sanitized).
- **GitHub Data Points to Retrieve**:
  - `login`, `name`, `avatar_url`, `bio`, `created_at`
  - `followers`: Count of followers
  - `public_repos`: Count of public repositories
  - `total_stars`: Aggregated stargazer count across public repositories
  - `contributions`: Estimated active contributions (via recent Public Events API or GraphQL `contributionsCollection` if authenticated)
- **Authentication & Rate Limiting Strategy**:
  - Support unauthenticated requests (60 requests/hr per IP limit).
  - Support optional server-side `GITHUB_TOKEN` environment variable (5,000 requests/hr).
  - Graceful error responses:
    - `400 Bad Request` if username is invalid or missing.
    - `404 Not Found` if user does not exist on GitHub.
    - `403 Forbidden` if rate limit is reached, with a friendly user-facing notice.
    - `500 Internal Server Error` on unexpected failures.

#### 2.2 Tier Assignment Algorithm
Performance tiers are calculated deterministically using a weighted score formula:
$$\text{Score} = (\text{Total Stars} \times 3.0) + (\text{Followers} \times 1.5) + (\min(\text{Public Repos}, 50) \times 1.0) + (\text{Active Contributions} \times 0.5)$$

- **Tiers & Thresholds**:
  - **Bronze** (`Score < 100`): Emerging developer / active learner.
  - **Gold** (`100 <= Score < 500`): Proven open-source contributor with established reach.
  - **Mythic** (`Score >= 500`): High-impact maintainer, viral creator, or prolific open-source champion.
- Each tier provides:
  - Label (`Bronze`, `Gold`, `Mythic`)
  - Title/Badge (e.g., `Apprentice Builder`, `Core Contributor`, `Legendary Architect`)
  - Description summary
  - Theme tokens (background, border, glow, text accent, badge style)

#### 2.3 Visual Card Component (`StatsCard.tsx`)
- Displays:
  - User avatar with fallback and CORS-compliant loading
  - Full name, `@username`, and bio
  - Tier badge with custom iconography
  - Stats grid: Followers, Stars, Repositories, Estimated Contributions
  - Calculated performance tier score
  - Member since year / active period
  - **Watermark**: Minimalist, elegant text watermark in the bottom corner (`github-stats-s3gs.onrender.com • verified tier`).
- **Styling Archetypes**:
  - **Bronze**: Sleek slate/zinc metallic gradient, cool brushed borders, understated silver accents.
  - **Gold**: Radiant amber/honey dual-gradient, subtle golden outer glow (`drop-shadow` / `box-shadow`), warm metallic badges.
  - **Mythic**: Dark neon-indigo/violet holographic theme, iridescent border gradient, cyan/magenta glow highlights, futuristic glassmorphic backdrop.

#### 2.4 High-Quality PNG Export (`DownloadButton.tsx`)
- Exports the DOM element containing the card using `html-to-image`.
- Configured with:
  - `pixelRatio: 2` or `3` for ultra-sharp Retina output.
  - `cacheBust: true` and CORS handling to ensure avatars and web fonts render accurately without tainted canvas exceptions.
  - Dynamic file naming: `${username}-github-tier-${tier.toLowerCase()}.png`.
  - Loading state while rendering and exporting.

---

### 3. Non-Functional Requirements
- **Performance**: API response time < 800ms (when using cached or single-page repo lookups).
- **Reliability**: No crash on missing avatar, null bio, or zero repos/followers.
- **Type Safety**: 100% TypeScript with strict typing on all API models, tier computations, and component props.
- **Responsive & Accessible**: Card is legible on mobile and desktop; accessible contrast ratios for stats and text.

---

### 4. Technical Stack
- **Framework**: Next.js 14/15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Image Generation**: `html-to-image`
- **HTTP / GitHub Client**: Native fetch with optional `@octokit/rest` integration

---

### 5. API Data Contract

#### Response: `GET /api/stats?username={username}`
```typescript
export interface GitHubStatsResponse {
  username: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  createdAt: string;
  followers: number;
  publicRepos: number;
  totalStars: number;
  activeContributions: number;
  tier: {
    tier: "Bronze" | "Gold" | "Mythic";
    score: number;
    title: string;
    description: string;
  };
}
```
