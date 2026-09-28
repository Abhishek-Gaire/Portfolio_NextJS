"use client";

import {
  BarChart3,
  BookOpen,
  Box,
  Gamepad2,
  Globe,
  HardDrive,
  Keyboard,
  Monitor,
  Palette,
  Smartphone,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { GitLabIcon, Github } from "@/components/icons";
import { BentoCard } from "@/components/primitives/BentoCard";
import { Button } from "@/components/primitives/Button";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { MonoTag } from "@/components/primitives/MonoTag";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionHead } from "@/components/primitives/SectionHead";
import { OrbitingCircles } from "@/components/motion/OrbitingCircles";
import { DownloadGrid } from "@/components/typeshala/DownloadCards";
import { useDetectedOS } from "@/components/typeshala/useDetectedOS";
import {
  ReleaseNotes,
  PreviousRelease,
} from "@/components/typeshala/ReleaseNotes";
import {
  TypeshalaTopNav,
  TypeshalaFooter,
} from "@/components/typeshala/TypeshalaChrome";
import { PLATFORM_DOWNLOADS } from "@/types/typeshala";
import type { TypeshalaPageData } from "./_lib/release";

type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const FEATURES: Feature[] = [
  {
    icon: Globe,
    title: "Bilingual Support",
    desc: "English and Nepali UI with full i18n support",
  },
  {
    icon: Keyboard,
    title: "Multiple Layouts",
    desc: "English QWERTY, Nepali Romanized, and Traditional Preeti",
  },
  {
    icon: BookOpen,
    title: "Structured Lessons",
    desc: "Progressive typing drills with accuracy and WPM tracking",
  },
  {
    icon: BarChart3,
    title: "Progress Stats",
    desc: "Detailed trends, heatmaps, and personal bests",
  },
  {
    icon: Palette,
    title: "Themes",
    desc: "Light, dark, and custom color schemes",
  },
  {
    icon: Gamepad2,
    title: "Ramayana Game",
    desc: "Bonus typing game based on the epic",
  },
  {
    icon: HardDrive,
    title: "Local-First",
    desc: "All data stored on-device via the Tauri store plugin",
  },
  {
    icon: Wrench,
    title: "Cross-Platform",
    desc: "Native apps for macOS, Windows, and Linux",
  },
  {
    icon: Smartphone,
    title: "Android Support",
    desc: "Mobile version with touch-optimized lessons",
  },
];

const TECH_STACK_OUTER = [
  "Tauri v2",
  "React 19",
  "TypeScript",
  "Vite",
  "Rust",
];

const TECH_STACK_INNER = ["Tailwind CSS", "Zustand", "Vitest"];

export default function TypeshalaPageClient({
  data,
}: {
  data: TypeshalaPageData;
}) {
  const {
    latestRelease,
    previousReleases,
    repoUrl,
    githubRepoUrl,
    issuesUrl,
    releasesUnavailable,
    releasesRateLimited,
  } = data;

  const desktopPlatforms = PLATFORM_DOWNLOADS.filter((p) =>
    [
      "macos-arm64",
      "macos-x64",
      "windows-exe",
      "windows-msi",
      "linux-appimage",
      "linux-deb",
      "linux-rpm",
    ].includes(p.platform),
  );

  const mobilePlatforms = PLATFORM_DOWNLOADS.filter((p) =>
    ["android", "fdroid"].includes(p.platform),
  );

  const detectedOS = useDetectedOS();
  // Mobile visitors see the Mobile section first — their download at top.
  const mobileFirst = detectedOS === "android" || detectedOS === "ios";
  const platformAssets = latestRelease?.platformAssets ?? {};

  const desktopSection = (
    <div className="mb-12">
      <Eyebrow as="h3" className="mb-5 flex items-center gap-2">
        <Monitor className="h-4 w-4" />
        <span>Desktop</span>
      </Eyebrow>
      <DownloadGrid platforms={desktopPlatforms} assets={platformAssets} />
    </div>
  );

  const mobileSection = (
    <div className="mb-12">
      <Eyebrow as="h3" className="mb-5 flex items-center gap-2">
        <Smartphone className="h-4 w-4" />
        <span>Mobile</span>
      </Eyebrow>
      <DownloadGrid platforms={mobilePlatforms} assets={platformAssets} />
    </div>
  );

  return (
    // No page background: the body already paints --color-bg plus the two
    // teal orbs, and an opaque wrapper would cover them.
    <div className="min-h-screen text-hi">
      <TypeshalaTopNav />

      <main>
        <section className="pt-16 pb-16">
          <div className="mx-auto max-w-shell px-6">
            <div className="max-w-[46rem]">
              <span className="inline-flex w-fit items-center gap-1.75 rounded-full border border-accent-line bg-accent-soft py-1.5 pl-2 pr-2.5 font-mono text-micro text-accent">
                <span className="animate-pulse-ring h-1.5 w-1.5 rounded-full bg-accent" />
                Available for download
              </span>

              <h1 className="mt-5 mb-3.5 text-display font-bold text-hi">
                Typeshala
              </h1>

              <p className="mb-6 max-w-measure-narrow text-mid text-lede">
                A bilingual (English / Nepali) typing tutor desktop app with
                structured lessons, progress stats, themes, and a bonus Ramayana
                game.
              </p>

              <div className="flex flex-wrap gap-2.5">
                <Button
                  as="a"
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                >
                  <GitLabIcon className="h-4 w-4" />
                  <span>View Source on GitLab</span>
                </Button>
                <Button
                  as="a"
                  href={issuesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Box className="h-4 w-4" />
                  <span>Report Issue</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {latestRelease ? (
          <section className="py-16">
            <div className="mx-auto max-w-shell px-6">
              <Reveal>
                <SectionHead
                  eyebrow="LATEST RELEASE"
                  title="Latest release"
                  lede={`Published ${latestRelease.publishedAt}`}
                >
                  <div className="mt-3 flex flex-wrap items-center gap-2.5">
                    <MonoTag accent>v{latestRelease.version}</MonoTag>
                    <Button
                      as="a"
                      href={latestRelease.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4" />
                      <span>View release</span>
                    </Button>
                  </div>
                </SectionHead>
              </Reveal>

              {mobileFirst ? (
                <>
                  {mobileSection}
                  {desktopSection}
                </>
              ) : (
                <>
                  {desktopSection}
                  {mobileSection}
                </>
              )}

              <ReleaseNotes
                version={latestRelease.version}
                name={latestRelease.name}
                publishedAt={latestRelease.publishedAt}
                body={latestRelease.body}
                url={latestRelease.url}
                isPrerelease={latestRelease.isPrerelease}
                isDraft={latestRelease.isDraft}
              />
            </div>
          </section>
        ) : null}

        {previousReleases.length > 0 ? (
          <section className="py-16">
            <div className="mx-auto max-w-shell px-6">
              <Reveal>
                <SectionHead
                  eyebrow="RELEASE HISTORY"
                  title="Previous releases"
                  lede="Earlier builds and the platform downloads they shipped with."
                />
              </Reveal>

              <div className="flex flex-col gap-3">
                {previousReleases.map((release) => (
                  <PreviousRelease
                    key={release!.version}
                    version={release!.version}
                    name={release!.name}
                    publishedAt={release!.publishedAt}
                    body={release!.body}
                    url={release!.url}
                    isPrerelease={release!.isPrerelease}
                    platformAssets={release!.platformAssets}
                  />
                ))}
              </div>

              <Reveal delay={120} className="mt-8 flex justify-center">
                <Button
                  as="a"
                  href={`${githubRepoUrl}/releases`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>View all releases on GitHub</span>
                  <Github className="h-4 w-4" />
                </Button>
              </Reveal>
            </div>
          </section>
        ) : null}

        {/*
          The three conditions on each fallback below are load-bearing. Only
          releasesUnavailable separates "the API failed" from "there is
          genuinely nothing published": release.ts treats a GitHub 404 as
          success-with-fallback, so an empty release list with no failure flag
          really does mean the repo has no public releases. releasesRateLimited
          then only changes the copy, never the condition set.
        */}
        {!latestRelease && previousReleases.length === 0 && releasesUnavailable ? (
          <section className="py-16">
            <div className="mx-auto max-w-shell px-6">
              <BentoCard className="mx-auto max-w-[44rem] rounded-hero p-7 text-center sm:p-9">
                <span className="inline-flex items-center gap-1.75 rounded-full border border-[rgba(167,139,250,0.32)] bg-[rgba(167,139,250,0.1)] py-1.5 pl-2 pr-2.5 font-mono text-micro text-violet">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet" />
                  {releasesRateLimited
                    ? "GitHub API rate limited"
                    : "Release info unavailable"}
                </span>

                <h2 className="mt-5 mb-3 text-title font-bold text-hi">
                  {releasesRateLimited
                    ? "GitHub API rate limit reached"
                    : "Couldn't load release info"}
                </h2>

                <p className="mx-auto mb-7 max-w-measure text-mid text-lede">
                  {releasesRateLimited
                    ? "GitHub API rate limit reached. Please try again in a few minutes — or check releases directly on GitHub."
                    : "Could not reach the GitHub API. Check releases directly on GitHub."}
                </p>

                <Button
                  as="a"
                  href={`${githubRepoUrl}/releases`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                >
                  <Github className="h-4 w-4" />
                  <span>View Releases on GitHub</span>
                </Button>
              </BentoCard>
            </div>
          </section>
        ) : null}

        {!latestRelease && previousReleases.length === 0 && !releasesUnavailable ? (
          <section className="py-16">
            <div className="mx-auto max-w-shell px-6">
              <BentoCard className="mx-auto max-w-[44rem] rounded-hero p-7 text-center sm:p-9">
                <span className="inline-flex items-center gap-1.75 rounded-full border border-[rgba(240,180,41,0.35)] bg-[rgba(240,180,41,0.1)] py-1.5 pl-2 pr-2.5 font-mono text-micro text-amber">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber" />
                  No releases yet
                </span>

                <h2 className="mt-5 mb-3 text-title font-bold text-hi">
                  No public releases published
                </h2>

                <p className="mx-auto mb-7 max-w-measure text-mid text-lede">
                  The Typeshala project hasn&apos;t published any releases yet.
                  Check the GitLab repository for development progress.
                </p>

                <Button
                  as="a"
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                >
                  <GitLabIcon className="h-4 w-4" />
                  <span>View Repository</span>
                </Button>
              </BentoCard>
            </div>
          </section>
        ) : null}

        <section className="py-16">
          <div className="mx-auto max-w-shell px-6">
            <Reveal>
              <SectionHead
                eyebrow="WHAT IT DOES"
                title="Features"
                lede="Everything that ships in the Typeshala desktop build."
              />
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, desc }, index) => (
                <Reveal
                  key={title}
                  delay={index * 50}
                  className="h-full"
                >
                  <BentoCard interactive className="h-full p-5">
                    <span className="mb-3.5 flex h-9.5 w-9.5 items-center justify-center rounded-control border border-accent-line bg-accent-soft text-accent">
                      <Icon size={17} />
                    </span>
                    <h3 className="text-[15px] font-semibold text-hi">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-[1.55] text-mid">
                      {desc}
                    </p>
                  </BentoCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="mx-auto max-w-shell px-6">
            <Reveal>
              <h2 className="font-mono text-xs tracking-widest text-low uppercase">
                Stack
              </h2>

              {/*
                Structure copied from the remix reference at
                src/routes/index.tsx:148-175. The parent's flex centring is
                load-bearing: the orbit children are absolutely positioned with
                no inset offsets, so their static position is what the flexbox
                centres, and the keyframes then rotate each one about it.

                One deliberate deviation. The reference hides the whole diagram
                below md (`hidden md:flex`), which is the wrong trade for a
                desktop app people discover on their phones, so the geometry is
                kept at the reference values and scaled down with a transform on
                narrow viewports instead of being removed. radius/iconSize are JS
                props, not CSS, so this is the only way to shrink them
                responsively.
              */}
              <div className="relative mx-auto mt-8 flex h-[420px] w-full origin-center items-center justify-center max-md:scale-[0.72] [&:hover_*]:[animation-play-state:paused]">
                <span className="font-mono text-xs text-low">core</span>
                <OrbitingCircles radius={170} duration={40} iconSize={56} speed={0.6}>
                  {TECH_STACK_OUTER.map((tech) => (
                    <span
                      key={tech}
                      className="flex size-14 items-center justify-center rounded-full border border-line bg-surface-2 px-1.5 text-center font-mono text-[11px] leading-tight text-hi"
                    >
                      {tech}
                    </span>
                  ))}
                </OrbitingCircles>
                <OrbitingCircles
                  radius={100}
                  duration={32}
                  iconSize={44}
                  speed={0.6}
                  reverse
                >
                  {TECH_STACK_INNER.map((tech) => (
                    <span
                      key={tech}
                      className="flex size-11 items-center justify-center rounded-full border border-line bg-surface-2 px-1 text-center font-mono text-[10px] leading-tight text-mid"
                    >
                      {tech}
                    </span>
                  ))}
                </OrbitingCircles>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <TypeshalaFooter issuesUrl={issuesUrl} />
    </div>
  );
}
