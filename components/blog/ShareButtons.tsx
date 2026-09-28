"use client";

import { Link as LinkIcon } from "lucide-react";
import { Facebook, Linkedin, Twitter } from "@/components/icons";
import { useMemo } from "react";
import { toast } from "react-toastify";

type ShareButtonsProps = {
  url: string;
  title: string;
  description?: string;
};

export default function ShareButtons({
  url,
  title,
  description = "",
}: ShareButtonsProps) {
  const shareLinks = useMemo(() => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);

    return {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    };
  }, [url, title, description]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy to clipboard.");
    }
  };

  return (
    <div className="my-8 flex flex-wrap items-center gap-3 border-y border-line py-5">
      <span className="font-mono text-[11.5px] text-low">SHARE</span>
      <div className="flex flex-wrap items-center gap-2.5">
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-control border border-line text-low transition-colors duration-200 hover:border-line-hi hover:text-accent"
          aria-label="Share on Twitter"
        >
          <Twitter className="h-5 w-5" />
        </a>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-control border border-line text-low transition-colors duration-200 hover:border-line-hi hover:text-accent"
          aria-label="Share on Facebook"
        >
          <Facebook className="h-5 w-5" />
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-control border border-line text-low transition-colors duration-200 hover:border-line-hi hover:text-accent"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-5 w-5" />
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="flex h-10 w-10 items-center justify-center rounded-control border border-line text-low transition-colors duration-200 hover:border-line-hi hover:text-accent"
          aria-label="Copy link"
        >
          <LinkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
