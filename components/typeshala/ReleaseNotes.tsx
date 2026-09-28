"use client";

import { useState } from "react";
import { ChevronDown, Clock } from "lucide-react";

import { Github } from "@/components/icons";
import { MonoTag } from "@/components/primitives/MonoTag";
import { Reveal } from "@/components/primitives/Reveal";

interface ReleaseNotesProps {
  version: string;
  name: string;
  publishedAt: string;
  body: string | null;
  url: string;
  isPrerelease: boolean;
  isDraft: boolean;
}

function ReleaseFlags({
  isPrerelease,
  isDraft,
}: {
  isPrerelease: boolean;
  isDraft: boolean;
}) {
  return (
    <>
      {isPrerelease ? (
        <MonoTag className="border-[rgba(240,180,41,0.35)] text-amber">
          Pre-release
        </MonoTag>
      ) : null}
      {isDraft ? <MonoTag>Draft</MonoTag> : null}
    </>
  );
}

function ReleaseHeader({
  url,
  isPrerelease,
  isDraft,
}: {
  url: string;
  isPrerelease: boolean;
  isDraft: boolean;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <div className="flex items-center gap-2.5">
        <h3 className="text-[15px] font-semibold text-hi">Release Notes</h3>
        <ReleaseFlags isPrerelease={isPrerelease} isDraft={isDraft} />
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-hi transition-colors duration-200 hover:text-accent"
      >
        <Github className="h-3.5 w-3.5" />
        <span>View on GitHub</span>
      </a>
    </div>
  );
}

export function ReleaseNotes({
  version,
  publishedAt,
  body,
  url,
  isPrerelease,
  isDraft,
}: ReleaseNotesProps) {
  const [expanded, setExpanded] = useState(false);

  if (!body) {
    return (
      <div className="rounded-card border border-line bg-surface p-5">
        <ReleaseHeader
          url={url}
          isPrerelease={isPrerelease}
          isDraft={isDraft}
        />
        <p className="text-[13px] text-low">No release notes provided.</p>
      </div>
    );
  }

  const lines = body.split("\n");
  const previewLines = lines.slice(0, 10);
  const hasMore = lines.length > 10;

  return (
    <div className="rounded-card border border-line bg-surface p-5">
      <ReleaseHeader
        url={url}
        isPrerelease={isPrerelease}
        isDraft={isDraft}
      />

      <div className="prose prose-sm max-w-none">
        <div className="whitespace-pre-wrap font-mono text-caption leading-[1.9] text-mid">
          {expanded || !hasMore ? (
            body
          ) : (
            <>
              {previewLines.join("\n")}
              <span className="text-low">...</span>
            </>
          )}
        </div>
      </div>

      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent transition-colors duration-200 hover:text-hi"
        >
          <span>{expanded ? "Show less" : "Show more"}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line pt-3.5 text-caption text-low">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>Released {publishedAt}</span>
        </span>
        <span className="font-mono text-mid">v{version}</span>
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
  platformAssets: Record<
    string,
    { asset: { name: string; browser_download_url: string; size: number }; platform: { label: string } }
  >;
}

export function PreviousRelease({
  version,
  name,
  publishedAt,
  body,
  url,
  isPrerelease,
  platformAssets,
}: PreviousReleaseProps) {
  const platformLabels = Object.values(platformAssets)
    .map((p) => p.platform.label)
    .join(", ");

  return (
    <details className="group/details overflow-hidden rounded-card border border-line bg-surface transition-colors duration-300 open:bg-surface-2">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control border border-accent-line bg-accent-soft font-mono text-caption font-semibold text-accent">
            v{version}
          </span>
          <div className="min-w-0">
            <h4 className="truncate text-[14px] font-semibold text-hi">
              {name || `Version ${version}`}
            </h4>
            <p className="mt-0.5 flex flex-wrap items-center gap-2 text-caption text-low">
              <span>{publishedAt}</span>
              {isPrerelease ? (
                <MonoTag className="border-[rgba(240,180,41,0.35)] text-amber">
                  Pre-release
                </MonoTag>
              ) : null}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          {platformLabels ? (
            <span className="hidden max-w-[46%] truncate sm:block">
              <MonoTag>{platformLabels}</MonoTag>
            </span>
          ) : null}
          <ChevronDown className="h-4 w-4 shrink-0 text-low transition-transform duration-200 group-open/details:rotate-180" />
        </div>
      </summary>

      <Reveal className="border-t border-line p-4">
        {body ? (
          <div className="prose prose-sm mb-4 max-w-none">
            <div className="whitespace-pre-wrap font-mono text-caption leading-[1.9] text-mid">
              {body}
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {Object.entries(platformAssets).map(([key, { asset, platform }]) => (
            <a
              key={key}
              href={asset.browser_download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-control border border-line px-2.5 py-1 font-mono text-[10.5px] text-low transition-colors duration-200 hover:border-line-hi hover:text-hi"
            >
              {platform.label}
            </a>
          ))}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-control border border-accent-line px-2.5 py-1 font-mono text-[10.5px] text-accent transition-colors duration-200 hover:bg-accent-soft"
          >
            Full Changelog
          </a>
        </div>
      </Reveal>
    </details>
  );
}
