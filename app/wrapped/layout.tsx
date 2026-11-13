import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitHub Wrapped — Developer Year in Review",
  description:
    "Explore your annual GitHub contributions, streak milestones, pull requests, and coding achievements.",
  alternates: {
    canonical: "https://mygitstats.dev/wrapped",
  },
  openGraph: {
    title: "GitHub Wrapped — Developer Year in Review | MyGitStats",
    description:
      "Explore your annual GitHub contributions, streak milestones, pull requests, and coding achievements.",
    url: "https://mygitstats.dev/wrapped",
  },
};

export default function WrappedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

