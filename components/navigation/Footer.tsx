import React from "react";
import Link from "next/link";
import { Sparkles, Github, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950/90 text-zinc-400 py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                MyGitStats<span className="text-indigo-400">.dev</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
              Celebrate your developer journey with your GitHub Wrapped year-in-review and high-resolution, city-themed developer performance tier cards.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Public data only • No OAuth token required</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono font-semibold text-zinc-200 uppercase tracking-wider">
              Products
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/wrapped"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>GitHub Wrapped 2026</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                    Hot
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/card" className="hover:text-white transition-colors">
                  Stats Card Studio
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/Simply-huMAN/github-stats"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Open Source Code
                </a>
              </li>
            </ul>
          </div>

          {/* City Themes & Design */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono font-semibold text-zinc-200 uppercase tracking-wider">
              City Themes
            </div>
            <div className="flex flex-wrap gap-1 text-[11px] font-mono text-zinc-500">
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">Tokyo</span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">Berlin</span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">Bangalore</span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">Hyderabad</span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">San Francisco</span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">Paris</span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">Frankfurt</span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">Shanghai</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} MyGitStats.dev — Built for developers worldwide.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Simply-huMAN/github-stats"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <span>•</span>
            <span className="flex items-center gap-1 text-zinc-400">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for open source
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
