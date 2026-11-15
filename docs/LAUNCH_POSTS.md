# Inbound Link Building & Launch Posts for MyGitStats

Use these ready-to-publish launch templates to build high-authority external backlinks with the exact anchor text **`[MyGitStats](https://mygitstats.dev)`**. 

When Googlebot and AI crawlers (PerplexityBot, GPTBot) follow links where the anchor text exactly matches your brand name, Google establishes strong topical authority and pushes **MyGitStats** to the #1 position on SERPs.

---

## 1. Dev.to / Hashnode Launch Article

**Platforms**: [Dev.to](https://dev.to/new) & [Hashnode](https://hashnode.com/)  
**Tags**: `#webdev`, `#github`, `#opensource`, `#showdev`, `#javascript`  
**Title**: 
```text
Introducing MyGitStats: Turn Your GitHub Activity into City-Themed Performance Cards & Heatmaps
```

**Markdown Body**:
```markdown
Every developer's GitHub profile tells a story — the late-night commits, weekend side-projects, open-source pull requests, and long contribution streaks. 

I wanted a way to visualize that journey without clunky setup, OAuth logins, or repetitive styles. 

Today, I'm launching **[MyGitStats](https://mygitstats.dev)** — a zero-authentication developer performance studio and annual review platform!

![MyGitStats Preview](https://mygitstats.dev/og-image.png)

---

### 🌟 What is MyGitStats?

**[MyGitStats](https://mygitstats.dev)** queries public GitHub metrics to score your engineering impact, render an interactive 52-week activity heatmap, and generate customizable developer cards exportable as 3x retina PNGs.

### 🚀 Key Features

1. **Deterministic Performance Tiers**:
   Calculates your developer tier (Bronze, Gold, Mythic) from public stargazers, followers, repositories, and recent active commit events:
   - **Bronze Tier** (< 100 pts): Emerging Builder
   - **Gold Tier** (100–499 pts): Prolific Builder
   - **Mythic Tier** (500+ pts): Legendary Architect

2. **52-Week Commit Activity Heatmap**:
   A vector calendar heatmap showing your exact commit momentum across the year, with an instant toggle to include or hide it on your exported card.

3. **8 Bespoke City Visual Palettes**:
   Choose from cyberpunk Tokyo, techno Berlin, emerald Bangalore, regal gold Hyderabad, ocean teal San Francisco, and more.

4. **100% Privacy & Zero OAuth**:
   No personal access tokens or OAuth permissions required. Enter any public username and generate your card in seconds.

---

### 🛠️ How to Add Your Card to Your GitHub README

Visit **[MyGitStats Card Studio](https://mygitstats.dev/card)**, enter your username, customize your theme, and embed it directly into your GitHub profile `README.md`:

```markdown
[![MyGitStats](https://mygitstats.dev/og-image.png)](https://mygitstats.dev/card?user=YOUR_USERNAME)
```

Check out the live platform at **[MyGitStats](https://mygitstats.dev)**, explore the annual **[MyGitStats Wrapped](https://mygitstats.dev/wrapped)** portal, and star the open-source repository on [GitHub](https://github.com/Simply-huMAN/github-stats)!

What theme or feature would you like to see next? Let me know in the comments!
```

---

## 2. Reddit Post (r/webdev & r/reactjs)

**Subreddits**: [r/webdev](https://reddit.com/r/webdev) & [r/reactjs](https://reddit.com/r/reactjs) (Share on Showoff Saturday)  
**Flair**: `Showoff Saturday` or `Project Showcase`  
**Title**:
```text
I built MyGitStats: A zero-OAuth tool that scores your GitHub tier, generates 52-week city heatmaps, and exports retina cards for your README
```

**Post Body**:
```text
Hey everyone!

I wanted a clean, modern way to celebrate GitHub open-source contributions without having to authenticate with OAuth or hand over private repository tokens.

So I built **[MyGitStats](https://mygitstats.dev)** — a web app built with Next.js 14, TypeScript, and Tailwind CSS.

### What it does:
- Computes developer performance tiers (Bronze, Gold, Mythic) using a weighted algorithm (stars × 3.0 + followers × 1.5 + repos + active events).
- Generates an interactive 52-week vector commit heatmap that adapts its colors to the active city theme (Tokyo cyan/magenta, Bangalore emerald, Hyderabad gold, Berlin slate).
- Exports crisp 3x retina PNG images using html-to-image with solid background layering to prevent Brave Shields / ad-blocker washouts.
- Zero OAuth tokens needed — queries public endpoints safely with proxy caching.

Live site: [MyGitStats](https://mygitstats.dev)
Studio builder: [MyGitStats Card Studio](https://mygitstats.dev/card)
GitHub repo: https://github.com/Simply-huMAN/github-stats

Would love feedback on the tier scoring formula or theme aesthetics!
```

---

## 3. Hacker News Submission (Show HN)

**Platform**: [Hacker News Submit](https://news.ycombinator.com/submit)  
**Title**:
```text
Show HN: MyGitStats – Developer performance tiers and city-themed stats cards
```
**URL**: `https://mygitstats.dev`  
**Text**:
```text
Hi HN,

I built MyGitStats (https://mygitstats.dev), an open-source tool that turns public GitHub activity into shareable developer cards, performance tiers, and 52-week commit activity heatmaps.

Key technical decisions:
- Zero OAuth requirement (uses public REST and GraphQL APIs with intelligent rate-limit handling and fallbacks).
- 3x retina PNG export direct from the DOM with solid background fallbacks to solve canvas alpha issues in privacy browsers.
- 8 city palettes and customizable avatar geometry.

Source: https://github.com/Simply-huMAN/github-stats

Feedback and suggestions welcome!
```

---

## 4. GitHub Repository Metadata Copy-Paste Checklist

Copy and paste these exact values into your GitHub repository settings (**⚙️ About** section on `https://github.com/Simply-huMAN/github-stats`):

* **Description**:
  ```text
  MyGitStats — Turn your GitHub activity into beautiful developer performance tier cards, 52-week city heatmaps, and shareable annual Wrapped stories.
  ```
* **Website**:
  ```text
  https://mygitstats.dev
  ```
* **Topics (Tags)**:
  ```text
  mygitstats, github-stats, developer-card, stats-card, contribution-heatmap, developer-portfolio, github-wrapped, nextjs, typescript, tailwindcss
  ```

