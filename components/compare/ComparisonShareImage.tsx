import { BrandMark } from "@/components/BrandMark";

export function ComparisonShareImage({ profiles }: { profiles?: [string, string] }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", width: "100%", height: "100%", padding: "64px 76px",
      color: "#e9eef4", backgroundColor: "#0a0c0e",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 27, marginBottom: 26 }}>
        <BrandMark size={38} color="#39d353" />
        <span>mygitstats.dev</span>
      </div>
      <div style={{ display: "flex", height: 2, backgroundColor: "#252e37" }} />
      <div style={{ display: "flex", marginTop: 50, fontWeight: 700, fontSize: 58, letterSpacing: "-0.035em" }}>
        Compare GitHub profiles
      </div>
      {profiles && (
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 33 }}>
          {profiles.map((profile, index) => (
            <div key={index} style={{
              display: "flex", flexDirection: "column", justifyContent: "center", gap: 12, flex: 1,
              minWidth: 0, height: 126, padding: "0 22px", backgroundColor: "#0e1216",
              border: "1px solid #252e37", borderRadius: 10,
            }}>
              <span style={{ color: "#929eac", fontSize: 20 }}>Profile {index + 1}</span>
              <span style={{ fontSize: profile.length > 28 ? 18 : profile.length > 18 ? 23 : 33, fontWeight: 700 }}>@{profile}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", fontSize: 26, color: "#929eac", marginTop: 30 }}>
        Repository stars, followers, and recent public GitHub activity.
      </div>
    </div>
  );
}
