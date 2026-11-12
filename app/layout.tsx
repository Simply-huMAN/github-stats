import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mygitstats.dev"),
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
  ],
  authors: [{ name: "MyGitStats" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mygitstats.dev",
    siteName: "MyGitStats",
    title: "MyGitStats — Developer Stats Cards & GitHub Wrapped",
    description:
      "Turn your GitHub activity into beautiful developer performance tier cards, city-themed profiles, and shareable annual Wrapped stories.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyGitStats — Developer Stats Cards & GitHub Wrapped",
    description:
      "Turn your GitHub activity into beautiful developer performance tier cards, city-themed profiles, and shareable annual Wrapped stories.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#070709",
};

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
      </head>
      <body className="bg-zinc-950 text-zinc-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
