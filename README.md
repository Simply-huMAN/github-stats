# MyGitStats — Developer Stats Cards & GitHub Wrapped

**[MyGitStats](https://mygitstats.dev)** is a modern open-source developer performance studio and annual review platform built with Next.js, TypeScript, and Tailwind CSS. It deterministically calculates developer performance tiers (Bronze, Gold, Mythic) from public GitHub activity, renders 52-week commit activity heatmaps with city themes, and exports high-resolution 3x retina PNG cards for developer portfolios and profile READMEs.

[![MyGitStats Live](https://img.shields.io/badge/MyGitStats-mygitstats.dev-6366f1?style=for-the-badge&logo=googlechrome&logoColor=white)](https://mygitstats.dev)
[![MyGitStats Card Studio](https://img.shields.io/badge/MyGitStats-Card_Studio-4f46e5?style=for-the-badge&logo=sparkles)](https://mygitstats.dev/card)
[![MyGitStats Compare](https://img.shields.io/badge/MyGitStats-Developer_Showdown-f59e0b?style=for-the-badge&logo=swords)](https://mygitstats.dev/compare)
[![MyGitStats Wrapped](https://img.shields.io/badge/MyGitStats-GitHub_Wrapped_2026-ec4899?style=for-the-badge&logo=github)](https://mygitstats.dev/wrapped)

> 🌐 **Official Website**: [https://mygitstats.dev](https://mygitstats.dev)  
> 🎨 **MyGitStats Studio**: [https://mygitstats.dev/card](https://mygitstats.dev/card)  
> ⚔️ **Developer Showdown**: [https://mygitstats.dev/compare](https://mygitstats.dev/compare)  
> 🎆 **MyGitStats Wrapped**: [https://mygitstats.dev/wrapped](https://mygitstats.dev/wrapped)  
> 📦 **GitHub Repository**: [https://github.com/Simply-huMAN/github-stats](https://github.com/Simply-huMAN/github-stats)

---

## 🌟 MyGitStats Key Features

- **GitHub Metrics Ingestion (`/api/stats` & `/api/developer`)**:
  - Automatically fetches followers, public repositories, and aggregates total stars across public repos.
  - Estimates active 90-day contributions from the GitHub Public Events API.
  - Zero-config public API access with rate-limit handling, plus optional `GITHUB_TOKEN` support (5,000 req/hr).
- **52-Week Commit Activity Heatmap**:
  - Live interactive commit frequency grid across the calendar year with city-themed color palettes (Tokyo, Bangalore, Hyderabad, Berlin, Classic Green).
  - Configurable customizer toggle to show or hide the heatmap on the card preview and PNG exports.
- **Weighted Developer Performance Tiers**:
  $$\text{Score} = (\text{Total Stars} \times 3.0) + (\text{Followers} \times 1.5) + (\min(\text{Public Repos}, 50) \times 1.0) + (\text{Active Contributions} \times 0.5)$$
  - **Bronze Tier** (`< 100` pts): Rising Developer / Emerging Builder.
  - **Gold Tier** (`100 - 499` pts): Senior Contributor / Prolific Builder.
  - **Mythic Tier** (`>= 500` pts): Legendary Architect / Ecosystem Leader.
- **High-Quality PNG Export**:
  - Exports crisp 3x retina PNG images directly from the card DOM node.
  - Built-in CORS safeguards for GitHub avatars to prevent tainted canvas errors.
  - Elegant, discreet watermark badge (`mygitstats.dev • verified tier`).

---

## 🚀 Embed MyGitStats in Your GitHub Profile README

Add your custom stats card to your GitHub profile README by linking back to your live [MyGitStats](https://mygitstats.dev) card:

```markdown
[![MyGitStats](https://mygitstats.dev/og-image.png)](https://mygitstats.dev/card?user=YOUR_USERNAME)
```

---

## Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/Simply-huMAN/github-stats.git
cd github-stats
```

### 2. Install dependencies & run dev server
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploying to Render

This repository is optimized for **Docker Standalone** deployment on Render, reducing RAM usage to $\sim 80\text{MB}-120\text{MB}$ and preventing build memory spikes on free/starter tiers.

### Option 1: Automatic Blueprint (Recommended)
1. In your [Render Dashboard](https://dashboard.render.com), click **New +** > **Blueprint**.
2. Select the `Simply-huMAN/github-stats` repository.
3. Render will read `render.yaml` automatically and configure the Docker Web Service.
4. Click **Apply**.

### Option 2: Manual Web Service
1. In Render, select **New +** > **Web Service**.
2. Select your repository `github-stats`.
3. Choose **Docker** as the runtime (Render will automatically pick up `Dockerfile`).
4. Set the environment variable:
   - `PORT`: `3000`
   - *(Optional)* `GITHUB_TOKEN`: Your GitHub personal access token (increases API limit to 5,000 req/hr).
5. Click **Create Web Service**.

---

## CI/CD & Release Workflows

Inspired by `quizo`, this repository includes GitHub Actions workflows under `.github/workflows/`:

- **`.github/workflows/snapshot.yml`**:
  - Triggers on pull requests and pushes to `working`, `dev`, or `feature/*`.
  - Runs dependencies caching, linting, TypeScript typechecking, and Next.js standalone build validation.
  - Deploys snapshot to Render if `RENDER_DEPLOY_HOOK` is configured.
- **`.github/workflows/release.yml`**:
  - Triggers on push to `main` or manually via **Run workflow** (`workflow_dispatch`).
  - Accepts a `version` input (e.g. `0.1.0` or `1.0.0`).
  - Validates SemVer format, archives standalone artifacts, and creates a formal **GitHub Release** with changelog.
  - Dispatches automated webhook deploy to Render if `secrets.RENDER_DEPLOY_HOOK` is set in GitHub repository secrets.

---

## Project Structure

```
├── .github/workflows/
│   ├── release.yml             # Release & deploy workflow
│   └── snapshot.yml            # Feature PR & snapshot CI
├── app/
│   ├── api/stats/route.ts      # GitHub stats aggregator API route
│   ├── globals.css             # Tailwind base & custom glows
│   ├── layout.tsx              # Root HTML layout
│   └── page.tsx                # Interactive demo dashboard
├── components/
│   ├── StatsCard.tsx           # Multi-tier visual card component
│   └── DownloadButton.tsx      # html-to-image PNG exporter
├── lib/
│   ├── tier.ts                 # Tier score formula & metadata
│   └── utils.ts                # Class merge utility (cn)
├── types/
│   └── stats.ts                # TypeScript data interfaces
├── Dockerfile                  # Next.js multi-stage standalone build
├── render.yaml                 # Render Blueprint specification
├── CHANGELOG.md                # Project release history
├── REQUIREMENTS.md             # Product requirements specification
└── ACTION_PLAN.md              # Architecture & roadmap plan
```

---

## License
MIT
