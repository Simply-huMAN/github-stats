import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Dynamic same-origin avatar proxy with username path segment.
 * Ensures each user's avatar has a distinct pathname (/api/avatar/<username>),
 * preventing html-to-image from caching and reusing previous users' avatars.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const { searchParams } = request.nextUrl;
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(rawUrl);
  } catch {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  const allowedHosts = [
    "avatars.githubusercontent.com",
    "github.com",
    "raw.githubusercontent.com",
  ];

  if (!allowedHosts.includes(targetUrl.hostname)) {
    return new NextResponse("Forbidden host", { status: 403 });
  }

  try {
    const upstreamRes = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent": "github-stats-card-app",
      },
      next: { revalidate: 86400 },
    });

    if (!upstreamRes.ok) {
      return new NextResponse("Failed to fetch avatar upstream", {
        status: upstreamRes.status,
      });
    }

    const contentType = upstreamRes.headers.get("content-type") || "image/png";
    const arrayBuffer = await upstreamRes.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: unknown) {
    console.error(`[api/avatar/${params.username}] Proxy error:`, err);
    return new NextResponse("Error fetching avatar", { status: 500 });
  }
}
