"use client";

import { Grid, List, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Reveal } from "@/components/primitives/Reveal";
import { SectionHead } from "@/components/primitives/SectionHead";
import { cn } from "@/lib/utils";
import type { Project, ProjectCategory } from "../../types/project";
import ProjectsGrid from "./ProjectsGrid";

const categories: ProjectCategory[] = [
  "All",
  "Full Stack",
  "Backend",
  "Collaboration",
];

type ProjectsPageClientProps = {
  projects: Project[];
};

export default function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("All");

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchQuery.toLowerCase().trim();
    return projects.filter((project) => {
      const technologies = Array.isArray(project.technologies)
        ? project.technologies
        : [];

      const matchesSearch =
        !normalizedSearch ||
        project.title.toLowerCase().includes(normalizedSearch) ||
        project.description.toLowerCase().includes(normalizedSearch) ||
        technologies.some((tech) => tech.toLowerCase().includes(normalizedSearch));

      const matchesCategory =
        selectedCategory === "All" || project.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  return (
    <>
      <Reveal>
        <SectionHead
          as="h1"
          eyebrow="SELECTED WORK"
          title="My projects"
          lede="A comprehensive showcase of my development journey, featuring full-stack applications, collaborative projects, and innovative solutions built with modern technologies."
        />
      </Reveal>

      {/*
       * View, search and category live in plain useState and are intentionally
       * NOT persisted to the URL or localStorage, unlike /blogs. Keep it that
       * way: no searchParams, no router.replace, no useSyncExternalStore.
       */}
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-low"
            />
            <input
              type="text"
              name="search"
              aria-label="Search projects"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-control border border-line bg-code-bg py-2.5 pl-10 pr-4 text-[14px] text-hi transition-colors duration-200 placeholder:text-low hover:border-line-hi focus:border-accent-line sm:w-[300px]"
            />
          </div>

          <select
            name="category"
            aria-label="Filter projects by category"
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(event.target.value as ProjectCategory)
            }
            className="rounded-control border border-line bg-code-bg px-4 py-2.5 text-[14px] text-hi transition-colors duration-200 hover:border-line-hi"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div
          role="group"
          aria-label="View mode"
          className="inline-flex items-center gap-1 self-start rounded-control border border-line bg-surface p-1"
        >
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-[7px] transition-colors duration-200",
              viewMode === "grid"
                ? "bg-accent-soft text-accent"
                : "text-low hover:bg-surface-2 hover:text-hi",
            )}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            aria-label="List view"
            aria-pressed={viewMode === "list"}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-[7px] transition-colors duration-200",
              viewMode === "list"
                ? "bg-accent-soft text-accent"
                : "text-low hover:bg-surface-2 hover:text-hi",
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ProjectsGrid projects={filteredProjects} view={viewMode} />
    </>
  );
}
