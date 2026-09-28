"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Github } from "@/components/icons";
import { cn } from "@/lib/utils";
import { BentoCard } from "@/components/primitives/BentoCard";
import { Button } from "@/components/primitives/Button";
import { MonoTag } from "@/components/primitives/MonoTag";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionHead } from "@/components/primitives/SectionHead";
import { WindowChrome } from "@/components/primitives/WindowChrome";
import type { Project } from "../../types/project";

type FeaturedProjectsClientProps = {
  projects: Project[];
};

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600";

export default function FeaturedProjectsClient({
  projects,
}: FeaturedProjectsClientProps) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-shell px-6">
        <Reveal>
          <SectionHead
            eyebrow="FEATURED WORK"
            title="Featured projects"
            lede="A showcase of my recent work, featuring modern web applications and creative solutions."
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {projects.map((project, index) => {
            const year = project.completionDate
              ? new Date(project.completionDate).getFullYear()
              : null;
            const technologies = Array.isArray(project.technologies)
              ? project.technologies
              : [];
            const featured = index === 0;

            return (
              <Reveal
                key={project.id}
                delay={index * 80}
                className={cn("h-full", featured && "sm:col-span-2")}
              >
                <BentoCard
                  interactive
                  className={cn(
                    "h-full",
                    featured ? "rounded-hero" : "rounded-tile",
                  )}
                >
                  <div
                    className={cn(
                      "h-full",
                      featured
                        ? "grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]"
                        : "flex flex-col",
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center bg-surface-2 p-6",
                        featured
                          ? "min-h-[220px] border-b border-line lg:border-b-0 lg:border-r"
                          : "min-h-[150px] border-b border-line",
                      )}
                    >
                      <WindowChrome
                        title={project.title}
                        className="h-auto w-[82%] max-w-[420px] overflow-hidden rounded-tile border border-line bg-code-bg"
                      >
                        <div className="h-[120px]">
                          <Image
                            src={project.image_url?.trim() || FALLBACK_IMAGE}
                            alt={project.title}
                            width={640}
                            height={360}
                            unoptimized
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </WindowChrome>
                    </div>

                    <div
                      className={cn(
                        "flex flex-col",
                        featured ? "p-7" : "p-5.5",
                      )}
                    >
                      {year ? (
                        <MonoTag className="mb-2.5 w-fit">{year}</MonoTag>
                      ) : null}

                      <h3
                        className={cn(
                          "font-semibold tracking-[-0.01em] text-hi",
                          featured ? "text-[20px]" : "text-[16px]",
                        )}
                      >
                        {project.title}
                      </h3>

                      <p
                        className={cn(
                          "mt-2.5 mb-4 text-[14px] leading-[1.6] text-mid",
                          featured ? "line-clamp-3" : "line-clamp-2",
                        )}
                      >
                        {project.description}
                      </p>

                      {technologies.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-1.5">
                          {technologies.slice(0, 3).map((tech, techIndex) => (
                            <MonoTag key={`${project.id}-${tech}-${techIndex}`}>
                              {tech}
                            </MonoTag>
                          ))}
                          {technologies.length > 3 && (
                            <MonoTag>+{technologies.length - 3} more</MonoTag>
                          )}
                        </div>
                      )}

                      <div className="mt-auto flex flex-wrap items-center gap-2.5">
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Live Demo"
                            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-hi transition-colors duration-200 hover:text-accent"
                          >
                            <span>Live demo</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Source Code"
                            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-hi transition-colors duration-200 hover:text-accent"
                          >
                            <Github className="h-3.5 w-3.5" />
                            <span>Source</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </BentoCard>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={160} className="mt-8 flex justify-center">
          <Button as={Link} href="/projects" variant="primary">
            <span>Explore my complete portfolio</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
