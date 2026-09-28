"use client";

import { useCallback, useRef, type HTMLAttributes, type MouseEvent } from "react";

import { cn } from "@/lib/utils";

type BentoCardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export function BentoCard({
  interactive = false,
  className,
  children,
  onMouseMove,
  ...props
}: BentoCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      onMouseMove?.(event);
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      el.style.setProperty("--my", `${event.clientY - rect.top}px`);
    },
    [onMouseMove],
  );

  return (
    <div
      ref={ref}
      onMouseMove={interactive ? handleMouseMove : onMouseMove}
      className={cn(
        "relative overflow-hidden rounded-card border border-line bg-surface",
        interactive &&
          "group/interactive transition-colors duration-300 hover:border-line-hi",
        className,
      )}
      {...props}
    >
      {interactive ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/interactive:opacity-100"
          style={{
            background:
              "radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgba(45, 212, 191, 0.09), transparent 45%)",
          }}
        />
      ) : null}
      <div className="relative z-[1] h-full">{children}</div>
    </div>
  );
}

export default BentoCard;
