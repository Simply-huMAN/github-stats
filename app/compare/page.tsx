import React from "react";
import { ComparisonArena } from "@/components/compare/ComparisonArena";
import { Swords, Sparkles, Shield, Trophy } from "lucide-react";

export default function CompareHubPage() {
  return (
    <main className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col items-center px-4 py-10 md:py-16 selection:bg-amber-500/30">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full bg-gradient-to-tr from-amber-600/10 via-orange-600/10 to-yellow-500/10 blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        {/* Hero Tagline */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono font-semibold mb-4 backdrop-blur-md">
          <Swords className="w-3.5 h-3.5 text-amber-400" />
          <span>Head-to-Head Developer Battle Arena</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight text-center max-w-3xl leading-tight">
          Compare GitHub Developers{" "}
          <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
            Side-by-Side
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-zinc-400 text-center max-w-xl leading-relaxed mb-8">
          Match any two GitHub profiles. Compare weighted performance tiers, repository stars,
          follower impact, and contribution velocity in real time.
        </p>

        {/* Comparison Arena Component */}
        <ComparisonArena initialUser1="torvalds" initialUser2="shadcn" />
      </div>
    </main>
  );
}
