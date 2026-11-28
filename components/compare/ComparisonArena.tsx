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
  ArrowRight,
  ArrowLeftRight,
  ArrowUpDown,
  Share2,
  Link2,
  Check,
  Loader2,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
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

  const arenaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const user1InputRef = useRef<HTMLInputElement>(null);
  const user2InputRef = useRef<HTMLInputElement>(null);
  const copyButtonRef = useRef<HTMLButtonElement>(null);
  const shareInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fallbackShareUrl) {
      shareInputRef.current?.focus();
      shareInputRef.current?.select();
    }
  }, [fallbackShareUrl]);

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
    formRef.current?.scrollIntoView();
    user1InputRef.current?.focus({ preventScroll: true });
  }

  function matchupUrl() {
    if (!comparison) return null;
    const u1 = comparison.user1.user.username;
    const u2 = comparison.user2.user.username;
    return `${window.location.origin}/compare/${encodeURIComponent(u1)}/vs/${encodeURIComponent(u2)}`;
  }

  async function handleShare() {
    const url = matchupUrl();
    if (!url || !comparison) return;
    const title = `${comparison.user1.user.username} vs ${comparison.user2.user.username} | MyGitStats`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await copyMatchupLink();
  }

  async function copyMatchupLink() {
    const url = matchupUrl();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setFallbackShareUrl(null);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setFallbackShareUrl(url);
    }
  }

  const handleCompareWith = (username: string) => {
    setUser1Input(username);
    setUser2Input("");
    setFeedback({});
    formRef.current?.scrollIntoView();
    user2InputRef.current?.focus({ preventScroll: true });
  };

  const inputs = [
    { id: "contender1", label: "Profile 1", ref: user1InputRef, value: user1Input, error: user1Error, onChange: handleInput1Change },
    { id: "contender2", label: "Profile 2", ref: user2InputRef, value: user2Input, error: user2Error, onChange: handleInput2Change },
  ];

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        aria-busy={isLoading}
        className="scroll-mt-24 rounded-lg border border-site-line bg-site-panel p-3 sm:p-5"
      >
        <div className="grid grid-cols-[minmax(0,1fr)_44px] items-start gap-3 sm:grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)_auto]">
          {inputs.map(({ id, label, ref, value, error, onChange }, index) => (
            <div key={id} className={index === 0 ? "min-w-0" : "col-start-1 row-start-2 min-w-0 sm:col-start-3 sm:row-start-1"}>
              <label htmlFor={id} className="mb-2 block font-mono text-xs text-site-muted">{label}</label>
              <input
                id={id}
                ref={ref}
                type="text"
                disabled={isLoading}
                autoCapitalize="none"
                spellCheck={false}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Username or GitHub URL"
                aria-describedby={error ? id + "-error" : undefined}
                aria-invalid={Boolean(error)}
                className="site-input font-mono aria-invalid:border-rose-400"
                required
              />
              {error && (
                <p id={id + "-error"} role="alert" className="mt-2 text-xs leading-relaxed text-rose-300 [overflow-wrap:anywhere]">{error}</p>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleSwap}
            disabled={isLoading}
            className="site-button col-start-2 row-span-2 row-start-1 min-h-11 w-11 self-center px-0 sm:row-span-1 sm:mt-6 sm:self-start"
            title="Swap profiles"
            aria-label="Swap profiles"
          >
            <ArrowUpDown size={16} className="sm:hidden" aria-hidden="true" />
            <ArrowLeftRight size={16} className="hidden sm:block" aria-hidden="true" />
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="site-button site-button-primary col-span-2 min-h-11 sm:col-span-1 sm:col-start-4 sm:row-start-1 sm:mt-6"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
            Compare profiles
          </button>
        </div>

        <button type="button" onClick={handleTryRandomExample} disabled={isLoading} className="mt-2 min-h-11 rounded text-sm text-site-muted underline decoration-site-control underline-offset-4 hover:text-foreground disabled:opacity-50">
          Try an example
        </button>
      </form>

      {notice && !isLoading && (
        <ComparisonNotice
          title={notice.title}
          action={<button type="button" onClick={() => formRef.current?.requestSubmit()} className="site-button min-h-11">Retry</button>}
        >
          <p>{notice.retryAt ? <>Try again after <time dateTime={notice.retryAt}>{formatComparisonDate(notice.retryAt)}</time>.</> : notice.message}</p>
        </ComparisonNotice>
      )}

      {isLoading && (
        <p role="status" className="flex items-center gap-2 border-t border-site-line py-5 font-mono text-xs text-site-muted">
          <Loader2 size={15} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
          Comparing GitHub profiles…
        </p>
      )}

      {!isLoading && comparison && (
        <section aria-labelledby="matchup-result">
          <div ref={arenaRef} className="min-w-0 space-y-5 bg-background">
            <div className="rounded-lg border border-site-line bg-site-panel p-4 sm:p-5">
              <p className="mb-2 font-mono text-xs text-site-muted [overflow-wrap:anywhere]">
                @{comparison.user1.user.username} <span className="px-1">vs</span> @{comparison.user2.user.username}
              </p>
              <h2 id="matchup-result" className="text-xl font-semibold leading-tight tracking-tight [overflow-wrap:anywhere] sm:text-2xl">
                {comparison.summary.winnerWithheld ? "Winner unavailable" : comparison.summary.headline}
              </h2>

              {!comparison.summary.isComplete && (
                <div className="mt-3">
                  <ComparisonNotice tone="warning" title="Some GitHub stats are unavailable">
                    <p>{comparison.summary.winnerWithheld
                      ? "The missing stats could change the outcome. You can still explore the available metrics below."
                      : "The available stats are enough to determine the winner. Missing values are marked below."}</p>
                  </ComparisonNotice>
                </div>
              )}

              <div data-export-ignore="true" className="mt-4 flex flex-wrap items-start gap-2">
                <button type="button" onClick={handleShare} aria-label="Share matchup" className="site-button min-h-11">
                  <Share2 size={15} aria-hidden="true" /> Share
                </button>
                <button type="button" onClick={copyMatchupLink} ref={copyButtonRef} className="site-button min-h-11">
                  {copiedLink ? <Check size={15} className="text-site-green" aria-hidden="true" /> : <Link2 size={15} aria-hidden="true" />}
                  <span aria-live="polite">{copiedLink ? "Link copied" : "Copy link"}</span>
                </button>
                <BattleCardDownload arenaRef={arenaRef} user1={comparison.user1.user.username} user2={comparison.user2.user.username} />
                <button type="button" onClick={handleCompareAnother} className="site-button min-h-11">
                  <RotateCcw size={15} aria-hidden="true" /> Compare another
                </button>
              </div>
              {fallbackShareUrl && (
                <div data-export-ignore="true" className="mt-3">
                  <ComparisonNotice
                    title="Copy the matchup link"
                    tone="warning"
                    action={<button type="button" className="site-button min-h-11" onClick={() => {
                      setFallbackShareUrl(null);
                      copyButtonRef.current?.focus();
                    }}>Done</button>}
                  >
                    <input ref={shareInputRef} readOnly aria-label="Matchup link" value={fallbackShareUrl}
                      onFocus={(event) => event.currentTarget.select()}
                      className="site-input mt-2 font-mono" />
                  </ComparisonNotice>
                </div>
              )}
            </div>

            <div className="grid min-w-0 grid-cols-2 gap-2.5 sm:gap-4">
              {[comparison.user1, comparison.user2].map((profile, index) => (
                <ComparisonCard
                  key={profile.user.username}
                  data={profile}
                  isOverallWinner={comparison.summary.overallWinner === index + 1}
                  contenderLabel={`Profile ${index + 1}`}
                />
              ))}
            </div>

            <ComparisonMetricsTable metrics={comparison.metrics} user1Name={comparison.user1.user.username} user2Name={comparison.user2.user.username} />

            <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 border-t border-site-line pt-3 font-mono text-[11px] text-site-muted">
              <span className="inline-flex items-center gap-1.5"><BrandMark size={13} color="#39d353" /> mygitstats.dev</span>
              <time dateTime={comparison.comparedAt}>Compared {formatComparisonDate(comparison.comparedAt)}</time>
            </div>
          </div>

          <details className="group mt-6 rounded-lg border border-site-line bg-site-panel px-3 sm:px-4">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded py-2 text-sm font-medium [&::-webkit-details-marker]:hidden">
              How is the winner calculated?
              <ChevronDown size={16} className="shrink-0 text-site-muted group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="space-y-2 border-t border-site-line py-3 text-sm leading-relaxed text-site-muted">
              <p>The profile that leads in more categories wins. If both lead in the same number of categories, the higher tier score breaks the tie. Matching tier scores result in a tie.</p>
              <p className="font-mono text-xs">Tier score = stars × 3 + followers × 1.5 + min(public repos, 50) + recent contributions × 0.5</p>
              <p>Recent activity is estimated from up to 100 public events per profile. If missing stats could change the outcome, the winner is withheld.</p>
            </div>
          </details>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-site-muted">Compare your profile</span>
            {[comparison.user1, comparison.user2].map(({ user }) => (
              <button key={user.username} type="button" onClick={() => handleCompareWith(user.username)} className="site-button min-h-11 max-w-full [overflow-wrap:anywhere]">
                vs @{user.username}
              </button>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="example-matchups" className="border-t border-site-line pt-5">
        <h2 id="example-matchups" className="mb-3 text-sm font-semibold">Example matchups</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {CURATED_MATCHUPS.map(({ u1, u2, label }) => (
            <button key={u1} type="button" onClick={() => handleSelectMatchup(u1, u2)} disabled={isLoading}
              className="min-h-11 rounded-lg border border-site-line bg-site-panel px-3 py-2.5 text-left hover:border-site-control disabled:opacity-50">
              <span className="block font-mono text-xs">{u1} <span className="text-site-muted">vs</span> {u2}</span>
              <span className="mt-1 block text-xs text-site-muted">{label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
