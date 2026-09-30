"use client";

import { useCallback, useRef, type HTMLAttributes, type MouseEvent } from "react";

import { cn } from "@/lib/utils";

type BentoCardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
  /**
   * Clip descendants to the card's rounded box. Default true, and correct for
   * every static use.
   *
   * Set it false on cards wrapped in TiltCard. A CardItem at translateZ(100)
   * under a 1000px perspective is scaled to roughly 1.11, so on a card whose
   * image sits flush to the edge it grows past the border and `overflow-hidden`
   * shears its corners off square, straight across the card's own rounded top.
   * Disabling the clip lets the lift read as a lift; the spotlight below rounds
   * itself to match, so nothing spills there either.
   *
   * The rounded-corner match assumes the card keeps its default radius. A
   * caller that overrides it with a different `rounded-*` also has to restate
   * it on the spotlight, or the two disagree while hovering.
   */
  clip?: boolean;
};

export function BentoCard({
  interactive = false,
  clip = true,
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
        "relative rounded-card border border-line bg-surface",
        clip && "overflow-hidden",
        interactive &&
          "group/interactive transition-colors duration-300 hover:border-line-hi",
        className,
      )}
      {...props}
    >
      {interactive ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-card opacity-0 transition-opacity duration-300 group-hover/interactive:opacity-100"
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
