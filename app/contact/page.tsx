import type { Metadata } from "next";
import HomeContact from "../../components/home/HomeContact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch to discuss web development, collaboration opportunities, and project inquiries.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact",
    description:
      "Get in touch to discuss web development, collaboration opportunities, and project inquiries.",
    url: "/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact",
    description:
      "Get in touch to discuss web development, collaboration opportunities, and project inquiries.",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black">
      <HomeContact />
    </main>
  );
}
