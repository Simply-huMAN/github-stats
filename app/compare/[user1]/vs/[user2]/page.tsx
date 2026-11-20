import React from "react";
import type { Metadata } from "next";
import { ComparisonArena } from "@/components/compare/ComparisonArena";
import { validateComparisonPair } from "@/lib/validation";
import { Swords } from "lucide-react";

interface BattlePageProps {
  params: {
    user1: string;
    user2: string;
  };
}

export async function generateMetadata({ params }: BattlePageProps): Promise<Metadata> {
  const { user1, user2 } = params;
  const val = validateComparisonPair(user1, user2);

  const u1Name = val.user1 || user1;
  const u2Name = val.user2 || user2;

  const title = `${u1Name} vs ${u2Name} — GitHub Developer Comparison & Battle | MyGitStats`;
  const description = `Compare ${u1Name} and ${u2Name} side-by-side on GitHub. Analyze performance tiers, total stars, active contributions, followers, and repositories with MyGitStats.`;
  const canonicalUrl = `/compare/${val.canonical1 || user1.toLowerCase()}/vs/${val.canonical2 || user2.toLowerCase()}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: `https://mygitstats.dev/compare/${u1Name}/vs/${u2Name}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function BattlePage({ params }: BattlePageProps) {
  const { user1, user2 } = params;
  const val = validateComparisonPair(user1, user2);

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
          <span>Developer Showdown</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight text-center max-w-3xl leading-tight">
          <span className="text-indigo-400">{val.user1 || user1}</span>{" "}
          <span className="text-zinc-500 font-mono text-2xl sm:text-4xl">vs</span>{" "}
          <span className="text-amber-400">{val.user2 || user2}</span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-zinc-400 text-center max-w-xl leading-relaxed mb-8">
          Verified side-by-side comparison of GitHub statistics, performance tiers, and open-source impact.
        </p>

        {/* Comparison Arena Component */}
        <ComparisonArena
          initialUser1={val.user1 || user1}
          initialUser2={val.user2 || user2}
          initialError={val.error || null}
        />
      </div>
    </main>
  );
}

