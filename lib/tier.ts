import { TierDetails, TierType, UserStats } from "@/types/stats";

/**
 * Calculates a weighted developer performance score.
 * Formula:
 * - Total Stars: 3.0x
 * - Followers: 1.5x
 * - Public Repos (capped at 50 to avoid inflation): 1.0x
 * - Active Contributions (90-day estimate): 0.5x
 */
export function calculateTierScore(stats: UserStats): number {
  const starsWeight = stats.totalStars * 3.0;
  const followersWeight = stats.followers * 1.5;
  const reposWeight = Math.min(stats.publicRepos, 50) * 1.0;
  const contributionsWeight = stats.activeContributions * 0.5;

  const totalScore = starsWeight + followersWeight + reposWeight + contributionsWeight;
  return Math.round(totalScore * 10) / 10;
}

/**
 * Maps a numeric score into a designated Performance Tier with styling tokens.
 */
export function getTierDetails(score: number): TierDetails {
  if (score >= 500) {
    return {
      tier: "Mythic",
      score,
      title: "Legendary Architect",
      badgeLabel: "MYTHIC TIER",
      description: "Elite open-source presence, prolific builder, and influential ecosystem champion.",
      colors: {
        badgeBg: "bg-indigo-950/80 backdrop-blur-md",
        badgeText: "text-cyan-300",
        badgeBorder: "border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.5)]",
        gradient: "from-indigo-950/90 via-purple-950/60 to-black",
        glow: "shadow-glow-mythic border-indigo-500/60 ring-1 ring-cyan-500/30",
        textAccent: "text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]",
        cardBorder: "border-indigo-500/50",
      },
    };
  }

  if (score >= 100) {
    return {
      tier: "Gold",
      score,
      title: "Core Contributor",
      badgeLabel: "GOLD TIER",
      description: "Proven open-source authority with high-traction repositories and active engagement.",
      colors: {
        badgeBg: "bg-amber-950/80 backdrop-blur-md",
        badgeText: "text-amber-300",
        badgeBorder: "border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.4)]",
        gradient: "from-amber-950/60 via-stone-900 to-neutral-950",
        glow: "shadow-glow-gold border-amber-500/50 ring-1 ring-amber-400/20",
        textAccent: "text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]",
        cardBorder: "border-amber-500/40",
      },
    };
  }

  return {
    tier: "Bronze",
    score,
    title: "Apprentice Builder",
    badgeLabel: "BRONZE TIER",
    description: "Active open-source developer learning, committing, and laying strong foundations.",
    colors: {
      badgeBg: "bg-zinc-800/80 backdrop-blur-md",
      badgeText: "text-zinc-300",
      badgeBorder: "border-zinc-500/40 shadow-[0_0_8px_rgba(161,161,170,0.2)]",
      gradient: "from-zinc-900 via-neutral-900 to-stone-950",
      glow: "shadow-glow-bronze border-zinc-700/60 ring-1 ring-zinc-600/20",
      textAccent: "text-zinc-200",
      cardBorder: "border-zinc-700/50",
    },
  };
}

/**
 * Convenience helper to determine tier directly from raw stats.
 */
export function assignTier(stats: UserStats): TierDetails {
  const score = calculateTierScore(stats);
  return getTierDetails(score);
}
