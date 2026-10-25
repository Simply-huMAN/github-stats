"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Sliders,
  Crop,
  ShieldAlert,
  Layers,
  RotateCcw,
  Check,
} from "lucide-react";
import {
  CustomizerOptions,
  CityThemeId,
  AvatarFrameStyle,
  AvatarBadgeStyle,
  CardBackgroundStyle,
} from "@/types/builder";
import { CITY_THEMES } from "@/lib/themes/cityThemes";
import {
  AVATAR_FRAME_CONFIG,
  AVATAR_BADGE_CONFIG,
  CARD_BACKGROUND_CONFIG,
} from "@/lib/themes/frameStyles";
import { cn } from "@/lib/utils";

export interface CustomizerToolbarProps {
  options: CustomizerOptions;
  onChange: (options: CustomizerOptions) => void;
  onReset: () => void;
  className?: string;
}

type TabType = "theme" | "frame" | "badge" | "background";

export function CustomizerToolbar({
  options,
  onChange,
  onReset,
  className,
}: CustomizerToolbarProps) {
  const [activeTab, setActiveTab] = useState<TabType>("theme");

  const cityThemeKeys = Object.keys(CITY_THEMES) as CityThemeId[];
  const frameKeys = Object.keys(AVATAR_FRAME_CONFIG) as AvatarFrameStyle[];
  const badgeKeys = Object.keys(AVATAR_BADGE_CONFIG) as AvatarBadgeStyle[];
  const bgKeys = Object.keys(CARD_BACKGROUND_CONFIG) as CardBackgroundStyle[];

  return (
    <div
      className={cn(
        "w-full max-w-2xl rounded-xl sm:rounded-2xl bg-zinc-900/95 border border-zinc-800 p-3 sm:p-4 shadow-2xl backdrop-blur-xl select-none",
        className
      )}
    >
      {/* Category Tabs Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 gap-2">
        <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-black/40 rounded-xl border border-zinc-800 text-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("theme")}
            className={cn(
              "flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all text-xs whitespace-nowrap",
              activeTab === "theme"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Themes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("frame")}
            className={cn(
              "flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all text-xs whitespace-nowrap",
              activeTab === "frame"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Crop className="w-3.5 h-3.5" />
            <span>Frame</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("badge")}
            className={cn(
              "flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all text-xs whitespace-nowrap",
              activeTab === "badge"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Badge</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("background")}
            className={cn(
              "flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all text-xs whitespace-nowrap",
              activeTab === "background"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Backdrop</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors flex-shrink-0"
          title="Reset customization to default"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="pt-3">
        {/* Tab 1: Themes (City Themes & Auto Tier) */}
        {activeTab === "theme" && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Select City or Performance Style:</span>
              <span className="font-mono text-indigo-400 text-[11px] capitalize">
                {options.themeMode === "auto" ? "Auto (Calculated Tier)" : options.themeMode}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 sm:gap-2">
              {/* Default Auto Option */}
              <button
                type="button"
                onClick={() => onChange({ ...options, themeMode: "auto" })}
                className={cn(
                  "p-2 rounded-xl text-left border transition-all relative flex flex-col justify-between h-14 sm:h-16",
                  options.themeMode === "auto"
                    ? "bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-400/30 text-white"
                    : "bg-black/30 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-amber-400 via-indigo-400 to-zinc-400" />
                  {options.themeMode === "auto" && <Check className="w-3 h-3 text-indigo-400" />}
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold leading-tight">Tier Auto</div>
                  <div className="text-[9px] text-zinc-500 font-mono">Calculated</div>
                </div>
              </button>

              {/* 8 City Themes */}
              {cityThemeKeys.map((cityKey) => {
                const city = CITY_THEMES[cityKey];
                const isSelected = options.themeMode === cityKey;
                return (
                  <button
                    key={cityKey}
                    type="button"
                    onClick={() => onChange({ ...options, themeMode: cityKey })}
                    className={cn(
                      "p-2 rounded-xl text-left border transition-all relative flex flex-col justify-between h-14 sm:h-16",
                      isSelected
                        ? "bg-zinc-800/90 border-indigo-400 shadow-lg ring-1 ring-indigo-400/40 text-white"
                        : "bg-black/30 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={cn("w-3.5 h-3.5 rounded-full bg-gradient-to-r shadow-sm", city.swatch)} />
                      {isSelected && <Check className="w-3 h-3 text-cyan-400" />}
                    </div>
                    <div>
                      <div className="text-[11px] sm:text-xs font-bold leading-tight">{city.name}</div>
                      <div className="text-[9px] text-zinc-500 truncate">{city.tagline.split(" ")[0]}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Avatar Frame */}
        {activeTab === "frame" && (
          <div className="space-y-2.5">
            <div className="text-xs text-zinc-400">Choose Avatar Frame Geometry:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 sm:gap-2">
              {frameKeys.map((frameKey) => {
                const frame = AVATAR_FRAME_CONFIG[frameKey];
                const isSelected = options.avatarFrame === frameKey;
                return (
                  <button
                    key={frameKey}
                    type="button"
                    onClick={() => onChange({ ...options, avatarFrame: frameKey })}
                    className={cn(
                      "p-2.5 sm:p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 sm:gap-2",
                      isSelected
                        ? "bg-indigo-950/40 border-indigo-500 text-white shadow-md ring-1 ring-indigo-400/40"
                        : "bg-black/30 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                    )}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 sm:w-8 sm:h-8 bg-zinc-800 border-2 border-zinc-500 transition-all",
                        frame.imgClassName
                      )}
                    />
                    <span className="text-[11px] sm:text-xs font-medium truncate w-full">{frame.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Avatar Badge */}
        {activeTab === "badge" && (
          <div className="space-y-2.5">
            <div className="text-xs text-zinc-400">Choose Badge Style:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 sm:gap-2">
              {badgeKeys.map((badgeKey) => {
                const badge = AVATAR_BADGE_CONFIG[badgeKey];
                const isSelected = options.avatarBadge === badgeKey;
                return (
                  <button
                    key={badgeKey}
                    type="button"
                    onClick={() => onChange({ ...options, avatarBadge: badgeKey })}
                    className={cn(
                      "p-2.5 sm:p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 sm:gap-2",
                      isSelected
                        ? "bg-indigo-950/40 border-indigo-500 text-white shadow-md ring-1 ring-indigo-400/40"
                        : "bg-black/30 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                    )}
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-indigo-400">
                      {badge.renderIcon("Gold")}
                    </div>
                    <span className="text-[11px] sm:text-xs font-medium truncate w-full">{badge.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Card Backdrop Overlays */}
        {activeTab === "background" && (
          <div className="space-y-2.5">
            <div className="text-xs text-zinc-400">Choose Background Texture:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 sm:gap-2">
              {bgKeys.map((bgKey) => {
                const bg = CARD_BACKGROUND_CONFIG[bgKey];
                const isSelected = options.cardBackground === bgKey;
                return (
                  <button
                    key={bgKey}
                    type="button"
                    onClick={() => onChange({ ...options, cardBackground: bgKey })}
                    className={cn(
                      "p-2.5 sm:p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 sm:gap-2",
                      isSelected
                        ? "bg-indigo-950/40 border-indigo-500 text-white shadow-md ring-1 ring-indigo-400/40"
                        : "bg-black/30 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                    )}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-800 border border-zinc-700",
                        bg.overlayClass
                      )}
                      style={bg.overlayStyle}
                    />
                    <span className="text-[11px] sm:text-xs font-medium truncate w-full">{bg.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
