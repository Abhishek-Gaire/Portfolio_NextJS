import type { Metadata } from "next";
import { headers } from "next/headers";
import FeaturedProjects from "../components/home/FeaturedProjects";
import Hero from "../components/home/Hero";
import HomeContact from "../components/home/HomeContact";
import LatestBlogs from "../components/home/LatestBlogs";
import Skills from "../components/home/Skills";

export const metadata: Metadata = {
  title: "Abhishek Gaire | Full Stack Developer",
  description: "Full Stack Developer from Pokhara, Nepal. Explore projects, blogs...",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Home | Abhishek Gaire",
    description:
      "Explore featured projects, latest blog posts, and contact details for Abhishek Gaire.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home | Abhishek Gaire",
    description:
      "Explore featured projects, latest blog posts, and contact details for Abhishek Gaire.",
  },
};

export const revalidate = 300;

export default async function HomePage() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "https://www.abhishekgaire.com.np";
  const nonce = (await headers()).get("x-nonce") ?? "";

  const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: "Abhishek Gaire | Full Stack Developer",
    url: siteUrl,
    mainEntity: {
      "@type": "Person",
      name: "Abhishek Gaire",
      jobTitle: "Full Stack Developer",
      url: siteUrl,
      sameAs: [
        "https://github.com/Abhishek-Gaire",
        "https://www.linkedin.com/in/abhisek-gaire-359294219/",
        "https://x.com/GaireAbhishek44",
      ],
    },
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />
      <Hero />
      <Skills />
      <FeaturedProjects />
      <LatestBlogs />
      <HomeContact />
    </main>
  );
}
