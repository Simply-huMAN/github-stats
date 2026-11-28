"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

const links = [
  { href: "/card", label: "Card Studio" },
  { href: "/wrapped", label: "Wrapped" },
  { href: "/compare", label: "Compare" },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-container site-header-inner">
        <Link href="/" className="site-brand" onClick={() => setMenuOpen(false)}>
          <BrandMark size={22} />
          <span>mygitstats<span className="text-site-muted">.dev</span></span>
        </Link>
        <button
          type="button"
          className="site-button site-menu-toggle"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>
        <nav
          id="primary-navigation"
          className="site-nav"
          data-open={menuOpen}
          aria-label="Main navigation"
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href || pathname?.startsWith(href + "/") ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <a
            className="site-button"
            href="https://github.com/Simply-huMAN/github-stats"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
}
