import React from "react";
import type { Metadata } from "next";
import { ComparisonArena } from "@/components/compare/ComparisonArena";
import { validateComparisonPair } from "@/lib/validation";
import { Swords } from "lucide-react";

export const dynamic = "force-dynamic";

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

  const title = `${u1Name} vs ${u2Name} — Who Wins the GitHub Developer Showdown? | MyGitStats`;
  const description = `Head-to-head GitHub battle: ${u1Name} vs ${u2Name}. Compare performance tier ranks (Mythic, Gold, Bronze), total stars, followers, and active contribution velocity side-by-side.`;
  const canonicalUrl = `/compare/${val.canonical1 || user1.toLowerCase()}/vs/${val.canonical2 || user2.toLowerCase()}`;
  const showdownUrl = `https://mygitstats.dev/compare/${u1Name}/vs/${u2Name}`;
  const ogImageUrl = `https://mygitstats.dev/compare/${encodeURIComponent(u1Name)}/vs/${encodeURIComponent(u2Name)}/opengraph-image`;

  return {
    title,
    description,
    keywords: [
      `${u1Name} vs ${u2Name}`,
      `${u1Name} github stats`,
      `${u2Name} github stats`,
      "github developer comparison",
      "developer showdown",
      "head-to-head git stats",
      "github performance tier battle",
      "compare developers",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: showdownUrl,
      siteName: "MyGitStats",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${u1Name} vs ${u2Name} — GitHub Developer Showdown Battle Card`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function BattlePage({ params }: BattlePageProps) {
  const { user1, user2 } = params;
  const val = validateComparisonPair(user1, user2);

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
          <span>Developer Showdown</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight text-center max-w-3xl leading-tight px-2 break-words">
          <span className="text-indigo-400">{val.user1 || user1}</span>{" "}
          <span className="text-zinc-500 font-mono text-xl sm:text-3xl md:text-4xl">vs</span>{" "}
          <span className="text-amber-400">{val.user2 || user2}</span>
        </h1>

        <p className="mt-3 sm:mt-4 text-xs sm:text-base text-zinc-400 text-center max-w-xl leading-relaxed mb-6 sm:mb-8 px-2">
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

