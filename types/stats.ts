export type TierType = "Bronze" | "Gold" | "Mythic";

export interface TierDetails {
  tier: TierType;
  score: number;
  title: string;
  description: string;
  badgeLabel: string;
  colors: {
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    gradient: string;
    glow: string;
    textAccent: string;
    cardBorder: string;
  };
}

export interface UserStats {
  followers: number;
  publicRepos: number;
  totalStars: number;
  activeContributions: number;
}

export interface UserProfile {
  username: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitterUsername: string | null;
  createdAt: string;
  htmlUrl: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface StatsResponse {
  user: UserProfile;
  stats: UserStats;
  tier: TierDetails;
  calendar?: ContributionCalendar;
  fetchedAt: string;
}

export type ApiErrorCode =
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "INVALID_USERNAME"
  | "NETWORK_ERROR"
  | "SERVER_ERROR";

export interface ApiError {
  error: string;
  code?: ApiErrorCode | string;
  details?: string;
  resetTime?: string;
  status: number;
}

export interface GitHubUserRaw {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  created_at: string;
  html_url: string;
  followers: number;
  public_repos: number;
  message?: string;
}

export interface GitHubRepoRaw {
  id: number;
  name: string;
  stargazers_count: number;
  fork: boolean;
}

export interface GitHubEventRaw {
  id: string;
  type: string;
  created_at: string;
  payload?: {
    size?: number;
    commits?: unknown[];
  };
}
