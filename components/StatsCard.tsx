"use client";

import React, { forwardRef, useMemo } from "react";
import {
  Star,
  Users,
  GitFork,
  Flame,
  Award,
  Sparkles,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { StatsResponse, TierType } from "@/types/stats";
import { CustomizerOptions } from "@/types/builder";
import { assignTier } from "@/lib/tier";
import { CITY_THEMES } from "@/lib/themes/cityThemes";
import {
  AVATAR_FRAME_CONFIG,
  AVATAR_BADGE_CONFIG,
  CARD_BACKGROUND_CONFIG,
} from "@/lib/themes/frameStyles";
import { cn } from "@/lib/utils";

export interface StatsCardProps {
  data: StatsResponse;
  className?: string;
  forceTier?: TierType;
  customizerOptions?: CustomizerOptions;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toLocaleString();
}

const TIER_THEME_CONFIG: Record<
  TierType,
  {
    baseBgColor: string;
    linearGradient: string;
    outerContainer: string;
    ambientBg: string;
    borderGlow: string;
    topStripe: string;
    badgeStyle: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    accentGradient: string;
    metricCardBg: string;
    metricIconColor: string;
    watermarkColor: string;
    avatarBorder: string;
    glowDot: string;
  }
> = {
  Bronze: {
    baseBgColor: "#121214",
    linearGradient: "linear-gradient(135deg, #18181b 0%, #121214 50%, #0a0a0c 100%)",
    outerContainer:
      "bg-gradient-to-br from-zinc-900 via-[#18181b] to-neutral-950 text-zinc-100 border border-zinc-700/60 shadow-xl shadow-zinc-950/80",
    ambientBg: "radial-gradient(circle at 85% 15%, rgba(161, 161, 170, 0.08), transparent 60%)",
    borderGlow: "shadow-[0_10px_35px_-10px_rgba(0,0,0,0.8),0_0_20px_-3px_rgba(161,161,170,0.12)]",
    topStripe: "bg-gradient-to-r from-zinc-500 via-zinc-400 to-stone-600",
    badgeStyle: "bg-zinc-800/90 text-zinc-300 border border-zinc-600/50 shadow-sm",
    icon: ShieldCheck,
    accentColor: "text-zinc-200",
    accentGradient: "text-zinc-200",
    metricCardBg: "bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700/60",
    metricIconColor: "text-zinc-400",
    watermarkColor: "text-zinc-400",
    avatarBorder: "border-zinc-500/70",
    glowDot: "bg-zinc-400",
  },
  Gold: {
    baseBgColor: "#140e05",
    linearGradient: "linear-gradient(135deg, #1b1307 0%, #130e06 50%, #0a0703 100%)",
    outerContainer:
      "bg-gradient-to-br from-[#1b1307] via-[#130e06] to-neutral-950 text-amber-50 border border-amber-500/50 shadow-2xl shadow-amber-950/50 ring-1 ring-amber-400/20",
    ambientBg:
      "radial-gradient(circle at 85% 15%, rgba(245, 158, 11, 0.16), transparent 55%), radial-gradient(circle at 15% 85%, rgba(217, 119, 6, 0.1), transparent 60%)",
    borderGlow:
      "shadow-[0_15px_45px_-10px_rgba(245,158,11,0.28),0_0_25px_2px_rgba(251,191,36,0.18)]",
    topStripe: "bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600",
    badgeStyle:
      "bg-gradient-to-r from-amber-500/25 to-yellow-600/25 text-amber-300 border border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.35)]",
    icon: Award,
    accentColor: "text-amber-300",
    accentGradient: "text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]",
    metricCardBg: "bg-amber-950/30 border border-amber-800/40 hover:border-amber-500/50",
    metricIconColor: "text-amber-400",
    watermarkColor: "text-amber-400/90",
    avatarBorder: "border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.35)]",
    glowDot: "bg-amber-400 shadow-[0_0_6px_#fbbf24]",
  },
  Mythic: {
    baseBgColor: "#08051a",
    linearGradient: "linear-gradient(135deg, #0d0926 0%, #090618 50%, #04020b 100%)",
    outerContainer:
      "bg-gradient-to-br from-[#0d0926] via-[#090618] to-[#04020b] text-indigo-50 border border-indigo-500/60 shadow-2xl shadow-indigo-950/60 ring-1 ring-cyan-500/40",
    ambientBg:
      "radial-gradient(circle at 20% 10%, rgba(99, 102, 241, 0.28), transparent 50%), radial-gradient(circle at 80% 85%, rgba(236, 72, 153, 0.22), transparent 50%)",
    borderGlow:
      "shadow-[0_20px_60px_-5px_rgba(99,102,241,0.45),0_0_35px_rgba(236,72,153,0.3)]",
    topStripe: "bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500",
    badgeStyle:
      "bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 text-cyan-200 border border-cyan-400/60 shadow-[0_0_20px_rgba(99,102,241,0.6)] animate-pulse-slow",
    icon: Sparkles,
    accentColor: "text-cyan-300",
    accentGradient: "text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]",
    metricCardBg: "bg-indigo-950/30 border border-indigo-700/40 hover:border-cyan-400/50",
    metricIconColor: "text-cyan-400",
    watermarkColor: "text-indigo-300/90",
    avatarBorder: "border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.4)]",
    glowDot: "bg-cyan-400 shadow-[0_0_6px_#22d3ee]",
  },
};

export const StatsCard = forwardRef<HTMLDivElement, StatsCardProps>(function StatsCard(
  { data, className, forceTier, customizerOptions },
  ref
) {
  const { user, stats } = data;

  // 1. Calculate raw user tier
  const tierDetails = useMemo(() => {
    if (forceTier) {
      const current = assignTier(stats);
      return { ...current, tier: forceTier };
    }
    return data.tier || assignTier(stats);
  }, [data.tier, stats, forceTier]);

  const activeTier = tierDetails.tier;

  // 2. Resolve Active Visual Theme (City Theme vs Tier Theme)
  const resolvedTheme = useMemo(() => {
    const selectedMode = customizerOptions?.themeMode || "auto";

    if (selectedMode !== "auto" && selectedMode in CITY_THEMES) {
      const city = CITY_THEMES[selectedMode as keyof typeof CITY_THEMES];
      return {
        baseBgColor: city.baseBgColor,
        linearGradient: city.linearGradient,
        outerContainer: city.outerContainer,
        ambientBg: city.ambientBg,
        borderGlow: city.borderGlow,
        topStripe: city.topStripe,
        badgeStyle: city.badgeStyle,
        badgeLabel: tierDetails.badgeLabel || `${activeTier} Tier`,
        accentColor: city.accentColor,
        accentGradient: city.accentGradient,
        metricCardBg: city.metricCardBg,
        metricIconColor: city.metricIconColor,
        watermarkColor: city.watermarkColor,
        avatarBorder: city.avatarBorder,
        glowDot: city.glowDot,
      };
    }

    const tierTheme =
      selectedMode !== "auto" && (selectedMode === "Bronze" || selectedMode === "Gold" || selectedMode === "Mythic")
        ? TIER_THEME_CONFIG[selectedMode]
        : TIER_THEME_CONFIG[activeTier];

    return {
      baseBgColor: tierTheme.baseBgColor,
      linearGradient: tierTheme.linearGradient,
      outerContainer: tierTheme.outerContainer,
      ambientBg: tierTheme.ambientBg,
      borderGlow: tierTheme.borderGlow,
      topStripe: tierTheme.topStripe,
      badgeStyle: tierTheme.badgeStyle,
      badgeLabel: tierDetails.badgeLabel || `${activeTier} Tier`,
      accentColor: tierTheme.accentColor,
      accentGradient: tierTheme.accentGradient,
      metricCardBg: tierTheme.metricCardBg,
      metricIconColor: tierTheme.metricIconColor,
      watermarkColor: tierTheme.watermarkColor,
      avatarBorder: tierTheme.avatarBorder,
      glowDot: tierTheme.glowDot,
    };
  }, [customizerOptions?.themeMode, activeTier, tierDetails.badgeLabel]);

  // 3. Resolve Avatar Frame & Badge Options
  const frameConfig = AVATAR_FRAME_CONFIG[customizerOptions?.avatarFrame || "squircle"];
  const badgeConfig = AVATAR_BADGE_CONFIG[customizerOptions?.avatarBadge || "tier-icon"];
  const bgConfig = CARD_BACKGROUND_CONFIG[customizerOptions?.cardBackground || "ambient-glow"];

  const joinYear = useMemo(() => {
    try {
      return new Date(user.createdAt).getFullYear();
    } catch {
      return null;
    }
  }, [user.createdAt]);

  // Use same-origin avatar proxy with unique username path to avoid CORS/Shields canvas issues
  // and prevent html-to-image from caching and reusing previous users' avatars
  const avatarSrc = useMemo(() => {
    if (user.avatarUrl && user.avatarUrl.startsWith("http")) {
      return `/api/avatar/${encodeURIComponent(user.username)}?url=${encodeURIComponent(user.avatarUrl)}`;
    }
    return user.avatarUrl;
  }, [user.avatarUrl, user.username]);

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: resolvedTheme.baseBgColor,
        backgroundImage: `${resolvedTheme.ambientBg}, ${resolvedTheme.linearGradient}`,
        colorScheme: "dark",
      }}
      className={cn(
        "relative w-full max-w-[540px] rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 overflow-hidden select-none transition-all duration-300",
        resolvedTheme.outerContainer,
        resolvedTheme.borderGlow,
        className
      )}
    >
      {/* Background Texture Overlay (Cyber Grid, Mesh, or Glassmorphic) */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl transition-opacity",
          bgConfig.overlayClass
        )}
        style={bgConfig.overlayStyle}
      />

      {/* Decorative Top Accent Stripe */}
      <div className={cn("absolute top-0 left-0 right-0 h-1 z-10", resolvedTheme.topStripe)} />

      {/* Header: User Avatar, Name, Handle, and Badge */}
      <div className="relative z-10 flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="relative flex-shrink-0">
            {/* User Avatar with selected Frame Shape */}
            <div className={cn("overflow-hidden transition-all", frameConfig.wrapperClassName)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={user.username}
                src={avatarSrc}
                alt={user.name || user.username}
                crossOrigin="anonymous"
                onError={(e) => {
                  // Fallback to direct avatarUrl if proxy fails
                  if (e.currentTarget.src !== user.avatarUrl) {
                    e.currentTarget.src = user.avatarUrl;
                  }
                }}
                className={cn(
                  "w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 object-cover border-2 shadow-md transition-all",
                  frameConfig.imgClassName,
                  resolvedTheme.avatarBorder
                )}
              />
            </div>

            {/* Custom Avatar Badge */}
            <div
              className={cn(
                "absolute -bottom-1 -right-1 sm:-bottom-1.5 sm:-right-1.5 p-0.5 sm:p-1 rounded-full text-white shadow-md bg-zinc-900 border border-white/20 transition-all scale-90 sm:scale-100",
                resolvedTheme.glowDot
              )}
            >
              {badgeConfig.renderIcon(activeTier)}
            </div>
          </div>

          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight truncate text-white">
              {user.name || user.username}
            </h2>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-zinc-400 flex-wrap">
              <span className="font-mono text-zinc-300">@{user.username}</span>
              {joinYear && (
                <>
                  <span className="opacity-40">•</span>
                  <span className="flex items-center gap-1 text-[11px] sm:text-xs text-zinc-400">
                    <Calendar className="w-3 h-3" />
                    {joinYear}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Theme or Tier Badge */}
        <div
          className={cn(
            "flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase backdrop-blur-md flex-shrink-0 shadow-sm",
            resolvedTheme.badgeStyle
          )}
        >
          {badgeConfig.renderIcon(activeTier)}
          <span>{resolvedTheme.badgeLabel}</span>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="relative z-10 mt-3 sm:mt-4 text-xs md:text-sm text-zinc-300/90 line-clamp-2 leading-relaxed">
          &ldquo;{user.bio}&rdquo;
        </p>
      )}

      {/* Rank Classification Box */}
      <div className="relative z-10 mt-3.5 sm:mt-5 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] sm:text-xs uppercase font-mono tracking-wider text-zinc-400">
            Rank Classification
          </span>
          <span className={cn("text-[10px] sm:text-xs font-bold font-mono tracking-wider", resolvedTheme.accentGradient)}>
            Score: {tierDetails.score.toLocaleString()} pts
          </span>
        </div>
        <div className={cn("text-sm sm:text-base font-extrabold mt-0.5", resolvedTheme.accentGradient)}>
          {tierDetails.title}
        </div>
        <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-1 leading-snug">
          {tierDetails.description}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="relative z-10 grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
        {/* Stars */}
        <div className={cn("p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl transition-colors backdrop-blur-sm", resolvedTheme.metricCardBg)}>
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] sm:text-[11px] font-medium tracking-wide">Total Stars</span>
            <Star className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current/20", resolvedTheme.metricIconColor)} />
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white font-mono">
            {formatNumber(stats.totalStars)}
          </div>
          <span className="text-[9px] sm:text-[10px] text-zinc-400 font-mono truncate block">earned across repos</span>
        </div>

        {/* Followers */}
        <div className={cn("p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl transition-colors backdrop-blur-sm", resolvedTheme.metricCardBg)}>
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] sm:text-[11px] font-medium tracking-wide">Followers</span>
            <Users className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", resolvedTheme.metricIconColor)} />
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white font-mono">
            {formatNumber(stats.followers)}
          </div>
          <span className="text-[9px] sm:text-[10px] text-zinc-400 font-mono truncate block">developer reach</span>
        </div>

        {/* Repositories */}
        <div className={cn("p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl transition-colors backdrop-blur-sm", resolvedTheme.metricCardBg)}>
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] sm:text-[11px] font-medium tracking-wide">Repositories</span>
            <GitFork className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", resolvedTheme.metricIconColor)} />
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white font-mono">
            {formatNumber(stats.publicRepos)}
          </div>
          <span className="text-[9px] sm:text-[10px] text-zinc-400 font-mono truncate block">public projects</span>
        </div>

        {/* Active Contributions */}
        <div className={cn("p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl transition-colors backdrop-blur-sm", resolvedTheme.metricCardBg)}>
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] sm:text-[11px] font-medium tracking-wide">Active Activity</span>
            <Flame className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current/20", resolvedTheme.metricIconColor)} />
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white font-mono">
            {formatNumber(stats.activeContributions)}
          </div>
          <span className="text-[9px] sm:text-[10px] text-zinc-400 font-mono truncate block">recent contributions</span>
        </div>
      </div>

      {/* Footer: Verified & Watermark */}
      <div className="relative z-10 mt-3.5 sm:mt-5 pt-2.5 sm:pt-3 border-t border-white/10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-zinc-400 text-[9px] sm:text-[11px]">
          <span>Verified via GitHub API</span>
        </div>

        {/* Watermark */}
        <div
          className={cn(
            "flex items-center gap-1 sm:gap-1.5 text-[8.5px] sm:text-[10px] font-mono select-none transition-opacity",
            resolvedTheme.watermarkColor
          )}
        >
          <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", resolvedTheme.glowDot)} />
          <span className="font-semibold tracking-normal lowercase">mygitstats.dev</span>
          <span className="opacity-40">•</span>
          <span className="opacity-80 tracking-wider uppercase">verified tier</span>
        </div>
      </div>
    </div>
  );
});
