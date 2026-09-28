import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";

type SectionHeadProps = {
  eyebrow: string;
  title: string;
  lede?: string;
  id?: string;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
};

export function SectionHead({
  eyebrow,
  title,
  lede,
  id,
  align = "left",
  className,
  children,
}: SectionHeadProps) {
  return (
    <div
      className={cn("mb-8", align === "center" && "text-center", className)}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="text-title font-bold text-hi">
        {title}
      </h2>
      {lede ? (
        <p className="mt-2.5 max-w-measure text-[15px] text-mid">{lede}</p>
      ) : null}
      {children}
    </div>
  );
}

export default SectionHead;
