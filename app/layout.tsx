import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Desktop } from "@/desktop/desktop";
import { getLibrary } from "@/lib/library";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://garox.org"),
  title: { default: "Garox.org", template: "%s · Garox.org" },
  description: "Garox's personal page: posts, things I'm building, and what I'm listening to.",
  openGraph: { siteName: "Garox.org", type: "website" },
  twitter: { card: "summary_large_image" },
};

// `viewport-fit=cover` exposes the safe-area insets used to clear notches.
export const viewport: Viewport = { viewportFit: "cover", themeColor: "#ffffff" };

/**
 * The desktop lives here, so it persists while pages change. Each page is
 * whatever's fullscreen on top of it; `/` is the bare desktop.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NuqsAdapter>
          <Desktop library={await getLibrary()}>{children}</Desktop>
        </NuqsAdapter>
      </body>
    </html>
  );
}
