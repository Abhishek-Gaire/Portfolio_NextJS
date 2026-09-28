import React from "react";

import { cn } from "@/lib/utils";

export interface OrbitingCirclesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
}

/**
 * Ported verbatim from
 * ../remix-of-pixel-perfect/src/components/ui/orbiting-circles.tsx
 *
 * One deviation, and it is only a name: the reference's `animate-orbit` is
 * `animate-orbit-angle` here. The remix keyframes rotate each child by its own
 * `--angle` and offset it by `--radius`, while this repo's pre-existing
 * `animate-orbit` (driving the home page skills orbit) rotates on a fixed
 * `--r` radius. Same shape on screen, different custom-property contract, so
 * they cannot share a keyframes name. The reference's `stroke-border` maps to
 * `border-line`, which is the only token translation.
 */
export function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  radius = 160,
  path = true,
  iconSize = 30,
  speed = 1,
  ...props
}: OrbitingCirclesProps) {
  const calculatedDuration = duration / speed;
  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-line stroke-1"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />
        </svg>
      )}
      {React.Children.map(children, (child, index) => {
        const angle = (360 / React.Children.count(children)) * index;
        return (
          <div
            style={
              {
                "--duration": calculatedDuration,
                "--radius": radius,
                "--angle": angle,
                "--icon-size": `${iconSize}px`,
              } as React.CSSProperties
            }
            className={cn(
              `animate-orbit-angle absolute flex size-(--icon-size) transform-gpu items-center justify-center rounded-full`,
              { "[animation-direction:reverse]": reverse },
              className,
            )}
            {...props}
          >
            {child}
          </div>
        );
      })}
    </>
  );
}
