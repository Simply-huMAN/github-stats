import type { StatsResponse } from "@/types/stats";
import type { ComparisonResult, MetricComparison, ComparisonSummary } from "@/types/compare";

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
 * Strictly prevents false winners by tracking missing data and withholding the overall winner
 * whenever incomplete metrics could affect the outcome.
 */
export function buildUserComparison(
  user1: StatsResponse,
  user2: StatsResponse
): ComparisonResult {
  const age1 = getAccountAgeDays(user1.user.createdAt);
  const age2 = getAccountAgeDays(user2.user.createdAt);

  const u1Missing = new Set(user1.missingFields || []);
  const u2Missing = new Set(user2.missingFields || []);

  const rawMetrics: Array<{
    key: MetricComparison["key"];
    label: string;
    description: string;
    v1: number;
    v2: number;
    u1Miss: boolean;
    u2Miss: boolean;
    unit?: string;
  }> = [
    {
      key: "tierScore",
      label: "Performance Tier Score",
      description: "Weighted algorithm combining stars, followers, repos, and velocity.",
      v1: user1.tier.score,
      v2: user2.tier.score,
      u1Miss: u1Missing.has("totalStars") || u1Missing.has("activeContributions"),
      u2Miss: u2Missing.has("totalStars") || u2Missing.has("activeContributions"),
      unit: "pts",
    },
    {
      key: "totalStars",
      label: "Total Stargazers",
      description: "Ecosystem trust and repository appreciation across open-source repos.",
      v1: user1.stats.totalStars,
      v2: user2.stats.totalStars,
      u1Miss: u1Missing.has("totalStars"),
      u2Miss: u2Missing.has("totalStars"),
      unit: "★",
    },
    {
      key: "followers",
      label: "Developer Followers",
      description: "Direct community audience and peer recognition.",
      v1: user1.stats.followers,
      v2: user2.stats.followers,
      u1Miss: false,
      u2Miss: false,
    },
    {
      key: "activeContributions",
      label: "Active Contributions",
      description: "Recent commits, pull requests, issues, and code reviews from public activity.",
      v1: user1.stats.activeContributions,
      v2: user2.stats.activeContributions,
      u1Miss: u1Missing.has("activeContributions"),
      u2Miss: u2Missing.has("activeContributions"),
    },
    {
      key: "publicRepos",
      label: "Public Repositories",
      description: "Volume of public projects, packages, and codebases.",
      v1: user1.stats.publicRepos,
      v2: user2.stats.publicRepos,
      u1Miss: false,
      u2Miss: false,
    },
    {
      key: "accountAgeDays",
      label: "GitHub Seniority",
      description: "Longevity and days active on the platform.",
      v1: age1,
      v2: age2,
      u1Miss: false,
      u2Miss: false,
      unit: "days",
    },
  ];

  let user1Wins = 0;
  let user2Wins = 0;
  let ties = 0;
  let undetermined = 0;

  const metrics: MetricComparison[] = rawMetrics.map((m) => {
    let winner: 1 | 2 | "tie" | "undetermined" = "tie";

    // If either contender has missing data for this metric, do not declare a false winner
    if (m.u1Miss || m.u2Miss) {
      winner = "undetermined";
      undetermined += 1;
    } else if (m.v1 > m.v2) {
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
      user1Missing: m.u1Miss,
      user2Missing: m.u2Miss,
      winner,
      diff: m.v1 - m.v2,
      percentDiff: calculatePercentDiff(m.v1, m.v2),
      unit: m.unit,
    };
  });

  const name1 = user1.user.name || user1.user.username;
  const name2 = user2.user.name || user2.user.username;

  // Withhold overall winner if missing values could potentially alter the victor
  const isComplete = !user1.isPartial && !user2.isPartial && undetermined === 0;
  let overallWinner: 1 | 2 | "tie" | "undetermined" = "tie";
  let isTiebreaker = false;
  let tiebreakerMetric: string | undefined = undefined;
  let winnerWithheld = false;
  let withheldReason: string | undefined = undefined;

  // Determine if missing metrics could change the outcome
  // If the score gap is smaller than or equal to undetermined metrics, withhold
  const winGap = Math.abs(user1Wins - user2Wins);
  if (undetermined > 0 && winGap <= undetermined) {
    overallWinner = "undetermined";
    winnerWithheld = true;
    withheldReason = `Winner withheld: ${undetermined} metric${undetermined > 1 ? "s" : ""} could not be retrieved from GitHub and could alter the match outcome.`;
  } else if (user1Wins > user2Wins) {
    overallWinner = 1;
  } else if (user2Wins > user1Wins) {
    overallWinner = 2;
  } else {
    // Tied on category wins: Check if tier score is reliable for tiebreaker
    const tierScoreMissing = u1Missing.has("totalStars") || u1Missing.has("activeContributions") ||
                             u2Missing.has("totalStars") || u2Missing.has("activeContributions");

    if (tierScoreMissing) {
      overallWinner = "undetermined";
      winnerWithheld = true;
      withheldReason = "Winner withheld: Match is tied on categories, but tier score tiebreaker data is incomplete.";
    } else if (user1.tier.score > user2.tier.score) {
      overallWinner = 1;
      isTiebreaker = true;
      tiebreakerMetric = "tier score";
    } else if (user2.tier.score > user1.tier.score) {
      overallWinner = 2;
      isTiebreaker = true;
      tiebreakerMetric = "tier score";
    } else {
      overallWinner = "tie";
    }
  }

  // Construct headline and winMargin cleanly:
  // e.g. "3 categories each · Linus wins on tier score."
  let headline = "";
  let winMargin = "";

  if (winnerWithheld) {
    headline = "Incomplete GitHub Data · Winner Withheld";
    winMargin = withheldReason || "Winner withheld due to missing metrics";
  } else if (isTiebreaker) {
    const winnerName = overallWinner === 1 ? name1 : name2;
    headline = `${user1Wins} categories each · ${winnerName} wins on tier score.`;
    winMargin = `${user1Wins} categories each · ${winnerName} wins on tier score`;
  } else if (overallWinner === 1) {
    headline = `${name1} leads with ${user1Wins} category wins.`;
    winMargin = `${user1Wins} to ${user2Wins} categories`;
  } else if (overallWinner === 2) {
    headline = `${name2} leads with ${user2Wins} category wins.`;
    winMargin = `${user2Wins} to ${user1Wins} categories`;
  } else {
    headline = `Dead Heat! ${name1} and ${name2} are evenly matched.`;
    winMargin = `Tied at ${user1Wins} categories each`;
  }

  const summary: ComparisonSummary = {
    user1Wins,
    user2Wins,
    ties,
    overallWinner,
    isTiebreaker,
    tiebreakerMetric,
    headline,
    winMargin,
    isComplete,
    winnerWithheld,
    withheldReason,
  };

  return {
    user1,
    user2,
    metrics,
    summary,
    comparedAt: new Date().toISOString(),
  };
}
