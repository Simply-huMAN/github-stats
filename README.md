# GitHub Stats & Performance Tier Card Generator

A modern Next.js 14/15 application built with TypeScript and Tailwind CSS. It calculates developer performance tiers (Bronze, Gold, and Mythic) based on public GitHub statistics, displays a beautifully styled tier card with bespoke glow aesthetics, and exports high-resolution PNG cards with an elegant watermark using `html-to-image`.

![Next.js](https://img.shields.io/badge/Next.js-14%2F15-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwind-css)

---

## Features

- **GitHub Stats Ingestion (`/api/stats`)**:
  - Automatically fetches followers, public repositories, and aggregates total stars across public repos.
  - Estimates active 90-day contributions from the GitHub Public Events API.
  - Zero-config public API access with rate-limit handling, plus optional `GITHUB_TOKEN` support (5,000 req/hr).
- **Weighted Tier Calculation**:
  - Bronze Tier (< 100 pts): Brushed metallic zinc/slate gradient.
  - Gold Tier (100 - 499 pts): Radiant amber/honey ambient glow.
  - Mythic Tier (>= 500 pts): Cosmic indigo/neon holographic theme.
- **High-Quality PNG Export**:
  - Exports crisp 3x retina PNG images directly from the card DOM node.
  - Built-in CORS safeguards for GitHub avatars to prevent tainted canvas errors.
  - Elegant, discreet watermark badge (`gitstats.dev • verified tier`).

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Simply-huMAN/github-stats.git
cd github-stats
```

### 2. Install dependencies
```bash
npm install
```

### 3. (Optional) Set up Environment Variables
Create a `.env.local` file to increase rate limits to 5,000 req/hr:
```bash
GITHUB_TOKEN=your_personal_access_token_here
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
