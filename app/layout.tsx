import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";
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
  title: "Garox.org",
  description: "Garox's personal website",
};

// `viewport-fit=cover` exposes the safe-area insets used to clear notches.
export const viewport: Viewport = { viewportFit: "cover", themeColor: "#ffffff" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
