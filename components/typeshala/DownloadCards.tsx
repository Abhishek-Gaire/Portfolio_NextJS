"use client";

import { useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  Link2,
  Loader2,
} from "lucide-react";

import { BentoCard } from "@/components/primitives/BentoCard";
import { Button } from "@/components/primitives/Button";
import { MonoTag } from "@/components/primitives/MonoTag";
import { Reveal } from "@/components/primitives/Reveal";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/types/typeshala";
import type { PlatformDownload } from "@/types/typeshala";
import {
  useDetectedOS,
  orderPlatformsByOS,
  isRecommendedForOS,
} from "./useDetectedOS";

interface DownloadAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface DownloadCardProps {
  platform: PlatformDownload;
  asset?: DownloadAsset;
  isLoading?: boolean;
  /** True when this card matches the visitor's OS. */
  recommended?: boolean;
}

function getAssetLabel(assetName: string, platform: PlatformDownload) {
  if (platform.downloadLabel) return platform.downloadLabel;
  return (
    assetName.match(/\.[^.]+$/)?.[0] ||
    platform.assetPatterns[0]?.replace(".", "") ||
    "Installer"
  );
}

export function DownloadCard({
  platform,
  asset,
  isLoading,
  recommended,
}: DownloadCardProps) {
  const [copied, setCopied] = useState(false);
  const [instructionCopied, setInstructionCopied] = useState(false);

  const handleDownload = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyInstructions = () => {
    if (!platform.installInstructions) return;
    navigator.clipboard.writeText(platform.installInstructions);
    setInstructionCopied(true);
    setTimeout(() => setInstructionCopied(false), 2000);
  };

  const isFdroid = platform.platform === "fdroid";
  // Manual URL (e.g. manually built Android APK) takes the place of a
  // release asset — the card behaves as if a download exists.
  const downloadUrl =
    asset?.browser_download_url || platform.manualUrl || undefined;
  const hasDownload = !!downloadUrl && !isFdroid;
  // Only badge cards the visitor can actually download.
  const showRecommended =
    !!recommended && platform.platform !== "windows-msi" && hasDownload;

  return (
    <BentoCard
      interactive
      className={cn("h-full p-5", showRecommended && "border-accent-line")}
    >
      <div className="flex h-full flex-col">
        <div className="mb-4 flex items-start justify-between gap-2.5">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control border border-line bg-surface-2 text-[19px] leading-none"
          >
            {platform.icon}
          </span>
          {showRecommended ? (
            <MonoTag accent className="mt-1.5">
              Recommended
            </MonoTag>
          ) : null}
        </div>

        <h3 className="text-[15px] font-semibold text-hi">{platform.label}</h3>
        <p className="mt-1.5 text-[13px] leading-[1.55] text-mid">
          {platform.description}
        </p>

        {hasDownload ? (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {asset ? (
              <>
                <MonoTag className="border-line-hi text-mid">
                  {formatBytes(asset.size)}
                </MonoTag>
                <MonoTag className="border-line-hi text-mid">
                  {getAssetLabel(asset.name, platform)}
                </MonoTag>
              </>
            ) : null}
            <a
              href={downloadUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-[10.5px] text-accent transition-colors duration-200 hover:text-hi"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Direct link</span>
            </a>
          </div>
        ) : null}

        {hasDownload ? (
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
            <Button
              variant="primary"
              onClick={() => handleDownload(downloadUrl!)}
              disabled={isLoading}
              className="disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>
                    Download {getAssetLabel(asset?.name || "", platform)}
                  </span>
                </>
              )}
            </Button>
            <Button
              onClick={() => handleCopyLink(downloadUrl!)}
              className={cn(copied && "border-accent-line text-accent")}
            >
              {copied ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Link2 className="h-4 w-4" />
              )}
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </Button>
          </div>
        ) : null}

        {!hasDownload && !isFdroid ? (
          <p className="mt-auto flex items-center gap-1.5 pt-4 text-caption text-amber">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>Not available in latest release</span>
          </p>
        ) : null}

        {isFdroid ? (
          <div className="mt-auto pt-4">
            <Button
              as="a"
              href="https://f-droid.org/packages/com.abhishek.typeshala/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View on F-Droid</span>
            </Button>
            <p className="mt-2.5 text-caption leading-[1.55] text-low">
              {platform.installInstructions}
            </p>
          </div>
        ) : null}

        {platform.installInstructions && hasDownload ? (
          <details className="group/details mt-3.5 border-t border-line pt-3.5">
            <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[13px] text-mid transition-colors duration-200 hover:text-hi">
              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-open/details:rotate-180" />
              <span>Show install instructions</span>
            </summary>
            <div className="mt-2.5 flex items-start gap-2">
              <p className="min-w-0 flex-1 break-all rounded-control border border-line bg-code-bg p-3 font-mono text-caption leading-[1.7] text-mid">
                {platform.installInstructions}
              </p>
              <button
                type="button"
                onClick={handleCopyInstructions}
                aria-label="Copy install instructions"
                title="Copy install instructions"
                className="shrink-0 rounded-control border border-line p-3 text-low transition-colors duration-200 hover:border-line-hi hover:text-accent"
              >
                {instructionCopied ? (
                  <CheckCircle className="h-4 w-4 text-accent" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </details>
        ) : null}
      </div>
    </BentoCard>
  );
}

interface DownloadGridProps {
  platforms: PlatformDownload[];
  assets: Record<string, { asset: DownloadAsset; platform: PlatformDownload }>;
  isLoading?: boolean;
}

export function DownloadGrid({
  platforms,
  assets,
  isLoading,
}: DownloadGridProps) {
  const os = useDetectedOS();
  const ordered = orderPlatformsByOS(platforms, os);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ordered.map((platform, index) => {
        const matched = assets[platform.platform];
        return (
          <Reveal key={platform.platform} delay={index * 60} className="h-full">
            <DownloadCard
              platform={platform}
              asset={matched?.asset}
              isLoading={isLoading}
              recommended={isRecommendedForOS(platform, os)}
            />
          </Reveal>
        );
      })}
    </div>
  );
}
