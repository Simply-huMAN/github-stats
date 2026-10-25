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
import { assignTier } from "@/lib/tier";
import { cn } from "@/lib/utils";

export interface StatsCardProps {
  data: StatsResponse;
  className?: string;
  forceTier?: TierType;
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
    outerContainer: string;
    ambientBg: string;
    borderGlow: string;
    badgeStyle: string;
    icon: React.ComponentType<{ className?: string }>;
    accentGradient: string;
    metricCardBg: string;
    metricIconColor: string;
    watermarkColor: string;
  }
> = {
  Bronze: {
    outerContainer:
      "bg-gradient-to-br from-zinc-900 via-[#18181b] to-neutral-950 text-zinc-100 border border-zinc-700/60 shadow-xl shadow-zinc-950/80",
    ambientBg: "radial-gradient(circle at 85% 15%, rgba(161, 161, 170, 0.08), transparent 60%)",
    borderGlow: "shadow-[0_10px_35px_-10px_rgba(0,0,0,0.8),0_0_20px_-3px_rgba(161,161,170,0.12)]",
    badgeStyle:
      "bg-zinc-800/90 text-zinc-300 border border-zinc-600/50 shadow-sm",
    icon: ShieldCheck,
    accentGradient:
      "text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-stone-300 to-zinc-400",
    metricCardBg: "bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700/60",
    metricIconColor: "text-zinc-400",
    watermarkColor: "text-zinc-500/80",
  },
  Gold: {
    outerContainer:
      "bg-gradient-to-br from-[#1b1307] via-[#130e06] to-neutral-950 text-amber-50 border border-amber-500/50 shadow-2xl shadow-amber-950/50 ring-1 ring-amber-400/20",
    ambientBg:
      "radial-gradient(circle at 85% 15%, rgba(245, 158, 11, 0.16), transparent 55%), radial-gradient(circle at 15% 85%, rgba(217, 119, 6, 0.1), transparent 60%)",
    borderGlow:
      "shadow-[0_15px_45px_-10px_rgba(245,158,11,0.28),0_0_25px_2px_rgba(251,191,36,0.18)]",
    badgeStyle:
      "bg-gradient-to-r from-amber-500/25 to-yellow-600/25 text-amber-300 border border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.35)]",
    icon: Award,
    accentGradient:
      "text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400",
    metricCardBg:
      "bg-amber-950/30 border border-amber-800/40 hover:border-amber-500/50",
    metricIconColor: "text-amber-400",
    watermarkColor: "text-amber-500/70",
  },
  Mythic: {
    outerContainer:
      "bg-gradient-to-br from-[#0d0926] via-[#090618] to-[#04020b] text-indigo-50 border border-indigo-500/60 shadow-2xl shadow-indigo-950/60 ring-1 ring-cyan-500/40",
    ambientBg:
      "radial-gradient(circle at 20% 10%, rgba(99, 102, 241, 0.28), transparent 50%), radial-gradient(circle at 80% 85%, rgba(236, 72, 153, 0.22), transparent 50%), radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.12), transparent 65%)",
    borderGlow:
      "shadow-[0_20px_60px_-5px_rgba(99,102,241,0.45),0_0_35px_rgba(236,72,153,0.3)]",
    badgeStyle:
      "bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 text-cyan-200 border border-cyan-400/60 shadow-[0_0_20px_rgba(99,102,241,0.6)] animate-pulse-slow",
    icon: Sparkles,
    accentGradient:
      "text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-200 to-fuchsia-300",
    metricCardBg:
      "bg-indigo-950/30 border border-indigo-700/40 hover:border-cyan-400/50",
    metricIconColor: "text-cyan-400",
    watermarkColor: "text-indigo-400/80",
  },
};

export const StatsCard = forwardRef<HTMLDivElement, StatsCardProps>(function StatsCard(
  { data, className, forceTier },
  ref
) {
  const { user, stats } = data;

  const tierDetails = useMemo(() => {
    if (forceTier) {
      const current = assignTier(stats);
      return { ...current, tier: forceTier };
    }
    return data.tier || assignTier(stats);
  }, [data.tier, stats, forceTier]);

  const activeTier = tierDetails.tier;
  const theme = TIER_THEME_CONFIG[activeTier];
  const TierIcon = theme.icon;

  const joinYear = useMemo(() => {
    try {
      return new Date(user.createdAt).getFullYear();
    } catch {
      return null;
    }
  }, [user.createdAt]);

  return (
    <div
      ref={ref}
      style={{ backgroundImage: theme.ambientBg }}
      className={cn(
        "relative w-full max-w-[540px] rounded-3xl p-7 md:p-8 overflow-hidden select-none transition-all duration-300",
        theme.outerContainer,
        theme.borderGlow,
        className
      )}
    >
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1",
          activeTier === "Mythic" &&
            "bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500",
          activeTier === "Gold" &&
            "bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600",
          activeTier === "Bronze" &&
            "bg-gradient-to-r from-zinc-500 via-zinc-400 to-stone-600"
        )}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatarUrl}
              alt={user.name || user.username}
              crossOrigin="anonymous"
              className={cn(
                "w-16 h-16 md:w-18 md:h-18 rounded-2xl object-cover border-2 shadow-md",
                activeTier === "Mythic" && "border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.4)]",
                activeTier === "Gold" && "border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.35)]",
                activeTier === "Bronze" && "border-zinc-500/70"
              )}
            />
            <div
              className={cn(
                "absolute -bottom-1.5 -right-1.5 p-1 rounded-full text-white shadow-sm",
                activeTier === "Mythic" && "bg-indigo-600 ring-2 ring-cyan-400/50",
                activeTier === "Gold" && "bg-amber-600 ring-2 ring-yellow-400/50",
                activeTier === "Bronze" && "bg-zinc-700 ring-2 ring-zinc-500/50"
              )}
            >
              <TierIcon className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight truncate text-white">
              {user.name || user.username}
            </h2>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span className="font-mono text-zinc-400">@{user.username}</span>
              {joinYear && (
                <>
                  <span className="opacity-40">•</span>
                  <span className="flex items-center gap-1 text-xs text-zinc-400">
                    <Calendar className="w-3 h-3" />
                    {joinYear}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase backdrop-blur-md flex-shrink-0",
            theme.badgeStyle
          )}
        >
          <TierIcon className="w-3.5 h-3.5" />
          <span>{tierDetails.badgeLabel || `${activeTier} Tier`}</span>
        </div>
      </div>

      {user.bio && (
        <p className="mt-4 text-xs md:text-sm text-zinc-300/90 line-clamp-2 leading-relaxed">
          &ldquo;{user.bio}&rdquo;
        </p>
      )}

      <div className="mt-5 p-3.5 rounded-2xl bg-black/30 backdrop-blur-sm border border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-mono tracking-wider text-zinc-400">
            Rank Classification
          </span>
          <span className={cn("text-xs font-bold font-mono tracking-wider", theme.accentGradient)}>
            Score: {tierDetails.score.toLocaleString()} pts
          </span>
        </div>
        <div className={cn("text-base font-extrabold mt-0.5", theme.accentGradient)}>
          {tierDetails.title}
        </div>
        <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
          {tierDetails.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className={cn("p-3.5 rounded-2xl transition-colors", theme.metricCardBg)}>
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-medium tracking-wide">Total Stars</span>
            <Star className={cn("w-4 h-4 fill-current/20", theme.metricIconColor)} />
          </div>
          <div className="text-xl md:text-2xl font-black tracking-tight text-white font-mono">
            {formatNumber(stats.totalStars)}
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">earned across repos</span>
        </div>

        <div className={cn("p-3.5 rounded-2xl transition-colors", theme.metricCardBg)}>
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-medium tracking-wide">Followers</span>
            <Users className={cn("w-4 h-4", theme.metricIconColor)} />
          </div>
          <div className="text-xl md:text-2xl font-black tracking-tight text-white font-mono">
            {formatNumber(stats.followers)}
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">developer reach</span>
        </div>

        <div className={cn("p-3.5 rounded-2xl transition-colors", theme.metricCardBg)}>
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-medium tracking-wide">Repositories</span>
            <GitFork className={cn("w-4 h-4", theme.metricIconColor)} />
          </div>
          <div className="text-xl md:text-2xl font-black tracking-tight text-white font-mono">
            {formatNumber(stats.publicRepos)}
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">public projects</span>
        </div>

        <div className={cn("p-3.5 rounded-2xl transition-colors", theme.metricCardBg)}>
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-medium tracking-wide">Active Activity</span>
            <Flame className={cn("w-4 h-4 fill-current/20", theme.metricIconColor)} />
          </div>
          <div className="text-xl md:text-2xl font-black tracking-tight text-white font-mono">
            {formatNumber(stats.activeContributions)}
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">recent contributions</span>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
          <span>Verified via GitHub API</span>
        </div>

        <div
          className={cn(
            "flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase select-none transition-opacity",
            theme.watermarkColor
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              activeTier === "Mythic" && "bg-cyan-400 shadow-[0_0_6px_#22d3ee]",
              activeTier === "Gold" && "bg-amber-400 shadow-[0_0_6px_#fbbf24]",
              activeTier === "Bronze" && "bg-zinc-400"
            )}
          />
          <span className="font-semibold">gitstats.dev</span>
          <span className="opacity-40">•</span>
          <span className="opacity-80">verified tier</span>
        </div>
      </div>
    </div>
  );
});
