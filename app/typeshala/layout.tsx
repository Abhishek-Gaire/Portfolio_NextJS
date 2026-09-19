import type { Metadata } from "next";
import { headers } from "next/headers";
import { TYPESHala_SITE_URL } from "@/lib/site-urls";

export const metadata: Metadata = {
  metadataBase: new URL(TYPESHala_SITE_URL),
  title: 'Typeshala - Download Bilingual Typing Tutor',
  description: 'Download Typeshala - A bilingual (English/Nepali) typing tutor with structured lessons, progress tracking, and cross-platform support for macOS, Windows, Linux, and Android.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Typeshala - Bilingual Typing Tutor',
    description: 'Download Typeshala for macOS, Windows, Linux, and Android. Practice English and Nepali typing with structured lessons.',
    url: '/',
    type: 'website',
    siteName: 'Abhishek Gaire',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Typeshala - Bilingual Typing Tutor',
    description: 'Download Typeshala for macOS, Windows, Linux, and Android.',
  },
};

export default async function TypeshalaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? "";

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Typeshala",
            applicationCategory: "EducationalApplication",
            operatingSystem: "macOS, Windows, Linux, Android",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            description: "A bilingual (English / Nepali) typing tutor desktop app with structured lessons, progress stats, themes, and a bonus Ramayana game.",
          }),
        }}
      />
      {children}
    </>
  );
}