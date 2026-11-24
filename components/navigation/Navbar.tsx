"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Sparkles, CreditCard, Menu, X, ArrowUpRight, Swords } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      href: "/wrapped",
      label: "Wrapped 2026",
      badge: "Flagship",
      icon: Sparkles,
      highlight: true,
    },
    {
      href: "/card",
      label: "Card Studio",
      icon: CreditCard,
    },
    {
      href: "/compare",
      label: "Compare",
      badge: "New",
      icon: Swords,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              MyGitStats
              <span className="rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-mono font-medium text-indigo-400 border border-indigo-500/20">
                .dev
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-1.5 lg:gap-2 px-2.5 py-1.5 lg:px-3.5 lg:py-2 rounded-xl text-xs lg:text-sm font-medium transition-all",
                  isActive
                    ? "text-white bg-zinc-900 border border-zinc-800 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                )}
              >
                <Icon
                  className={cn(
                    "w-3.5 h-3.5 lg:w-4 lg:h-4",
                    item.highlight ? "text-amber-400" : "text-zinc-400",
                    isActive && "text-indigo-400"
                  )}
                />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="hidden sm:inline-block rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-1.5 py-0.5 text-[9px] lg:text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA / GitHub Link */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href="https://github.com/Simply-huMAN/github-stats"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all"
          >
            <Github className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3 opacity-60 hidden lg:inline-block" />
          </a>

          {/* Redundant Get Wrapped CTA hidden on md (since Wrapped 2026 is already in navlinks) to prevent spill at 768px */}
          <Link
            href="/wrapped"
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 lg:px-4 lg:py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Get Wrapped</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-4 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-zinc-900 text-white border border-zinc-800"
                    : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-zinc-800/80 flex flex-col gap-2">
            <Link
              href="/wrapped"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Get Your 2026 Wrapped</span>
            </Link>
            <a
              href="https://github.com/Simply-huMAN/github-stats"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 text-xs font-mono"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repository</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
