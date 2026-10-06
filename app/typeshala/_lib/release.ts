import { headers } from 'next/headers';
import { GitHubRelease, PLATFORM_DOWNLOADS, matchAssetToPlatform, formatDate } from '@/types/typeshala';

export type TypeshalaPageData = Awaited<ReturnType<typeof getTypeshalaPageData>>;

const GITHUB_REPO = 'Abhishek-Gaire/Typeshala';
// GitHub is a CI mirror for builds — issues are tracked on GitLab.
const GITLAB_REPO_URL = 'https://gitlab.com/abhishek_gaire/typeshala';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases`;

// Optional server-only token. Unauthenticated GitHub API quota is only
// 60 req/hr per IP (and dev refetches on every reload), so set GITHUB_TOKEN
// (a PAT with no scopes is enough for public repos) to raise it to 5,000/hr.
// Add it to .env.local and to the hosting provider's env vars.
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function githubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Typeshala-Portfolio',
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }
  return headers;
}

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (data && typeof data.message === 'string') return data.message;
  } catch {
    // non-JSON error body — fall through to statusText
  }
  return res.statusText;
}

function isRateLimited(res: Response, message: string): boolean {
  return (
    res.status === 403 &&
    (res.headers.get('x-ratelimit-remaining') === '0' ||
      /rate limit/i.test(message))
  );
}

type FetchOutcome<T> = {
  data: T;
  /** True when the request failed for any reason (network, 5xx, rate limit). */
  failed: boolean;
  /** True when the failure was specifically GitHub rate limiting. */
  rateLimited: boolean;
};

async function handleGithubResponse<T>(
  res: Response,
  url: string,
  fallback: T,
): Promise<FetchOutcome<T>> {
  if (res.ok) {
    return { data: (await res.json()) as T, failed: false, rateLimited: false };
  }
  // 404 from /latest genuinely means "no public releases yet".
  if (res.status === 404) {
    return { data: fallback, failed: false, rateLimited: false };
  }

  const message = await readErrorMessage(res);
  if (isRateLimited(res, message)) {
    const reset = res.headers.get('x-ratelimit-reset');
    const resetsAt = reset
      ? new Date(Number(reset) * 1000).toLocaleTimeString()
      : 'unknown time';
    console.warn(
      `[typeshala] GitHub API rate limit exceeded for ${url} (quota resets ~${resetsAt}). ` +
        `Unauthenticated quota is 60 req/hr — set the GITHUB_TOKEN env var to raise it to 5,000/hr.`,
    );
    return { data: fallback, failed: true, rateLimited: true };
  }

  console.error(`[typeshala] GitHub API error for ${url}: ${res.status} — ${message}`);
  return { data: fallback, failed: true, rateLimited: false };
}

export async function fetchLatestRelease(): Promise<FetchOutcome<GitHubRelease | null>> {
  const url = `${GITHUB_API_URL}/latest`;
  try {
    const res = await fetch(url, {
      headers: githubHeaders(),
      next: { revalidate: 300 },
    });

    return handleGithubResponse<GitHubRelease | null>(res, url, null);
  } catch (error) {
    console.error('[typeshala] Failed to fetch latest release:', error);
    return { data: null, failed: true, rateLimited: false };
  }
}

export async function fetchAllReleases(): Promise<FetchOutcome<GitHubRelease[]>> {
  try {
    const res = await fetch(GITHUB_API_URL, {
      headers: githubHeaders(),
      next: { revalidate: 300 },
    });

    return handleGithubResponse<GitHubRelease[]>(res, GITHUB_API_URL, []);
  } catch (error) {
    console.error('[typeshala] Failed to fetch releases:', error);
    return { data: [], failed: true, rateLimited: false };
  }
}

export function getPlatformAssets(release: GitHubRelease) {
  const platformAssets: Record<string, { asset: GitHubRelease['assets'][0]; platform: typeof PLATFORM_DOWNLOADS[0] }> = {};

  for (const platform of PLATFORM_DOWNLOADS) {
    // Platforms with a manualUrl are distributed outside GitHub releases
    // (e.g. manually built Android APK) — never match a release asset.
    if (platform.manualUrl) continue;
    // An unreleased platform has nothing to match against either. Without this
    // an `.apk` asset dropped onto a release would silently turn the Android
    // card back into a live download button.
    if (platform.status === 'in-development') continue;
    // Empty assetPatterns means "no release-asset distribution", not "match
    // anything" — an empty list previously fell through to find() with a
    // predicate that always returned false, so it was harmless by accident.
    if (!platform.assetPatterns.length) continue;

    const asset = release.assets.find(a => matchAssetToPlatform(a, platform));
    if (asset) {
      platformAssets[platform.platform] = { asset, platform };
    }
  }

  return platformAssets;
}

export function getReleaseInfo(release: GitHubRelease | null) {
  if (!release) return null;

  const platformAssets = getPlatformAssets(release);
  const hasDownloads = Object.keys(platformAssets).length > 0;

  return {
    version: release.tag_name.replace(/^v/, ''),
    name: release.name || release.tag_name,
    publishedAt: formatDate(release.published_at),
    body: release.body,
    // Releases (notes, tags, assets) only exist on the GitHub CI mirror —
    // GitLab has no releases/tags, so per-version links must stay here.
    url: release.html_url,
    platformAssets,
    hasDownloads,
    isPrerelease: release.prerelease,
    isDraft: release.draft,
  };
}

export async function getTypeshalaPageData() {
  const host = (await headers()).get('host') || '';
  const isTypeshalaSubdomain = host.startsWith('typeshala.');

  const [latest, all] = await Promise.all([
    fetchLatestRelease(),
    fetchAllReleases(),
  ]);

  const releaseInfo = getReleaseInfo(latest.data);
  const previousReleases = all.data
    .filter(r => r.tag_name !== latest.data?.tag_name && !r.draft)
    .slice(0, 5)
    .map(r => getReleaseInfo(r))
    .filter(Boolean);

  return {
    isTypeshalaSubdomain,
    latestRelease: releaseInfo,
    previousReleases,
    // Source + issues live on GitLab; releases/downloads only on GitHub.
    repoUrl: GITLAB_REPO_URL,
    githubRepoUrl: `https://github.com/${GITHUB_REPO}`,
    issuesUrl: `${GITLAB_REPO_URL}/-/issues`,
    // True when the API couldn't be reached — the UI must NOT claim
    // "no releases yet" in this case, since we simply don't know.
    releasesUnavailable: latest.failed || all.failed,
    releasesRateLimited: latest.rateLimited || all.rateLimited,
  };
}