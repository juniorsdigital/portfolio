import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { SERVICES, serviceHref, startingPrice } from "@/lib/services";
import { SITE } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Design, video & marketing in ${SITE.location}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    siteName: SITE.brand,
    type: "website",
    locale: "en_US",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { telephone: false },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE.url}/#person`,
      name: SITE.name,
      url: SITE.url,
      image: `${SITE.url}/images/about-portrait.png`,
      jobTitle: "Freelance graphic designer, video editor and marketer",
      email: `mailto:${SITE.email}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE.location,
        addressRegion: "PA",
        addressCountry: "US",
      },
      knowsAbout: [
        "Graphic design",
        "Product cover design",
        "Video editing",
        "Social media marketing",
        "Google Business Profile management",
        "Campaign management",
        "Brand identity",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE.url}/#service`,
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      founder: { "@id": `${SITE.url}/#person` },
      areaServed: [
        { "@type": "City", name: SITE.location },
        { "@type": "Country", name: "United States" },
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE.location,
        addressRegion: "PA",
        addressCountry: "US",
      },
      serviceType: SERVICES.map((s) => s.name),
      priceRange: `$${Math.min(...SERVICES.map(startingPrice))}+`,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: SERVICES.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": `${SITE.url}${serviceHref(s)}#service`,
            name: s.name,
            url: `${SITE.url}${serviceHref(s)}`,
          },
          priceSpecification: {
            "@type": "PriceSpecification",
            minPrice: startingPrice(s),
            priceCurrency: "USD",
          },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      name: SITE.name,
      url: SITE.url,
      inLanguage: "en-US",
      publisher: { "@id": `${SITE.url}/#person` },
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#0f0f0d",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexMono.variable} h-full bg-ink`}
    >
      <body className="flex min-h-full flex-col bg-ink text-paper antialiased">
        <a
          href="#main"
          className="btn btn-sm btn-signal sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]"
        >
          Skip to content
        </a>
        <JsonLd data={siteJsonLd} />
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
