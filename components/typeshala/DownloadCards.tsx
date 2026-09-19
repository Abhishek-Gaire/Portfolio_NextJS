'use client';

import { useState } from 'react';
import { Download, ExternalLink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { PlatformDownload } from '@/types/typeshala';

interface DownloadCardProps {
  platform: PlatformDownload;
  asset?: {
    name: string;
    browser_download_url: string;
    size: number;
  };
  isLoading?: boolean;
}

export function DownloadCard({ platform, asset, isLoading }: DownloadCardProps) {
  const [copied, setCopied] = useState(false);

  const handleDownload = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFdroid = platform.platform === 'fdroid';
  // Manual URL (e.g. manually built Android APK) takes the place of a
  // release asset — the card behaves as if a download exists.
  const downloadUrl = asset?.browser_download_url || platform.manualUrl || undefined;
  const hasDownload = !!downloadUrl && !isFdroid;

  return (
    <div className={`group relative bg-gray-800/50 border rounded-2xl p-6 transition-all hover:border-blue-500/50 hover:bg-gray-800 ${!hasDownload && !isFdroid ? 'opacity-50' : ''}`}>
      <div className="flex items-start space-x-4">
        <div className="text-4xl shrink-0">{platform.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">{platform.label}</h3>
            {hasDownload && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center space-x-1"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Direct</span>
              </a>
            )}
          </div>
          <p className="text-gray-400 mt-1">{platform.description}</p>

          {hasDownload && (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => handleDownload(downloadUrl!)}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download {platform.downloadLabel || platform.assetPatterns[0]?.replace('.', '') || 'Installer'}</span>
                  </>
                )}
              </button>
              <button
                onClick={() => handleCopyLink(downloadUrl!)}
                className="flex items-center space-x-2 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <span className={copied ? 'text-green-400' : ''}>
                  {copied ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </span>
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          )}

          {!hasDownload && !isFdroid && (
            <p className="mt-4 text-yellow-400 text-sm flex items-center space-x-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Not available in latest release</span>
            </p>
          )}

          {isFdroid && (
            <div className="mt-4">
              <a
                href="https://f-droid.org/packages/com.abhishek.typeshala/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 border border-green-500/50 text-green-400 hover:bg-green-500/10 font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on F-Droid</span>
              </a>
              <p className="text-gray-500 text-sm mt-2">
                {platform.installInstructions}
              </p>
            </div>
          )}

          {platform.installInstructions && hasDownload && (
            <details className="mt-4 group">
              <summary className="text-sm text-gray-500 hover:text-gray-400 cursor-pointer flex items-center space-x-1">
                <span>Show install instructions</span>
                <svg className="w-4 h-4 transition-transform group-open:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <p className="mt-2 text-sm text-gray-400 bg-gray-900/50 p-3 rounded-lg font-mono">{platform.installInstructions}</p>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

interface DownloadGridProps {
  platforms: PlatformDownload[];
  assets: Record<string, { asset: { name: string; browser_download_url: string; size: number }; platform: PlatformDownload }>;
  isLoading?: boolean;
}

export function DownloadGrid({ platforms, assets, isLoading }: DownloadGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {platforms.map(platform => {
        const matched = assets[platform.platform];
        return (
          <DownloadCard
            key={platform.platform}
            platform={platform}
            asset={matched?.asset}
            isLoading={isLoading}
          />
        );
      })}
    </div>
  );
}