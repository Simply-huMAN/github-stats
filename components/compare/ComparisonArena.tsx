"use client";

import React, { useState, useRef, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ComparisonResult, ComparisonError } from "@/types/compare";
import { validateComparisonPair, GITHUB_USERNAME_REGEX } from "@/lib/validation";
import { ComparisonCard } from "./ComparisonCard";
import { ComparisonMetricsTable } from "./ComparisonMetricsTable";
import { BattleCardDownload } from "./BattleCardDownload";
import {
  Swords,
  ArrowLeftRight,
  Share2,
  Check,
  Sparkles,
  AlertCircle,
  Loader2,
  Trophy,
  Flame,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TRENDING_MATCHUPS = [
  { u1: "torvalds", u2: "antirez", label: "Linux vs Redis" },
  { u1: "shadcn", u2: "leerob", label: "Modern React & UI" },
  { u1: "yyx990803", u2: "evanw", label: "Vue vs esbuild" },
  { u1: "gaearon", u2: "tj", label: "Redux vs Express" },
];

interface ComparisonArenaProps {
  initialData?: ComparisonResult | null;
  initialUser1?: string;
  initialUser2?: string;
  initialError?: string | null;
}

export function ComparisonArena({
  initialData = null,
  initialUser1 = "torvalds",
  initialUser2 = "shadcn",
  initialError = null,
}: ComparisonArenaProps) {
  const router = useRouter();

  const [user1Input, setUser1Input] = useState(initialUser1);
  const [user2Input, setUser2Input] = useState(initialUser2);
  const [comparison, setComparison] = useState<ComparisonResult | null>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData && Boolean(initialUser1 && initialUser2));
  const [error, setError] = useState<string | null>(initialError);
  const [copiedLink, setCopiedLink] = useState(false);

  const arenaRef = useRef<HTMLDivElement>(null);

  // Fetch comparison data when requested
  async function executeComparison(u1: string, u2: string) {
    const val = validateComparisonPair(u1, u2);
    if (!val.isValid) {
      setError(val.error || "Please provide two valid GitHub usernames.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/compare?u1=${encodeURIComponent(val.user1)}&u2=${encodeURIComponent(val.user2)}`);
      const data = await res.json();

      if (!res.ok) {
        const errData = data as ComparisonError;
        setError(errData.error || errData.details || "Failed to compare developers.");
        setComparison(null);
      } else {
        setComparison(data as ComparisonResult);
        setError(null);
      }
    } catch (err: unknown) {
      setError("Network error while connecting to comparison engine.");
      setComparison(null);
    } finally {
      setIsLoading(false);
    }
  }

  // Load initial comparison if not passed from server
  useEffect(() => {
    if (!initialData && initialUser1 && initialUser2) {
      executeComparison(initialUser1, initialUser2);
    }
  }, [initialData, initialUser1, initialUser2]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const val = validateComparisonPair(user1Input, user2Input);
    if (!val.isValid) {
      setError(val.error || "Please provide two valid GitHub usernames.");
      return;
    }
    // Navigate to canonical SEO dynamic route
    router.push(`/compare/${val.user1}/vs/${val.user2}`);
    executeComparison(val.user1, val.user2);
  }

  function handleSwap() {
    const temp = user1Input;
    setUser1Input(user2Input);
    setUser2Input(temp);

    if (comparison) {
      const val = validateComparisonPair(user2Input, temp);
      if (val.isValid) {
        router.push(`/compare/${val.user1}/vs/${val.user2}`);
        executeComparison(val.user1, val.user2);
      }
    }
  }

  function handleSelectMatchup(u1: string, u2: string) {
    setUser1Input(u1);
    setUser2Input(u2);
    router.push(`/compare/${u1}/vs/${u2}`);
    executeComparison(u1, u2);
  }

  function handleCopyShareLink() {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Search & Matchmaking Controls */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl mb-8 p-3 sm:p-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3"
      >
        {/* User 1 Input */}
        <div className="relative w-full sm:flex-1">
          <input
            type="text"
            value={user1Input}
            onChange={(e) => setUser1Input(e.target.value)}
            placeholder="Contender 1 (e.g. torvalds)"
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/60 text-white placeholder-zinc-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            required
          />
        </div>

        {/* Swap Button */}
        <button
          type="button"
          onClick={handleSwap}
          className="p-2.5 rounded-xl border border-zinc-700/60 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all active:scale-95 shrink-0"
          title="Swap contenders"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>

        {/* User 2 Input */}
        <div className="relative w-full sm:flex-1">
          <input
            type="text"
            value={user2Input}
            onChange={(e) => setUser2Input(e.target.value)}
            placeholder="Contender 2 (e.g. shadcn)"
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/60 text-white placeholder-zinc-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            required
          />
        </div>

        {/* Submit Battle Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
          ) : (
            <Swords className="w-4 h-4 text-zinc-950" />
          )}
          <span>Battle!</span>
        </button>
      </form>

      {/* Error Alert */}
      {error && (
        <div className="w-full max-w-2xl mb-8 p-4 rounded-xl border border-rose-500/40 bg-rose-950/30 text-rose-300 flex items-start gap-3 backdrop-blur-md">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <div className="flex-1 text-sm">
            <p className="font-semibold text-rose-200">Comparison Check</p>
            <p className="text-rose-300/90 text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="w-full max-w-4xl py-16 flex flex-col items-center justify-center gap-4">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 animate-pulse shadow-glow-gold">
            <Swords className="w-8 h-8 text-amber-400 animate-bounce" />
          </div>
          <p className="text-sm font-mono text-zinc-400">
            Analyzing GitHub profiles & computing showdown metrics...
          </p>
        </div>
      )}

      {/* Showdown Result Arena */}
      {!isLoading && comparison && (
        <div className="w-full max-w-4xl flex flex-col gap-6 animate-fade-in">
          {/* Winner Headline Banner */}
          <div className="w-full p-4 sm:p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-zinc-950 to-orange-950/40 text-center flex flex-col items-center shadow-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{comparison.summary.winMargin}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight">
              {comparison.summary.headline}
            </h2>
          </div>

          {/* Exportable Battle Arena Ref Target */}
          <div
            ref={arenaRef}
            className="w-full p-4 sm:p-6 rounded-3xl border border-zinc-800 bg-[#070709] shadow-2xl flex flex-col gap-6"
          >
            {/* Contender Cards Face-Off Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative">
              {/* User 1 Card */}
              <ComparisonCard
                data={comparison.user1}
                isOverallWinner={comparison.summary.overallWinner === 1}
                winsCount={comparison.summary.user1Wins}
                contenderLabel="Contender 1"
              />

              {/* Central VS Badge (Floating on desktop) */}
              <div
                data-export-ignore="false"
                className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full bg-zinc-950 border-2 border-amber-500/60 shadow-xl shadow-amber-500/20 text-amber-400 font-extrabold font-mono text-sm"
              >
                VS
              </div>

              {/* User 2 Card */}
              <ComparisonCard
                data={comparison.user2}
                isOverallWinner={comparison.summary.overallWinner === 2}
                winsCount={comparison.summary.user2Wins}
                contenderLabel="Contender 2"
              />
            </div>

            {/* Metrics Breakdown Table */}
            <ComparisonMetricsTable
              metrics={comparison.metrics}
              user1Name={comparison.user1.user.name || comparison.user1.user.username}
              user2Name={comparison.user2.user.name || comparison.user2.user.username}
            />

            {/* Watermark in Exported PNG */}
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-zinc-900">
              <span>mygitstats.dev • verified developer showdown</span>
              <span>{new Date(comparison.comparedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Social Actions & Export Toolbar */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 pt-2">
            <button
              onClick={handleCopyShareLink}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-700/60 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs sm:text-sm transition-all active:scale-95 shadow-sm"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied Battle Link!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-zinc-400" />
                  <span>Share Battle</span>
                </>
              )}
            </button>

            <BattleCardDownload
              arenaRef={arenaRef}
              user1={comparison.user1.user.username}
              user2={comparison.user2.user.username}
            />
          </div>
        </div>
      )}

      {/* Trending Showdowns Section */}
      <div className="w-full max-w-4xl mt-16 pt-10 border-t border-zinc-800/80">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-mono uppercase tracking-wider font-bold text-zinc-300">
            Popular Open-Source Showdowns
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {TRENDING_MATCHUPS.map((match) => (
            <button
              key={`${match.u1}-${match.u2}`}
              onClick={() => handleSelectMatchup(match.u1, match.u2)}
              className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-950 hover:bg-zinc-900/60 hover:border-amber-500/40 text-left transition-all group flex flex-col gap-1"
            >
              <span className="text-xs font-bold text-zinc-200 group-hover:text-amber-300 transition-colors">
                {match.u1} <span className="text-zinc-500 font-normal">vs</span> {match.u2}
              </span>
              <span className="text-[11px] text-zinc-500 line-clamp-1">{match.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
