"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { CardStyleToggle } from "@/components/CardStyleToggle";
import { DEFAULT_CARD_OPTIONS, EXAMPLE_CARD } from "@/lib/previewCard";
import { validateGitHubUsername } from "@/lib/validation";
import type { CardStyle } from "@/types/builder";

const steps = [
  { title: "Enter a username", detail: "Start with any public GitHub profile." },
  { title: "Customize in Studio", detail: "Pick a palette, frame, and badge. Show or hide the heatmap." },
  { title: "Download or share", detail: "Export a high-resolution PNG or copy a link to your card." },
];

const wrappedTopics = [
  { title: "Identity", detail: "Profile & tier" },
  { title: "Activity", detail: "Streaks & volume" },
  { title: "Languages", detail: "Your stack" },
  { title: "Highlights", detail: "Standout repos" },
];

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [cardStyle, setCardStyle] = useState<CardStyle>("minimal");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("user") || params.get("theme") || params.get("frame")) {
      router.replace(`/card?${params.toString()}`);
    }
  }, [router]);

  function openCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateGitHubUsername(username);
    if (!result.isValid) {
      setFormError("Enter a valid GitHub username or profile URL.");
      return;
    }

    const params = new URLSearchParams({ user: result.cleanUsername, style: cardStyle });
    router.push(`/card?${params.toString()}`);
  }

  return (
    <main className="site-container">
      <section aria-labelledby="home-title" className="grid items-start gap-8 pb-12 pt-10 sm:gap-12 sm:py-16 lg:grid-cols-[1.06fr_0.94fr] lg:gap-16 lg:py-[88px]">
        <div>
          <h1 id="home-title" className="max-w-[15ch] text-balance text-[clamp(2.375rem,4.8vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.045em]">
            Create a GitHub stats card
          </h1>
          <p className="mt-4 max-w-[43ch] text-base leading-relaxed text-site-muted sm:mt-5 sm:text-[17px]">
            Put your GitHub stats and contribution heatmap on a card. Customize it in Studio, then download it or share a link.
          </p>

          <form action="/card" onSubmit={openCard} className="mt-6 max-w-[480px] sm:mt-8">
            <label htmlFor="home-username" className="mb-2 block font-mono text-xs text-site-muted">GitHub username</label>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
              <input
                id="home-username"
                name="user"
                className="site-input font-mono"
                placeholder="e.g. torvalds"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setFormError("");
                }}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                required
                aria-invalid={Boolean(formError)}
                aria-describedby={formError ? "home-username-error" : undefined}
              />
              <input type="hidden" name="style" value={cardStyle} />
              <button type="submit" className="site-button site-button-primary whitespace-nowrap">
                Create card <ArrowRight size={15} className="hidden sm:block" aria-hidden="true" />
              </button>
            </div>
            {formError && <p id="home-username-error" role="alert" className="mt-2 text-sm text-red-300">{formError}</p>}
          </form>
          <p className="mt-3 font-mono text-[11px] text-site-muted sm:text-xs">Public GitHub data · No sign-in</p>
        </div>

        <figure className="min-w-0 max-w-[540px]">
          <figcaption className="mb-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-[11px] text-site-muted">
            <span>Sample card</span>
            <CardStyleToggle value={cardStyle} onChange={setCardStyle} />
          </figcaption>
          <StatsCard data={EXAMPLE_CARD} customizerOptions={{ ...DEFAULT_CARD_OPTIONS, cardStyle }} />
        </figure>
      </section>

      <section aria-labelledby="how-it-works" className="border-t border-site-line py-9 sm:py-12">
        <h2 id="how-it-works" className="text-[26px] font-semibold tracking-tight">How it works</h2>
        <ol className="mt-5 grid divide-y divide-site-line sm:mt-7 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {steps.map(({ title, detail }, index) => (
            <li key={title} className="grid grid-cols-[auto_1fr] gap-x-3 py-3 sm:block sm:px-5 sm:py-0 sm:first:pl-0 sm:last:pr-0 lg:px-7">
              <span className="pt-0.5 font-mono text-xs text-site-green sm:mb-2 sm:block" aria-hidden="true">0{index + 1}</span>
              <div>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-site-muted">{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="wrapped-title" className="grid items-center gap-6 border-t border-site-line py-9 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <h2 id="wrapped-title" className="text-[26px] font-semibold tracking-tight">Your GitHub year in review</h2>
          <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-site-muted">
            Preview the stories behind your activity, from contribution streaks to the repositories that stood out.
          </p>
          <Link href="/wrapped" className="site-button mt-5">
            Open Wrapped <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-2 sm:gap-3" aria-label="Wrapped topics">
          {wrappedTopics.map(({ title, detail }) => (
            <li key={title} className="rounded-lg border border-site-line bg-site-panel px-3 py-2.5 sm:px-4 sm:py-3">
              <span className="text-sm font-medium">{title}</span>
              <span className="mt-1 block font-mono text-[11px] text-site-muted">{detail}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
