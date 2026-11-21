"use client";

import React from "react";
import { MetricComparison } from "@/types/compare";
import { Trophy, HelpCircle, AlertTriangle } from "lucide-react";
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
      {/* Table Header: Desktop view */}
      <div className="hidden sm:grid grid-cols-12 gap-2 p-4 sm:p-5 border-b border-zinc-800/80 bg-zinc-900/50 text-xs font-mono font-bold uppercase tracking-wider">
        <div className="col-span-4 text-left truncate text-indigo-400 break-words">
          {user1Name}
        </div>
        <div className="col-span-4 text-center text-zinc-400">
          Metric Showdown
        </div>
        <div className="col-span-4 text-right truncate text-amber-400 break-words">
          {user2Name}
        </div>
      </div>

      {/* Table Header: Mobile view */}
      <div className="flex sm:hidden items-center justify-between p-3.5 border-b border-zinc-800/80 bg-zinc-900/50 text-xs font-mono font-bold uppercase tracking-wider">
        <span className="text-indigo-400 truncate max-w-[45%] break-all">{user1Name}</span>
        <span className="text-zinc-500 font-normal">vs</span>
        <span className="text-amber-400 truncate max-w-[45%] text-right break-all">{user2Name}</span>
      </div>

      {/* Metric Rows */}
      <div className="divide-y divide-zinc-800/60">
        {metrics.map((m) => {
          const isUndetermined = m.winner === "undetermined";
          const hasMissing = m.user1Missing || m.user2Missing;
          const total = m.user1Value + m.user2Value;
          const u1Percent = total > 0 && !hasMissing ? Math.round((m.user1Value / total) * 100) : 50;
          const u2Percent = total > 0 && !hasMissing ? 100 - u1Percent : 50;

          return (
            <div
              key={m.key}
              className="p-3.5 sm:p-5 hover:bg-zinc-900/30 transition-colors flex flex-col gap-2.5"
            >
              {/* MOBILE LAYOUT (< sm) */}
              <div className="flex sm:hidden flex-col gap-2">
                {/* Metric Title & Description */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-200">{m.label}</span>
                    {hasMissing && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Partial
                      </span>
                    )}
                  </div>
                  <span className="block text-[10px] text-zinc-500 break-words px-2 mt-0.5">{m.description}</span>
                </div>

                {/* Values & Win Badges */}
                <div className="flex items-center justify-between gap-2">
                  {/* User 1 Value (Indigo) */}
                  <div className="flex flex-col items-start min-w-0">
                    <span
                      className={cn(
                        "text-sm font-bold font-mono tracking-tight truncate",
                        m.user1Missing ? "text-zinc-500 italic" : m.winner === 1 ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]" : "text-zinc-300"
                      )}
                    >
                      {m.user1Missing ? "—" : m.user1Value.toLocaleString()}
                      {!m.user1Missing && m.unit && m.key !== "tierScore" && ` ${m.unit}`}
                    </span>
                    {m.winner === 1 && !isUndetermined && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-1.5 py-0.2 text-[9px] font-semibold text-indigo-300 mt-0.5">
                        <Trophy className="w-2.5 h-2.5 text-indigo-400" />
                        Win
                      </span>
                    )}
                    {m.user1Missing && (
                      <span className="text-[9px] text-zinc-500">Missing</span>
                    )}
                  </div>

                  {/* Delta diff indicator in center */}
                  <div className="text-center px-1.5">
                    {isUndetermined ? (
                      <span className="text-[10px] font-mono text-amber-500/80">Withheld</span>
                    ) : m.winner !== "tie" ? (
                      <span className="text-[10px] font-mono text-zinc-500">
                        +{Math.abs(m.diff).toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-500">Tie</span>
                    )}
                  </div>

                  {/* User 2 Value (Amber) */}
                  <div className="flex flex-col items-end min-w-0 text-right">
                    <span
                      className={cn(
                        "text-sm font-bold font-mono tracking-tight truncate",
                        m.user2Missing ? "text-zinc-500 italic" : m.winner === 2 ? "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" : "text-zinc-300"
                      )}
                    >
                      {m.user2Missing ? "—" : m.user2Value.toLocaleString()}
                      {!m.user2Missing && m.unit && m.key !== "tierScore" && ` ${m.unit}`}
                    </span>
                    {m.winner === 2 && !isUndetermined && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.2 text-[9px] font-semibold text-amber-300 mt-0.5">
                        <Trophy className="w-2.5 h-2.5 text-amber-400" />
                        Win
                      </span>
                    )}
                    {m.user2Missing && (
                      <span className="text-[9px] text-zinc-500">Missing</span>
                    )}
                  </div>
                </div>
              </div>

              {/* DESKTOP LAYOUT (>= sm) */}
              <div className="hidden sm:grid grid-cols-12 items-center gap-2">
                {/* User 1 Value (Indigo) */}
                <div className="col-span-4 flex items-center gap-2">
                  <span
                    className={cn(
                      "text-base sm:text-xl font-bold font-mono tracking-tight",
                      m.user1Missing ? "text-zinc-500 italic" : m.winner === 1 ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]" : "text-zinc-300"
                    )}
                  >
                    {m.user1Missing ? "— (missing)" : m.user1Value.toLocaleString()}
                    {!m.user1Missing && m.unit && m.key !== "tierScore" && ` ${m.unit}`}
                  </span>
                  {m.winner === 1 && !isUndetermined && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 shadow-sm">
                      <Trophy className="w-3 h-3 text-indigo-400" />
                      Win
                    </span>
                  )}
                </div>

                {/* Central Metric Name */}
                <div className="col-span-4 text-center flex flex-col items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-semibold text-zinc-200">
                      {m.label}
                    </span>
                    {hasMissing && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30">
                        <AlertTriangle className="w-3 h-3" />
                        Incomplete
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-500 break-words px-2 text-center">
                    {m.description}
                  </span>
                </div>

                {/* User 2 Value (Amber) */}
                <div className="col-span-4 flex items-center justify-end gap-2 text-right">
                  {m.winner === 2 && !isUndetermined && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300 shadow-sm">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      Win
                    </span>
                  )}
                  <span
                    className={cn(
                      "text-base sm:text-xl font-bold font-mono tracking-tight",
                      m.user2Missing ? "text-zinc-500 italic" : m.winner === 2 ? "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" : "text-zinc-300"
                    )}
                  >
                    {m.user2Missing ? "— (missing)" : m.user2Value.toLocaleString()}
                    {!m.user2Missing && m.unit && m.key !== "tierScore" && ` ${m.unit}`}
                  </span>
                </div>
              </div>

              {/* Progress Bar (Mobile & Desktop) */}
              <div className="flex items-center gap-2 sm:gap-3">
                <span
                  className={cn(
                    "text-[10px] font-mono w-7 sm:w-8 text-left",
                    m.winner === 1 && !isUndetermined ? "text-indigo-400 font-bold" : "text-zinc-500"
                  )}
                >
                  {hasMissing ? "—" : `${u1Percent}%`}
                </span>
                <div className="flex-1 h-2 rounded-full overflow-hidden bg-zinc-800 flex">
                  {/* User 1 Segment (Indigo) */}
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      hasMissing
                        ? "bg-zinc-700/50"
                        : m.winner === 1
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.6)]"
                        : "bg-indigo-500/40"
                    )}
                    style={{ width: `${u1Percent}%` }}
                  />
                  {/* User 2 Segment (Amber / Yellow-Orange) */}
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      hasMissing
                        ? "bg-zinc-700/50"
                        : m.winner === 2
                        ? "bg-gradient-to-l from-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.6)]"
                        : "bg-amber-500/40"
                    )}
                    style={{ width: `${u2Percent}%` }}
                  />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-mono w-7 sm:w-8 text-right",
                    m.winner === 2 && !isUndetermined ? "text-amber-400 font-bold" : "text-zinc-500"
                  )}
                >
                  {hasMissing ? "—" : `${u2Percent}%`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
