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
        divider &&
          "[&:not(:last-child)]:border-r max-[720px]:border-r-0 max-[720px]:[&:not(:last-child)]:border-b",
        className,
      )}
    >
      <Tag className="block text-[28px] font-bold text-accent">{value}</Tag>
      <span className="text-[12.5px] text-low">{label}</span>
    </div>
  );
}

export default StatCell;
