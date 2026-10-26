import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Same-origin avatar proxy to avoid CORS/tainted canvas issues
 * when exporting cards in strict privacy browsers like Brave.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Safety check: only proxy trusted GitHub avatar domains
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
    console.error("[api/avatar] Proxy error:", err);
    return new NextResponse("Error fetching avatar", { status: 500 });
  }
}
