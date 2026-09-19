'use client';

import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { Github } from '@/components/icons';
import { useState } from 'react';

interface ReleaseNotesProps {
  version: string;
  name: string;
  publishedAt: string;
  body: string | null;
  url: string;
  isPrerelease: boolean;
  isDraft: boolean;
}

export function ReleaseNotes({ version, publishedAt, body, url, isPrerelease, isDraft }: ReleaseNotesProps) {
  const [expanded, setExpanded] = useState(false);

  if (!body) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-semibold text-white">Release Notes</h3>
            {isPrerelease && <span className="px-2 py-0.5 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full">Pre-release</span>}
            {isDraft && <span className="px-2 py-0.5 text-xs font-medium bg-gray-500/20 text-gray-400 rounded-full">Draft</span>}
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <Github className="w-4 h-4" />
            <span>View on GitHub</span>
          </a>
        </div>
        <p className="text-gray-500">No release notes provided.</p>
      </div>
    );
  }

  const lines = body.split('\n');
  const previewLines = lines.slice(0, 10);
  const hasMore = lines.length > 10;

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-xl font-semibold text-white">Release Notes</h3>
          {isPrerelease && <span className="px-2 py-0.5 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full">Pre-release</span>}
          {isDraft && <span className="px-2 py-0.5 text-xs font-medium bg-gray-500/20 text-gray-400 rounded-full">Draft</span>}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center space-x-1"
        >
          <Github className="w-4 h-4" />
          <span>View on GitHub</span>
        </a>
      </div>

      <div className="prose prose-invert max-w-none text-gray-300">
        <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
          {expanded || !hasMore ? (
            body
          ) : (
            <>
              {previewLines.join('\n')}
              <span className="text-gray-500">...</span>
            </>
          )}
        </div>
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm font-medium"
        >
          <span>{expanded ? 'Show less' : 'Show more'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      )}

      <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
        <span className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>Released {publishedAt}</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="font-mono text-gray-400">v{version}</span>
        </span>
      </div>
    </div>
  );
}

interface PreviousReleaseProps {
  version: string;
  name: string;
  publishedAt: string;
  body: string | null;
  url: string;
  isPrerelease: boolean;
  platformAssets: Record<string, { asset: { name: string; browser_download_url: string; size: number }; platform: { label: string } }>;
}

export function PreviousRelease({ version, name, publishedAt, body, url, isPrerelease, platformAssets }: PreviousReleaseProps) {
  const platformLabels = Object.values(platformAssets).map(p => p.platform.label).join(', ');

  return (
    <details className="group bg-gray-800/30 border border-gray-700 rounded-xl p-4 open:bg-gray-800/50">
      <summary className="flex items-center justify-between cursor-pointer list-none">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <span className="text-blue-400 font-mono text-sm">v{version}</span>
          </div>
          <div>
            <h4 className="font-medium text-white">{name || `Version ${version}`}</h4>
            <p className="text-sm text-gray-500 flex items-center space-x-2">
              <span>{publishedAt}</span>
              {isPrerelease && <span className="px-1.5 py-0.5 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded">Pre-release</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-400">
          {platformLabels && <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 bg-gray-700 rounded text-xs">{platformLabels}</span>}
          <svg className="w-5 h-5 transition-transform group-open:rotate-180 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </summary>

      <div className="mt-4 pt-4 border-t border-gray-700 animate-in slide-in-from-top-2 duration-200">
        {body && (
          <div className="prose prose-invert max-w-none text-gray-300 mb-4">
            <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{body}</div>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {Object.entries(platformAssets).map(([key, { asset, platform }]) => (
            <a
              key={key}
              href={asset.browser_download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-colors"
            >
              {platform.label}
            </a>
          ))}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 rounded transition-colors"
          >
            Full Changelog
          </a>
        </div>
      </div>
    </details>
  );
}