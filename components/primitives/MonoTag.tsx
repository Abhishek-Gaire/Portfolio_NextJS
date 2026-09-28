import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type MonoTagProps = {
  children: ReactNode;
  accent?: boolean;
  as?: ElementType;
  className?: string;
};

export function MonoTag({
  children,
  accent = false,
  as: Tag = "span",
  className,
}: MonoTagProps) {
  return (
    <Tag
      className={cn(
        "rounded-full border px-2 py-[3px] font-mono text-[10.5px]",
        accent ? "border-accent-line text-accent" : "border-line text-low",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export default MonoTag;
