import { NextRequest, NextResponse } from "next/server";
import {
  ApiError,
  GitHubEventRaw,
  GitHubRepoRaw,
  GitHubUserRaw,
  StatsResponse,
  UserProfile,
  UserStats,
} from "@/types/stats";
import { calculateTierScore, getTierDetails } from "@/lib/tier";
import { fetchContributionCalendar } from "@/lib/contributions";

export const dynamic = "force-dynamic";

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_USERNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
const UPSTREAM_TIMEOUT_MS = 8000;

/**
 * Builds standard GitHub request headers, attaching an optional
 * personal access token from process.env if available.
 */
function getGitHubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "github-stats-card-app",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token && token.trim().length > 0) {
    headers["Authorization"] = `Bearer ${token.trim()}`;
  }

  return headers;
}

/**
 * Custom fetch wrapper with strict timeout support.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = UPSTREAM_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<StatsResponse | ApiError>> {
  const { searchParams } = request.nextUrl;
  const rawUsername = searchParams.get("username");

  if (!rawUsername || !rawUsername.trim()) {
    return NextResponse.json(
      {
        error: "Missing required query parameter: username",
        code: "INVALID_USERNAME",
        details: "Please provide a valid GitHub username, e.g. /api/stats?username=octocat",
        status: 400,
      },
      { status: 400 }
    );
  }

  let username = rawUsername.trim().replace(/^@+/, "");
  if (username.includes("github.com/")) {
    username = username.split("github.com/")[1]?.split("/")[0]?.replace(/^@+/, "") || username;
  }

  if (!GITHUB_USERNAME_REGEX.test(username)) {
    return NextResponse.json(
      {
        error: "Invalid GitHub username format",
        code: "INVALID_USERNAME",
        details: "GitHub usernames must contain only alphanumeric characters or single hyphens.",
        status: 400,
      },
      { status: 400 }
    );
  }

  const headers = getGitHubHeaders();

  try {
    // 1. Fetch User Profile with timeout
    const userRes = await fetchWithTimeout(`${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`, {
      headers,
      next: { revalidate: 3600 },
    });

    if (userRes.status === 404) {
      return NextResponse.json(
        {
          error: "GitHub user not found",
          code: "NOT_FOUND",
          details: `The user '${username}' does not exist on GitHub.`,
          status: 404,
        },
        { status: 404 }
      );
    }

    if (userRes.status === 403) {
      const remaining = userRes.headers.get("x-ratelimit-remaining");
      const resetTime = userRes.headers.get("x-ratelimit-reset");
      const resetDate = resetTime ? new Date(parseInt(resetTime, 10) * 1000).toLocaleTimeString() : "soon";

      return NextResponse.json(
        {
          error: "GitHub API rate limit exceeded",
          code: "RATE_LIMITED",
          details: `Rate limit remaining: ${remaining ?? 0}. Limit resets at ${resetDate}. Consider adding GITHUB_TOKEN to server environment for 5,000 req/hr.`,
          resetTime: resetDate,
          status: 403,
        },
        { status: 403 }
      );
    }

    if (!userRes.ok) {
      return NextResponse.json(
        {
          error: "GitHub API returned an error",
          code: "SERVER_ERROR",
          details: `Status: ${userRes.status} ${userRes.statusText}`,
          status: userRes.status,
        },
        { status: userRes.status }
      );
    }

    const userData: GitHubUserRaw = await userRes.json();

    // 2. Concurrently fetch Repositories (paginating up to 300 repos for stars) and Public Events (for active contributions)
    const publicRepoCount = userData.public_repos || 0;
    // Determine how many pages to fetch (max 3 pages = 300 repos to prevent rate-limit exhaustion)
    const repoPagesToFetch = Math.min(Math.max(1, Math.ceil(publicRepoCount / 100)), 3);

    const repoRequests = Array.from({ length: repoPagesToFetch }, (_, idx) =>
      fetchWithTimeout(
        `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed&type=owner&page=${idx + 1}`,
        { headers, next: { revalidate: 3600 } }
      ).catch(() => null)
    );

    const [eventsRes, ...reposResponses] = await Promise.all([
      fetchWithTimeout(
        `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/events/public?per_page=100`,
        { headers, next: { revalidate: 1800 } }
      ).catch(() => null),
      ...repoRequests,
    ]);

    // Calculate total stargazers across public repositories
    let totalStars = 0;
    for (const reposRes of reposResponses) {
      if (reposRes && reposRes.ok) {
        const repos: GitHubRepoRaw[] = await reposRes.json().catch(() => []);
        if (Array.isArray(repos)) {
          totalStars += repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
        }
      }
    }

    // Estimate active contributions from recent public events
    let activeContributions = 0;
    if (eventsRes && eventsRes.ok) {
      const events: GitHubEventRaw[] = await eventsRes.json();
      if (Array.isArray(events)) {
        activeContributions = events.reduce((count, event) => {
          if (event.type === "PushEvent") {
            const commitCount = event.payload?.size || (event.payload?.commits ? event.payload.commits.length : 1);
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
      }
    }

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

    // Concurrently or safely resolve 52-week contribution calendar
    const calendar = await fetchContributionCalendar(
      username,
      process.env.GITHUB_TOKEN,
      activeContributions,
      stats.publicRepos
    );

    const payload: StatsResponse = {
      user,
      stats,
      tier,
      calendar,
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && (err.name === "AbortError" || err.name === "TimeoutError")) {
      return NextResponse.json(
        {
          error: "GitHub API request timed out",
          code: "TIMEOUT",
          details: "GitHub took too long to respond (exceeded 8s timeout). GitHub API may be experiencing high latency.",
          status: 504,
        },
        { status: 504 }
      );
    }

    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json(
      {
        error: "Internal Server Error",
        code: "SERVER_ERROR",
        details: message,
        status: 500,
      },
      { status: 500 }
    );
  }
}
