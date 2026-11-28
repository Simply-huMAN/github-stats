import { generateSyntheticCalendar } from "@/lib/contributions";
import { assignTier } from "@/lib/tier";
import type { CustomizerOptions } from "@/types/builder";
import type { StatsResponse } from "@/types/stats";

export const DEFAULT_CARD_OPTIONS: CustomizerOptions = {
  cardStyle: "showcase",
  themeMode: "site-green",
  avatarFrame: "squircle",
  avatarBadge: "tier-icon",
  cardBackground: "ambient-glow",
  showHeatmap: true,
};

const sampleStats = {
  followers: 486,
  publicRepos: 36,
  totalStars: 1284,
  activeContributions: 92,
};
const sampleDate = new Date("2026-11-28T00:00:00Z");

export const EXAMPLE_CARD: StatsResponse = {
  user: {
    username: "example",
    name: "Alex Morgan",
    avatarUrl: "",
    bio: null,
    company: null,
    location: null,
    blog: null,
    twitterUsername: null,
    createdAt: "2021-03-18T00:00:00Z",
    htmlUrl: "",
  },
  stats: sampleStats,
  tier: assignTier(sampleStats),
  calendar: generateSyntheticCalendar("example", sampleStats.activeContributions, sampleStats.publicRepos, sampleDate),
  fetchedAt: sampleDate.toISOString(),
};
