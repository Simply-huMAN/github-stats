import { NextRequest, NextResponse } from "next/server";
import { validateComparisonPair } from "@/lib/validation";
import { fetchUserStats, GitHubFetchError } from "@/lib/statsFetcher";
import { buildUserComparison } from "@/lib/comparisonEngine";
import { ComparisonResult, ComparisonError } from "@/types/compare";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ComparisonResult | ComparisonError>> {
  const { searchParams } = request.nextUrl;
  const rawUser1 = searchParams.get("u1") || searchParams.get("user1");
  const rawUser2 = searchParams.get("u2") || searchParams.get("user2");

  // Pre-validation before making ANY network calls
  const validation = validateComparisonPair(rawUser1, rawUser2);
  if (!validation.isValid) {
    return NextResponse.json(
      {
        error: validation.error || "Invalid comparison parameters.",
        code: validation.isSelfComparison ? "SELF_COMPARISON" : "INVALID_USERNAME",
        status: 400,
      },
      { status: 400 }
    );
  }

  const { user1, user2 } = validation;

  try {
    // Concurrently fetch both GitHub profiles in parallel, skipping unused 52-week calendar calculation
    const [res1, res2] = await Promise.allSettled([
      fetchUserStats(user1, { skipCalendar: true }),
      fetchUserStats(user2, { skipCalendar: true }),
    ]);

    // Check for individual errors
    if (res1.status === "rejected" || res2.status === "rejected") {
      const err1 = res1.status === "rejected" ? res1.reason : null;
      const err2 = res2.status === "rejected" ? res2.reason : null;

      const failedUser =
        err1 && err2 ? "both" : err1 ? "user1" : "user2";
      const primaryErr = err1 || err2;

      const statusCode =
        primaryErr instanceof GitHubFetchError ? primaryErr.status : 500;
      const code =
        primaryErr instanceof GitHubFetchError ? primaryErr.code : "FETCH_ERROR";

      return NextResponse.json(
        {
          error:
            failedUser === "both"
              ? `Failed to fetch stats for both '${user1}' and '${user2}'.`
              : failedUser === "user1"
              ? `Failed to fetch stats for Contender 1 ('${user1}'): ${primaryErr?.message}`
              : `Failed to fetch stats for Contender 2 ('${user2}'): ${primaryErr?.message}`,
          code,
          details: primaryErr instanceof GitHubFetchError ? primaryErr.details : undefined,
          failedUser,
          status: statusCode,
        },
        { status: statusCode }
      );
    }

    const comparisonData = buildUserComparison(res1.value, res2.value);

    // Cache complete results ONLY. Incomplete results or withheld outcomes must NOT be cached on CDN.
    const isComplete = comparisonData.summary.isComplete;
    const cacheHeaders: Record<string, string> = isComplete
      ? {
          "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200",
          "CDN-Cache-Control": "max-age=86400",
          "Cloudflare-CDN-Cache-Control": "max-age=86400",
        }
      : {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        };

    return NextResponse.json(comparisonData, {
      status: 200,
      headers: cacheHeaders,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json(
      {
        error: "Internal Server Error comparing developers",
        code: "SERVER_ERROR",
        details: message,
        status: 500,
      },
      { status: 500 }
    );
  }
}

