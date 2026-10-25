import { CityThemeConfig, CityThemeId } from "@/types/builder";

export const CITY_THEMES: Record<CityThemeId, CityThemeConfig> = {
  tokyo: {
    id: "tokyo",
    name: "Tokyo",
    tagline: "Shibuya Cyberpunk Night",
    swatch: "from-cyan-400 via-indigo-500 to-fuchsia-500",
    outerContainer:
      "bg-gradient-to-br from-[#0b0816] via-[#090518] to-[#04010a] text-cyan-50 border border-cyan-500/50 shadow-2xl shadow-indigo-950/80 ring-1 ring-fuchsia-500/30",
    ambientBg:
      "radial-gradient(circle at 15% 15%, rgba(6, 182, 212, 0.28), transparent 50%), radial-gradient(circle at 85% 85%, rgba(236, 72, 153, 0.24), transparent 50%)",
    borderGlow:
      "shadow-[0_15px_50px_-5px_rgba(6,182,212,0.35),0_0_30px_rgba(236,72,153,0.25)]",
    topStripe: "bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-500",
    badgeStyle:
      "bg-gradient-to-r from-cyan-500/20 via-indigo-500/25 to-pink-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.5)]",
    badgeText: "text-cyan-300",
    accentGradient:
      "text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-pink-300 to-purple-300",
    metricCardBg:
      "bg-[#0e0a24]/50 border border-indigo-700/40 hover:border-cyan-400/50",
    metricIconColor: "text-cyan-400",
    watermarkColor: "text-cyan-400/80",
    avatarBorder: "border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.5)]",
    glowDot: "bg-cyan-400 shadow-[0_0_6px_#22d3ee]",
  },

  berlin: {
    id: "berlin",
    name: "Berlin",
    tagline: "Industrial Techno Minimal",
    swatch: "from-zinc-700 via-neutral-900 to-lime-400",
    outerContainer:
      "bg-gradient-to-br from-[#121214] via-[#0d0d0f] to-[#08080a] text-zinc-100 border border-zinc-700/70 shadow-2xl shadow-black/80 ring-1 ring-lime-400/20",
    ambientBg:
      "radial-gradient(circle at 80% 20%, rgba(163, 230, 53, 0.12), transparent 55%), radial-gradient(circle at 20% 80%, rgba(63, 63, 70, 0.2), transparent 60%)",
    borderGlow:
      "shadow-[0_15px_45px_-10px_rgba(0,0,0,0.9),0_0_20px_rgba(163,230,53,0.15)]",
    topStripe: "bg-gradient-to-r from-zinc-600 via-lime-400 to-neutral-700",
    badgeStyle:
      "bg-lime-950/60 text-lime-300 border border-lime-400/50 shadow-[0_0_12px_rgba(163,230,53,0.3)]",
    badgeText: "text-lime-300",
    accentGradient:
      "text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-lime-300 to-stone-400",
    metricCardBg:
      "bg-zinc-900/80 border border-zinc-800 hover:border-lime-500/50",
    metricIconColor: "text-lime-400",
    watermarkColor: "text-lime-500/80",
    avatarBorder: "border-lime-400/80 shadow-[0_0_10px_rgba(163,230,53,0.35)]",
    glowDot: "bg-lime-400 shadow-[0_0_6px_#a3e635]",
  },

  bangalore: {
    id: "bangalore",
    name: "Bangalore",
    tagline: "Silicon Capital High-Velocity",
    swatch: "from-emerald-400 via-teal-500 to-cyan-500",
    outerContainer:
      "bg-gradient-to-br from-[#031513] via-[#020e0d] to-[#010807] text-emerald-50 border border-emerald-500/50 shadow-2xl shadow-emerald-950/70 ring-1 ring-emerald-400/20",
    ambientBg:
      "radial-gradient(circle at 15% 15%, rgba(16, 185, 129, 0.25), transparent 50%), radial-gradient(circle at 85% 85%, rgba(20, 184, 166, 0.18), transparent 55%)",
    borderGlow:
      "shadow-[0_15px_45px_-8px_rgba(16,185,129,0.3),0_0_25px_rgba(45,212,191,0.2)]",
    topStripe: "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400",
    badgeStyle:
      "bg-emerald-950/70 text-emerald-300 border border-emerald-400/60 shadow-[0_0_14px_rgba(16,185,129,0.35)]",
    badgeText: "text-emerald-300",
    accentGradient:
      "text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300",
    metricCardBg:
      "bg-emerald-950/30 border border-emerald-800/40 hover:border-emerald-400/50",
    metricIconColor: "text-emerald-400",
    watermarkColor: "text-emerald-400/80",
    avatarBorder: "border-emerald-400/80 shadow-[0_0_12px_rgba(16,185,129,0.4)]",
    glowDot: "bg-emerald-400 shadow-[0_0_6px_#34d399]",
  },

  hyderabad: {
    id: "hyderabad",
    name: "Hyderabad",
    tagline: "City of Pearls & Royal Amethyst",
    swatch: "from-purple-600 via-fuchsia-500 to-amber-300",
    outerContainer:
      "bg-gradient-to-br from-[#1a0a2a] via-[#11051c] to-[#08020d] text-purple-50 border border-purple-500/50 shadow-2xl shadow-purple-950/70 ring-1 ring-amber-400/30",
    ambientBg:
      "radial-gradient(circle at 80% 15%, rgba(251, 191, 36, 0.18), transparent 55%), radial-gradient(circle at 20% 85%, rgba(168, 85, 247, 0.22), transparent 55%)",
    borderGlow:
      "shadow-[0_15px_50px_-8px_rgba(168,85,247,0.35),0_0_25px_rgba(251,191,36,0.2)]",
    topStripe: "bg-gradient-to-r from-purple-500 via-amber-400 to-fuchsia-500",
    badgeStyle:
      "bg-gradient-to-r from-purple-900/60 to-amber-900/40 text-amber-300 border border-amber-400/60 shadow-[0_0_14px_rgba(251,191,36,0.3)]",
    badgeText: "text-amber-300",
    accentGradient:
      "text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-300 to-amber-300",
    metricCardBg:
      "bg-purple-950/30 border border-purple-800/40 hover:border-amber-400/50",
    metricIconColor: "text-amber-400",
    watermarkColor: "text-amber-400/80",
    avatarBorder: "border-amber-400/80 shadow-[0_0_12px_rgba(251,191,36,0.4)]",
    glowDot: "bg-amber-400 shadow-[0_0_6px_#fbbf24]",
  },

  "san-francisco": {
    id: "san-francisco",
    name: "San Francisco",
    tagline: "Golden Gate Sunset Modernism",
    swatch: "from-orange-500 via-rose-500 to-amber-400",
    outerContainer:
      "bg-gradient-to-br from-[#1c120f] via-[#120a08] to-[#0a0504] text-orange-50 border border-orange-500/50 shadow-2xl shadow-orange-950/60 ring-1 ring-rose-400/20",
    ambientBg:
      "radial-gradient(circle at 85% 15%, rgba(249, 115, 22, 0.22), transparent 55%), radial-gradient(circle at 15% 85%, rgba(244, 63, 94, 0.16), transparent 55%)",
    borderGlow:
      "shadow-[0_15px_45px_-8px_rgba(249,115,22,0.3),0_0_25px_rgba(244,63,94,0.18)]",
    topStripe: "bg-gradient-to-r from-orange-500 via-rose-500 to-amber-400",
    badgeStyle:
      "bg-gradient-to-r from-orange-500/20 to-rose-500/20 text-orange-300 border border-orange-400/60 shadow-[0_0_12px_rgba(249,115,22,0.35)]",
    badgeText: "text-orange-300",
    accentGradient:
      "text-transparent bg-clip-text bg-gradient-to-r from-orange-200 via-rose-300 to-amber-300",
    metricCardBg:
      "bg-orange-950/30 border border-orange-800/40 hover:border-orange-500/50",
    metricIconColor: "text-orange-400",
    watermarkColor: "text-orange-400/80",
    avatarBorder: "border-orange-400/80 shadow-[0_0_12px_rgba(249,115,22,0.4)]",
    glowDot: "bg-orange-400 shadow-[0_0_6px_#fb923c]",
  },

  paris: {
    id: "paris",
    name: "Paris",
    tagline: "Haute Couture & Champagne Gold",
    swatch: "from-slate-800 via-neutral-900 to-amber-200",
    outerContainer:
      "bg-gradient-to-br from-[#0b0c12] via-[#07070b] to-[#030305] text-amber-50 border border-amber-300/40 shadow-2xl shadow-black/80 ring-1 ring-amber-200/20",
    ambientBg:
      "radial-gradient(circle at 50% 10%, rgba(245, 230, 185, 0.14), transparent 60%), radial-gradient(circle at 80% 85%, rgba(30, 41, 59, 0.25), transparent 60%)",
    borderGlow:
      "shadow-[0_15px_45px_-10px_rgba(0,0,0,0.9),0_0_20px_rgba(245,230,185,0.16)]",
    topStripe: "bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-400",
    badgeStyle:
      "bg-black/60 text-amber-200 border border-amber-300/50 shadow-[0_0_12px_rgba(245,230,185,0.25)]",
    badgeText: "text-amber-200",
    accentGradient:
      "text-transparent bg-clip-text bg-gradient-to-r from-stone-100 via-amber-200 to-yellow-300",
    metricCardBg:
      "bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-300/40",
    metricIconColor: "text-amber-200",
    watermarkColor: "text-amber-300/70",
    avatarBorder: "border-amber-200/70 shadow-[0_0_10px_rgba(245,230,185,0.3)]",
    glowDot: "bg-amber-200 shadow-[0_0_6px_#fde68a]",
  },

  frankfurt: {
    id: "frankfurt",
    name: "Frankfurt",
    tagline: "Titanium Skyline & Euro Steel",
    swatch: "from-slate-600 via-sky-500 to-blue-600",
    outerContainer:
      "bg-gradient-to-br from-[#090e18] via-[#060910] to-[#020408] text-sky-50 border border-sky-500/50 shadow-2xl shadow-sky-950/70 ring-1 ring-sky-400/20",
    ambientBg:
      "radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.2), transparent 50%), radial-gradient(circle at 20% 80%, rgba(30, 58, 138, 0.25), transparent 60%)",
    borderGlow:
      "shadow-[0_15px_45px_-8px_rgba(56,189,248,0.28),0_0_22px_rgba(14,165,233,0.18)]",
    topStripe: "bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500",
    badgeStyle:
      "bg-sky-950/70 text-sky-300 border border-sky-400/50 shadow-[0_0_14px_rgba(56,189,248,0.3)]",
    badgeText: "text-sky-300",
    accentGradient:
      "text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-blue-300 to-cyan-300",
    metricCardBg:
      "bg-sky-950/30 border border-sky-800/40 hover:border-sky-400/50",
    metricIconColor: "text-sky-400",
    watermarkColor: "text-sky-400/80",
    avatarBorder: "border-sky-400/80 shadow-[0_0_12px_rgba(56,189,248,0.4)]",
    glowDot: "bg-sky-400 shadow-[0_0_6px_#38bdf8]",
  },

  shanghai: {
    id: "shanghai",
    name: "Shanghai",
    tagline: "The Bund Imperial Ruby & Gold",
    swatch: "from-rose-600 via-red-500 to-amber-400",
    outerContainer:
      "bg-gradient-to-br from-[#1a060a] via-[#100306] to-[#070103] text-rose-50 border border-rose-500/50 shadow-2xl shadow-rose-950/70 ring-1 ring-amber-400/30",
    ambientBg:
      "radial-gradient(circle at 15% 15%, rgba(225, 29, 72, 0.25), transparent 50%), radial-gradient(circle at 85% 85%, rgba(245, 158, 11, 0.2), transparent 55%)",
    borderGlow:
      "shadow-[0_15px_45px_-8px_rgba(225,29,72,0.35),0_0_25px_rgba(245,158,11,0.2)]",
    topStripe: "bg-gradient-to-r from-rose-500 via-red-500 to-amber-400",
    badgeStyle:
      "bg-gradient-to-r from-rose-900/60 to-red-950/70 text-rose-300 border border-rose-400/60 shadow-[0_0_14px_rgba(225,29,72,0.35)]",
    badgeText: "text-rose-300",
    accentGradient:
      "text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-amber-300 to-red-400",
    metricCardBg:
      "bg-rose-950/30 border border-rose-800/40 hover:border-amber-400/50",
    metricIconColor: "text-rose-400",
    watermarkColor: "text-rose-400/80",
    avatarBorder: "border-rose-400/80 shadow-[0_0_12px_rgba(225,29,72,0.4)]",
    glowDot: "bg-rose-400 shadow-[0_0_6px_#fb7185]",
  },
};
