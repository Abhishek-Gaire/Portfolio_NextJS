"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Share2, X } from "lucide-react";
import { Github } from "@/components/icons";
import { BentoCard } from "@/components/primitives/BentoCard";
import { Button } from "@/components/primitives/Button";
import { MonoTag } from "@/components/primitives/MonoTag";
import { Reveal } from "@/components/primitives/Reveal";
import { WindowChrome } from "@/components/primitives/WindowChrome";
import { cn } from "@/lib/utils";
import type { Project } from "../../types/project";

type ProjectsGridProps = {
  projects: Project[];
  view: "grid" | "list";
};

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600";

const DIALOG_TITLE_ID = "project-dialog-title";

const DIALOG_LABEL_CLASS = "mb-2 font-mono text-micro uppercase tracking-[0.14em] text-low";

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

  const isList = view === "list";
  const dialogYear = selectedProject?.completionDate
    ? new Date(selectedProject.completionDate).getFullYear()
    : null;

  return (
    <>
      <div
        className={cn(
          "grid gap-4",
          isList ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
        )}
      >
        {projects.map((project, index) => {
          const year = project.completionDate
            ? new Date(project.completionDate).getFullYear()
            : null;
          const technologies = Array.isArray(project.technologies)
            ? project.technologies
            : [];

          return (
            <Reveal key={project.id} delay={index * 60} className="h-full">
              <BentoCard interactive className="h-full">
                <div
                  className={cn(
                    "flex h-full flex-col",
                    isList && "sm:flex-row",
                  )}
                >
                  <div
                    className={cn(
                      "shrink-0 border-b border-line bg-surface-2 p-5",
                      isList && "sm:w-[38%] sm:border-b-0 sm:border-r",
                    )}
                  >
                    <WindowChrome
                      title={project.title}
                      className="h-auto w-full overflow-hidden rounded-tile border border-line bg-code-bg"
                    >
                      <div className="h-34">
                        <Image
                          src={project.image_url?.trim() || FALLBACK_IMAGE}
                          alt={project.title}
                          width={640}
                          height={360}
                          sizes={
                            isList
                              ? "33vw"
                              : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          }
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </WindowChrome>
                  </div>

                  <div
                    className={cn(
                      "flex flex-1 flex-col p-5.5",
                      isList && "sm:p-7",
                    )}
                  >
                    {year ? <MonoTag className="mb-2.5 w-fit">{year}</MonoTag> : null}

                    <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-hi transition-colors duration-200 group-hover/interactive:text-accent">
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="text-left"
                      >
                        {project.title}
                      </button>
                    </h3>

                    <p
                      className={cn(
                        "mt-2.5 mb-4 text-[14px] leading-[1.6] text-mid",
                        !isList && "line-clamp-3",
                      )}
                    >
                      {project.description}
                    </p>

                    {technologies.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {technologies.map((tech, techIndex) => (
                          <MonoTag key={`${project.id}-${tech}-${techIndex}`}>
                            {tech}
                          </MonoTag>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto flex flex-wrap items-center gap-4">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Live demo for ${project.title}`}
                          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-hi transition-colors duration-200 hover:text-accent"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>Live demo</span>
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Source code for ${project.title}`}
                          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-hi transition-colors duration-200 hover:text-accent"
                        >
                          <Github className="h-3.5 w-3.5" />
                          <span>Source</span>
                        </a>
                      )}
                      <button
                        type="button"
                        aria-label="View project details"
                        onClick={() => setSelectedProject(project)}
                        className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-control border border-line text-low transition-colors duration-200 hover:border-line-hi hover:text-hi"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </BentoCard>
            </Reveal>
          );
        })}
      </div>

      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={DIALOG_TITLE_ID}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-card border border-line bg-code-bg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-6 sm:p-7">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  {dialogYear ? (
                    <MonoTag className="mb-2.5">{dialogYear}</MonoTag>
                  ) : null}
                  <h2
                    id={DIALOG_TITLE_ID}
                    className="text-title font-bold text-hi"
                  >
                    {selectedProject.title}
                  </h2>
                </div>
                <button
                  type="button"
                  aria-label="Close project details"
                  onClick={() => setSelectedProject(null)}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-control border border-line text-low transition-colors duration-200 hover:border-line-hi hover:text-hi"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {selectedProject.image_url?.trim() && (
                <div className="mb-6 overflow-hidden rounded-tile border border-line">
                  <Image
                    src={selectedProject.image_url.trim()}
                    alt={selectedProject.title}
                    width={1200}
                    height={600}
                    sizes="100vw"
                    unoptimized
                    className="h-64 w-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className={DIALOG_LABEL_CLASS}>Description</h3>
                  <p className="text-[14px] leading-[1.65] text-mid">
                    {selectedProject.description}
                  </p>
                </div>
                <div>
                  <h3 className={DIALOG_LABEL_CLASS}>Role</h3>
                  <p className="text-[14px] leading-[1.65] text-mid">
                    {selectedProject.role}
                  </p>
                </div>
                {selectedProject.challenges && (
                  <div>
                    <h3 className={DIALOG_LABEL_CLASS}>Challenges</h3>
                    <p className="text-[14px] leading-[1.65] text-mid">
                      {selectedProject.challenges}
                    </p>
                  </div>
                )}
                {selectedProject.solutions && (
                  <div>
                    <h3 className={DIALOG_LABEL_CLASS}>Solutions</h3>
                    <p className="text-[14px] leading-[1.65] text-mid">
                      {selectedProject.solutions}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
                  {selectedProject.live_url && (
                    <Button
                      as="a"
                      href={selectedProject.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="primary"
                    >
                      Live site
                    </Button>
                  )}
                  {selectedProject.github_url && (
                    <Button
                      as="a"
                      href={selectedProject.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View code
                    </Button>
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
