"use client";

import { Grid, List, Search } from "lucide-react";
import { useMemo, useState } from "react";
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
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-gray-400 text-sm font-medium mb-6">
          <Grid size={16} className="mr-2" />
          Portfolio Collection
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          My Projects
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          A comprehensive showcase of my development journey, featuring
          full-stack applications, collaborative projects, and innovative
          solutions built with modern technologies
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-500 hover:border-gray-500/50 min-w-[300px]"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(event.target.value as ProjectCategory)
            }
            className="px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-500/50"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`p-3 rounded-xl transition-all duration-300 ${viewMode === "grid"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50 border border-gray-700/50"
              }`}
            aria-label="Grid view"
          >
            <Grid size={20} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`p-3 rounded-xl transition-all duration-300 ${viewMode === "list"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50 border border-gray-700/50"
              }`}
            aria-label="List view"
          >
            <List size={20} />
          </button>
        </div>
      </div>

      <ProjectsGrid projects={filteredProjects} view={viewMode} />
    </>
  );
}
