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
  themeMode: ThemeMode;
  avatarFrame: AvatarFrameStyle;
  avatarBadge: AvatarBadgeStyle;
  cardBackground: CardBackgroundStyle;
}

export interface CityThemeConfig {
  id: CityThemeId;
  name: string;
  tagline: string;
  swatch: string;
  outerContainer: string;
  ambientBg: string;
  borderGlow: string;
  topStripe: string;
  badgeStyle: string;
  badgeText: string;
  accentGradient: string;
  metricCardBg: string;
  metricIconColor: string;
  watermarkColor: string;
  avatarBorder: string;
  glowDot: string;
}
