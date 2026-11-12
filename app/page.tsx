"use client";

import React, { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  CreditCard,
  ArrowRight,
  Search,
  Flame,
  Star,
  ShieldCheck,
  Code2,
  Share2,
  Zap,
} from "lucide-react";

export default function PlatformLandingPage() {
  const router = useRouter();
  const [usernameInput, setUsernameInput] = useState("");

  // Backwards compatibility: If legacy share link hit "/?user=xxx", redirect to "/card?user=xxx"
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("user") || params.get("theme") || params.get("frame")) {
      router.replace(`/card?${params.toString()}`);
    }
  }, [router]);

  function handleQuickWrapped(e: FormEvent) {
    e.preventDefault();
    const trimmed = usernameInput.trim().replace(/^@+/, "");
    if (!trimmed) return;
    router.push(`/wrapped?user=${encodeURIComponent(trimmed)}`);
  }

  return (
    <main className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col items-center selection:bg-indigo-500/40">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-[140px]" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute top-2/3 -right-40 w-96 h-96 rounded-full bg-pink-500/10 blur-[130px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-5xl px-4 pt-12 sm:pt-20 pb-16 flex flex-col items-center text-center">
        {/* Top Launch Pill */}
        <Link
          href="/wrapped"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 border border-indigo-500/30 text-xs font-mono text-indigo-300 hover:border-indigo-500/60 transition-all mb-6 shadow-lg shadow-indigo-500/10 group"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span>Announcing <strong>GitHub Wrapped 2026</strong></span>
          <ArrowRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-3xl leading-[1.08]">
          Turn your code into a story{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            worth sharing.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl leading-relaxed">
          Generate your <strong className="text-zinc-200">GitHub Wrapped 2026</strong> year-in-review and customize beautiful, city-themed <strong className="text-zinc-200">performance cards</strong> for your README and portfolio.
        </p>

        {/* Quick Username Action */}
        <form onSubmit={handleQuickWrapped} className="mt-8 w-full max-w-md flex items-center gap-2">
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
            className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 active:scale-95 transition-all flex items-center gap-2 flex-shrink-0"
          >
            <span>Get Wrapped</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Sample profiles */}
        <div className="mt-3.5 flex items-center gap-2 text-xs text-zinc-500 flex-wrap justify-center font-mono">
          <span>Popular profiles:</span>
          {["shadcn", "torvalds", "kentcdodds", "leerob", "gaearon"].map((handle) => (
            <button
              key={handle}
              type="button"
              onClick={() => router.push(`/wrapped?user=${handle}`)}
              className="hover:text-zinc-300 underline underline-offset-4 decoration-zinc-800 transition-colors"
            >
              @{handle}
            </button>
          ))}
        </div>

        {/* Dual Product Highlight Cards */}
        <div className="mt-16 w-full grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Product 1: GitHub Wrapped (Hero) */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#120d2b] via-[#0a0718] to-black border border-indigo-500/40 shadow-2xl shadow-indigo-950/60 flex flex-col justify-between overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-semibold uppercase">
                  Flagship Experience
                </span>
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                GitHub Wrapped 2026
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Turn a year of coding into a captivating 6-chapter visual story. Discover your longest contribution streak, top languages, standout repos, and data-driven developer archetype.
              </p>

              <div className="mt-6 space-y-2 text-xs text-zinc-400 font-mono">
                <div className="flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>365-day commit velocity &amp; streaks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Byte-weighted language breakdown</span>
                </div>
                <div className="flex items-center gap-2">
                  <Share2 className="w-3.5 h-3.5 text-pink-400" />
                  <span>Shareable cards for X, LinkedIn &amp; Stories</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">100% Free • No OAuth Needed</span>
              <Link
                href="/wrapped"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md group-hover:scale-105"
              >
                <span>Launch Wrapped</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Product 2: Stats Card Studio (Utility) */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#121217] via-[#09090c] to-black border border-zinc-800 shadow-2xl flex flex-col justify-between overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] font-mono font-semibold uppercase">
                  Profile Utility
                </span>
                <CreditCard className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Developer Card Studio
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Design custom developer badges and performance tier cards. Choose from 8 city themes, avatar geometries, and export 3x retina PNGs for your README and portfolio.
              </p>

              <div className="mt-6 space-y-2 text-xs text-zinc-400 font-mono">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>8 City Themes (Tokyo, Berlin, Bangalore...)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Mythic, Gold &amp; Bronze performance tiers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  <span>3x Retina PNG export engine</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">README Image &amp; PNG</span>
              <Link
                href="/card"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold border border-zinc-700 transition-all group-hover:scale-105"
              >
                <span>Customize Card</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="w-full max-w-5xl px-4 py-16 border-t border-zinc-900">
        <div className="text-center mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
            Engineered For Developers
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
            Everything you need to showcase your craft
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Year-in-Review Story</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Unpack your commits, streaks, language shifts, and GitHub highlights formatted as high-res shareable slide cards.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">8 City-Inspired Themes</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Cyberpunk Tokyo, Minimalist Berlin, High-velocity Bangalore, Royal Hyderabad, and Sunset San Francisco aesthetics.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Weighted Performance Tiers</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Objective scoring based on stars, followers, repos, and verified contribution activity (Mythic, Gold, Bronze).
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
