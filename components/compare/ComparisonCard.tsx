"use client";

import React from "react";
import Image from "next/image";
import { StatsResponse } from "@/types/stats";
import { Crown, Trophy, ExternalLink, Calendar, MapPin, Building2, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonCardProps {
  data: StatsResponse;
  isOverallWinner: boolean;
  winsCount: number;
  contenderLabel: string;
}

export function ComparisonCard({
  data,
  isOverallWinner,
  winsCount,
  contenderLabel,
}: ComparisonCardProps) {
  const { user, stats, tier } = data;

  const joinYear = new Date(user.createdAt).getFullYear();

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-5 sm:p-6 backdrop-blur-xl transition-all duration-300",
        "bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 shadow-xl",
        isOverallWinner
          ? "border-amber-500/60 shadow-amber-500/10 ring-1 ring-amber-500/30"
          : "border-zinc-800/80 shadow-black/40"
      )}
    >
      {/* Contender Header Pill */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold px-2 py-0.5 rounded-md bg-zinc-800/60 border border-zinc-700/50">
          {contenderLabel}
        </span>

        {isOverallWinner && (
          <span className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
            <Crown className="w-3.5 h-3.5" />
            Showdown Winner ({winsCount} Wins)
          </span>
        )}
      </div>

      {/* Avatar & Identity */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <div
            className={cn(
              "relative h-18 w-18 sm:h-20 sm:w-20 rounded-2xl overflow-hidden border-2 shadow-md",
              isOverallWinner ? "border-amber-400 shadow-amber-500/20" : "border-zinc-700"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatarUrl}
              alt={user.name || user.username}
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
          {isOverallWinner && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-tr from-amber-500 to-yellow-300 text-zinc-950 p-1 rounded-full shadow-lg">
              <Trophy className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-lg sm:text-xl font-bold text-white truncate">
              {user.name || user.username}
            </h3>
            <a
              href={user.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Open GitHub profile"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-xs sm:text-sm font-mono text-zinc-400 truncate">@{user.username}</p>

          {/* Tier Badge */}
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-md shadow-sm">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                tier.tier === "Mythic" && "bg-cyan-400 shadow-[0_0_8px_#22d3ee]",
                tier.tier === "Gold" && "bg-amber-400 shadow-[0_0_8px_#fbbf24]",
                tier.tier === "Bronze" && "bg-zinc-400"
              )}
            />
            <span className={cn("text-[11px]", tier.colors.badgeText)}>
              {tier.badgeLabel} • {tier.score.toLocaleString()} pts
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 mb-4 leading-relaxed italic">
          &ldquo;{user.bio}&rdquo;
        </p>
      )}

      {/* Profile Metadata Tags */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/80 mt-auto">
        {user.location && (
          <span className="flex items-center gap-1 truncate max-w-[140px]">
            <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
            {user.location}
          </span>
        )}
        {user.company && (
          <span className="flex items-center gap-1 truncate max-w-[140px]">
            <Building2 className="w-3 h-3 text-zinc-500 shrink-0" />
            {user.company}
          </span>
        )}
        <span className="flex items-center gap-1 ml-auto">
          <Calendar className="w-3 h-3 text-zinc-500" />
          Member since {joinYear}
        </span>
      </div>
    </div>
  );
}
