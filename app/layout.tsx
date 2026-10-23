import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono, Instrument_Serif, Syne } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { pageMeta } from "@/lib/seo";
import { DESCRIPTIONS, SITE, SITE_URL } from "@/lib/site";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
});

const ibm = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm",
  weight: ["400", "500"],
});

const defaults = pageMeta({
  title: `${SITE.name} — Design, Video, Marketing`,
  absoluteTitle: true,
  description: DESCRIPTIONS.home,
  path: "/",
});

export const metadata: Metadata = {
  ...defaults,
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} — Design, Video, Marketing`,
    template: `%s — ${SITE.name}`,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${instrument.variable} ${ibm.variable} h-full bg-bg`}
    >
      <body className="min-h-full flex flex-col bg-bg text-bone antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
