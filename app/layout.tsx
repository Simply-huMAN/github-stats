import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import "./globals.css";

const BASE_URL = "https://mygitstats.dev";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "MyGitStats — Developer Stats Cards & GitHub Wrapped",
    template: "%s | MyGitStats",
  },
  description:
    "Turn your GitHub activity into beautiful developer performance tier cards, city-themed profiles, and shareable annual Wrapped stories.",
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
    canonical: BASE_URL,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "MyGitStats",
    title: "MyGitStats — Developer Stats Cards & GitHub Wrapped",
    description:
      "Turn your GitHub activity into beautiful developer performance tier cards, city-themed profiles, and shareable annual Wrapped stories.",
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
    description:
      "Turn your GitHub activity into beautiful developer performance tier cards, city-themed profiles, and shareable annual Wrapped stories.",
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
  themeColor: "#070709",
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MyGitStats",
    url: BASE_URL,
    description:
      "Turn your GitHub activity into beautiful developer performance tier cards, city-themed profiles, and shareable annual Wrapped stories.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "MyGitStats",
      url: BASE_URL,
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
      <body className="bg-zinc-950 text-zinc-100 antialiased selection:bg-indigo-500 selection:text-white flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
