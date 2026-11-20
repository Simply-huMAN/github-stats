import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare GitHub Developers — Head-to-Head Stats & Tier Battle",
  description:
    "Compare any two GitHub users side-by-side. Analyze performance tiers, total stars, active contributions, followers, and repositories with MyGitStats.",
  alternates: {
    canonical: "/compare",
  },
  openGraph: {
    title: "Compare GitHub Developers — Head-to-Head Stats & Tier Battle | MyGitStats",
    description:
      "Compare any two GitHub users side-by-side. Analyze performance tiers, total stars, active contributions, followers, and repositories with MyGitStats.",
    url: "https://mygitstats.dev/compare",
  },
};

export default function CompareRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

