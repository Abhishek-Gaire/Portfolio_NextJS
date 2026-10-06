export interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
  content_type: string;
}

export interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string | null;
  published_at: string;
  html_url: string;
  assets: GitHubAsset[];
  prerelease: boolean;
  draft: boolean;
}

/**
 * Whether a build is something a visitor can actually download today.
 *
 * This field exists because of a contradiction the page used to ship. The
 * feature grid advertised Android as a supported platform, the download grid
 * rendered an "Android (APK)" card, and that card then said "Not available in
 * latest release" — because the APK is built by hand and published nowhere.
 * Crawlers and AI assistants read those two places independently and produced
 * two different answers to "can I get this on Android?".
 *
 * So the status is data now, stated in the card itself, and the two places are
 * derived from the same array. An unbuilt platform says so; it does not
 * pretend to have a button.
 */
export type PlatformStatus = 'released' | 'in-development';

export interface PlatformDownload {
  platform: 'macos-arm64' | 'macos-x64' | 'windows-exe' | 'windows-msi' | 'linux-appimage' | 'linux-deb' | 'linux-rpm' | 'android';
  label: string;
  description: string;
  icon: string;
  assetPatterns: string[];
  installInstructions?: string;
  /** Defaults to 'released'. See PlatformStatus. */
  status?: PlatformStatus;
  /**
   * Manual download URL used INSTEAD of matching a GitHub release asset.
   * Set for platforms whose builds are distributed outside GitHub releases
   * (e.g. a manually built Android APK hosted on Drive/Supabase, or a
   * Play Store listing). Empty/unset = fall back to release matching.
   */
  manualUrl?: string;
  /** Button label override, e.g. 'APK'. Defaults to derived asset pattern. */
  downloadLabel?: string;
}

export const PLATFORM_DOWNLOADS: PlatformDownload[] = [
  {
    platform: 'macos-arm64',
    label: 'macOS (Apple Silicon)',
    description: 'M1/M2/M3 chips — .dmg installer',
    icon: '🍎',
    assetPatterns: ['aarch64-apple-darwin', 'arm64.dmg', 'aarch64.dmg'],
    installInstructions: 'xattr -cr /Applications/Typeshala.app',
  },
  {
    platform: 'macos-x64',
    label: 'macOS (Intel)',
    description: 'Intel chips — .dmg installer',
    icon: '🍎',
    assetPatterns: ['x86_64-apple-darwin', 'x64.dmg'],
    installInstructions: 'xattr -cr /Applications/Typeshala.app',
  },
  {
    platform: 'windows-exe',
    label: 'Windows (.exe)',
    description: 'Windows 10/11 — recommended .exe installer',
    icon: '🪟',
    assetPatterns: ['.exe'],
    installInstructions: 'Run the .exe installer and follow the setup wizard.',
  },
  {
    platform: 'windows-msi',
    label: 'Windows (.msi)',
    description: 'Windows 10/11 — .msi installer',
    icon: '🪟',
    assetPatterns: ['.msi'],
    installInstructions: 'Run the .msi installer and follow the setup wizard.',
  },
  {
    platform: 'linux-appimage',
    label: 'Linux (AppImage)',
    description: 'Universal — runs on any distro',
    icon: '🐧',
    assetPatterns: ['.AppImage', 'x86_64.AppImage'],
    installInstructions: 'Make executable: chmod +x Typeshala-*.AppImage, then run.',
  },
  {
    platform: 'linux-deb',
    label: 'Linux (.deb)',
    description: 'Debian/Ubuntu/Mint — .deb package',
    icon: '🐧',
    assetPatterns: ['_amd64.deb', '.deb'],
    installInstructions: 'sudo dpkg -i Typeshala_*.deb && sudo apt-get install -f',
  },
  {
    platform: 'linux-rpm',
    label: 'Linux (.rpm)',
    description: 'Fedora/RHEL/openSUSE — .rpm package',
    icon: '🐧',
    assetPatterns: ['_x86_64.rpm', '.rpm'],
    installInstructions: 'sudo dnf install Typeshala_*.rpm',
  },
  {
    /*
     * Honest about its state, which is the whole point of the status field.
     * The Android build exists and works (~/Desktop/OpenSource/Typeshala
     * src-tauri/gen/android, spec 0016 — immersive fullscreen, touch board), but
     * nothing publishes it: the release CI matrix in .github/workflows/release.yml
     * has no Android job, there is no Play Store listing and no APK is attached
     * to a GitHub release. So there is no URL to put in manualUrl and no button
     * to render. When a signed APK lands somewhere public, set manualUrl and flip
     * status to 'released' — nothing else needs to change.
     */
    platform: 'android',
    label: 'Android',
    description: 'Touch board build — not published yet',
    icon: '🤖',
    assetPatterns: [],
    status: 'in-development',
    installInstructions: 'No APK is published yet. Follow the GitLab project for when one is.',
  },
];

export function matchAssetToPlatform(asset: GitHubAsset, platform: PlatformDownload): boolean {
  const name = asset.name.toLowerCase();
  return platform.assetPatterns.some(pattern => name.includes(pattern.toLowerCase()));
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}