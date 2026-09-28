import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = {
  variant?: "default" | "primary";
  as?: ElementType;
  className?: string;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function Button({
  variant = "default",
  as,
  className,
  children,
  ...props
}: ButtonProps) {
  const Tag = (as ?? "button") as ElementType;

  return (
    <Tag
      className={cn(
        "inline-flex items-center gap-2 rounded-control border px-[18px] py-[11px] font-sans text-[13.5px] font-semibold transition-colors duration-200",
        variant === "primary"
          ? "border-accent bg-accent text-[#08110f] hover:bg-[#5eead4]"
          : "border-line bg-transparent text-hi hover:border-line-hi hover:bg-[rgba(255,255,255,0.03)]",
        className,
      )}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </Tag>
  );
}

export default Button;
