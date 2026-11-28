import type { Metadata } from "next";

const description = "Preview the chapters of a GitHub year in review, including activity, languages, and standout repositories.";

export const metadata: Metadata = {
  title: "GitHub Wrapped — Developer Year in Review",
  description,
  alternates: {
    canonical: "/wrapped",
  },
  openGraph: {
    title: "GitHub Wrapped — Developer Year in Review | MyGitStats",
    description,
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

