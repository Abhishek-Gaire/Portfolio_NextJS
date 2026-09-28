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
    "https://www.abhishekgaire.com.np";
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
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="py-16">
        <div className="mx-auto max-w-shell px-6">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2.5 font-mono text-micro text-low"
          >
            <Link
              href="/"
              className="transition-colors duration-200 hover:text-accent"
            >
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-mid">
              Projects
            </span>
          </nav>

          <ProjectsPageClient projects={projects} />
        </div>
      </section>
    </main>
  );
}
