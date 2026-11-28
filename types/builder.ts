import { TierType } from "./stats";

export type CityThemeId =
  | "tokyo"
  | "berlin"
  | "bangalore"
  | "hyderabad"
  | "san-francisco"
  | "paris"
  | "frankfurt"
  | "shanghai";

export type ThemeMode = "auto" | TierType | CityThemeId;
export type CardStyle = "minimal" | "showcase";

export type AvatarFrameStyle =
  | "squircle"
  | "circle"
  | "cyber-hex"
  | "neon-ring"
  | "brushed-metal";

export type AvatarBadgeStyle =
  | "tier-icon"
  | "verified-check"
  | "fire"
  | "minimal-dot"
  | "royal-crest";

export type CardBackgroundStyle =
  | "ambient-glow"
  | "cyber-grid"
  | "glassmorphic"
  | "mesh-gradient"
  | "pure-minimal";

export interface CustomizerOptions {
  cardStyle: CardStyle;
  themeMode: ThemeMode;
  avatarFrame: AvatarFrameStyle;
  avatarBadge: AvatarBadgeStyle;
  cardBackground: CardBackgroundStyle;
  showHeatmap?: boolean;
}

export interface CityThemeConfig {
  id: CityThemeId;
  name: string;
  tagline: string;
  swatch: string; // CSS color or gradient for UI selector
  baseBgColor: string; // Solid opaque base color for browser-agnostic export
  linearGradient: string; // Theme linear gradient foundation
  outerContainer: string;
  ambientBg: string;
  borderGlow: string;
  topStripe: string;
  badgeStyle: string;
  badgeText: string;
  accentGradient: string;
  accentColor: string; // High-contrast solid accent text color
  metricCardBg: string;
  metricIconColor: string;
  watermarkColor: string;
  avatarBorder: string;
  glowDot: string;
}
