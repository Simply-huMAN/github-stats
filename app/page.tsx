"use client";

import React, { useState, useRef, useEffect, useMemo, FormEvent } from "react";
import { StatsResponse } from "@/types/stats";
import { CustomizerOptions } from "@/types/builder";
import { StatsCard } from "@/components/StatsCard";
import { DownloadButton } from "@/components/DownloadButton";
import { CustomizerToolbar } from "@/components/builder/CustomizerToolbar";
import {
  NotificationAlert,
  NotificationErrorType,
} from "@/components/NotificationAlert";
import { CITY_THEMES } from "@/lib/themes/cityThemes";
import {
  Search,
  Github,
  RefreshCw,
  Share2,
  Check,
} from "lucide-react";

const INITIAL_DEMO_DATA: StatsResponse = {
  user: {
    username: "leerob",
    name: "Lee Robinson",
    avatarUrl: "https://avatars.githubusercontent.com/u/9113740?v=4",
    bio: "VP of Product at Vercel. Helping developers build the web faster.",
    company: "Vercel",
    location: "Des Moines, IA",
    blog: "https://leerob.io",
    twitterUsername: "leeerob",
    createdAt: "2014-10-14T20:25:29Z",
    htmlUrl: "https://github.com/leerob",
  },
  stats: {
    followers: 38400,
    publicRepos: 128,
    totalStars: 14500,
    activeContributions: 320,
  },
  tier: {
    tier: "Mythic",
    score: 101250,
    title: "Legendary Architect",
    badgeLabel: "MYTHIC TIER",
    description: "Elite open-source presence, prolific builder, and influential ecosystem champion.",
    colors: {
      badgeBg: "bg-indigo-950/80 backdrop-blur-md",
      badgeText: "text-cyan-300",
      badgeBorder: "border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.5)]",
      gradient: "from-indigo-950/90 via-purple-950/60 to-black",
      glow: "shadow-glow-mythic border-indigo-500/60 ring-1 ring-cyan-500/30",
      textAccent: "text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]",
      cardBorder: "border-indigo-500/50",
    },
  },
  fetchedAt: new Date().toISOString(),
};

const DEFAULT_OPTIONS: CustomizerOptions = {
  themeMode: "auto",
  avatarFrame: "squircle",
  avatarBadge: "tier-icon",
  cardBackground: "ambient-glow",
};

interface ErrorState {
  type: NotificationErrorType;
  title: string;
  message: string;
  details?: string;
  suggestions?: string[];
  username?: string;
  resetTime?: string;
}

export default function HomePage() {
  const [usernameInput, setUsernameInput] = useState("leerob");
  const [statsData, setStatsData] = useState<StatsResponse>(INITIAL_DEMO_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<ErrorState | null>(null);
  const [customizerOptions, setCustomizerOptions] = useState<CustomizerOptions>(DEFAULT_OPTIONS);
  const [copiedLink, setCopiedLink] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  // Sync URL query params on mount or options change
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get("user");
    const themeParam = params.get("theme") as CustomizerOptions["themeMode"];
    const frameParam = params.get("frame") as CustomizerOptions["avatarFrame"];
    const badgeParam = params.get("badge") as CustomizerOptions["avatarBadge"];
    const bgParam = params.get("bg") as CustomizerOptions["cardBackground"];

    if (userParam && userParam !== usernameInput) {
      setUsernameInput(userParam);
      fetchStats(userParam);
    }

    if (themeParam || frameParam || badgeParam || bgParam) {
      setCustomizerOptions((prev) => ({
        themeMode: themeParam || prev.themeMode,
        avatarFrame: frameParam || prev.avatarFrame,
        avatarBadge: badgeParam || prev.avatarBadge,
        cardBackground: bgParam || prev.cardBackground,
      }));
    }
  }, []);

  // Compute solid base background color to pass to DownloadButton for browser-agnostic export
  const currentBaseBgColor = useMemo(() => {
    if (customizerOptions.themeMode !== "auto" && customizerOptions.themeMode in CITY_THEMES) {
      return CITY_THEMES[customizerOptions.themeMode as keyof typeof CITY_THEMES].baseBgColor;
    }
    const tier = statsData.tier?.tier || "Mythic";
    if (tier === "Gold") return "#140e05";
    if (tier === "Bronze") return "#121214";
    return "#08051a";
  }, [customizerOptions.themeMode, statsData.tier]);

  async function fetchStats(userToFetch: string) {
    let trimmed = userToFetch.trim().replace(/^@+/, "");
    if (trimmed.includes("github.com/")) {
      trimmed = trimmed.split("github.com/")[1]?.split("/")[0]?.replace(/^@+/, "") || trimmed;
    }
    if (!trimmed) return;

    setIsLoading(true);
    setErrorState(null);

    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), 10000);

    try {
      // Use /api/developer to prevent ad-blockers / Brave Shields from blocking the request as tracking telemetry
      const res = await fetch(`/api/developer?username=${encodeURIComponent(trimmed)}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutTimer);

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 404) {
          setErrorState({
            type: "not_found",
            title: "Developer Not Found",
            message: `The GitHub user '@${trimmed}' does not exist or has been renamed.`,
            details: data.details,
            username: trimmed,
            suggestions: [
              "Verify the username spelling or check for accidental spaces.",
              "GitHub usernames only contain letters, numbers, and single hyphens.",
              "Confirm the user has not deleted their GitHub account.",
            ],
          });
          return;
        }

        if (res.status === 403 || data.code === "RATE_LIMITED") {
          setErrorState({
            type: "rate_limited",
            title: "GitHub API Rate Limit Reached",
            message: "The unauthenticated GitHub API rate limit (60 requests/hr) has been reached.",
            details: data.details,
            resetTime: data.resetTime,
            username: trimmed,
            suggestions: [
              `Rate limit will reset at ${data.resetTime || "shortly"}.`,
              "Wait a few moments or consider configuring GITHUB_TOKEN on the server for 5,000 req/hr.",
            ],
          });
          return;
        }

        if (res.status === 504 || data.code === "TIMEOUT") {
          setErrorState({
            type: "timeout",
            title: "Request Timed Out",
            message: "GitHub API took longer than 8 seconds to respond.",
            details: data.details,
            username: trimmed,
            suggestions: [
              "GitHub API may be experiencing temporary latency.",
              "Click the 'Retry' button below to try fetching again.",
            ],
          });
          return;
        }

        if (res.status === 400 || data.code === "INVALID_USERNAME") {
          setErrorState({
            type: "invalid_username",
            title: "Invalid GitHub Handle",
            message: data.error || "Please enter a valid GitHub username.",
            details: data.details,
            username: trimmed,
            suggestions: [
              "GitHub usernames can be up to 39 characters.",
              "Only alphanumeric characters or hyphens are allowed (no consecutive hyphens).",
            ],
          });
          return;
        }

        setErrorState({
          type: "server",
          title: data.error || "Unable to Fetch Profile",
          message: data.details || "An error occurred while communicating with GitHub.",
          details: data.details,
          username: trimmed,
          suggestions: [
            "Check that your network connection is stable.",
            "Retry the request in a few moments.",
          ],
        });
        return;
      }

      setStatsData(data);
      setErrorState(null);
    } catch (err: unknown) {
      clearTimeout(timeoutTimer);

      if (err instanceof Error && err.name === "AbortError") {
        setErrorState({
          type: "timeout",
          title: "Request Timed Out",
          message: "The request exceeded 10 seconds without a response.",
          username: trimmed,
          suggestions: [
            "Network connectivity to GitHub or the server may be slow.",
            "Click 'Retry' below to attempt fetching again.",
          ],
        });
        return;
      }

      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setErrorState({
          type: "network",
          title: "You are Offline",
          message: "No internet connection detected. Please verify your Wi-Fi or data connection.",
          username: trimmed,
          suggestions: [
            "Ensure Wi-Fi or cellular network is enabled.",
            "Disable any ad-blockers or firewall software interfering with requests.",
          ],
        });
        return;
      }

      setErrorState({
        type: "server",
        title: "Connection Error",
        message: err instanceof Error ? err.message : "Failed to connect to the stats service.",
        username: trimmed,
        suggestions: [
          "Check your network connection.",
          "Click 'Retry' below to try again.",
        ],
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    let trimmed = usernameInput.trim().replace(/^@+/, "");
    if (trimmed.includes("github.com/")) {
      trimmed = trimmed.split("github.com/")[1]?.split("/")[0]?.replace(/^@+/, "") || trimmed;
    }
    setUsernameInput(trimmed);
    fetchStats(trimmed);
  }

  function handleCopyShareLink() {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("user", statsData.user.username);
    if (customizerOptions.themeMode !== "auto") {
      url.searchParams.set("theme", customizerOptions.themeMode);
    } else {
      url.searchParams.delete("theme");
    }
    url.searchParams.set("frame", customizerOptions.avatarFrame);
    url.searchParams.set("badge", customizerOptions.avatarBadge);
    url.searchParams.set("bg", customizerOptions.cardBackground);

    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  }

  return (
    <main className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col items-center px-3 sm:px-4 py-8 sm:py-10 md:py-16 selection:bg-indigo-500/40">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-cyan-500/10 blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        {/* App Title */}
        <div className="text-center space-y-2 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-xs font-mono text-zinc-300">
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Stats &amp; City Customizer</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Custom Developer Card Builder
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-zinc-400 max-w-xl mx-auto px-2">
            Personalize your GitHub stats with city-inspired themes (Tokyo, Berlin, Bangalore, Hyderabad), custom frames, badges, and export high-res PNGs.
          </p>
        </div>

        {/* Username Search Form */}
        <form onSubmit={handleSearch} className="w-full max-w-md flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Enter GitHub username (e.g. torvalds)"
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-base sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !usernameInput.trim()}
            className="px-4 sm:px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 flex-shrink-0"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Fetch"}
          </button>
        </form>

        {/* Quick Sample Links */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-zinc-500 mb-6 sm:mb-8 flex-wrap justify-center">
          <span>Quick profiles:</span>
          {["shadcn", "torvalds", "kentcdodds", "leerob", "gaearon"].map((handle) => (
            <button
              key={handle}
              type="button"
              onClick={() => {
                setUsernameInput(handle);
                fetchStats(handle);
              }}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-mono transition-colors"
            >
              @{handle}
            </button>
          ))}
        </div>

        {/* Polished Error & Notification Banner */}
        {errorState && (
          <div className="w-full flex justify-center mb-6">
            <NotificationAlert
              type={errorState.type}
              title={errorState.title}
              message={errorState.message}
              details={errorState.details}
              suggestions={errorState.suggestions}
              username={errorState.username}
              resetTime={errorState.resetTime}
              isRetrying={isLoading}
              onRetry={() => {
                if (errorState.username) {
                  fetchStats(errorState.username);
                } else {
                  fetchStats(usernameInput);
                }
              }}
              onDismiss={() => setErrorState(null)}
              onSelectSample={(sampleHandle) => {
                setUsernameInput(sampleHandle);
                fetchStats(sampleHandle);
              }}
            />
          </div>
        )}

        {/* Live Card Canvas */}
        <div className="w-full flex justify-center py-2 px-1">
          <StatsCard
            ref={cardRef}
            data={statsData}
            customizerOptions={customizerOptions}
          />
        </div>

        {/* Action Controls: Download & Share */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 w-full max-w-sm sm:max-w-none">
          <DownloadButton
            cardRef={cardRef}
            username={statsData.user.username}
            tier={customizerOptions.themeMode === "auto" ? statsData.tier.tier : customizerOptions.themeMode}
            baseBgColor={currentBaseBgColor}
            className="w-full sm:w-auto"
          />

          <button
            type="button"
            onClick={handleCopyShareLink}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border border-zinc-700 shadow-sm"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-zinc-400" />
                <span>Share Card Link</span>
              </>
            )}
          </button>
        </div>

        {/* Interactive Customizer Toolbar */}
        <div className="w-full mt-10 flex justify-center">
          <CustomizerToolbar
            options={customizerOptions}
            onChange={setCustomizerOptions}
            onReset={() => setCustomizerOptions(DEFAULT_OPTIONS)}
          />
        </div>

        {/* Footer info */}
        <div className="mt-14 text-center text-xs text-zinc-600 max-w-md space-y-1.5">
          <p>
            City themes: Tokyo, Berlin, Bangalore, Hyderabad, San Francisco, Paris, Frankfurt, Shanghai.
          </p>
          <p className="font-mono text-[11px] text-zinc-500">
            Exported cards include 3x retina pixel ratio and full frame/theme rendering.
          </p>
        </div>
      </div>
    </main>
  );
}
