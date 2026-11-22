"use client";

import React from "react";
import { StatsResponse } from "@/types/stats";
import { Crown, Trophy, ExternalLink, Calendar, MapPin, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonCardProps {
  data: StatsResponse;
  isOverallWinner: boolean;
  winsCount: number;
  contenderLabel: string;
  colorTheme?: "indigo" | "amber";
}

export function ComparisonCard({
  data,
  isOverallWinner,
  winsCount,
  contenderLabel,
  colorTheme = "indigo",
}: ComparisonCardProps) {
  const { user, stats, tier } = data;
  const joinYear = new Date(user.createdAt).getFullYear();
  const isIndigo = colorTheme === "indigo";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-4 sm:p-6 backdrop-blur-xl transition-all duration-300",
        "bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 shadow-xl",
        isOverallWinner
          ? isIndigo
            ? "border-indigo-500/60 shadow-indigo-500/10 ring-1 ring-indigo-500/30"
            : "border-amber-500/60 shadow-amber-500/10 ring-1 ring-amber-500/30"
          : "border-zinc-800/80 shadow-black/40"
      )}
    >
      {/* Contender Header Pill & Winner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
        <span
          className={cn(
            "text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md border",
            isIndigo
              ? "text-indigo-300 bg-indigo-500/10 border-indigo-500/30"
              : "text-amber-300 bg-amber-500/10 border-amber-500/30"
          )}
        >
          {contenderLabel}
        </span>

        {isOverallWinner && (
          <span
            className={cn(
              "flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full border shadow-sm animate-pulse",
              isIndigo
                ? "text-indigo-300 bg-indigo-500/20 border-indigo-500/40"
                : "text-amber-300 bg-amber-500/20 border-amber-500/40"
            )}
          >
            <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Showdown Winner ({winsCount} Wins)
          </span>
        )}
      </div>

      {/* Avatar & Identity */}
      <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="relative shrink-0">
          <div
            className={cn(
              "relative h-14 w-14 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl overflow-hidden border-2 shadow-md",
              isOverallWinner
                ? isIndigo
                  ? "border-indigo-400 shadow-indigo-500/20"
                  : "border-amber-400 shadow-amber-500/20"
                : "border-zinc-700"
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
            <div
              className={cn(
                "absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 p-1 rounded-full shadow-lg",
                isIndigo
                  ? "bg-gradient-to-tr from-indigo-500 to-cyan-300 text-white"
                  : "bg-gradient-to-tr from-amber-500 to-yellow-300 text-zinc-950"
              )}
            >
              <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-base sm:text-xl font-bold text-white truncate max-w-[calc(100%-48px)]">
              {user.name || user.username}
            </h3>
            <a
              href={user.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] min-w-[44px] -m-2 p-2 flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800/60 active:scale-95 shrink-0"
              title={`Open @${user.username}'s GitHub profile`}
              aria-label={`Open @${user.username}'s GitHub profile`}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <p
            className={cn(
              "text-xs sm:text-sm font-mono truncate font-medium",
              isIndigo ? "text-indigo-400/90" : "text-amber-400/90"
            )}
          >
            @{user.username}
          </p>

          {/* Tier Badge */}
          <div className="mt-1.5 sm:mt-2 inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold border backdrop-blur-md shadow-sm">
            <span
              className={cn(
                "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full",
                tier.tier === "Mythic" && "bg-cyan-400 shadow-[0_0_8px_#22d3ee]",
                tier.tier === "Gold" && "bg-amber-400 shadow-[0_0_8px_#fbbf24]",
                tier.tier === "Bronze" && "bg-zinc-400"
              )}
            />
            <span className={cn("text-[10px] sm:text-[11px]", tier.colors.badgeText)}>
              {tier.badgeLabel} • {tier.score.toLocaleString()} pts
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 mb-3 sm:mb-4 leading-relaxed italic">
          &ldquo;{user.bio}&rdquo;
        </p>
      )}

      {/* Profile Metadata Tags */}
      <div className="flex flex-wrap items-center justify-between gap-y-1 gap-x-2 text-[10px] sm:text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/80 mt-auto">
        <div className="flex flex-wrap items-center gap-2">
          {user.location && (
            <span className="flex items-center gap-1 truncate max-w-[110px] sm:max-w-[140px]">
              <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
              {user.location}
            </span>
          )}
          {user.company && (
            <span className="flex items-center gap-1 truncate max-w-[110px] sm:max-w-[140px]">
              <Building2 className="w-3 h-3 text-zinc-500 shrink-0" />
              {user.company}
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 shrink-0">
          <Calendar className="w-3 h-3 text-zinc-500" />
          Since {joinYear}
        </span>
      </div>
    </div>
  );
}
