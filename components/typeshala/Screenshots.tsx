import Image from "next/image";

import { BentoCard } from "@/components/primitives/BentoCard";
import { SectionHead } from "@/components/primitives/SectionHead";

import { TYPESHALA_SCREENSHOTS } from "@/lib/typeshala-content";

/**
 * The app itself, in pixels. A tutorial page with no picture of the software
 * reads like vapour to both visitors and the image search crawlers, and the
 * doc this whole change answers to asked for screenshots explicitly.
 *
 * No <Reveal> on purpose, same argument as in Faq.tsx: Reveal ships
 * `opacity-0` in the server HTML, and a screenshot that needs JavaScript to
 * become visible fails the "visible with JS disabled" rule it exists to
 * satisfy.
 */
export function TypeshalaScreenshots() {
  if (!TYPESHALA_SCREENSHOTS.length) return null;

  const [first, ...rest] = TYPESHALA_SCREENSHOTS;

  return (
    <section className="pb-16">
      <div className="mx-auto max-w-shell px-6">
        <SectionHead
          eyebrow="IN THE APP"
          title="What it looks like"
          lede="One look at the software before you download it."
        />

        <BentoCard className="overflow-hidden p-2">
          <Image
            src={first.src}
            alt={first.alt}
            width={first.width}
            height={first.height}
            sizes="(min-width: 1180px) 1180px, 100vw"
            unoptimized
            loading="eager"
            className="h-auto w-full rounded-tile bg-code-bg"
          />
        </BentoCard>
        <p className="mt-3.5 text-[13px] leading-[1.6] text-low">
          {first.caption}
        </p>

        {rest.map((shot) => (
          <figure key={shot.src} className="mt-6">
            <BentoCard className="overflow-hidden p-2">
              <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                sizes="(min-width: 1180px) 1180px, 100vw"
                unoptimized
                loading="lazy"
                className="h-auto w-full rounded-tile bg-code-bg"
              />
            </BentoCard>
            <figcaption className="mt-3.5 text-[13px] leading-[1.6] text-low">
              {shot.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
