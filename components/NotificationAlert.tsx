"use client";

import React from "react";
import {
  UserX,
  Clock,
  ShieldAlert,
  WifiOff,
  AlertCircle,
  RotateCcw,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NotificationErrorType =
  | "not_found"
  | "timeout"
  | "rate_limited"
  | "network"
  | "invalid_username"
  | "server";

export interface NotificationAlertProps {
  type: NotificationErrorType;
  title: string;
  message: string;
  details?: string;
  suggestions?: string[];
  username?: string;
  resetTime?: string;
  isRetrying?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
  onSelectSample?: (username: string) => void;
  className?: string;
}

const TYPE_CONFIG = {
  not_found: {
    icon: UserX,
    label: "404 Not Found",
    containerClass:
      "border-rose-500/40 bg-gradient-to-br from-rose-950/50 via-[#18080c]/80 to-[#0d0407] text-rose-100 shadow-xl shadow-rose-950/30",
    badgeClass: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
    iconClass: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    titleClass: "text-rose-200",
  },
  timeout: {
    icon: Clock,
    label: "Request Timeout",
    containerClass:
      "border-amber-500/40 bg-gradient-to-br from-amber-950/50 via-[#1a1205]/80 to-[#0e0902] text-amber-100 shadow-xl shadow-amber-950/30",
    badgeClass: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    iconClass: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    titleClass: "text-amber-200",
  },
  rate_limited: {
    icon: ShieldAlert,
    label: "403 Rate Limit",
    containerClass:
      "border-purple-500/40 bg-gradient-to-br from-purple-950/50 via-[#160a22]/80 to-[#0c0414] text-purple-100 shadow-xl shadow-purple-950/30",
    badgeClass: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
    iconClass: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    titleClass: "text-purple-200",
  },
  network: {
    icon: WifiOff,
    label: "Network Offline",
    containerClass:
      "border-red-500/40 bg-gradient-to-br from-red-950/50 via-[#1a0808]/80 to-[#0d0303] text-red-100 shadow-xl shadow-red-950/30",
    badgeClass: "bg-red-500/20 text-red-300 border border-red-500/30",
    iconClass: "text-red-400 bg-red-500/10 border-red-500/20",
    titleClass: "text-red-200",
  },
  invalid_username: {
    icon: AlertCircle,
    label: "400 Invalid Handle",
    containerClass:
      "border-amber-500/40 bg-gradient-to-br from-amber-950/50 via-[#1a1205]/80 to-[#0e0902] text-amber-100 shadow-xl shadow-amber-950/30",
    badgeClass: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    iconClass: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    titleClass: "text-amber-200",
  },
  server: {
    icon: AlertCircle,
    label: "Server Error",
    containerClass:
      "border-red-500/40 bg-gradient-to-br from-red-950/50 via-[#1a0808]/80 to-[#0d0303] text-red-100 shadow-xl shadow-red-950/30",
    badgeClass: "bg-red-500/20 text-red-300 border border-red-500/30",
    iconClass: "text-red-400 bg-red-500/10 border-red-500/20",
    titleClass: "text-red-200",
  },
};

export function NotificationAlert({
  type,
  title,
  message,
  details,
  suggestions,
  username,
  resetTime,
  isRetrying = false,
  onRetry,
  onDismiss,
  onSelectSample,
  className,
}: NotificationAlertProps) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.server;
  const IconComponent = config.icon;

  return (
    <div
      role="alert"
      className={cn(
        "relative w-full max-w-xl rounded-2xl border p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-top-2",
        config.containerClass,
        className
      )}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={cn(
              "p-2 rounded-xl border flex-shrink-0 mt-0.5",
              config.iconClass
            )}
          >
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className={cn(
                  "px-2 py-0.5 rounded-md text-[10px] font-mono uppercase font-bold tracking-wider",
                  config.badgeClass
                )}
              >
                {config.label}
              </span>
              {username && (
                <span className="text-xs font-mono text-zinc-400">
                  @{username}
                </span>
              )}
            </div>

            <h3 className={cn("text-sm sm:text-base font-bold tracking-tight", config.titleClass)}>
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 mt-0.5 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Dismiss Button */}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss notification"
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Optional Details Box */}
      {details && (
        <div className="mt-3 p-2.5 rounded-lg bg-black/40 border border-white/5 font-mono text-[11px] text-zinc-400 break-words leading-relaxed">
          {details}
        </div>
      )}

      {/* Helpful Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block mb-1.5">
            What you can do:
          </span>
          <ul className="space-y-1 text-xs text-zinc-300">
            {suggestions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-zinc-500 select-none">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Row */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-white/10">
        {/* Sample profiles for 404 */}
        {type === "not_found" && onSelectSample ? (
          <div className="flex items-center gap-1.5 flex-wrap text-xs text-zinc-400">
            <span className="flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3 h-3 text-rose-400" />
              Try profiles:
            </span>
            {["shadcn", "torvalds", "gaearon"].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => onSelectSample(sample)}
                className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-rose-200 font-mono text-xs transition-colors"
              >
                @{sample}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-[11px] text-zinc-400 font-mono">
            {resetTime ? `Rate limit resets at: ${resetTime}` : "Need help? Check spelling or try again."}
          </div>
        )}

        {/* Retry Button */}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 text-xs font-semibold text-white transition-all shadow-sm disabled:opacity-50"
          >
            <RotateCcw className={cn("w-3.5 h-3.5", isRetrying && "animate-spin")} />
            <span>{isRetrying ? "Retrying..." : "Retry"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
