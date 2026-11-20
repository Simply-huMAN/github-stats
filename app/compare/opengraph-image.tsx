import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Compare GitHub Developers Side-by-Side — MyGitStats Showdown";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function CompareHubOpenGraphImage() {
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
            "radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.22), transparent 60%), radial-gradient(circle at 80% 70%, rgba(245, 158, 11, 0.2), transparent 60%)",
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
            marginBottom: "28px",
            color: "#a5b4fc",
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          <span>MYGITSTATS.DEV • DEVELOPER SHOWDOWN</span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "62px",
            fontWeight: 900,
            textAlign: "center",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: "20px",
            background: "linear-gradient(180deg, #ffffff 0%, #e2e8f0 70%, #94a3b8 100%)",
            backgroundClip: "text",
            color: "transparent",
            maxWidth: "1050px",
          }}
        >
          Compare GitHub Developers Side-by-Side
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "24px",
            textAlign: "center",
            color: "#94a3b8",
            maxWidth: "850px",
            lineHeight: 1.4,
            marginBottom: "40px",
          }}
        >
          Match any two GitHub profiles. Compare weighted performance tiers, repository stars,
          follower reach, and active contribution velocity in real time.
        </div>

        {/* Showdown Badges */}
        <div
          style={{
            display: "flex",
            gap: "14px",
          }}
        >
          {[
            "Head-to-Head Metrics",
            "Performance Tier Battle",
            "Retina Battle Cards",
            "Zero OAuth Required",
          ].map((badge) => (
            <div
              key={badge}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "12px",
                padding: "10px 20px",
                fontSize: "16px",
                color: "#e2e8f0",
                fontWeight: 600,
              }}
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

