"use client";

import React, { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";
import { StatsResponse } from "@/types/stats";
import { CustomizerOptions } from "@/types/builder";
import { StatsCard } from "@/components/StatsCard";
import { CardStyleToggle } from "@/components/CardStyleToggle";
import { DownloadButton } from "@/components/DownloadButton";
import { CustomizerToolbar } from "@/components/builder/CustomizerToolbar";
import {
  NotificationAlert,
  NotificationErrorType,
} from "@/components/NotificationAlert";
import { CITY_THEMES } from "@/lib/themes/cityThemes";
import { AVATAR_BADGE_CONFIG, AVATAR_FRAME_CONFIG, CARD_BACKGROUND_CONFIG } from "@/lib/themes/frameStyles";
import { generateSyntheticCalendar } from "@/lib/contributions";
import { DEFAULT_CARD_OPTIONS } from "@/lib/previewCard";
import { sanitizeGitHubUsername } from "@/lib/validation";
import {
  RefreshCw,
  Share2,
  Check,
  ArrowRight,
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
  calendar: generateSyntheticCalendar("leerob", 320, 128),
  fetchedAt: new Date().toISOString(),
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

export default function CardStudioPage() {
  const [usernameInput, setUsernameInput] = useState("leerob");
  const [statsData, setStatsData] = useState<StatsResponse>(INITIAL_DEMO_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<ErrorState | null>(null);
  const [customizerOptions, setCustomizerOptions] = useState<CustomizerOptions>(DEFAULT_CARD_OPTIONS);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">("idle");
  const [exportError, setExportError] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  // Sync URL query params on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const userParam = sanitizeGitHubUsername(params.get("user"));
    const themeParam = params.get("theme") as CustomizerOptions["themeMode"];
    const styleParam = params.get("style");
    const style = styleParam === "minimal" || styleParam === "showcase" ? styleParam : undefined;
    const frameParam = params.get("frame") as CustomizerOptions["avatarFrame"];
    const badgeParam = params.get("badge") as CustomizerOptions["avatarBadge"];
    const bgParam = params.get("bg") as CustomizerOptions["cardBackground"];
    const legacyMinimal = !style && bgParam === "pure-minimal";
    const heatmapParam = params.get("heatmap");
    const showHeatmap = heatmapParam !== null ? heatmapParam !== "false" && heatmapParam !== "0" : undefined;

    if (userParam) {
      setUsernameInput(userParam);
      fetchStats(userParam);
    }

    if (style || themeParam || frameParam || badgeParam || bgParam || showHeatmap !== undefined) {
      setCustomizerOptions((prev) => ({
        cardStyle: style ?? (legacyMinimal ? "minimal" : prev.cardStyle),
        themeMode: themeParam && (Object.hasOwn(CITY_THEMES, themeParam)
          || ["auto", "Bronze", "Gold", "Mythic"].includes(themeParam)) ? themeParam : prev.themeMode,
        avatarFrame: frameParam && Object.hasOwn(AVATAR_FRAME_CONFIG, frameParam) ? frameParam : prev.avatarFrame,
        avatarBadge: badgeParam && Object.hasOwn(AVATAR_BADGE_CONFIG, badgeParam) ? badgeParam : prev.avatarBadge,
        cardBackground: !legacyMinimal && bgParam && Object.hasOwn(CARD_BACKGROUND_CONFIG, bgParam)
          ? bgParam : prev.cardBackground,
        showHeatmap: showHeatmap !== undefined ? showHeatmap : prev.showHeatmap,
      }));
    }
  }, []);

  async function fetchStats(userToFetch: string) {
    const trimmed = sanitizeGitHubUsername(userToFetch);
    if (!trimmed) return;

    setIsLoading(true);
    setErrorState(null);

    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), 10000);

    try {
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
            message: "The unauthenticated GitHub API rate limit has been reached.",
            details: data.details,
            resetTime: data.resetTime,
            username: trimmed,
            suggestions: [
              `Rate limit will reset at ${data.resetTime || "shortly"}.`,
              "Wait a few moments or retry shortly.",
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
              "Only alphanumeric characters or hyphens are allowed.",
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
      setShareStatus("idle");
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
    const trimmed = sanitizeGitHubUsername(usernameInput);
    setUsernameInput(trimmed);
    fetchStats(trimmed);
  }

  function updateOptions(options: CustomizerOptions) {
    setCustomizerOptions(options);
    setShareStatus("idle");
    setExportError(false);
  }

  async function handleCopyShareLink() {
    const url = new URL(window.location.href);
    url.pathname = "/card";
    url.searchParams.set("user", statsData.user.username);
    url.searchParams.set("style", customizerOptions.cardStyle);
    if (customizerOptions.themeMode !== "auto") {
      url.searchParams.set("theme", customizerOptions.themeMode);
    } else {
      url.searchParams.delete("theme");
    }
    url.searchParams.set("frame", customizerOptions.avatarFrame);
    url.searchParams.set("badge", customizerOptions.avatarBadge);
    url.searchParams.set("bg", customizerOptions.cardBackground);
    if (customizerOptions.showHeatmap === false) {
      url.searchParams.set("heatmap", "false");
    } else {
      url.searchParams.delete("heatmap");
    }

    try {
      await navigator.clipboard.writeText(url.toString());
      setShareStatus("copied");
    } catch {
      setShareStatus("error");
    }
  }

  return (
    <main className="site-container py-9 sm:py-14">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">Card Studio</h1>
        <p className="mt-3 leading-relaxed text-site-muted">
          Build and export a card from any public GitHub profile.
        </p>
      </div>

      <div className="grid items-start gap-6 border-t border-site-line pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.16fr)] lg:gap-x-12 lg:gap-y-5">
        <div>
          <form onSubmit={handleSearch} className="max-w-lg">
            <label htmlFor="studio-username" className="mb-2 block font-mono text-xs text-site-muted">GitHub username</label>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
              <input
                id="studio-username"
                type="text"
                value={usernameInput}
                onChange={(event) => setUsernameInput(event.target.value)}
                className="site-input font-mono"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                required
              />
              <button type="submit" disabled={isLoading || !usernameInput.trim()} className="site-button">
                {isLoading && <RefreshCw size={14} className="animate-spin" aria-hidden="true" />}
                {isLoading ? "Loading…" : "Load profile"}
              </button>
            </div>
          </form>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] text-site-muted">
            <span>Try</span>
            {["shadcn", "torvalds", "kentcdodds", "leerob", "gaearon"].map((handle) => (
              <button
                key={handle}
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setUsernameInput(handle);
                  fetchStats(handle);
                }}
                className="underline decoration-site-control underline-offset-4 hover:text-foreground disabled:opacity-50"
              >
                @{handle}
              </button>
            ))}
          </div>

          {errorState && (
            <div className="mt-4">
              <NotificationAlert
                type={errorState.type}
                title={errorState.title}
                message={errorState.message}
                details={errorState.details}
                suggestions={errorState.suggestions}
                username={errorState.username}
                resetTime={errorState.resetTime}
                isRetrying={isLoading}
                onRetry={() => fetchStats(errorState.username || usernameInput)}
                onDismiss={() => setErrorState(null)}
                onSelectSample={(sampleHandle) => {
                  setUsernameInput(sampleHandle);
                  fetchStats(sampleHandle);
                }}
              />
            </div>
          )}
        </div>

        <section aria-labelledby="studio-preview" className="min-w-0 max-w-[540px] lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-site-muted">
            <h2 id="studio-preview">{statsData === INITIAL_DEMO_DATA ? "Sample card" : "Card preview"}</h2>
            <CardStyleToggle
              value={customizerOptions.cardStyle}
              onChange={(cardStyle) => updateOptions({ ...customizerOptions, cardStyle })}
            />
          </div>
          <StatsCard ref={cardRef} data={statsData} customizerOptions={customizerOptions} />

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <DownloadButton
              cardRef={cardRef}
              username={statsData.user.username}
              cardStyle={customizerOptions.cardStyle}
              tier={customizerOptions.themeMode === "auto" ? statsData.tier.tier : customizerOptions.themeMode}
              onError={() => setExportError(true)}
              onSuccess={() => setExportError(false)}
            />
            <button type="button" onClick={handleCopyShareLink} className="site-button">
              {shareStatus === "copied" ? <Check size={15} aria-hidden="true" /> : <Share2 size={15} aria-hidden="true" />}
              {shareStatus === "copied" ? "Link copied" : "Copy card link"}
            </button>
          </div>
          <div role="status" className="mt-2 text-sm text-site-muted">
            {exportError && <p>Couldn’t download the PNG. Try again.</p>}
            {shareStatus === "error" && "Couldn’t copy the link. Check your browser’s clipboard permissions and try again."}
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-site-muted">
            <Link href={`/wrapped?user=${encodeURIComponent(statsData.user.username)}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
              Open Wrapped <ArrowRight size={13} aria-hidden="true" />
            </Link>
            <Link href={`/compare?user1=${encodeURIComponent(statsData.user.username)}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
              Compare profile <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <CustomizerToolbar
          options={customizerOptions}
          onChange={updateOptions}
          onReset={() => updateOptions(DEFAULT_CARD_OPTIONS)}
        />
      </div>
    </main>
  );
}
