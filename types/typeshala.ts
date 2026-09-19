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

export interface PlatformDownload {
  platform: 'macos-arm64' | 'macos-x64' | 'windows' | 'linux-appimage' | 'linux-deb' | 'linux-rpm' | 'android' | 'fdroid';
  label: string;
  description: string;
  icon: string;
  assetPatterns: string[];
  installInstructions?: string;
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
  },
  {
    platform: 'macos-x64',
    label: 'macOS (Intel)',
    description: 'Intel chips — .dmg installer',
    icon: '🍎',
    assetPatterns: ['x86_64-apple-darwin', 'x64.dmg'],
  },
  {
    platform: 'windows',
    label: 'Windows',
    description: 'Windows 10/11 — .msi installer',
    icon: '🪟',
    assetPatterns: ['x86_64-pc-windows-msvc', '.msi', '.exe'],
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
    platform: 'android',
    label: 'Android (APK)',
    description: 'Direct APK download',
    icon: '🤖',
    assetPatterns: ['.apk'],
    installInstructions: 'Enable "Install unknown apps" in settings, then open the APK.',
    // Android builds are NOT published to GitHub releases (built manually).
    // TODO: paste your APK link here (Drive / Supabase storage / Play Store
    // listing). While empty, the card shows "Not available in latest release".
    manualUrl: '',
    downloadLabel: 'APK',
  },
  {
    platform: 'fdroid',
    label: 'F-Droid',
    description: 'Open-source app store (if published)',
    icon: '📦',
    assetPatterns: [],
    installInstructions: 'Search "Typeshala" in F-Droid app or add repository.',
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