"use client";

import React, { useState, useRef, FormEvent } from "react";
import { StatsResponse, TierType } from "@/types/stats";
import { StatsCard } from "@/components/StatsCard";
import { DownloadButton } from "@/components/DownloadButton";
import {
  Search,
  Github,
  AlertCircle,
  Sparkles,
  Award,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

const INITIAL_DEMO_DATA: StatsResponse = {
  user: {
    username: "leerob",
    name: "Lee Robinson",
    avatarUrl: "https://avatars.githubusercontent.com/u/9113740?v=4",
    bio: "VP of Product at Vercel. Helping developers build the web faster.",
    company: "Vercel",
    location: "Des Moines, IA",
    blog: "https://leerob.io",
    twitterUsername: "leeerob",
    createdAt: "2014-10-14T20:25:29Z",
    htmlUrl: "https://github.com/leerob",
  },
  stats: {
    followers: 38400,
    publicRepos: 128,
    totalStars: 14500,
    activeContributions: 320,
  },
  tier: {
    tier: "Mythic",
    score: 101250,
    title: "Legendary Architect",
    badgeLabel: "MYTHIC TIER",
    description: "Elite open-source presence, prolific builder, and influential ecosystem champion.",
    colors: {
      badgeBg: "bg-indigo-950/80 backdrop-blur-md",
      badgeText: "text-cyan-300",
      badgeBorder: "border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.5)]",
      gradient: "from-indigo-950/90 via-purple-950/60 to-black",
      glow: "shadow-glow-mythic border-indigo-500/60 ring-1 ring-cyan-500/30",
      textAccent: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400",
      cardBorder: "border-indigo-500/50",
    },
  },
  fetchedAt: new Date().toISOString(),
};

export default function HomePage() {
  const [usernameInput, setUsernameInput] = useState("leerob");
  const [statsData, setStatsData] = useState<StatsResponse>(INITIAL_DEMO_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tierOverride, setTierOverride] = useState<TierType | undefined>(undefined);

  const cardRef = useRef<HTMLDivElement>(null);

  async function fetchStats(userToFetch: string) {
    if (!userToFetch.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/stats?username=${encodeURIComponent(userToFetch.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Failed to fetch GitHub stats");
      }

      setStatsData(data);
      setTierOverride(undefined);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    fetchStats(usernameInput);
  }

  return (
    <main className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col items-center px-4 py-12 md:py-16 selection:bg-indigo-500/40">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-amber-500/10 blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-xs font-mono text-zinc-300">
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Stats &amp; Tier Showcase</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            Developer Performance Tiers
          </h1>
          <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto">
            Calculate your public GitHub tier (Bronze, Gold, Mythic), preview bespoke styling, and export high-resolution PNG cards.
          </p>
        </div>

        <form onSubmit={handleSearch} className="w-full max-w-md flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Enter GitHub username (e.g. torvalds)"
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !usernameInput.trim()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Fetch"}
          </button>
        </form>

        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-8 flex-wrap justify-center">
          <span>Try quick samples:</span>
          {["shadcn", "torvalds", "kentcdodds", "octocat"].map((handle) => (
            <button
              key={handle}
              type="button"
              onClick={() => {
                setUsernameInput(handle);
                fetchStats(handle);
              }}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-mono transition-colors"
            >
              @{handle}
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="w-full max-w-md mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
            <div className="leading-relaxed">
              <span className="font-semibold block">Failed to fetch stats</span>
              {errorMessage}
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 text-xs">
          <span className="text-zinc-500 font-mono px-2 text-[11px]">Theme Preview:</span>
          <button
            type="button"
            onClick={() => setTierOverride(undefined)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              tierOverride === undefined
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Auto ({statsData.tier.tier})
          </button>
          <button
            type="button"
            onClick={() => setTierOverride("Bronze")}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
              tierOverride === "Bronze"
                ? "bg-zinc-700 text-zinc-100 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            Bronze
          </button>
          <button
            type="button"
            onClick={() => setTierOverride("Gold")}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
              tierOverride === "Gold"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Gold
          </button>
          <button
            type="button"
            onClick={() => setTierOverride("Mythic")}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
              tierOverride === "Mythic"
                ? "bg-indigo-500/20 text-cyan-300 border border-indigo-500/30 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Mythic
          </button>
        </div>

        <div className="w-full flex justify-center py-2">
          <StatsCard
            ref={cardRef}
            data={statsData}
            forceTier={tierOverride}
          />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <DownloadButton
            cardRef={cardRef}
            username={statsData.user.username}
            tier={tierOverride || statsData.tier.tier}
          />
        </div>

        <div className="mt-14 text-center text-xs text-zinc-600 max-w-md space-y-2">
          <p>
            Scores weighted across followers, stargazers, repos, and estimated 90-day active contributions.
          </p>
          <p className="font-mono text-[11px] text-zinc-500">
            Exported cards include 3x retina pixel ratio and CORS-safe avatar rendering.
          </p>
        </div>
      </div>
    </main>
  );
}
