"use client";

import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
// The reference project imports these from "motion/react", but this repo has
// no `motion` dependency. framer-motion v11 is installed and exports them.
//
// Note that `useScroll`, `useTransform` and `useSpring` are *not* used here.
// The reference couples the row's offset to `scrollYProgress`, so the text only
// moves while the page is scrolling and coasts to a stop when you stop. This
// row is meant to run continuously and freeze on hover instead, which is a
// different mechanism: a rAF loop advancing a motion value and wrapping it on
// the period. See the note on VelocityTrack for why the wrap has to be measured
// rather than hardcoded.
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";

import { cn } from "@/lib/utils";

import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type ScrollVelocityContainerProps = HTMLAttributes<HTMLDivElement>;

export function ScrollVelocityContainer({
  children,
  className,
  ...props
}: ScrollVelocityContainerProps) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center overflow-hidden",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type ScrollVelocityRowProps = {
  children: ReactNode;
  /** Travel speed in px per second. */
  baseVelocity?: number;
  direction?: 1 | -1;
  /** Freeze in place. Set this from the parent's hover state, not locally. */
  paused?: boolean;
  className?: string;
  tone?: "muted" | "accent" | "hi";
};

const ROW_CLASSES =
  "flex gap-8 text-nowrap font-mono text-caption uppercase tracking-[0.18em]";

const TONE_CLASSES: Record<NonNullable<ScrollVelocityRowProps["tone"]>, string> = {
  muted: "text-mid",
  accent: "text-accent",
  hi: "text-hi",
};

export function ScrollVelocityRow({
  children,
  baseVelocity = 20,
  direction = 1,
  paused = false,
  className,
  tone = "muted",
}: ScrollVelocityRowProps) {
  // The global `prefers-reduced-motion` block in globals.css only clamps CSS
  // animation and transition durations. This row's movement is a rAF loop
  // writing `transform` on every frame, which no CSS media query can reach, so
  // the loop is skipped from JS instead and a static single copy is rendered.
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="relative flex w-full overflow-hidden whitespace-nowrap">
        <div className={cn(ROW_CLASSES, TONE_CLASSES[tone], className)}>
          <span>{children}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full overflow-hidden whitespace-nowrap">
      <VelocityTrack
        baseVelocity={baseVelocity}
        direction={direction}
        paused={paused}
        className={cn(ROW_CLASSES, TONE_CLASSES[tone], className)}
      >
        {children}
      </VelocityTrack>
    </div>
  );
}

type VelocityTrackProps = {
  children: ReactNode;
  baseVelocity: number;
  direction: 1 | -1;
  paused: boolean;
  className?: string;
};

/** Two copies is the floor for the period measurement to be possible at all. */
const MIN_COPIES = 3;

/**
 * Repeated copies translated along x and wrapped on the period.
 *
 * The period has to be measured, not assumed. It is the distance from the left
 * edge of copy 1 to the left edge of copy 2, which is the text width *plus* the
 * `gap-8` between them. Hardcoding the text width would desync the seam by the
 * gap on every cycle, and using the container width instead would mean the tail
 * of the phrase never scrolls into view, because each cycle would jump a whole
 * viewport rather than one phrase.
 *
 * The measurement is re-taken on resize because the fonts are self-hosted with
 * `display: swap`: the first layout is done in the fallback face, and the swap
 * changes the text width, which changes the period. Reading it once would put
 * the seam out by however much Space Grotesk differs from the fallback.
 */
function VelocityTrack({
  children,
  baseVelocity,
  direction,
  paused,
  className,
}: VelocityTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [period, setPeriod] = useState(0);
  const [copies, setCopies] = useState(MIN_COPIES);
  const x = useMotionValue(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const [first, second] = [track.children[0], track.children[1]];
      if (!first || !second) return;
      // getBoundingClientRect, not offsetLeft: both copies share an offsetParent
      // so either works, but the rects are in the same coordinate space as the
      // transform we are about to write.
      const distance =
        second.getBoundingClientRect().left - first.getBoundingClientRect().left;
      if (distance <= 0) return;
      setPeriod(distance);

      // Enough copies that the row can never run out of text, at the worst
      // point in the cycle. See the wrap note in useAnimationFrame.
      const rowWidth = track.parentElement?.clientWidth ?? 0;
      setCopies(Math.max(MIN_COPIES, Math.ceil(rowWidth / distance) + 1));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    if (track.parentElement) observer.observe(track.parentElement);
    return () => observer.disconnect();
  }, [children]);

  useAnimationFrame((_time, delta) => {
    if (paused || period === 0) return;
    const next = x.get() + (direction * baseVelocity * delta) / 1000;
    // Wrap into [-period, 0), NOT [0, period). Every copy translates together,
    // so the content's left edge is exactly x: a positive x slides the text
    // right and leaves the strip to the left of it empty. Starting negative
    // means the copies are always ahead of the viewport instead, and the
    // coverage requirement is n * period >= rowWidth + period.
    x.set(((next % period) + period) % period - period);
  });

  return (
    <motion.div ref={trackRef} style={{ x }} className={className}>
      {Array.from({ length: copies }, (_, i) => (
        <span key={i}>{children}</span>
      ))}
    </motion.div>
  );
}
