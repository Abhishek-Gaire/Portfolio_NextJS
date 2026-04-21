"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Share2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Project } from "../../types/project";

type ProjectsGridProps = {
  projects: Project[];
  view: "grid" | "list";
};

export default function ProjectsGrid({ projects, view }: ProjectsGridProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedProject]);

  return (
    <>
      <div
        className={`grid gap-8 ${view === "grid"
          ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
          : "grid-cols-1"
          }`}
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ animationDelay: `${index * 100}ms` }}
            className={`group bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2 ${view === "list" ? "flex" : ""
              }`}
          >
            {project.image_url?.trim() && (
              <div
                className={`relative overflow-hidden ${view === "list" ? "w-1/3" : ""}`}
              >
                <Image
                  src={project.image_url.trim()}
                  alt={project.title}
                  width={640}
                  height={360}
                  sizes={
                    view === "list"
                      ? "33vw"
                      : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  }
                  unoptimized
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            )}
            <div className={`p-8 ${view === "list" ? "w-2/3" : ""}`}>
              <div className="flex justify-between items-start mb-6">
                <h3
                  onClick={() => setSelectedProject(project)}
                  className="text-xl font-bold text-white cursor-pointer hover:text-blue-400 transition-all duration-300 group-hover:text-blue-400"
                >
                  {project.title}
                </h3>
                <span className="text-sm text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full">
                  {project.completionDate
                    ? new Date(project.completionDate).getFullYear()
                    : ""}
                </span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {(Array.isArray(project.technologies)
                  ? project.technologies
                  : []
                ).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full text-xs font-medium hover:bg-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 hover:border-blue-500/40 transition-all duration-300 text-sm font-medium"
                    >
                      <ExternalLink size={16} className="mr-1" />
                      Live
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gray-700/30 text-gray-400 border border-gray-600/30 rounded-lg hover:bg-gray-700/50 hover:border-gray-600/50 hover:text-white transition-all duration-300 text-sm font-medium"
                    >
                      <Github size={16} className="mr-1" />
                      Code
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-300"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </motion.div>
        ))}
      </div>

      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-white">
                  {selectedProject.title}
                </h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-300"
                >
                  <X size={24} />
                </button>
              </div>
              {selectedProject.image_url?.trim() && (
                <Image
                  src={selectedProject.image_url.trim()}
                  alt={selectedProject.title}
                  width={1200}
                  height={600}
                  sizes="100vw"
                  unoptimized
                  className="w-full h-80 object-cover rounded-xl mb-8"
                />
              )}
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-xl mb-3 text-white">
                    Description
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-3 text-white">Role</h3>
                  <p className="text-gray-400">{selectedProject.role}</p>
                </div>
                {selectedProject.challenges && (
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-white">
                      Challenges
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {selectedProject.challenges}
                    </p>
                  </div>
                )}
                {selectedProject.solutions && (
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-white">
                      Solutions
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {selectedProject.solutions}
                    </p>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                  {selectedProject.live_url && (
                    <a
                      href={selectedProject.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 font-medium"
                    >
                      Live Url
                    </a>
                  )}
                  {selectedProject.github_url && (
                    <a
                      href={selectedProject.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 border border-gray-600/50 text-white rounded-xl hover:bg-gray-800/50 hover:border-gray-500/50 transition-all duration-300 font-medium"
                    >
                      View Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
