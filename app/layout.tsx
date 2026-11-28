import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import "./globals.css";

const BASE_URL = "https://mygitstats.dev";
const SITE_DESCRIPTION = "Create a stats card from a public GitHub profile. Choose a city theme, download a PNG, or share your card.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  applicationName: "MyGitStats",
  title: {
    default: "MyGitStats — Developer Stats Cards & GitHub Wrapped",
    template: "%s | MyGitStats",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "GitHub stats",
    "GitHub stats card",
    "GitHub wrapped",
    "developer card",
    "git stats",
    "developer portfolio",
    "GitHub performance tier",
    "GitHub README card",
    "developer card generator",
    "open source stats",
  ],
  authors: [{ name: "MyGitStats", url: BASE_URL }],
  creator: "MyGitStats",
  publisher: "MyGitStats",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "MyGitStats",
    title: "MyGitStats — Developer Stats Cards & GitHub Wrapped",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "MyGitStats — Developer Stats Cards & GitHub Wrapped",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyGitStats — Developer Stats Cards & GitHub Wrapped",
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0c0e",
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MyGitStats",
    alternateName: ["mygitstats.dev", "MyGitStats App", "MyGitStats Developer Cards"],
    url: BASE_URL,
    description: SITE_DESCRIPTION,
    sameAs: ["https://github.com/Simply-huMAN/github-stats"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MyGitStats",
    url: BASE_URL,
    sameAs: ["https://github.com/Simply-huMAN/github-stats"],
    description: SITE_DESCRIPTION,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    featureList: [
      "Developer Performance Tier Scoring (Mythic, Gold, Bronze)",
      "52-Week GitHub-Style Commit Activity Heatmap with City Themes",
      "8 Bespoke City Aesthetic Palettes & Avatar Customizers",
      "Crisp 3x Retina PNG Direct Image Export",
      "GitHub Wrapped Annual Year-in-Review Story",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Maloth Aditya",
      url: "https://github.com/Simply-huMAN",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How is the GitHub performance tier calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The developer score is calculated deterministically from public GitHub metrics: (Total Stars × 3.0) + (Followers × 1.5) + (min(Public Repos, 50) × 1.0) + (Active 90-Day Contributions × 0.5). Scores below 100 receive Bronze Tier, 100–499 receive Gold Tier, and 500+ earn Mythic Tier.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to sign in or provide a GitHub token to use MyGitStats?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No personal authentication or token is required. MyGitStats queries public GitHub REST API endpoints without requiring any logins, permissions, or private repository access.",
        },
      },
      {
        "@type": "Question",
        name: "How can I export and share my developer card?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Enter any public GitHub username, select your preferred city aesthetic (Tokyo, Berlin, Bangalore, etc.), frame, and badge, then export a crisp 3x retina PNG to embed in your GitHub profile README, portfolio, or social networks.",
        },
      },
    ],
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "z3rub6x7jr");
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
