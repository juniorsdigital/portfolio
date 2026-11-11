import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { SERVICES, serviceHref, startingPrice } from "@/lib/services";
import { SITE, SOCIAL_LINKS } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

// The same font file again, for the condensed .display / .wordmark styles. Its
// fallback is Arial Bold scaled to Archivo's 72% width (see globals.css), so the
// headlines wrap the same before and after the font swaps in.
const archivoDisplay = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo-display",
  axes: ["wdth"],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Archivo Display Fallback", "sans-serif"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  display: "swap",
});

const GTM_CONTAINER_ID = "GTM-PZJNX6GQ";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `Cover art for music, sample & sound packs — ${SITE.name}`,
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
      jobTitle: "Freelance cover artist, graphic designer and video editor",
      ...(SOCIAL_LINKS.length > 0 ? { sameAs: SOCIAL_LINKS.map((l) => l.href) } : {}),
      email: `mailto:${SITE.email}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE.location,
        addressRegion: "PA",
        addressCountry: "US",
      },
      knowsAbout: [
        "Cover art",
        "Music pack cover design",
        "Sample pack cover art",
        "3D packaging renders",
        "Graphic design",
        "Product cover design",
        "Trailer editing",
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
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${archivoDisplay.variable} ${plexMono.variable} h-full bg-ink`}
    >
      <head>
        {/* Google Tag Manager — Google's own container snippet, as a plain tag in <head>
            so it is in the server HTML where Tag Assistant looks for it. The
            `gtm.start` / `gtm.js` push is what fires the container's All Pages and
            Initialization triggers; without it, page-view tags never run. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-ink text-paper antialiased">
        {/* Google Tag Manager (noscript), straight after <body> as Google specifies. */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
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
