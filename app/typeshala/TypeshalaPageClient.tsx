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
  ShieldOff,
  Smartphone,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { GitLabIcon, Github } from "@/components/icons";
import { BentoCard } from "@/components/primitives/BentoCard";
import { Button } from "@/components/primitives/Button";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { StackOrbit } from "@/components/primitives/StackOrbit";
import { MonoTag } from "@/components/primitives/MonoTag";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionHead } from "@/components/primitives/SectionHead";
import { DownloadGrid } from "@/components/typeshala/DownloadCards";
import { TypeshalaFaq } from "@/components/typeshala/Faq";
import { TypeshalaScreenshots } from "@/components/typeshala/Screenshots";
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
import {
  TYPESHALA_DEVANAGARI,
  TYPESHALA_INTRO,
  TYPESHALA_LICENSE,
  TYPESHALA_NAME,
} from "@/lib/typeshala-content";
import type { TypeshalaPageData } from "./_lib/release";

type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

/**
 * Every tile here describes something a person can use in a build they can
 * download. "Android Support" used to sit in this grid while the Android card
 * under it admitted there was no APK — the grid is the first thing a reader or
 * a crawler skims, so a claim here outranks any correction further down.
 */
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
    icon: ShieldOff,
    title: "No Account, No Tracking",
    desc: "No accounts, no cloud sync, and no network calls at all",
  },
  {
    icon: Wrench,
    title: "Cross-Platform",
    desc: "Native apps for macOS, Windows, and Linux",
  },
];

/*
 * Verified against the real app rather than from memory. `Zustand` was listed
 * here and is a false claim: it is not in the app's package.json, not in its
 * lockfile, and not imported anywhere in src/. The frontend has no external
 * state library at all — persistence runs through Tauri commands into Rust
 * (`src/infrastructure/tauriApi.ts` -> `invoke`), backed by
 * `tauri-plugin-store`, with the shared shapes serialised by serde. So Serde
 * replaces it, which is both true and the thing that actually does the job
 * Zustand was credited with.
 *
 * Check the rest against ~/Desktop/OpenSource/Typeshala before changing either
 * list — the other five are all real dependencies.
 */
const TECH_STACK_OUTER = ["Tauri v2", "React 19", "TypeScript", "Vite", "Rust"];

const TECH_STACK_INNER = ["Tailwind CSS", "Serde", "Vitest"];

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

  // Only one mobile platform is left (Android, unreleased), so this grid drops
  // to a single track — see DownloadGrid's className prop.
  const mobilePlatforms = PLATFORM_DOWNLOADS.filter(
    (p) => p.platform === "android",
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
      <DownloadGrid
        platforms={mobilePlatforms}
        assets={platformAssets}
        className="sm:grid-cols-1 lg:grid-cols-1 lg:max-w-104"
      />
    </div>
  );

  return (
    // No page background: the body already paints --color-bg plus the two
    // teal orbs, and an opaque wrapper would cover them.
    <div className="min-h-screen text-hi">
      <TypeshalaTopNav />

      <main>
        {/*
          The stack orbit sits beside the title block rather than at the foot of
          the page. It was the last section, which meant it rendered below every
          release note, the download cards and the feature grid — a diagram
          nobody reaches, since the page is long and the useful links are all
          above it. Beside the h1 it is the first thing after the title and it
          fills the space the single-column layout was leaving empty.

          The right column is a FIXED 26rem track, not `auto` and not a
          percentage. `auto` collapses: the orbit badges are absolutely
          positioned, so they are out of flow and contribute nothing to the
          track's intrinsic width, and the column shrinks to the 42px of the
          "core" label while the badges escape the section. A 50% track clips
          the ring on narrower desktops. The ring needs 170px of radius plus a
          56px badge on each side, so 416px is the floor and the left column is
          the one that gives way.
        */}
        <section className="pt-16 pb-16">
          <div className="mx-auto max-w-shell px-6">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16">
              <div className="max-w-184">
                <span className="inline-flex w-fit items-center gap-1.75 rounded-full border border-accent-line bg-accent-soft py-1.5 pl-2 pr-2.5 font-mono text-micro text-accent">
                  <span className="animate-pulse-ring h-1.5 w-1.5 rounded-full bg-accent" />
                  Available for download
                </span>

                {/*
                  The Devanagari spelling sits inside the h1 rather than beside
                  it. "टाइपशाला" is how most Nepali speakers search for this,
                  and a name rendered as an image — or as a heading a crawler
                  skips past — is a name nobody finds. lang="ne" is on the span so
                  screen readers switch voice rather than reading Devanagari with
                  an English voice.
                */}
                <h1 className="mt-5 mb-3.5 text-display font-bold text-hi">
                  {TYPESHALA_NAME}{" "}
                  <span lang="ne" className="text-mid">
                    ({TYPESHALA_DEVANAGARI})
                  </span>
                </h1>

                <p className="mb-4 max-w-measure-narrow text-mid text-lede">
                  {TYPESHALA_INTRO[0]}
                </p>
                <p className="mb-4 max-w-measure-narrow text-mid text-lede">
                  {TYPESHALA_INTRO[1]}
                </p>

                {/*
                  Price, license and platforms, in text, above the fold. Someone
                  deciding whether to trust a download link reads exactly these
                  three things, and a crawler building an answer about the app
                  has nowhere else to find them.
                */}
                <div className="mb-6 flex flex-wrap items-center gap-2.5">
                  <MonoTag accent>Free &amp; open source</MonoTag>
                  <MonoTag>MIT license</MonoTag>
                  <MonoTag>Windows · macOS · Linux</MonoTag>
                  <MonoTag>Works offline</MonoTag>
                  <MonoTag>No account needed</MonoTag>
                </div>

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
                  <Button
                    as="a"
                    href={TYPESHALA_LICENSE}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>MIT License</span>
                  </Button>
                </div>

                {/*
                  The third paragraph reads as an aside under the buttons rather
                  than as a fourth block of lede: it answers "why does this
                  exist", which is a question people ask after the download
                  question, not before it.
                */}
                <p className="mt-6 max-w-measure-narrow border-l-2 border-line pl-4 text-[13px] leading-[1.65] text-low">
                  {TYPESHALA_INTRO[2]}
                </p>
              </div>

              <div className="w-full lg:w-104">
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
                  narrow viewports instead of being removed. radius/iconSize are
                  JS props, not CSS, so this is the only way to shrink them
                  responsively.

                  No <Reveal> here, deliberately. It is a scroll-intersection
                  effect, and this is above the fold — the observer would fire on
                  the first frame and the fade would just be a flash.
                */}
                <StackOrbit outer={TECH_STACK_OUTER} inner={TECH_STACK_INNER} />
              </div>
            </div>
          </div>
        </section>

        {/* The proof the app exists, before the download buttons. */}
        <TypeshalaScreenshots />

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
        {!latestRelease &&
        previousReleases.length === 0 &&
        releasesUnavailable ? (
          <section className="py-16">
            <div className="mx-auto max-w-shell px-6">
              <BentoCard className="mx-auto max-w-176 rounded-hero p-7 text-center sm:p-9">
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

        {!latestRelease &&
        previousReleases.length === 0 &&
        !releasesUnavailable ? (
          <section className="py-16">
            <div className="mx-auto max-w-shell px-6">
              <BentoCard className="mx-auto max-w-176 rounded-hero p-7 text-center sm:p-9">
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
                <Reveal key={title} delay={index * 50} className="h-full">
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

        <TypeshalaFaq />
      </main>

      <TypeshalaFooter issuesUrl={issuesUrl} />
    </div>
  );
}
