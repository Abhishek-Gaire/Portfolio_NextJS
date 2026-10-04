import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type FlagBadgeTone = "neutral" | "accent";

type FlagBadgeProps = {
  children: ReactNode;
  tone?: FlagBadgeTone;
  className?: string;
  as?: ElementType;
};

/**
 * Metadata badge with a leading colour bar.
 *
 * A separate primitive from MonoTag rather than a restyle of it. MonoTag is the
 * dense 10.5px mono pill used for framework lists, platform names and release
 * flags; this one is the larger sans badge that sits above a title, where the
 * bar is the thing that makes it scannable in a row. Restyling MonoTag would
 * have made every framework list on the site twice as tall.
 *
 * Tones are token-only, no literal palette: neutral is line/surface/low, accent
 * is the site's teal. The bar carries the tone, the border and fill stay quiet,
 * so a row of three reads as one group rather than three competing cards.
 */
const TONE: Record<FlagBadgeTone, string> = {
  neutral:
    "border-line bg-surface text-mid hover:border-line-hi hover:text-hi",
  accent: "border-accent-line bg-accent-soft text-accent hover:border-accent/70",
};

const BAR: Record<FlagBadgeTone, string> = {
  neutral: "bg-low",
  accent: "bg-accent",
};

export function FlagBadge({
  children,
  tone = "neutral",
  className,
  as: Tag = "span",
}: FlagBadgeProps) {
  return (
    <Tag
      className={cn(
        "inline-flex items-center gap-2.5 rounded-control border py-1.5 ps-4 pe-3.5 text-[13px] leading-none font-medium whitespace-nowrap transition-colors duration-200",
        TONE[tone],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-4 w-1 shrink-0 rounded-full", BAR[tone])}
      />
      {children}
    </Tag>
  );
}

export default FlagBadge;