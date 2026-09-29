import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import ProjectDetail from "@/components/projects/ProjectDetail";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Project } from "@/types/project";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

async function fetchProject(slug: string): Promise<Project | null> {
  if (!slug) {
    return null;
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("Projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as Project | null) ?? null;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchProject(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  const description = project.description.slice(0, 200);

  return {
    title: `${project.title} — Abhishek Gaire`,
    description,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} — Abhishek Gaire`,
      description,
      url: `/projects/${project.slug}`,
      type: "article",
      images: project.image_url?.trim()
        ? [
            {
              url: project.image_url.trim(),
              width: 1200,
              height: 630,
              alt: project.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Abhishek Gaire`,
      description,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await fetchProject(slug);

  if (!project) {
    notFound();
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "https://www.abhishekgaire.com.np";
  const nonce = (await headers()).get("x-nonce") ?? "";

  /*
   * BreadcrumbList plus a CreativeWork for the project itself. The breadcrumb
   * is the same shape the /projects index emits, so a crawler walking from the
   * index into a project sees one consistent trail.
   *
   * `main` is here rather than inside ProjectDetail, matching every other route
   * in the app. The pair reads once per request: generateMetadata and the page
   * both call fetchProject, which is a single indexed lookup on the slug.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
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
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: `${siteUrl}/projects/${project.slug}`,
          },
        ],
      },
      {
        "@type": "CreativeWork",
        name: project.title,
        description: project.description,
        url: `${siteUrl}/projects/${project.slug}`,
        dateCreated: project.completionDate || undefined,
        creator: {
          "@type": "Person",
          name: "Abhishek Gaire",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetail project={project} />
    </main>
  );
}
