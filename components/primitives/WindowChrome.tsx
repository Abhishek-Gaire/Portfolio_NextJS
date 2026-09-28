import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type WindowChromeProps = {
  title?: string;
  className?: string;
  barClassName?: string;
  bodyClassName?: string;
  children?: ReactNode;
};

export function WindowChrome({
  title,
  className,
  barClassName,
  bodyClassName,
  children,
}: WindowChromeProps) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div
        className={cn(
          "flex items-center gap-1.5 border-b border-line px-4 py-2.75",
          barClassName,
        )}
      >
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-chrome-dot" />
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-chrome-dot" />
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-chrome-dot" />
        {title ? (
          <span className="ml-2.5 font-mono text-micro text-low">{title}</span>
        ) : null}
      </div>
      <div className={cn("min-h-0 flex-1", bodyClassName)}>{children}</div>
    </div>
  );
}

export default WindowChrome;
