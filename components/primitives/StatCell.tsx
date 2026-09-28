import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type StatCellProps = {
  value: ReactNode;
  label: ReactNode;
  as?: ElementType;
  divider?: boolean;
  className?: string;
};

export function StatCell({
  value,
  label,
  as: Tag = "b",
  divider = true,
  className,
}: StatCellProps) {
  return (
    <div
      className={cn(
        "px-[26px] py-[22px]",
        // The colour must be explicit: Tailwind v4 preflight declares
        // `border: 0 solid` with no border-color, so a bare `border-r` falls
        // back to currentColor rather than the --color-line token.
        divider &&
          "border-line [&:not(:last-child)]:border-r max-[720px]:border-r-0 max-[720px]:[&:not(:last-child)]:border-b",
        className,
      )}
    >
      {/* Preflight sets line-height 1.5 on html, which inflates this cell to
          112px against the reference's 100px. Reset it on the value. */}
      <Tag className="block text-[28px] leading-none font-bold text-accent">
        {value}
      </Tag>
      <span className="text-[12.5px] leading-[1.35] text-low">{label}</span>
    </div>
  );
}

export default StatCell;
