"use client";

import React from "react";
import { MetricComparison } from "@/types/compare";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonMetricsTableProps {
  metrics: MetricComparison[];
  user1Name: string;
  user2Name: string;
}

export function ComparisonMetricsTable({
  metrics,
  user1Name,
  user2Name,
}: ComparisonMetricsTableProps) {
  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-2 p-4 sm:p-5 border-b border-zinc-800/80 bg-zinc-900/50 text-xs font-mono font-bold uppercase tracking-wider">
        <div className="col-span-5 sm:col-span-4 text-left truncate text-indigo-400">
          {user1Name}
        </div>
        <div className="col-span-2 sm:col-span-4 text-center text-zinc-400">
          Metric Showdown
        </div>
        <div className="col-span-5 sm:col-span-4 text-right truncate text-purple-400">
          {user2Name}
        </div>
      </div>

      {/* Metric Rows */}
      <div className="divide-y divide-zinc-800/60">
        {metrics.map((m) => {
          const total = m.user1Value + m.user2Value;
          const u1Percent = total > 0 ? Math.round((m.user1Value / total) * 100) : 50;
          const u2Percent = total > 0 ? 100 - u1Percent : 50;

          return (
            <div
              key={m.key}
              className="p-4 sm:p-5 hover:bg-zinc-900/30 transition-colors flex flex-col gap-2.5"
            >
              {/* Top Row: Values and Metric Name */}
              <div className="grid grid-cols-12 items-center gap-2">
                {/* User 1 Value (Indigo) */}
                <div className="col-span-4 flex items-center gap-2">
                  <span
                    className={cn(
                      "text-base sm:text-xl font-bold font-mono tracking-tight",
                      m.winner === 1 ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]" : "text-zinc-300"
                    )}
                  >
                    {m.user1Value.toLocaleString()}
                    {m.unit && m.key !== "tierScore" && ` ${m.unit}`}
                  </span>
                  {m.winner === 1 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 shadow-sm">
                      <Trophy className="w-3 h-3 text-indigo-400" />
                      Win
                    </span>
                  )}
                </div>

                {/* Central Metric Name */}
                <div className="col-span-4 text-center flex flex-col items-center">
                  <span className="text-xs sm:text-sm font-semibold text-zinc-200">
                    {m.label}
                  </span>
                  <span className="hidden sm:inline text-[11px] text-zinc-500 line-clamp-1">
                    {m.description}
                  </span>
                </div>

                {/* User 2 Value (Purple) */}
                <div className="col-span-4 flex items-center justify-end gap-2 text-right">
                  {m.winner === 2 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 text-[10px] font-semibold text-purple-300 shadow-sm">
                      <Trophy className="w-3 h-3 text-purple-400" />
                      Win
                    </span>
                  )}
                  <span
                    className={cn(
                      "text-base sm:text-xl font-bold font-mono tracking-tight",
                      m.winner === 2 ? "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" : "text-zinc-300"
                    )}
                  >
                    {m.user2Value.toLocaleString()}
                    {m.unit && m.key !== "tierScore" && ` ${m.unit}`}
                  </span>
                </div>
              </div>

              {/* Bottom Visual Comparison Progress Bar */}
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "text-[10px] font-mono w-8 text-left",
                    m.winner === 1 ? "text-indigo-400 font-bold" : "text-zinc-500"
                  )}
                >
                  {u1Percent}%
                </span>
                <div className="flex-1 h-2 rounded-full overflow-hidden bg-zinc-800 flex">
                  {/* User 1 Segment (Indigo) */}
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      m.winner === 1
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.6)]"
                        : "bg-indigo-500/40"
                    )}
                    style={{ width: `${u1Percent}%` }}
                  />
                  {/* User 2 Segment (Purple) */}
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      m.winner === 2
                        ? "bg-gradient-to-l from-purple-600 to-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.6)]"
                        : "bg-purple-500/40"
                    )}
                    style={{ width: `${u2Percent}%` }}
                  />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-mono w-8 text-right",
                    m.winner === 2 ? "text-purple-400 font-bold" : "text-zinc-500"
                  )}
                >
                  {u2Percent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
