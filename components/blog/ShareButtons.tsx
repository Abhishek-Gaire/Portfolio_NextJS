"use client";

import { Facebook, Link as LinkIcon, Linkedin, Twitter } from "lucide-react";
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
    <div className="flex items-center space-x-4 my-8 border-t border-b border-gray-200 py-6">
      <span className="text-gray-600">Share:</span>
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-5 w-5" />
      </a>
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-gray-600 hover:text-blue-800 transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-5 w-5" />
      </a>
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-5 w-5" />
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="p-2 text-gray-600 hover:text-blue-700 transition-colors"
        aria-label="Copy link"
      >
        <LinkIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
