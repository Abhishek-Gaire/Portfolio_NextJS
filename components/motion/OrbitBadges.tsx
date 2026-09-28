import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type OrbitBadgeItem = {
  label: string;
  color: string;
};

type RingConfig = {
  radius: number;
  duration: number;
  reverse?: boolean;
  /** Degrees to rotate the static reduced-motion layout by, to stagger the rings. */
  offset?: number;
  badgeClassName: string;
};

const INNER_RING: RingConfig = {
  radius: 78,
  duration: 20,
  offset: 0,
  badgeClassName: "size-10 text-xs",
};

const OUTER_RING: RingConfig = {
  radius: 150,
  duration: 32,
  reverse: true,
  offset: 45,
  badgeClassName: "size-[34px] text-[10.5px]",
};

type OrbitBadgesProps = {
  innerItems: OrbitBadgeItem[];
  outerItems: OrbitBadgeItem[];
  hubLabel?: string;
  caption?: ReactNode;
  className?: string;
};

function OrbitRing({ items, config }: { items: OrbitBadgeItem[]; config: RingConfig }) {
  return (
    <>
      {items.map((item, index) => {
        const angle = (360 / items.length) * index + (config.offset ?? 0);
        return (
          <div
            key={item.label}
            className={cn(
              "animate-orbit absolute left-1/2 top-1/2 size-0 group-hover:[animation-play-state:paused]",
              config.reverse && "[animation-direction:reverse]",
              // The global reduced-motion switch in globals.css only stops the
              // animation, which would leave every badge stacked on the hub at
              // the keyframe origin. Pin each badge to an even angle instead so
              // the ring stays readable when motion is off.
              "motion-reduce:[animation:none] motion-reduce:[transform:rotate(var(--a))_translateX(var(--r))_rotate(calc(var(--a)*-1))]",
            )}
            style={
              {
                "--r": `${config.radius}px`,
                "--dur": `${config.duration}s`,
                "--delay": `${-(config.duration / items.length) * index}s`,
                "--a": `${angle}deg`,
              } as CSSProperties
            }
          >
            <div
              className={cn(
                "absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-tile border bg-code-bg font-mono font-semibold [box-shadow:0_0_0_3px_rgba(0,0,0,0.4)]",
                config.badgeClassName,
              )}
              style={
                {
                  "--c": item.color,
                  color: "var(--c)",
                  borderColor: "var(--c)",
                } as CSSProperties
              }
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </>
  );
}

export function OrbitBadges({
  innerItems,
  outerItems,
  hubLabel = "CORE STACK",
  caption,
  className,
}: OrbitBadgesProps) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="group relative mx-auto aspect-square w-full max-w-[380px] max-[560px]:max-w-[280px]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[2] flex size-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-0.5 rounded-tile border border-accent-line bg-accent-soft text-accent">
          <span className="font-mono text-[15px] font-semibold leading-none">&lt;/&gt;</span>
          <span className="font-mono text-[7px] tracking-[0.04em] text-low uppercase">
            {hubLabel}
          </span>
        </div>
        <OrbitRing items={innerItems} config={INNER_RING} />
        <OrbitRing items={outerItems} config={OUTER_RING} />
      </div>
      {caption ? (
        <p className="mt-2 text-center font-mono text-micro text-low">{caption}</p>
      ) : null}
    </div>
  );
}
