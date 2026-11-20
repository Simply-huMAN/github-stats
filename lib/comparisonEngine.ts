import { StatsResponse } from "@/types/stats";
import { ComparisonResult, MetricComparison, ComparisonSummary } from "@/types/compare";

function getAccountAgeDays(createdAt: string): number {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdDate.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function calculatePercentDiff(val1: number, val2: number): number {
  if (val1 === val2) return 0;
  const min = Math.min(val1, val2);
  const max = Math.max(val1, val2);
  if (min === 0) {
    return max > 0 ? 100 : 0;
  }
  const pct = Math.round(((max - min) / min) * 100);
  return Math.min(pct, 9999);
}

/**
 * Computes comparative metrics and overall showdown results between two users.
 */
export function buildUserComparison(
  user1: StatsResponse,
  user2: StatsResponse
): ComparisonResult {
  const age1 = getAccountAgeDays(user1.user.createdAt);
  const age2 = getAccountAgeDays(user2.user.createdAt);

  const rawMetrics: Array<{
    key: MetricComparison["key"];
    label: string;
    description: string;
    v1: number;
    v2: number;
    unit?: string;
  }> = [
    {
      key: "tierScore",
      label: "Performance Tier Score",
      description: "Weighted algorithm combining stars, followers, repos, and velocity.",
      v1: user1.tier.score,
      v2: user2.tier.score,
      unit: "pts",
    },
    {
      key: "totalStars",
      label: "Total Stargazers",
      description: "Ecosystem trust and repository appreciation across open-source repos.",
      v1: user1.stats.totalStars,
      v2: user2.stats.totalStars,
      unit: "★",
    },
    {
      key: "followers",
      label: "Developer Followers",
      description: "Direct community audience and peer recognition.",
      v1: user1.stats.followers,
      v2: user2.stats.followers,
    },
    {
      key: "activeContributions",
      label: "Active Contributions",
      description: "Recent commits, pull requests, issues, and code reviews.",
      v1: user1.stats.activeContributions,
      v2: user2.stats.activeContributions,
    },
    {
      key: "publicRepos",
      label: "Public Repositories",
      description: "Volume of public projects, packages, and codebases.",
      v1: user1.stats.publicRepos,
      v2: user2.stats.publicRepos,
    },
    {
      key: "accountAgeDays",
      label: "GitHub Seniority",
      description: "Longevity and days active on the platform.",
      v1: age1,
      v2: age2,
      unit: "days",
    },
  ];

  let user1Wins = 0;
  let user2Wins = 0;
  let ties = 0;

  const metrics: MetricComparison[] = rawMetrics.map((m) => {
    let winner: 1 | 2 | "tie" = "tie";
    if (m.v1 > m.v2) {
      winner = 1;
      user1Wins += 1;
    } else if (m.v2 > m.v1) {
      winner = 2;
      user2Wins += 1;
    } else {
      ties += 1;
    }

    return {
      key: m.key,
      label: m.label,
      description: m.description,
      user1Value: m.v1,
      user2Value: m.v2,
      winner,
      diff: m.v1 - m.v2,
      percentDiff: calculatePercentDiff(m.v1, m.v2),
      unit: m.unit,
    };
  });

  // Overall winner determination: tier score carries priority if tied, else majority categories
  let overallWinner: 1 | 2 | "tie" = "tie";
  if (user1Wins > user2Wins) {
    overallWinner = 1;
  } else if (user2Wins > user1Wins) {
    overallWinner = 2;
  } else {
    // If category wins are equal, break tie with Tier Score
    if (user1.tier.score > user2.tier.score) {
      overallWinner = 1;
    } else if (user2.tier.score > user1.tier.score) {
      overallWinner = 2;
    } else {
      overallWinner = "tie";
    }
  }

  const name1 = user1.user.name || user1.user.username;
  const name2 = user2.user.name || user2.user.username;

  let headline = "";
  if (overallWinner === 1) {
    headline = `${name1} leads this showdown with ${user1Wins} category wins!`;
  } else if (overallWinner === 2) {
    headline = `${name2} leads this showdown with ${user2Wins} category wins!`;
  } else {
    headline = `Epic Dead Heat! ${name1} and ${name2} are evenly matched.`;
  }

  const winMargin =
    overallWinner === "tie"
      ? `Tied at ${user1Wins} categories each (${ties} draws)`
      : `${Math.max(user1Wins, user2Wins)} to ${Math.min(user1Wins, user2Wins)} categories`;

  const summary: ComparisonSummary = {
    user1Wins,
    user2Wins,
    ties,
    overallWinner,
    headline,
    winMargin,
  };

  return {
    user1,
    user2,
    metrics,
    summary,
    comparedAt: new Date().toISOString(),
  };
}

