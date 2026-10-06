import type { Metadata } from "next";
import { headers } from "next/headers";
import localFont from "next/font/local";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import AppShell from "../components/AppShell";
import { TYPESHala_SITE_URL, isTypeshalaHost } from "../lib/site-urls";
import {
  TYPESHALA_DESCRIPTION,
  TYPESHALA_DEVANAGARI,
  TYPESHALA_NAME,
} from "../lib/typeshala-content";

const spaceGrotesk = localFont({
  src: [
    {
      path: "../public/fonts/SpaceGrotesk-Variable.woff2",
      weight: "300 700",
      style: "normal",
    },
  ],
  variable: "--font-space-grotesk",
  display: "swap",
});

const ibmPlexMono = localFont({
  src: [
    {
      path: "../public/fonts/IBMPlexMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/IBMPlexMono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/IBMPlexMono-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-ibm-mono",
  display: "swap",
});

const siteUrl = "https://www.abhishekgaire.com.np";
const siteName = "Abhishek Gaire Portfolio";
const defaultTitle = "Abhishek Gaire | Full Stack Developer";
const defaultDescription =
  "Portfolio of Abhishek Gaire — projects, blogs, and contact information focused on full-stack web development.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteName} social preview image`,
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? "";
  const host = (await headers()).get("host") ?? "";
  const onTypeshala = isTypeshalaHost(host);
  /*
   * One app, two sites. The portfolio's WebSite block used to render on the
   * Typeshala route too, telling crawlers that the product page belonged to an
   * entity called "Abhishek Gaire Portfolio" at www.abhishekgaire.com.np with a
   * blog search box — three wrong facts in one script tag. The Typeshala side
   * gets its own WebSite entry instead. It carries no SearchAction on purpose:
   * the product page has no search to describe, and an action that points at
   * the portfolio's blog search would be the same category of lie.
   */
  const websiteJsonLd = onTypeshala
    ? {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: TYPESHALA_NAME,
        alternateName: TYPESHALA_DEVANAGARI,
        url: TYPESHala_SITE_URL,
        description: TYPESHALA_DESCRIPTION,
        inLanguage: ["en", "ne"],
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteName,
        url: siteUrl,
        description: defaultDescription,
        inLanguage: "en",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/blogs?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      };

  return (
    <html
      lang="en"
      nonce={nonce}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-hi">
        <script
          type="application/ld+json"
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/*
          No-JS fallback for <Reveal>. Its hidden state is `opacity: 0` until an
          IntersectionObserver fires, so without JavaScript every wrapped
          section stays invisible. This un-hides exactly that class and nothing
          else. `!important` is load-bearing: Tailwind v4 emits utilities into
          a cascade layer, and this unlayered rule needs to outrank it.
        */}
        <noscript>
          <style>{`.reveal-hidden{opacity:1 !important}`}</style>
        </noscript>
        <AppShell isTypeshalaHost={onTypeshala}>{children}</AppShell>
      </body>
    </html>
  );
}
