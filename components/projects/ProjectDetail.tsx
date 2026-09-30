import Link from "next/link";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";

import { Github } from "@/components/icons";
import { FeaturedImage } from "@/components/motion/FeaturedImage";
import { Breadcrumb } from "@/components/primitives/Breadcrumb";
import { Button } from "@/components/primitives/Button";
import { MonoTag } from "@/components/primitives/MonoTag";
import { LmsArchitecture } from "@/components/projects/LmsArchitecture";
import { ProjectTagChips } from "@/components/projects/ProjectTagChips";
import { getProjectDownloadUrl } from "@/lib/project-links";
import type { Project } from "../../types/project";

/**
 * The body of a project case study, rendered server-side on
 * /projects/<slug>.
 *
 * This was ProjectDialog's contents. The dialog only mounted on click, from
 * client state, which meant none of this copy was in the server-rendered HTML:
 * `Challenges` and `Solutions` appeared zero times in the /projects payload,
 * so the writing was invisible to crawlers and to anything that reads the
 * markup rather than clicking. As a route it is in the payload for free, and
 * the browser supplies focus handling, the Escape key and the scroll lock that
 * the dialog had to do by hand.
 *
 * A server component on purpose. It has no state and no handlers, so it costs
 * no client JavaScript at all.
 */
export default function ProjectDetail({ project }: { project: Project }) {
  const year = project.completionDate
    ? new Date(project.completionDate).getFullYear()
    : null;
  const downloadUrl = getProjectDownloadUrl(project.title);
  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];

  const LABEL_CLASS =
    "mb-2 font-mono text-micro uppercase tracking-[0.14em] text-low";

  return (
    <article className="mx-auto max-w-shell px-6 py-16">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: project.title },
        ]}
      />

      {/*
        The back link stays alongside the breadcrumb rather than replacing it.
        The breadcrumb is what tells a screen reader where this page sits in the
        hierarchy; the back link is the control someone actually reaches for.
        Two links to /projects on one page is deliberate, not an oversight.
      */}
      <Link
        href="/projects"
        className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-mid transition-colors duration-200 hover:text-hi"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All projects
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_18rem] lg:gap-14">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            {year ? <MonoTag>{year}</MonoTag> : null}
            <MonoTag>{project.category}</MonoTag>
          </div>

          <h1 className="mt-5 text-title font-bold tracking-[-0.02em] text-balance text-hi">
            {project.title}
          </h1>

          {/*
            Provenance and, for coursework, where it sat. Placed directly under
            the title rather than down in the metadata sidebar: this is the claim
            the page is making about itself, and it belongs where a reader meets
            the project name first. `context` carries "6th semester - Minor
            Project 2" and deliberately does not name the university.
          */}
          {(Array.isArray(project.tags) && project.tags.length > 0) ||
          project.context ? (
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              <ProjectTagChips tags={project.tags} />
              {project.context ? (
                <span className="font-mono text-[11px] text-low">
                  {project.context}
                </span>
              ) : null}
            </div>
          ) : null}

          {/*
            The visual slot under the title, and every case study has one.

            A real image when there is one. This project has no image_url, so it
            gets the architecture diagram instead -- and it goes HERE, in the
            same position and the same frame as the cover on every other project,
            rather than after the Solutions section where it was first put.

            That earlier placement made the LMS page structurally different from
            every other one: title, then straight into Overview, with the most
            substantial thing about the project filed at the bottom. The argument
            for it -- that a hero is where the reader decides whether to keep
            reading -- cuts the other way. It is the best argument for putting a
            diagram at the top, not the bottom.

            The image branch is tested FIRST on purpose. If a screenshot is ever
            added for this project it takes the hero automatically and the
            diagram stops rendering here, with no edit to make.
          */}
          {project.image_url?.trim() ? (
            <FeaturedImage
              src={project.image_url.trim()}
              alt={project.title}
              slug={project.slug}
              width={1600}
              height={900}
              sizes="(min-width: 1024px) 800px, 100vw"
              priority
              className="mt-8 overflow-hidden rounded-card border border-line"
              imageClassName="h-auto w-full object-cover object-top"
            />
          ) : project.slug === "lms-microservices" ? (
            <figure className="mt-8">
              <LmsArchitecture className="rounded-card border border-line bg-surface p-4 sm:p-6" />
              <figcaption className="mt-3 font-mono text-micro text-low">
                Seven services behind one NestJS gateway. RabbitMQ carries
                asynchronous work, gRPC carries typed request-response, and
                Redis holds shared state.
              </figcaption>
            </figure>
          ) : null}

          <div className="mt-9 space-y-7">
            <section>
              <h2 className={LABEL_CLASS}>Overview</h2>
              <p className="text-[15px] leading-[1.7] text-mid">
                {project.description}
              </p>
            </section>

            <section>
              <h2 className={LABEL_CLASS}>Role</h2>
              <p className="text-[15px] leading-[1.7] text-mid">
                {project.role}
              </p>
            </section>

            {project.challenges ? (
              <section>
                <h2 className={LABEL_CLASS}>Challenges</h2>
                <p className="text-[15px] leading-[1.7] text-mid">
                  {project.challenges}
                </p>
              </section>
            ) : null}

            {project.solutions ? (
              <section>
                <h2 className={LABEL_CLASS}>Solutions</h2>
                <p className="text-[15px] leading-[1.7] text-mid">
                  {project.solutions}
                </p>
              </section>
            ) : null}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-2.5 border-t border-line pt-8">
            {/*
              Download leads when the project has one, and it leaves the
              portfolio for the project's own home — the Typeshala subdomain,
              which serves per-platform installers. The ExternalLink icon is on
              it because that is exactly what it does; without it the button
              looks like an internal step.
            */}
            {downloadUrl ? (
              <Button
                as="a"
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
              >
                <Download className="h-4 w-4" />
                Download
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            ) : null}
            {project.live_url ? (
              <Button
                as="a"
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live site
              </Button>
            ) : null}
            {project.github_url ? (
              <Button
                as="a"
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                View code
              </Button>
            ) : null}
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-card border border-line bg-surface p-5">
            <h2 className="font-mono text-micro uppercase tracking-[0.14em] text-low">
              Stack
            </h2>
            {technologies.length > 0 ? (
              <ul className="mt-3.5 flex flex-wrap gap-1.5">
                {technologies.map((tech, index) => (
                  <li key={`${tech}-${index}`}>
                    <MonoTag>{tech}</MonoTag>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 font-mono text-xs text-low">—</p>
            )}

            <div className="mt-6 border-t border-line pt-5">
              <h2 className="font-mono text-micro uppercase tracking-[0.14em] text-low">
                Completed
              </h2>
              <p className="mt-2 font-mono text-xs text-hi">
                {project.completionDate || "—"}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
