'use client';

import { Monitor, Smartphone, Box } from 'lucide-react';
import { GitLabIcon, Github } from '@/components/icons';
import { DownloadGrid } from '@/components/typeshala/DownloadCards';
import { useDetectedOS } from '@/components/typeshala/useDetectedOS';
import { ReleaseNotes, PreviousRelease } from '@/components/typeshala/ReleaseNotes';
import { TypeshalaTopNav, TypeshalaFooter } from '@/components/typeshala/TypeshalaChrome';
import { PLATFORM_DOWNLOADS } from '@/types/typeshala';
import type { TypeshalaPageData } from './_lib/release';

export default function TypeshalaPageClient({ data }: { data: TypeshalaPageData }) {
  const { latestRelease, previousReleases, repoUrl, githubRepoUrl, issuesUrl, releasesUnavailable, releasesRateLimited } = data;

  const desktopPlatforms = PLATFORM_DOWNLOADS.filter(p =>
    ['macos-arm64', 'macos-x64', 'windows', 'linux-appimage', 'linux-deb', 'linux-rpm'].includes(p.platform)
  );

  const mobilePlatforms = PLATFORM_DOWNLOADS.filter(p =>
    ['android', 'fdroid'].includes(p.platform)
  );

  const detectedOS = useDetectedOS();
  // Mobile visitors see the Mobile section first — their download at top.
  const mobileFirst = detectedOS === 'android' || detectedOS === 'ios';
  const platformAssets = latestRelease?.platformAssets ?? {};

  const desktopSection = (
    <div className="mb-12">
      <h3 className="text-lg font-semibold text-gray-300 mb-6 flex items-center space-x-2">
        <Monitor className="w-5 h-5 text-blue-400" />
        <span>Desktop</span>
      </h3>
      <DownloadGrid
        platforms={desktopPlatforms}
        assets={platformAssets}
      />
    </div>
  );

  const mobileSection = (
    <div className="mb-12">
      <h3 className="text-lg font-semibold text-gray-300 mb-6 flex items-center space-x-2">
        <Smartphone className="w-5 h-5 text-green-400" />
        <span>Mobile</span>
      </h3>
      <DownloadGrid
        platforms={mobilePlatforms}
        assets={platformAssets}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <TypeshalaTopNav />
      <main>
      <div className="relative">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-purple-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />

        <div className="relative container mx-auto px-6 py-16 lg:py-24">

          <section className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-blue-400 text-sm font-medium">Available for Download</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="bg-linear-to-r from-blue-400 via-white to-purple-400 bg-clip-text text-transparent">
                Typeshala
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              A bilingual (English / Nepali) typing tutor desktop app with structured lessons,
              progress stats, themes, and a bonus Ramayana game.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <GitLabIcon className="w-5 h-5" />
                <span>View Source on GitLab</span>
              </a>
              <a
                href={issuesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <Box className="w-5 h-5" />
                <span>Report Issue</span>
              </a>
            </div>
          </section>

          {latestRelease && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold">
                    Latest Release
                    <span className="ml-3 font-mono text-blue-400">v{latestRelease.version}</span>
                  </h2>
                  <p className="text-gray-400 mt-1">Released {latestRelease.publishedAt}</p>
                </div>
                <a
                  href={latestRelease.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                >
                  <Github className="w-4 h-4" />
                  <span>View Release</span>
                </a>
              </div>

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
            </section>
          )}

          {previousReleases.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl lg:text-3xl font-bold mb-8">Previous Releases</h2>
              <div className="space-y-4">
                {previousReleases.map(release => (
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

              <div className="text-center mt-8">
                <a
                href={`${githubRepoUrl}/releases`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-medium"
              >
                <span>View all releases on GitHub</span>
                <Github className="w-4 h-4" />
                </a>
              </div>
            </section>
          )}

          {!latestRelease && previousReleases.length === 0 && releasesUnavailable && (
            <section className="text-center py-16">
              <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-blue-400 text-sm font-medium">Temporarily Unavailable</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">Couldn&apos;t load release info</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                {releasesRateLimited
                  ? 'GitHub API rate limit reached. Please try again in a few minutes — or check releases directly on GitHub.'
                  : 'Could not reach the GitHub API. Check releases directly on GitHub.'}
              </p>
              <a
                href={`${githubRepoUrl}/releases`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>View Releases on GitHub</span>
              </a>
            </section>
          )}

          {!latestRelease && previousReleases.length === 0 && !releasesUnavailable && (
            <section className="text-center py-16">
              <div className="inline-flex items-center space-x-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-yellow-400 text-sm font-medium">No Releases Yet</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">No public releases published</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                The Typeshala project hasn&apos;t published any releases yet. Check the GitLab repository for development progress.
              </p>
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <GitLabIcon className="w-5 h-5" />
                <span>View Repository</span>
              </a>
            </section>
          )}

          <section className="mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: '🌐', title: 'Bilingual Support', desc: 'English and Nepali UI with full i18n support' },
                { icon: '⌨️', title: 'Multiple Layouts', desc: 'English QWERTY, Nepali Romanized, and Traditional Preeti' },
                { icon: '📚', title: 'Structured Lessons', desc: 'Progressive typing drills with accuracy and WPM tracking' },
                { icon: '📊', title: 'Progress Stats', desc: 'Detailed trends, heatmaps, and personal bests' },
                { icon: '🎨', title: 'Themes', desc: 'Light, dark, and custom color schemes' },
                { icon: '🎮', title: 'Ramayana Game', desc: 'Bonus typing game based on the epic' },
                { icon: '💾', title: 'Local-First', desc: 'All data stored on-device via Tauri store plugin' },
                { icon: '🔧', title: 'Cross-Platform', desc: 'Native apps for macOS, Windows, and Linux' },
                { icon: '📱', title: 'Android Support', desc: 'Mobile version with touch-optimized lessons' },
              ].map((feature, i) => (
                <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-colors">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8">Built With</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {['Tauri v2', 'React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Rust', 'Zustand', 'Vitest'].map(tech => (
                <span key={tech} className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-sm font-medium text-gray-300">
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
      </main>
      <TypeshalaFooter issuesUrl={issuesUrl} />
    </div>
  );
}