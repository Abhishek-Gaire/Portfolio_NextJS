import type { Metadata } from "next";
import { headers } from "next/headers";
import { Breadcrumb } from "@/components/primitives/Breadcrumb";
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
    // nullsLast is load-bearing, not tidiness. Postgres defaults a DESC sort to
    // NULLS FIRST, so an undated row lands at the very top of /projects. The
    // LMS row is inserted with a null completionDate until its real date is
    // known -- see supabase/migrations/20260929000005_seed_lms_microservices.sql
    // -- and without this it would open the page above his two client projects.
    .order("completionDate", { ascending: false, nullsFirst: false });

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
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Projects" }]}
          />

          <ProjectsPageClient projects={projects} />
        </div>
      </section>
    </main>
  );
}
