import { StatsResponse, TierType } from "./stats";

export type ComparisonMetricKey =
  | "tierScore"
  | "totalStars"
  | "followers"
  | "publicRepos"
  | "activeContributions"
  | "accountAgeDays";

export interface MetricComparison {
  key: ComparisonMetricKey;
  label: string;
  description: string;
  user1Value: number;
  user2Value: number;
  winner: 1 | 2 | "tie";
  diff: number; // user1Value - user2Value
  percentDiff: number; // percentage difference relative to lower value or 0
  unit?: string;
}

export interface ComparisonSummary {
  user1Wins: number;
  user2Wins: number;
  ties: number;
  overallWinner: 1 | 2 | "tie";
  headline: string;
  winMargin: string;
}

export interface ComparisonResult {
  user1: StatsResponse;
  user2: StatsResponse;
  metrics: MetricComparison[];
  summary: ComparisonSummary;
  comparedAt: string;
}

export interface ComparisonError {
  error: string;
  code: string;
  details?: string;
  failedUser?: "user1" | "user2" | "both";
  status: number;
}

