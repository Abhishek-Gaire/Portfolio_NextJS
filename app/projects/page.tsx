import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import ProjectsPageClient from "../../components/projects/ProjectsPageClient";
import { getSupabaseServerClient } from "../../lib/supabase/server";
import type { Project } from "../../types/project";

export const metadata: Metadata = {
  title: "Projects | Abhishek Gaire",
  description:
    "Browse projects in web development and software engineering, including full-stack, backend, and collaboration work.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects | Abhishek Gaire",
    description:
      "Browse projects in web development and software engineering, including full-stack, backend, and collaboration work.",
    url: "/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Abhishek Gaire",
    description:
      "Browse projects in web development and software engineering, including full-stack, backend, and collaboration work.",
  },
};

export const revalidate = 300;



async function fetchProjects() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("Projects")
    .select("*")
    .order("completionDate", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Project[];
}



export default async function ProjectsPage() {
  const projects = await fetchProjects();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "https://example.com";
  const nonce = (await headers()).get("x-nonce") ?? "";
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${siteUrl}/projects`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-black pt-20">
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="container mx-auto px-6 py-16">
        <nav className="flex items-center mb-12 text-gray-400 text-sm">
          <Link
            href="/"
            className="hover:text-white transition-colors hover:translate-x-1 duration-300"
          >
            Home
          </Link>
          <span className="mx-3 text-gray-600">/</span>
          <span className="text-white">Projects</span>
        </nav>

        <ProjectsPageClient projects={projects} />
      </section>
    </main>
  );
}
