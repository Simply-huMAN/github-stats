import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MyGitStats — Developer Stats Cards & GitHub Wrapped";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#070709",
          backgroundImage:
            "radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.25), transparent 70%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.15), transparent 60%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#ffffff",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        {/* Brand pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "rgba(99, 102, 241, 0.15)",
            border: "1px solid rgba(99, 102, 241, 0.35)",
            borderRadius: "9999px",
            padding: "8px 24px",
            marginBottom: "32px",
            color: "#a5b4fc",
            fontSize: "20px",
            fontWeight: 600,
            letterSpacing: "0.05em",
          }}
        >
          <span>MYGITSTATS.DEV</span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 800,
            textAlign: "center",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: "24px",
            background:
              "linear-gradient(180deg, #ffffff 0%, #cbd5e1 60%, #94a3b8 100%)",
            backgroundClip: "text",
            color: "transparent",
            maxWidth: "1000px",
          }}
        >
          Developer Stats Cards &amp; Performance Tiers
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "26px",
            textAlign: "center",
            color: "#94a3b8",
            maxWidth: "850px",
            lineHeight: 1.4,
            marginBottom: "44px",
          }}
        >
          Turn your public GitHub activity into bespoke city-themed developer
          cards, performance ranks, and shareable annual stories.
        </div>

        {/* Feature Badges */}
        <div
          style={{
            display: "flex",
            gap: "16px",
          }}
        >
          {["Mythic • Gold • Bronze", "8 City Themes", "3x Retina PNG Export", "GitHub Wrapped"].map(
            (badge) => (
              <div
                key={badge}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "12px",
                  padding: "10px 20px",
                  fontSize: "17px",
                  color: "#e2e8f0",
                }}
              >
                {badge}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

