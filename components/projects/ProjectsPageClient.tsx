"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Download,
  ExternalLink,
  Grid,
  LayoutGrid,
  List,
  Search,
} from "lucide-react";

import { Github } from "@/components/icons";
import { TiltCard } from "@/components/motion/TiltCard";
import { BentoCard } from "@/components/primitives/BentoCard";
import { MonoTag } from "@/components/primitives/MonoTag";
import { Reveal } from "@/components/primitives/Reveal";
import { getProjectDownloadUrl } from "@/lib/project-links";
import { cn } from "@/lib/utils";
import type { Project, ProjectCategory } from "../../types/project";

/*
 * Ported from the reference project:
 * ../remix-of-pixel-perfect/src/routes/projects/index.tsx
 *
 * Three places the port does not follow the reference literally, each because
 * the reference's version depends on something this site does not have:
 *
 * 1. The reference's cards link the image and the title to /projects/$slug.
 *    That route now exists here — see app/projects/[slug]/page.tsx — so this
 *    port follows the reference rather than diverging from it. The image and
 *    title are real links, which is why they cannot be nested: the Download
 *    link beside them goes somewhere else entirely, and a link inside a link
 *    is invalid and breaks keyboard and screen-reader navigation.
 *
 * 2. The reference's filter dropdown is decorative. `filter` is written to
 *    state and never read — the `visible` memo filters on `query` only, so
 *    picking a category changes the label and nothing else. Porting that would
 *    be a regression against the working <select> this replaces, so the control
 *    is a native select and it actually filters. The reference's own category
 *    names ("Full-stack", "Frontend", "Automation") are that project's data;
 *    this site's are ProjectCategory, so the reference's values are not used.
 *    The native select is also what globals.css sets `color-scheme: dark` for —
 *    its popup is styled, whereas a custom listbox would have to be rebuilt.
 *
 * 3. The reference's Share button is gone rather than adapted. It copied a
 *    per-project URL, and now that a per-project URL exists, the browser's own
 *    share sheet does the job better — and the icon would have been a third
 *    affordance doing what the title link already does.
 *
 * The reference's CardContainer/CardBody/CardItem 3D tilt is already ported to
 * this repo as TiltCard, unused until now. The reference layers four different
 * translateZ depths inside one card; TiltCard takes a single depth for the
 * whole child, so the tilt is faithful and the layered depth is not.
 *
 * Search still matches description and technologies as well as title. That is
 * the behaviour this replaced, and it is a superset of the reference's
 * title-only match.
 */

const categories: ProjectCategory[] = [
  "All",
  "Full Stack",
  "Backend",
  "Frontend",
  "Collaboration",
];

/*
 * images.unsplash.com, not the images.pexels.com this used to point at.
 * next.config.ts only whitelists **.supabase.co and images.unsplash.com, so a
 * project row with a null or blank image_url hit the fallback and threw at
 * runtime instead of degrading. No current row does, but the branch is one bad
 * row away from taking /projects down.
 */
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80";

type ProjectsPageClientProps = {
  projects: Project[];
};

export default function ProjectsPageClient({
  projects,
}: ProjectsPageClientProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ProjectCategory>("All");

  const normalizedSearch = searchQuery.toLowerCase().trim();
  const filteredProjects = projects.filter((project) => {
    const technologies = Array.isArray(project.technologies)
      ? project.technologies
      : [];

    const matchesSearch =
      !normalizedSearch ||
      project.title.toLowerCase().includes(normalizedSearch) ||
      project.description.toLowerCase().includes(normalizedSearch) ||
      technologies.some((tech) =>
        tech.toLowerCase().includes(normalizedSearch),
      );

    const matchesCategory =
      selectedCategory === "All" || project.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Reveal>
        <header className="mx-auto mt-12 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-mid">
            <LayoutGrid className="h-3.5 w-3.5 text-accent" />
            Portfolio Collection
          </span>
          <h1 className="mt-5 text-title font-bold tracking-[-0.02em] text-hi">
            My Projects
          </h1>
          <p className="mx-auto mt-4 max-w-measure text-[15px] leading-relaxed text-mid">
            A comprehensive showcase of my development journey, featuring
            full-stack applications, collaborative projects, and innovative
            solutions built with modern technologies
          </p>
        </header>
      </Reveal>

      {/*
        View, search and category live in plain useState and are intentionally
        NOT persisted to the URL or localStorage, unlike /blogs. Keep it that
        way: no searchParams, no router.replace, no useSyncExternalStore.
      */}
      <Reveal delay={60}>
        <div className="mt-12 flex w-full flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-low"
            />
            <input
              type="search"
              name="search"
              aria-label="Search projects"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-10 w-full rounded-control border border-line bg-surface pr-3 pl-10 text-sm text-hi transition-colors duration-200 placeholder:text-low hover:border-line-hi focus:border-accent-line"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              name="category"
              aria-label="Filter projects by category"
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(event.target.value as ProjectCategory)
              }
              className="h-10 rounded-control border border-line bg-surface px-4 text-sm text-hi transition-colors duration-200 hover:border-line-hi"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <div role="group" aria-label="View mode" className="flex gap-2">
              {(
                [
                  ["grid", Grid, "Grid view"],
                  ["list", List, "List view"],
                ] as const
              ).map(([view, Icon, label]) => (
                <button
                  key={view}
                  type="button"
                  aria-label={label}
                  aria-pressed={viewMode === view}
                  onClick={() => setViewMode(view)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-control border transition-colors duration-200",
                    viewMode === view
                      ? "border-accent bg-accent text-[#08110f]"
                      : "border-line bg-surface text-low hover:text-hi",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {filteredProjects.length === 0 ? (
        <p className="mt-16 text-center text-sm text-mid">
          No projects match &ldquo;{searchQuery.trim()}&rdquo;
          {selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}.
        </p>
      ) : (
        <div
          className={cn(
            "mt-4 grid gap-6",
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1",
          )}
        >
          {filteredProjects.map((project, index) => {
            const downloadUrl = getProjectDownloadUrl(project.title);
            const isList = viewMode === "list";

            return (
              <Reveal key={project.id} delay={index * 60} className="h-full">
                <TiltCard
                  depth={100}
                  wrapperClassName="h-full w-full"
                  className="h-full w-full"
                >
                  <BentoCard interactive className="h-full w-full">
                    <div
                      className={cn(
                        "flex h-full gap-5 p-5",
                        isList ? "flex-col sm:flex-row" : "flex-col",
                      )}
                    >
                      <Link
                        href={`/projects/${project.slug}`}
                        aria-label={`View case study for ${project.title}`}
                        className={cn(
                          "block shrink-0 overflow-hidden rounded-tile",
                          isList ? "sm:w-[38%]" : "w-full",
                        )}
                      >
                        <Image
                          src={project.image_url?.trim() || FALLBACK_IMAGE}
                          alt={project.title}
                          width={1024}
                          height={640}
                          sizes={
                            isList
                              ? "(min-width: 640px) 38vw, 100vw"
                              : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          }
                          unoptimized
                          className={cn(
                            "w-full rounded-tile object-cover",
                            isList ? "h-40 sm:h-full sm:min-h-45" : "h-48",
                          )}
                        />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="mb-5 flex items-center justify-between gap-3">
                          <h2 className="text-xl font-bold text-hi">
                            <Link
                              href={`/projects/${project.slug}`}
                              className="text-left transition-colors duration-200 hover:text-accent"
                            >
                              {project.title}
                            </Link>
                          </h2>
                          {project.completionDate ? (
                            <MonoTag className="shrink-0">
                              {new Date(project.completionDate).getFullYear()}
                            </MonoTag>
                          ) : null}
                        </div>

                        <p className="mt-2 line-clamp-3 max-w-sm text-sm text-mid">
                          {project.description}
                        </p>

                        {Array.isArray(project.technologies) &&
                        project.technologies.length > 0 ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {project.technologies.map((tech, techIndex) => (
                              <MonoTag
                                key={`${project.id}-${tech}-${techIndex}`}
                                accent
                              >
                                {tech}
                              </MonoTag>
                            ))}
                          </div>
                        ) : null}

                        <div className="mt-6 flex items-center justify-between gap-3">
                          {downloadUrl ? (
                            <a
                              href={downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-control border border-accent bg-accent px-4 py-2 font-mono text-xs font-semibold text-[#08110f] transition-colors duration-200 hover:bg-[#5eead4]"
                            >
                              <Download size={14} /> Download
                            </a>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {project.live_url ? (
                                <a
                                  href={project.live_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-control border border-accent-line px-4 py-2 font-mono text-xs font-semibold text-accent transition-colors duration-200 hover:bg-accent-soft"
                                >
                                  <ExternalLink size={14} /> Live
                                </a>
                              ) : null}
                              {project.github_url ? (
                                <a
                                  href={project.github_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-control border border-line px-4 py-2 font-mono text-xs font-semibold text-hi transition-colors duration-200 hover:border-line-hi"
                                >
                                  <Github size={14} /> Code
                                </a>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </BentoCard>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      )}
    </>
  );
}
