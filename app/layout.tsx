import type { Metadata } from "next";
import { headers } from "next/headers";
import localFont from "next/font/local";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import AppShell from "../components/AppShell";

const mulish = localFont({
  src: [
    {
      path: "../public/fonts/Mulish-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Mulish-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-mulish",
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
  ],
  variable: "--font-ibm-mono",
  display: "swap",
});

const fraunces = localFont({
  src: [
    {
      path: "../public/fonts/Fraunces-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Fraunces-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Fraunces-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Fraunces-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-fraunces",
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
  const websiteJsonLd = {
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
      className={`${mulish.variable} ${ibmPlexMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <script
          type="application/ld+json"
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
