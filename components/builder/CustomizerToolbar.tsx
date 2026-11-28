"use client";

import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { getHeatmapPalette } from "@/components/ContributionHeatmap";
import { CITY_THEMES } from "@/lib/themes/cityThemes";
import {
  AVATAR_FRAME_CONFIG,
  AVATAR_BADGE_CONFIG,
  CARD_BACKGROUND_CONFIG,
} from "@/lib/themes/frameStyles";
import { cn } from "@/lib/utils";
import type { CustomizerOptions } from "@/types/builder";

interface CustomizerToolbarProps {
  options: CustomizerOptions;
  onChange: (options: CustomizerOptions) => void;
  onReset: () => void;
}

const categories = [
  { key: "themeMode", label: "Theme" },
  { key: "avatarFrame", label: "Frame" },
  { key: "avatarBadge", label: "Badge" },
  { key: "cardBackground", label: "Backdrop" },
] as const;

const themeChoices = [
  { id: "auto" as const, name: "Default", color: "#39d353" },
  ...Object.values(CITY_THEMES).map((city) => ({
    id: city.id,
    name: city.name,
    color: getHeatmapPalette(city.id, "Mythic")[4],
  })),
];

export function CustomizerToolbar({ options, onChange, onReset }: CustomizerToolbarProps) {
  const [category, setCategory] = useState<(typeof categories)[number]["key"]>("themeMode");
  const hasBackdrops = options.cardStyle === "showcase";
  const visibleCategories = hasBackdrops ? categories : categories.filter(({ key }) => key !== "cardBackground");
  const activeCategory = !hasBackdrops && category === "cardBackground" ? "themeMode" : category;
  const showHeatmap = options.showHeatmap !== false;

  const choices = {
    themeMode: themeChoices.map((theme) => ({
      id: theme.id,
      label: theme.name,
      sample: <span className="size-3 rounded-sm" style={{ backgroundColor: theme.color }} />,
    })),
    avatarFrame: Object.values(AVATAR_FRAME_CONFIG).map((frame) => ({
      id: frame.id,
      label: frame.label,
      sample: <span className={cn("size-5 border border-site-control bg-site-panel", frame.imgClassName)} />,
    })),
    avatarBadge: Object.values(AVATAR_BADGE_CONFIG).map((badge) => ({
      id: badge.id,
      label: badge.label,
      sample: badge.renderIcon("Gold"),
    })),
    cardBackground: Object.values(CARD_BACKGROUND_CONFIG).map((background) => ({
      id: background.id,
      label: background.label,
      sample: <span className="h-4 w-5 rounded border border-site-control bg-site-panel" style={background.overlayStyle} />,
    })),
  };

  return (
    <section aria-labelledby="card-appearance" className="min-w-0 rounded-lg border border-site-line bg-site-panel p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 id="card-appearance" className="text-sm font-semibold">Appearance</h2>
        <button type="button" onClick={onReset} className="inline-flex items-center gap-1.5 rounded px-1 py-2 font-mono text-xs text-site-muted hover:text-foreground">
          <RotateCcw size={13} aria-hidden="true" /> Reset
        </button>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1 border-b border-site-line pb-3 min-[380px]:grid-cols-4" role="group" aria-label="Appearance settings">
        {visibleCategories.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            aria-pressed={activeCategory === key}
            onClick={() => setCategory(key)}
            className="rounded-md px-1 py-2 font-mono text-xs text-site-muted hover:text-foreground aria-pressed:bg-site-inset aria-pressed:text-foreground aria-pressed:ring-1 aria-pressed:ring-inset aria-pressed:ring-site-control"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 min-[480px]:grid-cols-3" role="group" aria-label={categories.find(({ key }) => key === activeCategory)?.label}>
        {choices[activeCategory].map(({ id, label, sample }) => (
          <button
            key={id}
            type="button"
            aria-pressed={options[activeCategory] === id}
            onClick={() => onChange({ ...options, [activeCategory]: id })}
            className="flex min-h-14 flex-col justify-between gap-2 rounded-md border border-site-line bg-site-inset px-2.5 py-2 text-left text-xs text-site-muted hover:border-site-control hover:text-foreground aria-pressed:border-site-green aria-pressed:text-foreground"
          >
            <span className="flex min-h-5 w-full items-center justify-between gap-1" aria-hidden="true">
              {sample}
              {options[activeCategory] === id && <Check size={13} className="text-site-green" />}
            </span>
            {label}
          </button>
        ))}
      </div>

      <label className="mt-4 inline-flex min-h-8 cursor-pointer items-center gap-2 font-mono text-xs text-site-muted">
        <input
          type="checkbox"
          className="size-4 accent-site-green"
          checked={showHeatmap}
          onChange={(event) => onChange({ ...options, showHeatmap: event.target.checked })}
        />
        Show contribution heatmap
      </label>
    </section>
  );
}
