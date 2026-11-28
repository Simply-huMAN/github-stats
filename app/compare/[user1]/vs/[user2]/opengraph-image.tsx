import { ImageResponse } from "next/og";
import { ComparisonShareImage } from "@/components/compare/ComparisonShareImage";
import { validateComparisonPair } from "@/lib/validation";

export const runtime = "edge";
export const alt = "GitHub profile comparison on MyGitStats";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function ShowdownOpenGraphImage({ params }: { params: { user1: string; user2: string } }) {
  const pair = validateComparisonPair(params.user1, params.user2);
  return new ImageResponse(
    <ComparisonShareImage profiles={pair.isValid ? [pair.user1, pair.user2] : undefined} />,
    size,
  );
}
