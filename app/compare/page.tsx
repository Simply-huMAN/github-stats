import React from "react";
import { ComparisonArena } from "@/components/compare/ComparisonArena";
import { sanitizeGitHubUsername } from "@/lib/validation";

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
    <main className="site-container py-9 sm:py-14">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
          Compare GitHub profiles
        </h1>

        <p className="mt-3 leading-relaxed text-site-muted">
          Compare repository stars, followers, and recent activity for two public GitHub profiles.
        </p>
      </div>

      <ComparisonArena initialUser1={resolvedUser1} initialUser2={resolvedUser2} />
    </main>
  );
}
