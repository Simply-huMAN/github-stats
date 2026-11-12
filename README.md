# GitHub Stats & Performance Tier Card Generator

A modern Next.js 14/15 application built with TypeScript and Tailwind CSS. It calculates developer performance tiers (Bronze, Gold, and Mythic) based on public GitHub statistics, displays a beautifully styled tier card with bespoke glow aesthetics, and exports high-resolution PNG cards with an elegant watermark using `html-to-image`.

![Next.js](https://img.shields.io/badge/Next.js-14%2F15-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwind-css)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?style=flat&logo=docker)
![Render](https://img.shields.io/badge/Render-Deployable-46e3b7?style=flat&logo=render)

---

## Features

- **GitHub Stats Ingestion (`/api/stats`)**:
  - Automatically fetches followers, public repositories, and aggregates total stars across public repos.
  - Estimates active 90-day contributions from the GitHub Public Events API.
  - Zero-config public API access with rate-limit handling, plus optional `GITHUB_TOKEN` support (5,000 req/hr).
- **Weighted Tier Calculation**:
  $$\text{Score} = (\text{Total Stars} \times 3.0) + (\text{Followers} \times 1.5) + (\min(\text{Public Repos}, 50) \times 1.0) + (\text{Active Contributions} \times 0.5)$$
  - **Bronze Tier** (`< 100` pts): Brushed metallic zinc/slate gradient.
  - **Gold Tier** (`100 - 499` pts): Radiant amber/honey ambient glow.
  - **Mythic Tier** (`>= 500` pts): Cosmic indigo/neon holographic theme.
- **High-Quality PNG Export**:
  - Exports crisp 3x retina PNG images directly from the card DOM node.
  - Built-in CORS safeguards for GitHub avatars to prevent tainted canvas errors.
  - Elegant, discreet watermark badge (`github-stats-s3gs.onrender.com • verified tier`).

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
