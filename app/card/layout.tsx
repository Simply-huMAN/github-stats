import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Developer Stats Card Builder",
  description:
    "Generate and customize your GitHub developer stats card with city themes, avatar frames, performance tiers, and export high-res PNGs.",
  alternates: {
    canonical: "/card/",
  },
  openGraph: {
    title: "Custom Developer Stats Card Builder | MyGitStats",
    description:
      "Generate and customize your GitHub developer stats card with city themes, avatar frames, performance tiers, and export high-res PNGs.",
    url: "https://mygitstats.dev/card",
  },
};

export default function CardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

