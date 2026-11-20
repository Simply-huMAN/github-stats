"use client";

import React from "react";
import { MetricComparison } from "@/types/compare";
import { Trophy, CheckCircle2, Minus, ArrowUp, ArrowDown } from "lucide-react";
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
      <div className="grid grid-cols-12 gap-2 p-4 sm:p-5 border-b border-zinc-800/80 bg-zinc-900/50 text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
        <div className="col-span-5 sm:col-span-4 text-left truncate">{user1Name}</div>
        <div className="col-span-2 sm:col-span-4 text-center">Metric Showdown</div>
        <div className="col-span-5 sm:col-span-4 text-right truncate">{user2Name}</div>
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
                {/* User 1 Value */}
                <div className="col-span-4 flex items-center gap-2">
                  <span
                    className={cn(
                      "text-base sm:text-xl font-bold font-mono tracking-tight",
                      m.winner === 1 ? "text-amber-400" : "text-zinc-300"
                    )}
                  >
                    {m.user1Value.toLocaleString()}
                    {m.unit && m.key !== "tierScore" && ` ${m.unit}`}
                  </span>
                  {m.winner === 1 && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                      <Trophy className="w-3 h-3 text-amber-400" />
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

                {/* User 2 Value */}
                <div className="col-span-4 flex items-center justify-end gap-2 text-right">
                  {m.winner === 2 && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      Win
                    </span>
                  )}
                  <span
                    className={cn(
                      "text-base sm:text-xl font-bold font-mono tracking-tight",
                      m.winner === 2 ? "text-amber-400" : "text-zinc-300"
                    )}
                  >
                    {m.user2Value.toLocaleString()}
                    {m.unit && m.key !== "tierScore" && ` ${m.unit}`}
                  </span>
                </div>
              </div>

              {/* Bottom Visual Comparison Progress Bar */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-zinc-500 w-8 text-left">
                  {u1Percent}%
                </span>
                <div className="flex-1 h-2 rounded-full overflow-hidden bg-zinc-800 flex">
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      m.winner === 1
                        ? "bg-gradient-to-r from-amber-500 to-amber-300"
                        : "bg-indigo-500/70"
                    )}
                    style={{ width: `${u1Percent}%` }}
                  />
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      m.winner === 2
                        ? "bg-gradient-to-l from-amber-500 to-amber-300"
                        : "bg-purple-500/70"
                    )}
                    style={{ width: `${u2Percent}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-zinc-500 w-8 text-right">
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
