## What's Changed in v0.3.4

### Added
- **52-Week Commit Activity Heatmap**:
  - Implemented an inline vector SVG heatmap component ([`components/ContributionHeatmap.tsx`](components/ContributionHeatmap.tsx)) rendering the full calendar year of commit activity across 52 columns and 7 weekday rows.
  - Added month indicators (Jan–Dec), weekday labels (Mon, Wed, Fri), commit summary badge, and an intensity level legend (Less $\to$ More).
- **City-Themed Heatmap Palettes**:
  - Integrated dynamic color mapping to harmonize dot intensities across all city palettes (Tokyo, Bangalore, Hyderabad, Berlin, San Francisco, Paris, Frankfurt, Shanghai) as well as tier fallbacks and classic GitHub green.
- **Interactive Heatmap Customizer Toggle**:
  - Added a dedicated 1-click `[Heatmap: ON / OFF]` button to the builder toolbar ([`components/builder/CustomizerToolbar.tsx`](components/builder/CustomizerToolbar.tsx)).
  - Dynamically renders or completely removes the heatmap from card canvas previews and 3x retina PNG exports ([`components/StatsCard.tsx`](components/StatsCard.tsx)).
  - Preserves toggle preference across deep-link sharing URLs (`?heatmap=false`).
- **Resilient 3-Tier Contribution Data Ingestion**:
  - Built multi-tier data resolution in [`lib/contributions.ts`](lib/contributions.ts): queries the official GitHub GraphQL `contributionsCollection` when `GITHUB_TOKEN` is present, falls back to a public mirror API, and defaults to a deterministic synthetic 52-week activity generator seeded from user activity metrics.
- **SEO & Backlink Flywheel in README**:
  - Added live domain badges (`mygitstats.dev`), direct studio navigation links, and a copy-paste GitHub profile README embed code snippet in [`README.md`](README.md).

### Fixed
- **WhatsApp & Social Link Previews**:
  - Resolved missing preview image on WhatsApp, iMessage, and Telegram by adding an optimized static banner at [`public/og-image.png`](public/og-image.png) (85.7 KB, well under WhatsApp's 300 KB limit).
  - Added explicit `type: "image/png"` to Open Graph image metadata in [`app/layout.tsx`](app/layout.tsx).
