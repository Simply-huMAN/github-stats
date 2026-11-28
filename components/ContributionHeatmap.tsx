"use client";

import React, { useMemo } from "react";
import { GitCommit } from "lucide-react";
import { ContributionCalendar, TierType } from "@/types/stats";
import { ThemeMode } from "@/types/builder";
import { cn } from "@/lib/utils";

export interface ContributionHeatmapProps {
  calendar?: ContributionCalendar;
  themeMode?: ThemeMode;
  tier?: TierType;
  className?: string;
  compact?: boolean;
}

const HEATMAP_PALETTES: Record<string, [string, string, string, string, string]> = {
  // Classic GitHub emerald green
  "site-green": ["rgba(255, 255, 255, 0.06)", "#0e4429", "#006d32", "#26a641", "#39d353"],
  // City themes
  tokyo: ["rgba(255, 255, 255, 0.06)", "#1e1b4b", "#4338ca", "#818cf8", "#06b6d4"],
  berlin: ["rgba(255, 255, 255, 0.06)", "#27272a", "#52525b", "#a1a1aa", "#f4f4f5"],
  bangalore: ["rgba(255, 255, 255, 0.06)", "#064e3b", "#047857", "#10b981", "#34d399"],
  hyderabad: ["rgba(255, 255, 255, 0.06)", "#451a03", "#92400e", "#d97706", "#fbbf24"],
  "san-francisco": ["rgba(255, 255, 255, 0.06)", "#134e4a", "#0f766e", "#14b8a6", "#2dd4bf"],
  paris: ["rgba(255, 255, 255, 0.06)", "#3b0764", "#7e22ce", "#c084fc", "#e9d5ff"],
  frankfurt: ["rgba(255, 255, 255, 0.06)", "#1e293b", "#334155", "#64748b", "#cbd5e1"],
  shanghai: ["rgba(255, 255, 255, 0.06)", "#450a0a", "#991b1b", "#ef4444", "#f59e0b"],
  // Tier fallbacks
  Bronze: ["rgba(255, 255, 255, 0.06)", "#27272a", "#52525b", "#a1a1aa", "#e4e4e7"],
  Gold: ["rgba(255, 255, 255, 0.06)", "#451a03", "#92400e", "#d97706", "#fbbf24"],
  Mythic: ["rgba(255, 255, 255, 0.06)", "#1e1b4b", "#4338ca", "#818cf8", "#22d3ee"],
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function getHeatmapPalette(theme: ThemeMode, tier: TierType) {
  const palette = HEATMAP_PALETTES[theme];
  return Array.isArray(palette) ? palette : HEATMAP_PALETTES[tier] ?? HEATMAP_PALETTES["site-green"];
}

export function ContributionHeatmap({
  calendar,
  themeMode = "auto",
  tier = "Gold",
  className,
  compact = false,
}: ContributionHeatmapProps) {
  const palette = getHeatmapPalette(themeMode, tier);

  const weeks = calendar?.weeks || [];
  const totalContributions = calendar?.totalContributions ?? 0;

  // Month label positions across the 52 columns
  const monthLabels = useMemo(() => {
    if (weeks.length === 0) return [];
    const labels: { text: string; x: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((w, idx) => {
      const firstDay = w.contributionDays[0];
      if (firstDay && firstDay.date) {
        const month = new Date(firstDay.date).getUTCMonth();
        if (month !== lastMonth && (idx === 0 || idx - (labels[labels.length - 1]?.x / 9.5 || 0) > 3)) {
          labels.push({ text: MONTH_NAMES[month], x: idx * 9.5 + 18 });
          lastMonth = month;
        }
      }
    });

    return labels;
  }, [weeks]);

  // Layout parameters for SVG
  // 52 weeks * 9.5px = 494px. Left margin for day labels (M, W, F) = 16px. Total width ~ 520px
  const cellWidth = 7;
  const cellHeight = 7;
  const cellGap = 2.5;
  const offsetX = 16;
  const offsetY = 14;

  return (
    <div
      className={cn(
        compact
          ? "mt-4"
          : "relative z-10 mt-3 sm:mt-4 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 transition-all",
        className
      )}
    >
      {/* Header with Title & Legend */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[10px] sm:text-[11px] font-mono text-site-muted">
        <div className="flex items-center gap-1.5">
          {!compact && <GitCommit className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />}
          <span>{totalContributions.toLocaleString("en-US")} contributions</span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1 text-[10px]" aria-hidden="true">
          <span>Less</span>
          {palette.map((color, i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-[1.5px] border border-white/10"
              style={{ backgroundColor: color }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Responsive SVG Grid */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox="0 0 520 80"
          className="w-full h-auto block select-none"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`GitHub contribution heatmap showing ${totalContributions} contributions`}
        >
          {/* Month labels */}
          {monthLabels.map((lbl, i) => (
            <text
              key={i}
              x={lbl.x}
              y={8}
              fill={compact ? "#929eac" : "#71717a"}
              fontSize="8"
              fontFamily="monospace"
              fontWeight="500"
            >
              {lbl.text}
            </text>
          ))}

          {/* Weekday labels (Mon=1, Wed=3, Fri=5) */}
          <text x={0} y={offsetY + 1 * (cellHeight + cellGap) + 5.5} fill="#929eac" fontSize="7" fontFamily="monospace">
            M
          </text>
          <text x={0} y={offsetY + 3 * (cellHeight + cellGap) + 5.5} fill="#929eac" fontSize="7" fontFamily="monospace">
            W
          </text>
          <text x={0} y={offsetY + 5 * (cellHeight + cellGap) + 5.5} fill="#929eac" fontSize="7" fontFamily="monospace">
            F
          </text>

          {/* 52 Columns of 7 Days */}
          {weeks.map((week, wIdx) => {
            const x = offsetX + wIdx * (cellWidth + cellGap);
            return (
              <g key={wIdx}>
                {week.contributionDays.map((day, dIdx) => {
                  const y = offsetY + dIdx * (cellHeight + cellGap);
                  const color = palette[day.level] || palette[0];
                  return (
                    <rect
                      key={day.date || `${wIdx}-${dIdx}`}
                      x={x}
                      y={y}
                      width={cellWidth}
                      height={cellHeight}
                      rx={1.5}
                      ry={1.5}
                      fill={color}
                      stroke="rgba(255, 255, 255, 0.05)"
                      strokeWidth={0.5}
                    >
                      <title>{`${day.count} contributions on ${day.date}`}</title>
                    </rect>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

