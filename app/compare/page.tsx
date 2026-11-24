import React from "react";
import { ComparisonArena } from "@/components/compare/ComparisonArena";
import { sanitizeGitHubUsername } from "@/lib/validation";
import { Swords } from "lucide-react";

export const dynamic = "force-dynamic";

interface CompareHubPageProps {
  searchParams?: {
    user1?: string;
    u1?: string;
    user2?: string;
    u2?: string;
    user?: string;
  };
}

export default function CompareHubPage({ searchParams }: CompareHubPageProps) {
  const rawU1 = searchParams?.user1 || searchParams?.u1 || searchParams?.user || "";
  const rawU2 = searchParams?.user2 || searchParams?.u2 || "";

  const initialUser1 = rawU1 ? sanitizeGitHubUsername(rawU1) : "";
  const initialUser2 = rawU2 ? sanitizeGitHubUsername(rawU2) : "";

  // If a profile shortcut provides user1 (e.g. from Card Studio or Wrapped: /compare?user1=leerob),
  // prefill user1 and leave user2 empty and ready for input.
  // Otherwise, default to the classic torvalds vs shadcn matchup.
  const resolvedUser1 = initialUser1 || (initialUser2 ? "" : "torvalds");
  const resolvedUser2 = initialUser2 || (initialUser1 ? "" : "shadcn");

  return (
    <main className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col items-center px-3 py-8 sm:px-4 sm:py-10 md:py-16 selection:bg-amber-500/30">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full bg-gradient-to-tr from-amber-600/10 via-orange-600/10 to-yellow-500/10 blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        {/* Hero Tagline */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono font-semibold mb-3 sm:mb-4 backdrop-blur-md">
          <Swords className="w-3.5 h-3.5 text-amber-400" />
          <span>Head-to-Head Developer Battle Arena</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight text-center max-w-3xl leading-tight">
          Compare GitHub Developers{" "}
          <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
            Side-by-Side
          </span>
        </h1>

        <p className="mt-3 sm:mt-4 text-xs sm:text-base text-zinc-400 text-center max-w-xl leading-relaxed mb-6 sm:mb-8 px-2">
          Match any two GitHub profiles. Compare weighted performance tiers, repository stars,
          follower reach, and recent contribution activity.
        </p>

        {/* Comparison Arena Component */}
        <ComparisonArena
          initialUser1={resolvedUser1}
          initialUser2={resolvedUser2}
        />
      </div>
    </main>
  );
}
