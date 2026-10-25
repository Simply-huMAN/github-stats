import React from "react";
import {
  ShieldCheck,
  Award,
  Sparkles,
  Flame,
  CheckCircle2,
  Crown,
  CircleDot,
} from "lucide-react";
import {
  AvatarBadgeStyle,
  AvatarFrameStyle,
  CardBackgroundStyle,
} from "@/types/builder";
import { TierType } from "@/types/stats";

export interface FrameStyleConfig {
  id: AvatarFrameStyle;
  label: string;
  imgClassName: string;
  wrapperClassName: string;
}

export const AVATAR_FRAME_CONFIG: Record<AvatarFrameStyle, FrameStyleConfig> = {
  squircle: {
    id: "squircle",
    label: "Squircle",
    imgClassName: "rounded-2xl",
    wrapperClassName: "rounded-2xl",
  },
  circle: {
    id: "circle",
    label: "Circle",
    imgClassName: "rounded-full",
    wrapperClassName: "rounded-full",
  },
  "cyber-hex": {
    id: "cyber-hex",
    label: "Cyber Hex",
    imgClassName: "rounded-lg [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]",
    wrapperClassName: "rounded-lg",
  },
  "neon-ring": {
    id: "neon-ring",
    label: "Neon Ring",
    imgClassName: "rounded-full ring-2 ring-cyan-400 ring-offset-2 ring-offset-black",
    wrapperClassName: "rounded-full shadow-[0_0_15px_rgba(6,182,212,0.6)]",
  },
  "brushed-metal": {
    id: "brushed-metal",
    label: "Brushed Metal",
    imgClassName: "rounded-2xl ring-2 ring-stone-400/80 ring-offset-2 ring-offset-zinc-950",
    wrapperClassName: "rounded-2xl shadow-[0_0_12px_rgba(214,211,209,0.3)]",
  },
};

export interface BadgeStyleConfig {
  id: AvatarBadgeStyle;
  label: string;
  renderIcon: (tier: TierType) => React.ReactNode;
}

export const AVATAR_BADGE_CONFIG: Record<AvatarBadgeStyle, BadgeStyleConfig> = {
  "tier-icon": {
    id: "tier-icon",
    label: "Tier Rank",
    renderIcon: (tier) => {
      if (tier === "Mythic") return <Sparkles className="w-3.5 h-3.5" />;
      if (tier === "Gold") return <Award className="w-3.5 h-3.5" />;
      return <ShieldCheck className="w-3.5 h-3.5" />;
    },
  },
  "verified-check": {
    id: "verified-check",
    label: "Verified",
    renderIcon: () => <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  fire: {
    id: "fire",
    label: "Velocity",
    renderIcon: () => <Flame className="w-3.5 h-3.5 fill-current" />,
  },
  "royal-crest": {
    id: "royal-crest",
    label: "Royal Crest",
    renderIcon: () => <Crown className="w-3.5 h-3.5" />,
  },
  "minimal-dot": {
    id: "minimal-dot",
    label: "Status Dot",
    renderIcon: () => <CircleDot className="w-3.5 h-3.5" />,
  },
};

export interface BackgroundStyleConfig {
  id: CardBackgroundStyle;
  label: string;
  overlayClass: string;
  overlayStyle?: React.CSSProperties;
}

export const CARD_BACKGROUND_CONFIG: Record<CardBackgroundStyle, BackgroundStyleConfig> = {
  "ambient-glow": {
    id: "ambient-glow",
    label: "Ambient Glow",
    overlayClass: "opacity-100",
  },
  "cyber-grid": {
    id: "cyber-grid",
    label: "Cyber Grid",
    overlayClass: "opacity-70",
    overlayStyle: {
      backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
      backgroundSize: "20px 20px",
    },
  },
  glassmorphic: {
    id: "glassmorphic",
    label: "Frosted Glass",
    overlayClass: "backdrop-blur-2xl bg-white/[0.03] border-white/10",
  },
  "mesh-gradient": {
    id: "mesh-gradient",
    label: "Mesh Glow",
    overlayClass: "opacity-90",
    overlayStyle: {
      backgroundImage: `radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.2) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.2) 0px, transparent 50%),
                        radial-gradient(at 50% 50%, rgba(6, 182, 212, 0.15) 0px, transparent 50%)`,
    },
  },
  "pure-minimal": {
    id: "pure-minimal",
    label: "Pure Matte",
    overlayClass: "opacity-0",
  },
};
