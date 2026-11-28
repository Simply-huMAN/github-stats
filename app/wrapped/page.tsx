"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sanitizeGitHubUsername } from "@/lib/validation";

const years = [2026, 2025, 2024];
const chapters = [
  { title: "Identity", detail: "Profile details, account age, and performance tier." },
  { title: "Activity", detail: "Contributions, streaks, and the busiest day of the year." },
  { title: "Languages", detail: "Top languages by share of repository code." },
  { title: "Highlights", detail: "Repositories that earned the most stars." },
  { title: "Personality", detail: "A developer archetype based on activity patterns." },
  { title: "Share card", detail: "A summary designed for sharing." },
];

export default function WrappedPage() {
  const [year, setYear] = useState(years[0]);
  const [username, setUsername] = useState("");
  const [activeUser, setActiveUser] = useState("torvalds");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user = sanitizeGitHubUsername(params.get("user"));
    if (user) {
      setUsername(user);
      setActiveUser(user);
    }
  }, []);

  function handlePreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const user = sanitizeGitHubUsername(username);
    if (user) setActiveUser(user);
  }

  return (
    <main className="site-container py-9 sm:py-14">
      <h1 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">GitHub Wrapped</h1>
      <p className="mt-3 max-w-[54ch] leading-relaxed text-site-muted">
        Preview the chapters of a GitHub year in review.
      </p>

      <div className="mt-6 flex flex-wrap gap-2 font-mono" role="group" aria-label="Year">
        {years.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={year === option}
            onClick={() => setYear(option)}
            className={year === option ? "site-button site-button-primary" : "site-button"}
          >
            {option}
          </button>
        ))}
      </div>

      <form onSubmit={handlePreview} className="mt-5 max-w-md">
        <label htmlFor="wrapped-username" className="mb-2 block font-mono text-xs text-site-muted">GitHub username</label>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
          <input
            id="wrapped-username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="e.g. torvalds"
            className="site-input font-mono"
            autoCapitalize="none"
            spellCheck={false}
            required
          />
          <button type="submit" className="site-button">
            Preview <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      </form>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 font-mono text-[11px] text-site-muted">
        <span>Try</span>
        {["shadcn", "torvalds", "kentcdodds", "leerob", "gaearon"].map((handle) => (
          <button
            key={handle}
            type="button"
            onClick={() => {
              setUsername(handle);
              setActiveUser(handle);
            }}
            className="underline decoration-site-control underline-offset-4 hover:text-foreground"
          >
            @{handle}
          </button>
        ))}
      </div>

      <section aria-labelledby="wrapped-preview" className="mt-9 border-t border-site-line pt-7 sm:mt-12">
        <h2 id="wrapped-preview" className="text-2xl font-semibold tracking-tight">Chapter preview</h2>
        <p className="mt-2 break-all font-mono text-sm text-site-muted">@{activeUser} · {year}</p>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map(({ title, detail }, index) => (
            <li key={title} className="rounded-lg border border-site-line bg-site-panel p-4">
              <span className="font-mono text-xs text-site-green" aria-hidden="true">0{index + 1}</span>
              <h3 className="mt-3 text-sm font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-site-muted">{detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <nav aria-label="More MyGitStats tools" className="mt-8 flex flex-wrap gap-2">
        <Link href={`/card?user=${encodeURIComponent(activeUser)}`} className="site-button">Open Card Studio</Link>
        <Link href={`/compare?user1=${encodeURIComponent(activeUser)}`} className="site-button">Compare profile</Link>
      </nav>
    </main>
  );
}
