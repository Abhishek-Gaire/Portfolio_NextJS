import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type EyebrowProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
};

export function Eyebrow({ children, as: Tag = "p", className }: EyebrowProps) {
  return (
    <Tag className={cn("mb-2 font-mono text-[13px] text-accent", className)}>
      {children}
    </Tag>
  );
}

export default Eyebrow;
