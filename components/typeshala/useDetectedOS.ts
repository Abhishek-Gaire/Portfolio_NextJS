'use client';

import { useSyncExternalStore } from 'react';
import type { PlatformDownload } from '@/types/typeshala';

export type DetectedOS = 'macos' | 'windows' | 'linux' | 'android' | 'ios';

// Which platform cards belong to each OS, in display order.
const PRIORITY: Record<DetectedOS, string[]> = {
  macos: ['macos-arm64', 'macos-x64'],
  windows: ['windows'],
  linux: ['linux-appimage', 'linux-deb', 'linux-rpm'],
  android: ['android', 'fdroid'],
  // No iOS build exists — nothing to prioritize.
  ios: [],
};

export function detectOS(): DetectedOS | null {
  if (typeof navigator === 'undefined') return null;
  const uaData =
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ?? '';
  const ua = `${uaData} ${navigator.userAgent}`.toLowerCase();
  // Android UA contains "Linux" too — check it first.
  if (ua.includes('android')) return 'android';
  if (/(iphone|ipad|ipod)/.test(ua)) return 'ios';
  if (ua.includes('mac')) return 'macos';
  if (ua.includes('win')) return 'windows';
  if (ua.includes('linux')) return 'linux';
  return null;
}

/**
 * Detected visitor OS. Null during SSR / first render so server and client
 * output matches — callers must handle null as "unknown, keep default order".
 */
function subscribe() {
  return () => {};
}

export function useDetectedOS(): DetectedOS | null {
  return useSyncExternalStore(subscribe, detectOS, () => null);
}

/** Sort the visitor's OS platforms first, keep relative order otherwise. */
export function orderPlatformsByOS<T extends PlatformDownload>(
  platforms: T[],
  os: DetectedOS | null,
): T[] {
  if (!os) return platforms;
  const priority = PRIORITY[os];
  return [...platforms].sort((a, b) => {
    const ai = priority.indexOf(a.platform);
    const bi = priority.indexOf(b.platform);
    return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi);
  });
}

export function isRecommendedForOS(
  platform: PlatformDownload,
  os: DetectedOS | null,
): boolean {
  if (!os) return false;
  return PRIORITY[os].includes(platform.platform);
}
