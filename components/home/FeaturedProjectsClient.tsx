"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BentoCard } from "@/components/primitives/BentoCard";
import { CardBody, CardItem } from "@/components/motion/CardItem";
import { TiltCard } from "@/components/motion/TiltCard";
import { Button } from "@/components/primitives/Button";
import { MonoTag } from "@/components/primitives/MonoTag";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionHead } from "@/components/primitives/SectionHead";
import { WindowChrome } from "@/components/primitives/WindowChrome";
import type { Project } from "../../types/project";

type FeaturedProjectsClientProps = {
  projects: Project[];
};

/*
 * Was `images.pexels.com`, which is NOT in next.config.ts remotePatterns —
 * only **.supabase.co and images.unsplash.com are. Any project row with a
 * null or blank image_url therefore hit the fallback and threw at runtime
 * rather than degrading. No row has done so far, which is exactly why it went
 * unnoticed: the branch is only reachable from data the admin UI cannot
 * currently produce, but it is one bad row away from taking the page down.
 * images.unsplash.com is whitelisted, so the fallback is safe by construction.
 */
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80";

/*
 * One project per row, image and text alternating sides.
 *
 * The previous layout was a two-column grid with the first card spanning both
 * columns. At two projects that put two cards side by side, each image about
 * 400px wide, and the crop then cut the identifying part out of both — the
 * Typeshala capture lost its toolbar, the calendar lost the "Baisakh / BS 2083"
 * header. A full-width row gives the media half the row instead of a third of
 * it, so the image reads as a picture of the project rather than a texture.
 *
 * `object-position` is top-anchored on the media for the same reason. The two
 * seeded screenshots are both wider than the box they are cropped into, and
 * both carry their most identifying detail along the top edge. Bottom-anchored
 * would keep the least useful part.
 *
 * There is no "hero card" branch any more. Every card is full width, so the
 * old `index === 0 && length >= 3` split has nothing left to distinguish, and
 * dropping it means raising FEATURED_LIMIT to 3 or 4 needs no change here.
 *
 * Alternation is by odd/even index, so it holds for any number of projects:
 * 0 image-left, 1 image-right, 2 image-left. Below lg the grid is one column
 * and the order is moot — the image stacks above the text either way, which is
 * the right reading order on a phone regardless of which side it came from.
 */
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

        <div className="flex flex-col gap-5">
          {projects.map((project, index) => {
            const year = project.completionDate
              ? new Date(project.completionDate).getFullYear()
              : null;
            const technologies = Array.isArray(project.technologies)
              ? project.technologies
              : [];
            const isReversed = index % 2 === 1;

            const media = (
              <CardItem translateZ={100} className="flex">
                <div
                  className={cn(
                    "flex w-full items-center justify-center bg-surface-2 p-5 sm:p-6",
                    isReversed
                      ? "border-t border-line lg:border-t-0 lg:border-l"
                      : "border-t border-line lg:border-t-0 lg:border-r",
                  )}
                >
                  <WindowChrome
                    title={project.title}
                    className="h-auto w-full max-w-125 overflow-hidden rounded-tile border border-line bg-code-bg"
                  >
                    <div className="aspect-16/10">
                      <Image
                        src={project.image_url?.trim() || FALLBACK_IMAGE}
                        alt={project.title}
                        width={1024}
                        height={640}
                        sizes="(min-width: 1024px) 590px, 100vw"
                        unoptimized
                        loading={index === 0 ? "eager" : "lazy"}
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  </WindowChrome>
                </div>
              </CardItem>
            );

            const body = (
              <div className="flex flex-col p-6 sm:p-7">
                <CardItem translateZ={50} className="mb-2.5 w-fit">
                  {year ? <MonoTag>{year}</MonoTag> : null}
                </CardItem>

                <CardItem
                  as="h3"
                  translateZ={50}
                  className="text-[19px] font-semibold tracking-[-0.01em] text-hi"
                >
                  {project.title}
                </CardItem>

                <CardItem
                  as="p"
                  translateZ={30}
                  className="mt-3 mb-5 text-[14px] leading-[1.6] text-mid"
                >
                  {project.description}
                </CardItem>

                {technologies.length > 0 && (
                  <CardItem translateZ={20} className="mb-5 flex flex-wrap gap-1.5">
                    {technologies.slice(0, 3).map((tech, techIndex) => (
                      <MonoTag key={`${project.id}-${tech}-${techIndex}`}>
                        {tech}
                      </MonoTag>
                    ))}
                    {technologies.length > 3 && (
                      <MonoTag>+{technologies.length - 3} more</MonoTag>
                    )}
                  </CardItem>
                )}

                <CardItem translateZ={20} className="mt-auto flex flex-wrap items-center gap-2.5">
                  {/*
                    One CTA, and it is a link to the case study. The card used
                    to carry its own Live/Source pair and a name-keyed Download
                    override, which meant the home page duplicated the whole
                    link set of the project page — and the two already disagreed
                    once, about the Download button.

                    A teaser card should tease. Every destination now lives on
                    /projects/<slug>, and that route is server-rendered, so the
                    copy behind those links is finally visible to a crawler.
                    The Download override is down to one call site, the detail
                    page, instead of two that could drift.
                  */}
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-hi transition-colors duration-200 hover:text-accent"
                  >
                    <span>View project</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardItem>
              </div>
            );

            return (
              <Reveal key={project.id} delay={index * 80}>
                <TiltCard wrapperClassName="h-full w-full" className="h-full w-full">
                  <CardBody className="h-full w-full">
                    <BentoCard interactive clip={false} className="h-full w-full">
                      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
                        {isReversed ? (
                          <>
                            {body}
                            {media}
                          </>
                        ) : (
                          <>
                            {media}
                            {body}
                          </>
                        )}
                      </div>
                    </BentoCard>
                  </CardBody>
                </TiltCard>
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
