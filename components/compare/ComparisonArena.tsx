"use client";

import React, { useState, useRef, FormEvent, useEffect, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ComparisonResult, ComparisonError } from "@/types/compare";
import { validateComparisonPair } from "@/lib/validation";
import { getComparisonFeedback, validateComparisonForm } from "@/lib/comparisonFeedback";
import type { ComparisonFeedback } from "@/lib/comparisonFeedback";
import { ComparisonCard } from "./ComparisonCard";
import { ComparisonMetricsTable } from "./ComparisonMetricsTable";
import { BattleCardDownload } from "./BattleCardDownload";
import { ComparisonNotice } from "./ComparisonNotice";
import {
  Swords,
  ArrowLeftRight,
  ArrowUpDown,
  Share2,
  Check,
  AlertCircle,
  Loader2,
  Trophy,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatComparisonDate } from "@/lib/comparisonFormat";

const CURATED_MATCHUPS = [
  { u1: "torvalds", u2: "shadcn", label: "Kernel Legend vs Modern UI" },
  { u1: "gaearon", u2: "yyx990803", label: "React vs Vue Creators" },
  { u1: "leerob", u2: "addyosmani", label: "Next.js vs Web Platform" },
];

interface ComparisonArenaProps {
  initialData?: ComparisonResult | null;
  initialUser1?: string;
  initialUser2?: string;
  initialFeedback?: ComparisonFeedback;
}

export function ComparisonArena({
  initialData = null,
  initialUser1 = "torvalds",
  initialUser2 = "shadcn",
  initialFeedback,
}: ComparisonArenaProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, startNavigation] = useTransition();

  const [user1Input, setUser1Input] = useState(initialUser1);
  const [user2Input, setUser2Input] = useState(initialUser2);

  const [feedback, setFeedback] = useState<ComparisonFeedback>(initialFeedback ?? {});
  const { user1: user1Error, user2: user2Error, notice } = feedback;

  const [comparison, setComparison] = useState<ComparisonResult | null>(initialData);
  const [isFetching, setIsFetching] = useState(!initialData && !initialFeedback && Boolean(initialUser1 && initialUser2));
  const isLoading = isFetching || isNavigating;
  const startedInitialFetch = useRef(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [fallbackShareUrl, setFallbackShareUrl] = useState<string | null>(null);
  const [showFormulaInfo, setShowFormulaInfo] = useState(false);

  const arenaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const user1InputRef = useRef<HTMLInputElement>(null);
  const user2InputRef = useRef<HTMLInputElement>(null);
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const shareInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fallbackShareUrl) {
      shareInputRef.current?.focus();
      shareInputRef.current?.select();
    }
  }, [fallbackShareUrl]);

  // Auto-focus second field if field 1 was prefilled via shortcut (e.g. /compare?user1=leerob)
  useEffect(() => {
    if (initialUser1 && !initialUser2) {
      user2InputRef.current?.focus();
    }
  }, [initialUser1, initialUser2]);

  function handleInput1Change(val: string) {
    setUser1Input(val);
    setFeedback({ user2: validateComparisonPair(user1Input, user2Input).isSelfComparison ? undefined : user2Error });
  }

  function handleInput2Change(val: string) {
    setUser2Input(val);
    setFeedback({ user1: user1Error });
  }

  // Fetch comparison data when requested
  async function executeComparison(u1: string, u2: string) {
    const { pair: val, feedback: validationFeedback } = validateComparisonForm(u1, u2);
    if (!val.isValid) {
      setFeedback(validationFeedback);
      setIsFetching(false);
      setComparison(null);
      return;
    }

    setFeedback({});
    setIsFetching(true);

    try {
      const res = await fetch(`/api/compare?u1=${encodeURIComponent(val.user1)}&u2=${encodeURIComponent(val.user2)}`);
      const data = await res.json();

      if (!res.ok) {
        setFeedback(getComparisonFeedback(data as ComparisonError));
        setComparison(null);
      } else {
        setComparison(data as ComparisonResult);
      }
    } catch {
      setFeedback(getComparisonFeedback({ code: "NETWORK_ERROR" }));
      setComparison(null);
    } finally {
      setIsFetching(false);
    }
  }

  // Load initial comparison only if not already provided by server
  useEffect(() => {
    if (!startedInitialFetch.current && !initialData && !initialFeedback && initialUser1 && initialUser2) {
      startedInitialFetch.current = true;
      executeComparison(initialUser1, initialUser2);
    }
  }, [initialData, initialFeedback, initialUser1, initialUser2]);

  function openMatchup(u1: string, u2: string) {
    setFeedback({});
    setFallbackShareUrl(null);
    setCopiedLink(false);

    const href = `/compare/${u1}/vs/${u2}`;
    if (pathname.toLowerCase() === href.toLowerCase()) {
      void executeComparison(u1, u2);
      return;
    }
    startNavigation(() => router.push(href));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isLoading) return;
    const { pair: val, feedback: validationFeedback } = validateComparisonForm(user1Input, user2Input);
    if (!val.isValid) {
      setFeedback(validationFeedback);
      (validationFeedback.user1 ? user1InputRef : user2InputRef).current?.focus();
      setComparison(null);
      setFallbackShareUrl(null);
      return;
    }

    setUser1Input(val.user1);
    setUser2Input(val.user2);
    openMatchup(val.user1, val.user2);
  }

  function handleSwap() {
    const temp = user1Input;
    setUser1Input(user2Input);
    setUser2Input(temp);
    setFeedback({});

    if (comparison && user2Input && temp) {
      const val = validateComparisonPair(user2Input, temp);
      if (val.isValid) {
        openMatchup(val.user1, val.user2);
      }
    }
  }

  function handleSelectMatchup(u1: string, u2: string) {
    setUser1Input(u1);
    setUser2Input(u2);
    openMatchup(u1, u2);
  }

  function handleTryRandomExample() {
    const randomPreset = CURATED_MATCHUPS[Math.floor(Math.random() * CURATED_MATCHUPS.length)];
    handleSelectMatchup(randomPreset.u1, randomPreset.u2);
  }

  function handleCompareAnother() {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
    user1InputRef.current?.focus();
  }

  async function handleShare() {
    if (!comparison || typeof window === "undefined") return;
    const u1 = comparison.user1.user.username;
    const u2 = comparison.user2.user.username;
    const shareUrl = `${window.location.origin}/compare/${encodeURIComponent(u1)}/vs/${encodeURIComponent(u2)}`;
    const title = `${u1} vs ${u2} — GitHub Developer Showdown`;
    const text = `Check out this GitHub developer battle: ${u1} vs ${u2} on MyGitStats!`;

    // Try native Mobile Share Sheet first (iOS Safari / Android Chrome)
    if (navigator?.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch {
      // Fallback: offer a selectable link input dialog if clipboard writing fails
      setFallbackShareUrl(shareUrl);
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* SIMPLIFIED FORM */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        aria-busy={isLoading}
        className="w-full max-w-3xl mb-6 sm:mb-8 p-4 sm:p-5 rounded-2xl border border-zinc-800 bg-zinc-950/90 backdrop-blur-xl shadow-2xl flex flex-col gap-3"
      >
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
          <span className="text-xs sm:text-sm font-semibold text-zinc-300">
            Compare two GitHub profiles
          </span>
          <button
            type="button"
            onClick={handleTryRandomExample}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Try an example</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full">
          {/* Contender 1 Input with connected label and aria tags */}
          <div className="relative flex-1 min-w-0 max-w-full w-full flex flex-col">
            <label
              htmlFor="contender1-input"
              className="text-[11px] font-mono font-bold text-indigo-400 mb-1"
            >
              Contender 1
            </label>
            <input
              id="contender1-input"
              ref={user1InputRef}
              type="text"
              disabled={isLoading}
              autoCapitalize="none"
              spellCheck={false}
              value={user1Input}
              onChange={(e) => handleInput1Change(e.target.value)}
              placeholder="Username or GitHub URL"
              aria-describedby={user1Error ? "contender1-error" : undefined}
              aria-invalid={Boolean(user1Error)}
              className={cn(
                "w-full px-3.5 sm:px-4 py-2.5 rounded-xl bg-zinc-900 border text-white placeholder-zinc-500 font-mono text-base sm:text-sm min-h-[44px] focus:outline-none focus:ring-2",
                user1Error
                  ? "border-rose-500 focus:ring-rose-500/50"
                  : "border-zinc-700/60 focus:ring-indigo-500/50 focus:border-indigo-500"
              )}
              required
            />
            {user1Error && (
              <span
                id="contender1-error"
                role="alert"
                className="mt-1.5 flex items-start gap-1.5 text-xs leading-relaxed text-rose-300 [overflow-wrap:anywhere]"
              >
                <AlertCircle aria-hidden="true" className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span className="min-w-0">{user1Error}</span>
              </span>
            )}
          </div>

          {/* Swap Button (Min 44px tap target on mobile and desktop) */}
          <div className="flex sm:flex-col items-center justify-center pt-0 sm:pt-4 shrink-0">
            <button
              type="button"
              onClick={handleSwap}
              disabled={isLoading}
              className="p-3 sm:p-2.5 rounded-xl border border-zinc-700/60 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 shadow-sm"
              title="Swap contenders"
              aria-label="Swap contenders"
            >
              <ArrowUpDown className="w-4 h-4 sm:hidden text-amber-400" />
              <ArrowLeftRight className="w-4 h-4 hidden sm:block text-amber-400" />
            </button>
          </div>

          {/* Contender 2 Input with connected label and aria tags */}
          <div className="relative flex-1 min-w-0 max-w-full w-full flex flex-col">
            <label
              htmlFor="contender2-input"
              className="text-[11px] font-mono font-bold text-amber-400 mb-1"
            >
              Contender 2
            </label>
            <input
              id="contender2-input"
              ref={user2InputRef}
              type="text"
              disabled={isLoading}
              autoCapitalize="none"
              spellCheck={false}
              value={user2Input}
              onChange={(e) => handleInput2Change(e.target.value)}
              placeholder="Username or GitHub URL"
              aria-describedby={user2Error ? "contender2-error" : undefined}
              aria-invalid={Boolean(user2Error)}
              className={cn(
                "w-full px-3.5 sm:px-4 py-2.5 rounded-xl bg-zinc-900 border text-white placeholder-zinc-500 font-mono text-base sm:text-sm min-h-[44px] focus:outline-none focus:ring-2",
                user2Error
                  ? "border-rose-500 focus:ring-rose-500/50"
                  : "border-zinc-700/60 focus:ring-amber-500/50 focus:border-amber-500"
              )}
              required
            />
            {user2Error && (
              <span
                id="contender2-error"
                role="alert"
                className="mt-1.5 flex items-start gap-1.5 text-xs leading-relaxed text-rose-300 [overflow-wrap:anywhere]"
              >
                <AlertCircle aria-hidden="true" className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span className="min-w-0">{user2Error}</span>
              </span>
            )}
          </div>

          {/* Compare Profiles Button */}
          <div className="pt-0 sm:pt-4 shrink-0">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-extrabold text-sm min-h-[44px] flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
              ) : (
                <Swords className="w-4 h-4 text-zinc-950" />
              )}
              <span>Compare profiles</span>
            </button>
          </div>
        </div>
      </form>

      {notice && !isLoading && (
        <div className="mb-6 w-full max-w-3xl">
          <ComparisonNotice
            title={notice.title}
            action={
              <button type="button" onClick={() => formRef.current?.requestSubmit()}
                className="min-h-[44px] rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm font-semibold text-white hover:bg-zinc-800">
                Retry
              </button>
            }
          >
            <p>{notice.retryAt ? <>Try again after <time dateTime={notice.retryAt}>{formatComparisonDate(notice.retryAt)}</time>.</> : notice.message}</p>
          </ComparisonNotice>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div role="status" className="w-full max-w-4xl py-12 sm:py-16 flex flex-col items-center justify-center gap-3 sm:gap-4">
          <div className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 animate-pulse shadow-glow-gold">
            <Swords className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 animate-bounce" />
          </div>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 text-center px-4">
            Comparing GitHub profiles…
          </p>
        </div>
      )}

      {/* RESULT AND ACTIONS FIRST */}
      {!isLoading && comparison && (
        <div className="w-full max-w-4xl flex flex-col gap-4 sm:gap-6 animate-fade-in">
          {/* Top Result & Action Bar (Above Profile Cards) */}
          <div
            className={cn(
              "w-full p-4 sm:p-5 rounded-2xl border text-center flex flex-col items-center shadow-lg transition-all",
              comparison.summary.winnerWithheld
                ? "border-amber-500/40 bg-zinc-950/90 text-amber-300"
                : comparison.summary.overallWinner === 1
                ? "border-indigo-500/40 bg-gradient-to-r from-indigo-950/50 via-zinc-950 to-indigo-950/20 shadow-indigo-950/40"
                : comparison.summary.overallWinner === 2
                ? "border-amber-500/40 bg-gradient-to-r from-amber-950/50 via-zinc-950 to-orange-950/20 shadow-amber-950/40"
                : "border-zinc-800 bg-zinc-950/80 shadow-black/40"
            )}
          >
            {/* Contender Handles */}
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-mono font-bold mb-1.5 flex-wrap px-2">
              <span className="text-indigo-400 break-all">@{comparison.user1.user.username}</span>
              <span className="text-zinc-500 font-mono text-xs font-normal">vs</span>
              <span className="text-amber-400 break-all">@{comparison.user2.user.username}</span>
            </div>

            {/* Tiebreaker / Win Headline */}
            {!comparison.summary.winnerWithheld && <div
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold mb-2 border",
                comparison.summary.overallWinner === 1
                  ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
                  : comparison.summary.overallWinner === 2
                  ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                  : "bg-zinc-800/60 border-zinc-700/60 text-zinc-400"
              )}
            >
              <Trophy
                className={cn(
                  "w-3.5 h-3.5",
                  comparison.summary.overallWinner === 1
                    ? "text-indigo-400"
                    : comparison.summary.overallWinner === 2
                    ? "text-amber-400"
                    : "text-zinc-400"
                )}
              />
              <span>{comparison.summary.isTiebreaker ? "Tier-score tiebreaker" : comparison.summary.winMargin}</span>
            </div>}

            <h2 className="max-w-full text-base sm:text-2xl font-extrabold text-white tracking-tight px-2 [overflow-wrap:anywhere]">
              {comparison.summary.winnerWithheld ? "Winner unavailable" : comparison.summary.headline}
            </h2>
            {!comparison.summary.isComplete && (
              <div className="mt-3 w-full max-w-lg">
                <ComparisonNotice tone="warning" title="Some GitHub stats are unavailable">
                  <p>{comparison.summary.winnerWithheld
                    ? "The missing stats could change the outcome. You can still explore the available metrics below."
                    : "The available stats are enough to determine the winner. Missing values are marked below."}</p>
                </ComparisonNotice>
              </div>
            )}

            {/* Top Action Buttons (Next to Summary) */}
            <div className="mt-3 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleShare}
                ref={shareButtonRef}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs transition-all active:scale-95 shadow-sm min-h-[44px]"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied Link!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Share Matchup</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCompareAnother}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs transition-all active:scale-95 shadow-sm min-h-[44px]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                <span>Compare another</span>
              </button>

              <BattleCardDownload
                arenaRef={arenaRef}
                user1={comparison.user1.user.username}
                user2={comparison.user2.user.username}
                className="py-1.5 px-3.5 text-xs"
              />
            </div>
            {fallbackShareUrl && (
              <div className="mt-3 w-full max-w-lg">
                <ComparisonNotice title="Copy the matchup link" tone="warning"
                  action={
                    <button type="button" className="min-h-[44px] px-2 text-sm text-zinc-300 hover:text-white"
                      onClick={() => {
                        setFallbackShareUrl(null);
                        shareButtonRef.current?.focus();
                      }}>
                      Done
                    </button>
                  }
                >
                  <p>Automatic sharing is unavailable. Select the link to copy it.</p>
                  <input ref={shareInputRef} readOnly aria-label="Matchup link" value={fallbackShareUrl}
                    onFocus={(e) => e.currentTarget.select()}
                    className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-xs text-zinc-200" />
                </ComparisonNotice>
              </div>
            )}

            {/* Quick Referral Prompt for Incoming Visitors */}
            <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-center gap-2 text-xs font-mono text-zinc-400 flex-wrap">
              <span className="text-zinc-500 text-[11px]">Compare your profile:</span>
              <button
                type="button"
                onClick={() => {
                  setUser1Input(comparison.user1.user.username);
                  setUser2Input("");
                  formRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-2 py-0.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] transition-colors"
              >
                vs @{comparison.user1.user.username}
              </button>
              <button
                type="button"
                onClick={() => {
                  setUser1Input(comparison.user2.user.username);
                  setUser2Input("");
                  formRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-2 py-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] transition-colors"
              >
                vs @{comparison.user2.user.username}
              </button>
            </div>
          </div>

          {/* Exportable Battle Arena Ref Target */}
          <div
            ref={arenaRef}
            className="w-full p-3 sm:p-6 rounded-2xl sm:rounded-3xl border border-zinc-800 bg-[#070709] shadow-2xl flex flex-col gap-4 sm:gap-6"
          >
            {/* Contender Cards Face-Off Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 relative">
              {/* User 1 Card (Indigo Theme) */}
              <ComparisonCard
                data={comparison.user1}
                isOverallWinner={comparison.summary.overallWinner === 1}
                winsCount={comparison.summary.user1Wins}
                contenderLabel="Contender 1"
                colorTheme="indigo"
              />

              {/* Desktop Central Floating VS Badge */}
              <div
                data-export-ignore="false"
                className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full bg-zinc-950 border-2 border-indigo-500/40 shadow-xl shadow-indigo-500/20 text-white font-extrabold font-mono text-sm"
              >
                VS
              </div>

              {/* Mobile Centered VS Divider */}
              <div className="flex md:hidden items-center justify-center -my-1 z-10">
                <span className="px-3 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 text-[11px] font-mono font-bold text-zinc-300 shadow-md">
                  VS
                </span>
              </div>

              {/* User 2 Card (Amber / Yellow-Orange Theme) */}
              <ComparisonCard
                data={comparison.user2}
                isOverallWinner={comparison.summary.overallWinner === 2}
                winsCount={comparison.summary.user2Wins}
                contenderLabel="Contender 2"
                colorTheme="amber"
              />
            </div>

            {/* Metrics Breakdown Table */}
            <ComparisonMetricsTable
              metrics={comparison.metrics}
              user1Name={comparison.user1.user.name || comparison.user1.user.username}
              user2Name={comparison.user2.user.name || comparison.user2.user.username}
            />

            {/* Watermark & Accurate Data Ingestion Details */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] sm:text-[11px] font-mono text-zinc-500 pt-2 border-t border-zinc-900">
              <span>mygitstats.dev</span>
              <time dateTime={comparison.comparedAt}>
                Compared {formatComparisonDate(comparison.comparedAt)}
              </time>
            </div>
          </div>

          {/* Transparent Scoring Formula Accordion */}
          <div className="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3 text-xs text-zinc-400">
            <button
              type="button"
              onClick={() => setShowFormulaInfo(!showFormulaInfo)}
              aria-expanded={showFormulaInfo}
              className="w-full flex items-center justify-between text-left font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <span className="flex items-center gap-1.5 font-semibold">
                <Info className="hidden sm:inline-block w-3.5 h-3.5 text-indigo-400 shrink-0" />
                How are showdown winners & tier scores calculated?
              </span>
              {showFormulaInfo ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
            </button>

            {showFormulaInfo && (
              <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-2 text-zinc-400 font-sans leading-relaxed">
                <p>
                  <strong>Category Victories:</strong> The showdown winner is determined by majority category wins across 6 metrics (Tier Score, Stars, Followers, Contributions, Repositories, Seniority).
                </p>
                <p>
                  <strong>Tiebreaker Rule:</strong> If category wins are equal, the match tie is broken by the overall <strong>Performance Tier Score</strong>. If tier scores are also identical, the match is ruled a dead heat.
                </p>
                <p>
                  <strong>Tier Score Formula:</strong>{" "}
                  <code className="text-zinc-300 font-mono text-[11px] bg-zinc-900 px-1 py-0.5 rounded">
                    Score = (Total Stars × 3.0) + (Followers × 1.5) + (min(Public Repos, 50) × 1.0) + (Active Contributions × 0.5)
                  </code>
                </p>
                <p className="text-[11px] text-zinc-500">
                  Recent activity is estimated from up to 100 public events per user. When missing data could change the outcome, the comparison withholds the winner.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Popular Open-Source Showdowns */}
      <div className="w-full max-w-4xl mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-zinc-800/80">
        <h3 className="text-xs sm:text-sm font-mono uppercase tracking-wider font-bold text-zinc-400 mb-3">
          Popular Open-Source Showdowns
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {CURATED_MATCHUPS.map((match) => (
            <button
              key={`${match.u1}-${match.u2}`}
              onClick={() => handleSelectMatchup(match.u1, match.u2)}
              disabled={isLoading}
              className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-950 hover:bg-zinc-900/80 hover:border-amber-500/40 text-left transition-all group flex flex-col gap-0.5"
            >
              <span className="text-xs font-bold text-zinc-200 group-hover:text-amber-300 transition-colors truncate">
                {match.u1} <span className="text-zinc-500 font-normal">vs</span> {match.u2}
              </span>
              <span className="text-[11px] text-zinc-500 line-clamp-1">{match.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
