import { ImageResponse } from "next/og";
import { ComparisonShareImage } from "@/components/compare/ComparisonShareImage";

export const runtime = "edge";
export const alt = "Compare GitHub profiles with MyGitStats";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function CompareHubOpenGraphImage() {
  return new ImageResponse(<ComparisonShareImage />, size);
}
