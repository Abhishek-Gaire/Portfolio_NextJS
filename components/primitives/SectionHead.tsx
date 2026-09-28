import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";

type SectionHeadProps = {
  eyebrow: string;
  title: string;
  lede?: string;
  id?: string;
  align?: "left" | "center";
  /**
   * Pass "h1" on a page whose section head IS the page's main heading
   * (`/projects`, `/blogs`, `/contact`). Those pages have no other h1, and
   * defaulting to h2 left them with none at all.
   */
  as?: "h1" | "h2" | "h3";
  className?: string;
  children?: ReactNode;
};

export function SectionHead({
  eyebrow,
  title,
  lede,
  id,
  align = "left",
  as: Heading = "h2",
  className,
  children,
}: SectionHeadProps) {
  return (
    <div
      className={cn("mb-8", align === "center" && "text-center", className)}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading id={id} className="text-title font-bold text-hi">
        {title}
      </Heading>
      {lede ? (
        <p className="mt-2.5 max-w-measure text-[15px] text-mid">{lede}</p>
      ) : null}
      {children}
    </div>
  );
}

export default SectionHead;
