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
 * The reference's `animate-orbit` is `animate-orbit-angle` here, and
 * `stroke-border` is `border-line`. The rename was originally needed because
 * this repo already had an `animate-orbit` for a second, mockup-derived orbit
 * component. That component is gone — the home page skills diagram and the
 * Typeshala stack section both use this one now — so the two could be merged
 * back, but the name is left alone rather than churning a working rename in a
 * change that is otherwise about adopting the component.
 *
 * The parent must be a flex container that centres its children. The orbit
 * children are absolutely positioned with no inset offsets, so their static
 * position is what the flexbox places, and the keyframes rotate each one about
 * that point.
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
