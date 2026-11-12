"use client";

import React, { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Flame,
  GitCommit,
  GitPullRequest,
  Star,
  Award,
  ArrowRight,
  Search,
  Code2,
  CheckCircle2,
  ShieldCheck,
  Share2,
} from "lucide-react";

const YEARS = [2026, 2025, 2024];

export default function WrappedPage() {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [usernameInput, setUsernameInput] = useState("");
  const [activeUser, setActiveUser] = useState("torvalds");

  // Read ?user= query param if passed
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get("user");
    if (userParam) {
      setUsernameInput(userParam);
      setActiveUser(userParam);
    }
  }, []);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const trimmed = usernameInput.trim().replace(/^@+/, "");
    if (!trimmed) return;
    setActiveUser(trimmed);
  }

  return (
    <main className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col items-center px-4 py-10 md:py-16 selection:bg-indigo-500/40">
      {/* Ambient background lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-pink-500/15 blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] rounded-full bg-amber-500/10 blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center">
        {/* Top Flagship Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-indigo-500/15 border border-amber-500/30 text-xs font-mono text-amber-300 mb-6 shadow-md shadow-amber-500/10">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Flagship Developer Year-in-Review</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-2xl leading-[1.1]">
          Your GitHub Year, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">Wrapped.</span>
        </h1>

        <p className="mt-4 text-sm sm:text-base md:text-lg text-zinc-400 max-w-xl leading-relaxed">
          Relive your {selectedYear} coding story. Unpack your total commits, streak records, top languages, standout repositories, and developer personality.
        </p>

        {/* Year Selector */}
        <div className="mt-8 flex items-center justify-center gap-2 p-1 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl">
          {YEARS.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => setSelectedYear(year)}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedYear === year
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{year}</span>
                {year === 2026 && (
                  <span className="text-[10px] uppercase font-mono px-1 rounded bg-amber-400/20 text-amber-300">
                    Now
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Username Lookup */}
        <form onSubmit={handleSearch} className="mt-6 w-full max-w-md flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Enter GitHub handle (e.g. torvalds)"
              className="w-full pl-10 pr-4 py-3 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/25 active:scale-95 transition-all flex items-center gap-2 flex-shrink-0"
          >
            <span>Preview</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Sample profiles */}
        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 flex-wrap justify-center font-mono">
          <span>Try profiles:</span>
          {["shadcn", "torvalds", "kentcdodds", "leerob", "gaearon"].map((handle) => (
            <button
              key={handle}
              type="button"
              onClick={() => {
                setUsernameInput(handle);
                setActiveUser(handle);
              }}
              className="hover:text-zinc-300 underline underline-offset-4 decoration-zinc-700"
            >
              @{handle}
            </button>
          ))}
        </div>

        {/* Interactive Wrapped Story Preview Showcase */}
        <div className="w-full mt-12 pt-8 border-t border-zinc-850">
          <div className="text-center mb-6">
            <div className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
              The 6-Chapter Wrapped Experience
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              What your @{activeUser} review looks like
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
            {/* Slide 1: Welcome & Identity */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-zinc-900/80 to-zinc-950 border border-indigo-500/30 flex flex-col justify-between h-48 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-indigo-300 uppercase font-semibold">01 • Identity</span>
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">The Journey Begins</div>
                <p className="text-xs text-zinc-400 mt-1">
                  Developer profile snapshot, year recap badge, and account seniority.
                </p>
              </div>
              <div className="text-xs font-mono text-zinc-500">@{activeUser} • {selectedYear}</div>
            </div>

            {/* Slide 2: Activity & Commits */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-zinc-900/80 to-zinc-950 border border-purple-500/30 flex flex-col justify-between h-48 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-purple-300 uppercase font-semibold">02 • Activity</span>
                <Flame className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">Velocity &amp; Streaks</div>
                <p className="text-xs text-zinc-400 mt-1">
                  Annual commit count, longest active contribution streak, and busiest coding day.
                </p>
              </div>
              <div className="text-xs font-mono text-purple-400/80">365-day heatmap preview</div>
            </div>

            {/* Slide 3: Languages Profile */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-zinc-900/80 to-zinc-950 border border-cyan-500/30 flex flex-col justify-between h-48 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-cyan-300 uppercase font-semibold">03 • Languages</span>
                <Code2 className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">Top Tech Stack</div>
                <p className="text-xs text-zinc-400 mt-1">
                  Byte-weighted breakdown of your most written languages across repositories.
                </p>
              </div>
              <div className="text-xs font-mono text-cyan-400/80">TypeScript • Python • Go</div>
            </div>

            {/* Slide 4: Standout Repos */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-zinc-900/80 to-zinc-950 border border-amber-500/30 flex flex-col justify-between h-48 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-amber-300 uppercase font-semibold">04 • Highlights</span>
                <Star className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">Repository Stars</div>
                <p className="text-xs text-zinc-400 mt-1">
                  Top performing public projects and most starred contributions of {selectedYear}.
                </p>
              </div>
              <div className="text-xs font-mono text-amber-400/80">Open Source Impact</div>
            </div>

            {/* Slide 5: Personality */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-zinc-900/80 to-zinc-950 border border-rose-500/30 flex flex-col justify-between h-48 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-rose-300 uppercase font-semibold">05 • Personality</span>
                <Award className="w-4 h-4 text-rose-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">Developer Archetype</div>
                <p className="text-xs text-zinc-400 mt-1">
                  Algorithmic developer persona: &ldquo;Night Owl Architect&rdquo; or &ldquo;Prolific Shipper&rdquo;.
                </p>
              </div>
              <div className="text-xs font-mono text-rose-400/80">Personality Badge</div>
            </div>

            {/* Slide 6: Share Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-zinc-900/80 to-zinc-950 border border-emerald-500/30 flex flex-col justify-between h-48 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-300 uppercase font-semibold">06 • Finale</span>
                <Share2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">Social Summary Card</div>
                <p className="text-xs text-zinc-400 mt-1">
                  High-res downloadable card optimized for X/Twitter, LinkedIn, and Instagram stories.
                </p>
              </div>
              <div className="text-xs font-mono text-emerald-400/80">3x PNG Export</div>
            </div>
          </div>
        </div>

        {/* Studio Cross-link */}
        <div className="mt-14 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center max-w-lg">
          <h3 className="text-base font-bold text-white">Also need a GitHub README Card?</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Build live SVG &amp; PNG cards customized with city themes (Tokyo, Berlin, Bangalore) for your profile repository.
          </p>
          <Link
            href={`/card?user=${encodeURIComponent(activeUser)}`}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
          >
            <span>Open Card Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
