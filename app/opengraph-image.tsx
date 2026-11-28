import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MyGitStats — Create a GitHub stats card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const mark = [".###.", "#....", "#.###", "#...#", ".###."];

  return new ImageResponse(
    <div style={{
      width: "100%", height: "100%", padding: "72px 80px", backgroundColor: "#0a0c0e",
      color: "#e9eef4", display: "flex", flexDirection: "column",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 27, marginBottom: 32 }}>
        <svg width="64" height="64" viewBox="0 0 49 49">
          {mark.flatMap((row, y) => row.split("").map((cell, x) => (
            <rect key={`${x},${y}`} x={x * 10} y={y * 10} width="9" height="9" rx="1.5" fill={cell === "#" ? "#39d353" : "#1b2430"} />
          )))}
        </svg>
        <span>mygitstats.dev</span>
      </div>
      <div style={{ display: "flex", height: 2, backgroundColor: "#252e37" }} />
      <div style={{ display: "flex", flexDirection: "column", fontSize: 78, fontWeight: 700, lineHeight: 1.08, marginTop: 58 }}>
        <span>Create a GitHub</span>
        <span>stats card</span>
      </div>
      <div style={{ display: "flex", marginTop: 36, color: "#929eac", fontSize: 28 }}>
        City themes, contribution heatmaps, and PNG export.
      </div>
    </div>,
    size,
  );
}
