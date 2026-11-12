# Architecture Plan: Custom Card Builder & City Themes

This plan details the design, technical specifications, and rollout plan for the **Custom Card Builder** iteration, featuring modular avatar frames, badges, background styles, and 8 bespoke city-inspired themes.

---

## 1. Feature Scope & Objectives

The Custom Card Builder allows users to personalize their GitHub stats card beyond the automatic Bronze/Gold/Mythic tier styles, with real-time visual feedback:
1. **City-Inspired In-Built Themes**: Tokyo, Berlin, Bangalore, Hyderabad, San Francisco, Paris, Frankfurt, Shanghai (plus original Tier themes).
2. **Avatar Frame Styles**: Circular, Squircle, Cyber Hexagon, Glowing Ring, Brushed Metallic.
3. **Avatar Badges**: Rank Icon, Verified Check, Flame, Minimalist Status Dot, Royal Crest.
4. **Card Background Textures**: Ambient Radial Glow, Cyber Matrix Grid, High-Contrast Glassmorphism, Brushed Metal, Clean Slate.
5. **Instant Live Preview**: Dynamic React state updates without refetching GitHub API metrics.
6. **Download Engine Parity**: 100% compatibility with `html-to-image` at 3x retina resolution for all custom combinations.

---

## 2. City Themes Specification

Each theme embodies the aesthetic character of its namesake metropolis:

| Theme | Inspiration & Mood | Color Palette & Tailwind Tokens | Outer Glow & Accents |
| :--- | :--- | :--- | :--- |
| **Tokyo** | Cyberpunk Shibuya night, electric neon, futuristic holograms | Deep Obsidian (`#0b0813`), Electric Cyan (`#06b6d4`), Shibuya Magenta (`#ec4899`) | Dual cyan/magenta neon outer drop shadow, glowing text gradients |
| **Berlin** | Industrial techno minimalism, raw concrete, club culture | Raw Concrete Charcoal (`#121214`), Steel Slate (`#27272a`), Acid Lime (`#a3e635`) | High-contrast industrial border, acid lime badges, monochrome grid |
| **Bangalore** | High-velocity tech capital, circuit green, startup pulse | Silicon Deep Teal (`#031412`), Cyber Emerald (`#10b981`), Electric Mint (`#34d399`) | Luminous green emerald ambient halo, circuit-inspired border tones |
| **Hyderabad** | City of Pearls & HITEC City, Nizami royal amethyst & gold | Royal Velvet Purple (`#180b26`), Deep Amethyst (`#6b21a8`), Warm Pearl Gold (`#fbbf24`) | Gilded pearl amber borders, jewel-toned radial backdrops |
| **San Francisco** | Golden Gate sunset, Pacific fog, clean Silicon Valley glass | Dusk Umber (`#1c1311`), Fog Slate (`#1e1e24`), Sunset Coral (`#f97316`) | Warm sunset radial light, ultra-sleek glassmorphic card container |
| **Paris** | Haussmannian luxury, haute couture, timeless navy & champagne | Noir Luxury (`#08090d`), Midnight Navy (`#0f172a`), Champagne Gold (`#e2d9b6`) | Brushed champagne metallic highlights, sophisticated editorial typography |
| **Frankfurt** | Global financial hub, Mainhattan skyscrapers, precision steel | Titanium Void (`#0b0f17`), Euro Steel (`#1e293b`), Ice Blue (`#38bdf8`) | Crisp high-contrast geometric borders, platinum metallic accents |
| **Shanghai** | The Bund skyline, imperial ruby & amber neon water reflections | Imperial Crimson (`#1a070a`), Ruby Neon (`#e11d48`), Radiant Gold Amber (`#f59e0b`) | Ruby-and-gold neon ambient reflections, luminous contrast badges |

---

## 3. Modular Customization Options

### 3.1 Avatar Frame Archetypes
- **`squircle`** (Default): `rounded-2xl` with subtle border glow.
- **`circle`**: Classic `rounded-full` with continuous rotating conic gradient ring.
- **`cyber-hex`**: Hexagonal clip-path with cybernetic corner notches.
- **`neon-ring`**: Multi-layered pulsing neon box-shadow (`ring-2 ring-cyan-400 ring-offset-2 ring-offset-black`).
- **`brushed-metal`**: Metallic gradient border simulating bevelled platinum/gold.

### 3.2 Avatar Badges
- **`tier-icon`** (Default): Award / Shield / Sparkles based on performance score.
- **`verified-check`**: Clean blue/cyan verified checkmark badge.
- **`fire`**: Animated flame badge denoting high contributor activity.
- **`minimal-dot`**: Subtle pulsing status indicator in the avatar corner.
- **`royal-crest`**: Detailed crown/shield badge for high-tier personalization.

### 3.3 Card Background Textures
- **`ambient-glow`** (Default): Dual-origin radial lighting gradients.
- **`cyber-grid`**: Subtle 16px isometric grid pattern with low opacity (`bg-grid-white/[0.03]`).
- **`glassmorphic`**: High-blur frosted glass (`backdrop-blur-xl bg-white/[0.04] border-white/10`).
- **`mesh-gradient`**: Multi-point colorful ambient mesh.
- **`pure-minimal`**: Clean, deep matte dark background without textures.

---

## 4. Technical Architecture & File Layout

```
├── types/
│   ├── stats.ts                # Existing GitHub & Tier models
│   └── builder.ts              # Customizer state, ThemeConfig, FrameConfig
├── lib/
│   ├── tier.ts                 # Tier scoring logic
│   └── themes/
│       ├── cityThemes.ts       # Tokyo, Berlin, Bangalore, etc. definitions
│       └── frameStyles.ts      # Avatar frames & badge styling tokens
├── components/
│   ├── StatsCard.tsx           # Refactored to accept dynamic CustomizerOptions
│   ├── DownloadButton.tsx      # Retains 3x retina export for any custom style
│   └── builder/
│       ├── CustomizerToolbar.tsx   # Floating or docked customization dock
│       ├── ThemePicker.tsx         # Visual theme selection cards with color swatches
│       ├── FramePicker.tsx         # Avatar frame shape & ring toggles
│       ├── BadgePicker.tsx         # Badge style selectors
│       └── BackgroundPicker.tsx    # Texture & overlay selectors
└── app/
    └── page.tsx                # Split view: Live Card Preview + Interactive Builder Dock
```

---

## 5. Phased Implementation Roadmap

- [ ] **Phase 1: Types & Theme Design Tokens**
  - Define `CustomizerOptions` and `CityThemeId` in `types/builder.ts`.
  - Author complete CSS token dictionaries for all 8 city themes in `lib/themes/cityThemes.ts`.
- [ ] **Phase 2: Card Component Refactoring**
  - Update `StatsCard.tsx` to support the new `options: CustomizerOptions` prop with fallback to performance tier styling.
  - Implement dynamic avatar frame masking, badge anchors, and background texture layers.
- [ ] **Phase 3: Interactive Customizer Dock**
  - Build `CustomizerToolbar.tsx` with clean tabs: **Themes**, **Frames**, **Badges**, **Backdrops**.
  - Add interactive swatch buttons for instant zero-latency theme switching.
- [ ] **Phase 4: PNG Export Quality Assurance**
  - Verify that custom clip-paths, radial gradients, and neon shadows rasterize accurately with `html-to-image` at 3x DPI.
- [ ] **Phase 5: Release v0.2.0**
  - Update `CHANGELOG.md` and trigger the release pipeline.
