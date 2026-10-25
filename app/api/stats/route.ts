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

export const dynamic = "force-dynamic";

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_USERNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;

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

export async function GET(request: NextRequest): Promise<NextResponse<StatsResponse | ApiError>> {
  const { searchParams } = request.nextUrl;
  const rawUsername = searchParams.get("username");

  if (!rawUsername || !rawUsername.trim()) {
    return NextResponse.json(
      {
        error: "Missing required query parameter: username",
        details: "Please provide a valid GitHub username, e.g. /api/stats?username=octocat",
        status: 400,
      },
      { status: 400 }
    );
  }

  const username = rawUsername.trim();

  if (!GITHUB_USERNAME_REGEX.test(username)) {
    return NextResponse.json(
      {
        error: "Invalid GitHub username format",
        details: "GitHub usernames must contain only alphanumeric characters or single hyphens.",
        status: 400,
      },
      { status: 400 }
    );
  }

  const headers = getGitHubHeaders();

  try {
    const userRes = await fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`, {
      headers,
      next: { revalidate: 3600 },
    });

    if (userRes.status === 404) {
      return NextResponse.json(
        {
          error: "GitHub user not found",
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
          details: `Rate limit remaining: ${remaining ?? 0}. Limit resets at ${resetDate}. Consider adding GITHUB_TOKEN to .env.local for 5,000 req/hr.`,
          status: 403,
        },
        { status: 403 }
      );
    }

    if (!userRes.ok) {
      return NextResponse.json(
        {
          error: "GitHub API returned an error",
          details: `Status: ${userRes.status} ${userRes.statusText}`,
          status: userRes.status,
        },
        { status: userRes.status }
      );
    }

    const userData: GitHubUserRaw = await userRes.json();

    const [reposRes, eventsRes] = await Promise.all([
      fetch(
        `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed&type=owner`,
        { headers, next: { revalidate: 3600 } }
      ),
      fetch(
        `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/events/public?per_page=100`,
        { headers, next: { revalidate: 1800 } }
      ),
    ]);

    let totalStars = 0;
    if (reposRes.ok) {
      const repos: GitHubRepoRaw[] = await reposRes.json();
      if (Array.isArray(repos)) {
        totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
      }
    }

    let activeContributions = 0;
    if (eventsRes.ok) {
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

    const payload: StatsResponse = {
      user,
      stats,
      tier,
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: message,
        status: 500,
      },
      { status: 500 }
    );
  }
}
