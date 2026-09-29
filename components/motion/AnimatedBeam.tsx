"use client";

import { useEffect, useId, useState, type RefObject } from "react";
// The reference project imports `motion` from "motion/react", but this repo has
// no `motion` dependency. framer-motion v11 is installed and exports it.
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export interface AnimatedBeamProps {
  className?: string;
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
  /**
   * A literal colour, not a token reference. This lands on the SVG `stroke`
   * *attribute*, and attribute values are not parsed for `var()`, so
   * `var(--color-line)` here would render as no stroke at all. Use
   * `stroke-line` as a className on the beam's parent if you need the token.
   */
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  repeat?: number;
  repeatDelay?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

/**
 * Ported from
 * ../remix-of-pixel-perfect/src/components/ui/animated-beam.tsx
 *
 * Three deviations from the reference, all deliberate:
 *
 * 1. The shadcn token classes the reference's *call site* puts on its nodes
 *    (`border-border`, `bg-card`, `text-foreground`) do not exist here. They
 *    are remapped to the bento tokens in the call site, not here — this
 *    component only ever draws paths.
 *
 * 2. The reference observes just `containerRef` with its ResizeObserver. That
 *    misses the case that actually bites in this repo: the fonts are
 *    self-hosted with `display: swap`, so the first paint lays the node labels
 *    out in the fallback face and the swapped-in Space Grotesk reflows them
 *    without the container changing size at all. Observing the two endpoints
 *    as well costs three `observe` calls and makes the beam land correctly on
 *    the first stable layout.
 *
 * 3. A `prefers-reduced-motion` guard, which the reference does not have. The
 *    gradient sweep is framer-motion writing SVG attributes every frame, and
 *    the global kill switch in globals.css only clamps CSS animation and
 *    transition durations — it cannot reach this. Same reasoning as
 *    ScrollVelocityRow and TiltCard.
 */
export function AnimatedBeam({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 5,
  delay = 0,
  pathColor = "#3f4145",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#2dd4bf",
  gradientStopColor = "#5eead4",
  repeat = Infinity,
  repeatDelay = 0,
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}: AnimatedBeamProps) {
  const id = useId();
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();

  const gradientCoordinates = reverse
    ? { x1: ["90%", "-10%"], x2: ["100%", "0%"], y1: ["0%", "0%"], y2: ["0%", "0%"] }
    : { x1: ["10%", "110%"], x2: ["0%", "100%"], y1: ["0%", "0%"], y2: ["0%", "0%"] };

  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const rectA = fromRef.current.getBoundingClientRect();
        const rectB = toRef.current.getBoundingClientRect();
        setSvgDimensions({ width: containerRect.width, height: containerRect.height });
        const startX = rectA.left - containerRect.left + rectA.width / 2 + startXOffset;
        const startY = rectA.top - containerRect.top + rectA.height / 2 + startYOffset;
        const endX = rectB.left - containerRect.left + rectB.width / 2 + endXOffset;
        const endY = rectB.top - containerRect.top + rectB.height / 2 + endYOffset;
        const controlY = startY - curvature;
        setPathD(`M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`);
      }
    };
    const resizeObserver = new ResizeObserver(updatePath);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    // See deviation 2 above: the endpoints move when the webfont swaps even
    // though the container does not.
    if (fromRef.current) resizeObserver.observe(fromRef.current);
    if (toRef.current) resizeObserver.observe(toRef.current);
    updatePath();
    return () => resizeObserver.disconnect();
  }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset]);

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "pointer-events-none absolute top-0 left-0 transform-gpu stroke-2",
        className,
      )}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
      aria-hidden="true"
    >
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      <path
        d={pathD}
        strokeWidth={pathWidth}
        stroke={`url(#${id})`}
        strokeOpacity="1"
        strokeLinecap="round"
      />
      <defs>
        {prefersReducedMotion ? (
          /*
           * Static spread across the whole path instead of the sweep. The beam
           * still reads as a live connection, it just stops moving.
           */
          <linearGradient
            id={id}
            gradientUnits="userSpaceOnUse"
            x1="0%"
            x2="100%"
            y1="0%"
            y2="0%"
          >
            <stop stopColor={gradientStartColor} stopOpacity="0" />
            <stop stopColor={gradientStartColor} />
            <stop offset="32.5%" stopColor={gradientStopColor} />
            <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
          </linearGradient>
        ) : (
          <motion.linearGradient
            className="transform-gpu"
            id={id}
            gradientUnits="userSpaceOnUse"
            initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
            animate={{
              x1: gradientCoordinates.x1,
              x2: gradientCoordinates.x2,
              y1: gradientCoordinates.y1,
              y2: gradientCoordinates.y2,
            }}
            transition={{ delay, duration, ease: [0.16, 1, 0.3, 1], repeat, repeatDelay }}
          >
            <stop stopColor={gradientStartColor} stopOpacity="0" />
            <stop stopColor={gradientStartColor} />
            <stop offset="32.5%" stopColor={gradientStopColor} />
            <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
          </motion.linearGradient>
        )}
      </defs>
    </svg>
  );
}

export default AnimatedBeam;
