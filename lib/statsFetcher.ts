import type {
  GitHubEventRaw,
  GitHubRepoRaw,
  GitHubUserRaw,
  StatsResponse,
  UserProfile,
  UserStats,
} from "@/types/stats";
import { calculateTierScore, getTierDetails } from "@/lib/tier";
import { fetchContributionCalendar } from "@/lib/contributions";

const GITHUB_API_BASE = "https://api.github.com";
const UPSTREAM_TIMEOUT_MS = 8000;

async function fetchGitHubList<T>(
  url: string,
  options: RequestInit,
  isItem: (item: unknown) => item is T
): Promise<T[] | null> {
  try {
    const response = await fetchWithTimeout(url, options);
    if (!response.ok) return null;
    const items: unknown = await response.json();
    return Array.isArray(items) && items.every(isItem) ? items : null;
  } catch {
    return null;
  }
}

function isRepository(item: unknown): item is GitHubRepoRaw {
  return !!item && typeof item === "object" &&
    "stargazers_count" in item && Number.isSafeInteger(item.stargazers_count) &&
    Number(item.stargazers_count) >= 0;
}

function isEvent(item: unknown): item is GitHubEventRaw {
  return !!item && typeof item === "object" && "type" in item && typeof item.type === "string";
}

function getGitHubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "mygitstats-app",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token && token.trim().length > 0) {
    headers["Authorization"] = `Bearer ${token.trim()}`;
  }

  return headers;
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = UPSTREAM_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

export class GitHubFetchError extends Error {
  code: string;
  status: number;
  details?: string;

  constructor(message: string, code: string, status: number, details?: string) {
    super(message);
    this.name = "GitHubFetchError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/**
 * Fetches verified public GitHub stats and computes performance tier for a username.
 * Supports Next.js edge caching and optional server-side GITHUB_TOKEN.
 * Options allow skipping unused 52-week contribution calendar calculation to optimize performance.
 */
export async function fetchUserStats(
  username: string,
  options?: { skipCalendar?: boolean }
): Promise<StatsResponse> {
  const headers = getGitHubHeaders();

  let userRes: Response;
  try {
    userRes = await fetchWithTimeout(
      `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`,
      {
        headers,
        next: { revalidate: 3600 },
      }
    );
  } catch (err: unknown) {
    if (err instanceof Error && (err.name === "AbortError" || err.name === "TimeoutError")) {
      throw new GitHubFetchError(
        `GitHub API timed out fetching user '${username}'.`,
        "TIMEOUT",
        504,
        "GitHub API exceeded the 8s response threshold."
      );
    }
    throw new GitHubFetchError(
      `Network error fetching user '${username}'.`,
      "NETWORK_ERROR",
      502,
      err instanceof Error ? err.message : String(err)
    );
  }

  if (userRes.status === 404) {
    throw new GitHubFetchError(
      `User '${username}' does not exist on GitHub.`,
      "NOT_FOUND",
      404,
      `Please check the spelling of '${username}'.`
    );
  }

  if (userRes.status === 403) {
    const remaining = userRes.headers.get("x-ratelimit-remaining");
    const resetTime = userRes.headers.get("x-ratelimit-reset");
    const resetDate = resetTime ? new Date(parseInt(resetTime, 10) * 1000).toLocaleTimeString() : "soon";
    throw new GitHubFetchError(
      "GitHub API rate limit exceeded.",
      "RATE_LIMITED",
      403,
      `Remaining calls: ${remaining ?? 0}. Resets at ${resetDate}.`
    );
  }

  if (!userRes.ok) {
    throw new GitHubFetchError(
      `GitHub API returned status ${userRes.status}.`,
      "SERVER_ERROR",
      userRes.status,
      userRes.statusText
    );
  }

  const userData: GitHubUserRaw = await userRes.json();

  // Concurrently fetch Repositories (up to 300 repos) and Public Events
  const publicRepoCount = userData.public_repos || 0;
  const repoPagesToFetch = Math.min(Math.ceil(publicRepoCount / 100), 3);

  const repoRequests = Array.from({ length: repoPagesToFetch }, (_, idx) =>
    fetchGitHubList(
      `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed&type=owner&page=${idx + 1}`,
      { headers, next: { revalidate: 3600 } },
      isRepository
    )
  );

  const [events, ...repoPages] = await Promise.all([
    fetchGitHubList(
      `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/events/public?per_page=100`,
      { headers, next: { revalidate: 1800 } },
      isEvent
    ),
    ...repoRequests,
  ]);

  const missingFields: string[] = [];

  let totalStars = 0;
  if (repoPages.some((page) => page === null)) {
    missingFields.push("totalStars");
  } else {
    totalStars = repoPages.flat().reduce((sum, repo) => sum + (repo?.stargazers_count ?? 0), 0);
  }

  let activeContributions = 0;
  if (events) {
    activeContributions = events.reduce((count, event) => {
      if (event.type === "PushEvent") {
        const { size, commits } = event.payload ?? {};
        const commitCount = typeof size === "number" && Number.isSafeInteger(size)
          ? size
          : Array.isArray(commits) ? commits.length : 1;
        return count + Math.max(commitCount, 1);
      }
      if (
        event.type === "PullRequestEvent" ||
        event.type === "IssuesEvent" ||
        event.type === "CreateEvent" ||
        event.type === "CommitCommentEvent" ||
        event.type === "PullRequestReviewEvent"
      ) {
        return count + 1;
      }
      return count;
    }, 0);
  } else {
    missingFields.push("activeContributions");
  }

  const isPartial = missingFields.length > 0;

  const stats: UserStats = {
    followers: userData.followers || 0,
    publicRepos: userData.public_repos || 0,
    totalStars,
    activeContributions,
  };

  const user: UserProfile = {
    username: userData.login,
    name: userData.name,
    avatarUrl: userData.avatar_url,
    bio: userData.bio,
    company: userData.company,
    location: userData.location,
    blog: userData.blog,
    twitterUsername: userData.twitter_username,
    createdAt: userData.created_at,
    htmlUrl: userData.html_url,
  };

  const score = calculateTierScore(stats);
  const tier = getTierDetails(score);

  // Skip the unused contribution calendar if requested (e.g. for comparison showdown)
  const calendar = options?.skipCalendar
    ? { totalContributions: activeContributions, weeks: [] }
    : await fetchContributionCalendar(
        username,
        process.env.GITHUB_TOKEN,
        activeContributions,
        stats.publicRepos
      );

  return {
    user,
    stats,
    tier,
    calendar,
    fetchedAt: new Date().toISOString(),
    isPartial,
    missingFields: isPartial ? missingFields : undefined,
  };
}

