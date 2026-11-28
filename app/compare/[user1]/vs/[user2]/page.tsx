import React from "react";
import type { Metadata } from "next";
import { ComparisonArena } from "@/components/compare/ComparisonArena";
import { validateComparisonPair } from "@/lib/validation";
import { fetchUserStats, getComparisonFailure } from "@/lib/statsFetcher";
import { getComparisonFeedback, validateComparisonForm } from "@/lib/comparisonFeedback";
import { buildUserComparison } from "@/lib/comparisonEngine";
import { ComparisonResult } from "@/types/compare";

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

  if (!val.isValid) {
    return { title: "Compare GitHub profiles", robots: { index: false } };
  }

  const u1Name = val.user1;
  const u2Name = val.user2;

  const title = `${u1Name} vs ${u2Name} — Who Wins the GitHub Developer Showdown? | MyGitStats`;
  const description = `Head-to-head GitHub battle: ${u1Name} vs ${u2Name}. Compare performance tier ranks (Mythic, Gold, Bronze), total stars, followers, and active contribution velocity side-by-side.`;
  const canonicalUrl = `/compare/${val.canonical1}/vs/${val.canonical2}`;
  const showdownUrl = `https://mygitstats.dev/compare/${encodeURIComponent(u1Name)}/vs/${encodeURIComponent(u2Name)}`;
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

export default async function BattlePage({ params }: BattlePageProps) {
  const { user1, user2 } = params;
  const { pair: val, feedback } = validateComparisonForm(user1, user2);
  let initialData: ComparisonResult | null = null;
  let initialFeedback = val.isValid ? undefined : feedback;

  // Single server-side fetch per matchup: avoids client-side duplicate requests
  if (val.isValid) {
    try {
      const [res1, res2] = await Promise.allSettled([
        fetchUserStats(val.user1, { skipCalendar: true }),
        fetchUserStats(val.user2, { skipCalendar: true }),
      ]);

      if (res1.status === "fulfilled" && res2.status === "fulfilled") {
        initialData = buildUserComparison(res1.value, res2.value);
      } else {
        const err1 = res1.status === "rejected" ? res1.reason : null;
        const err2 = res2.status === "rejected" ? res2.reason : null;
        initialFeedback = getComparisonFeedback(getComparisonFailure(err1, err2));
      }
    } catch (e: unknown) {
      console.error("Comparison page failed", e);
      initialFeedback = getComparisonFeedback({ code: "FETCH_ERROR" });
    }
  }

  return (
    <main className="site-container py-9 sm:py-14">
      <div className="mb-8">
        <h1 className="break-words text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
          <span>{val.user1 || user1}</span>{" "}
          <span className="font-mono text-xl text-site-muted sm:text-3xl">vs</span>{" "}
          <span>{val.user2 || user2}</span>
        </h1>

        <p className="mt-3 leading-relaxed text-site-muted">
          Public GitHub stats and performance tiers, side by side.
        </p>
      </div>

      <ComparisonArena
        key={`${user1}/vs/${user2}`}
        initialData={initialData}
        initialUser1={val.user1 || user1}
        initialUser2={val.user2 || user2}
        initialFeedback={initialFeedback}
      />
    </main>
  );
}
