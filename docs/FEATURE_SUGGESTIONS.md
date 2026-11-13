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

## 3. Prioritization & Implementation Path

| Phase | Milestone | Scope |
| :--- | :--- | :--- |
| **Phase A** | GraphQL Contribution Service | Implement backend service to fetch the 365-day contribution calendar matrix for any public user without authentication. |
| **Phase B** | Heatmap React Component | Build an accessible, scalable SVG/HTML calendar dot grid with city theme color mapping. |
| **Phase C** | Banner Canvas Mode | Add a layout toggle in `/card` (or new `/banner` studio route): **Card View** (vertical/square) vs **Banner View** (1500×500 / 1584×396). |
| **Phase D** | High-Res Export & Preview | Wire up landscape DOM node to `DownloadButton` with instant 1500×500 PNG download. |
