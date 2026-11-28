import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container site-footer-inner">
        <span>mygitstats.dev · Built in Hyderabad</span>
        <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link href="/card">Card Studio</Link>
          <Link href="/wrapped">Wrapped</Link>
          <Link href="/compare">Compare</Link>
          <a
            href="https://github.com/Simply-huMAN/github-stats"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1"
          >
            GitHub <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </nav>
      </div>
    </footer>
  );
}
