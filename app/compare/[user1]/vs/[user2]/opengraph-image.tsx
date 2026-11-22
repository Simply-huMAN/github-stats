import { ImageResponse } from "next/og";
import { validateComparisonPair } from "@/lib/validation";

export const runtime = "edge";
export const alt = "GitHub Developer Showdown — Head-to-Head Battle";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface Props {
  params: {
    user1: string;
    user2: string;
  };
}

export default async function ShowdownOpenGraphImage({ params }: Props) {
  let u1Raw = params.user1 || "";
  let u2Raw = params.user2 || "";
  try {
    u1Raw = decodeURIComponent(u1Raw);
    u2Raw = decodeURIComponent(u2Raw);
  } catch {}

  const val = validateComparisonPair(u1Raw, u2Raw);

  const u1Name = val.user1 || u1Raw || "User 1";
  const u2Name = val.user2 || u2Raw || "User 2";

  const u1Initial = u1Name.charAt(0).toUpperCase();
  const u2Initial = u2Name.charAt(0).toUpperCase();

  const u1FontSize = u1Name.length > 18 ? "28px" : u1Name.length > 12 ? "34px" : "42px";
  const u2FontSize = u2Name.length > 18 ? "28px" : u2Name.length > 12 ? "34px" : "42px";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#070709",
          backgroundImage:
            "radial-gradient(circle at 18% 40%, rgba(99, 102, 241, 0.28), transparent 55%), radial-gradient(circle at 82% 40%, rgba(245, 158, 11, 0.24), transparent 55%), radial-gradient(circle at 50% 10%, rgba(255, 255, 255, 0.05), transparent 45%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#ffffff",
          padding: "44px 56px",
          position: "relative",
        }}
      >
        {/* Top Header Pill & Subtitle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              borderRadius: "9999px",
              padding: "6px 20px",
              color: "#e2e8f0",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            <span>MYGITSTATS.DEV • DEVELOPER SHOWDOWN</span>
          </div>

          <div
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#94a3b8",
              letterSpacing: "-0.01em",
            }}
          >
            Who has the higher open-source ranking?
          </div>
        </div>

        {/* Center Battle Arena - Contender 1 VS Contender 2 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            gap: "24px",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          {/* Contender 1 Card (Electric Indigo) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              maxWidth: "460px",
              backgroundColor: "rgba(99, 102, 241, 0.08)",
              border: "2px solid rgba(99, 102, 241, 0.4)",
              borderRadius: "24px",
              padding: "28px 24px",
              position: "relative",
            }}
          >
            {/* Contender 1 Label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(99, 102, 241, 0.2)",
                border: "1px solid rgba(99, 102, 241, 0.5)",
                borderRadius: "9999px",
                padding: "4px 14px",
                color: "#a5b4fc",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                marginBottom: "16px",
              }}
            >
              CONTENDER 1
            </div>

            {/* Avatar Circle */}
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
                border: "4px solid #818cf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "42px",
                fontWeight: 900,
                color: "#ffffff",
                marginBottom: "16px",
              }}
            >
              {u1Initial}
            </div>

            {/* Username */}
            <div
              style={{
                fontSize: u1FontSize,
                fontWeight: 800,
                color: "#ffffff",
                textAlign: "center",
                maxWidth: "380px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: 1.2,
                marginBottom: "6px",
              }}
            >
              {u1Name}
            </div>

            {/* Handle */}
            <div
              style={{
                fontSize: "16px",
                color: "#818cf8",
                fontWeight: 600,
                marginBottom: "16px",
              }}
            >
              {`github.com/${u1Name}`}
            </div>

            {/* Micro Tags */}
            <div style={{ display: "flex", gap: "8px" }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  backgroundColor: "rgba(99, 102, 241, 0.15)",
                  color: "#c7d2fe",
                  borderRadius: "8px",
                  padding: "4px 10px",
                }}
              >
                ⚡ Tier Score
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "#cbd5e1",
                  borderRadius: "8px",
                  padding: "4px 10px",
                }}
              >
                ⭐ Star Power
              </div>
            </div>
          </div>

          {/* Glowing Central "VS" Battle Badge */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "74px",
                height: "74px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #18181b 0%, #09090b 100%)",
                border: "3px solid #f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 25px rgba(245, 158, 11, 0.4)",
              }}
            >
              <span
                style={{
                  fontSize: "30px",
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #ffffff 0%, #fbbf24 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                  letterSpacing: "0.02em",
                }}
              >
                VS
              </span>
            </div>

            <div
              style={{
                fontSize: "11px",
                fontWeight: 800,
                color: "#f59e0b",
                letterSpacing: "0.15em",
              }}
            >
              BATTLE
            </div>
          </div>

          {/* Contender 2 Card (Yellow-Orange / Amber) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              maxWidth: "460px",
              backgroundColor: "rgba(245, 158, 11, 0.08)",
              border: "2px solid rgba(245, 158, 11, 0.4)",
              borderRadius: "24px",
              padding: "28px 24px",
              position: "relative",
            }}
          >
            {/* Contender 2 Label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(245, 158, 11, 0.2)",
                border: "1px solid rgba(245, 158, 11, 0.5)",
                borderRadius: "9999px",
                padding: "4px 14px",
                color: "#fde68a",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                marginBottom: "16px",
              }}
            >
              CONTENDER 2
            </div>

            {/* Avatar Circle */}
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                border: "4px solid #fbbf24",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "42px",
                fontWeight: 900,
                color: "#ffffff",
                marginBottom: "16px",
              }}
            >
              {u2Initial}
            </div>

            {/* Username */}
            <div
              style={{
                fontSize: u2FontSize,
                fontWeight: 800,
                color: "#ffffff",
                textAlign: "center",
                maxWidth: "380px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: 1.2,
                marginBottom: "6px",
              }}
            >
              {u2Name}
            </div>

            {/* Handle */}
            <div
              style={{
                fontSize: "16px",
                color: "#fbbf24",
                fontWeight: 600,
                marginBottom: "16px",
              }}
            >
              {`github.com/${u2Name}`}
            </div>

            {/* Micro Tags */}
            <div style={{ display: "flex", gap: "8px" }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  backgroundColor: "rgba(245, 158, 11, 0.15)",
                  color: "#fef3c7",
                  borderRadius: "8px",
                  padding: "4px 10px",
                }}
              >
                🔥 90d Velocity
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "#cbd5e1",
                  borderRadius: "8px",
                  padding: "4px 10px",
                }}
              >
                👥 Reach
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Bar & CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "12px 24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              fontSize: "14px",
              color: "#94a3b8",
              fontWeight: 600,
            }}
          >
            <span>🏆 Mythic • Gold • Bronze Ranks</span>
            <span>•</span>
            <span>📊 6 Comparative Dimensions</span>
            <span>•</span>
            <span>⚡ Edge-Cached</span>
          </div>

          <div
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#fbbf24",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>Click to view full head-to-head breakdown →</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

