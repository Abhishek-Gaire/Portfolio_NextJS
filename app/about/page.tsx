import type { Metadata } from "next";
import AboutClient from "../../components/about/AboutClient";

export const metadata: Metadata = {
  title: "About Me - Abhishek Gaire",
  description:
    "Learn about Abhishek Gaire's journey as a Full-Stack Developer, his values, skills, and passion for creating exceptional web applications.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Abhishek Gaire - Full-Stack Developer",
    description:
      "Discover the story behind the code. Learn about my journey, values, and passion for web development.",
    url: "/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Abhishek Gaire - Full-Stack Developer",
    description:
      "Discover the story behind the code. Learn about my journey, values, and passion for web development.",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
