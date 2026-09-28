"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
// The reference project imports these from "motion/react", but this repo has
// no `motion` dependency. framer-motion v11 is installed and exports all four.
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";

import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type ScrollVelocityContainerProps = {
  children: ReactNode;
  className?: string;
};

export function ScrollVelocityContainer({
  children,
  className,
}: ScrollVelocityContainerProps) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}

type ScrollVelocityRowProps = {
  children: ReactNode;
  baseVelocity?: number;
  direction?: number;
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
  className,
  tone = "muted",
}: ScrollVelocityRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // The global `prefers-reduced-motion` block in globals.css only clamps CSS
  // animation/transition durations. This row's movement is a framer spring
  // writing `transform` on every frame, which no CSS media query can reach, so
  // the spring has to be unmounted from JS instead.
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (containerRef.current) setWidth(containerRef.current.scrollWidth);
  }, [children, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div ref={containerRef} className="relative flex w-full overflow-hidden whitespace-nowrap">
        <div className={cn(ROW_CLASSES, TONE_CLASSES[tone], className)}>
          <span>{children}</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative flex w-full overflow-hidden whitespace-nowrap">
      <VelocityTrack
        width={width}
        baseVelocity={baseVelocity}
        direction={direction}
        className={cn(ROW_CLASSES, TONE_CLASSES[tone], className)}
      >
        {children}
      </VelocityTrack>
    </div>
  );
}

type VelocityTrackProps = {
  children: ReactNode;
  width: number;
  baseVelocity: number;
  direction: number;
  className?: string;
};

function VelocityTrack({
  children,
  width,
  baseVelocity,
  direction,
  className,
}: VelocityTrackProps) {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], [0, direction * baseVelocity * 10]);
  const springX = useSpring(x, { stiffness: 100, damping: 30 });

  return (
    <motion.div style={{ x: springX, minWidth: width }} className={className}>
      <span>{children}</span>
      <span>{children}</span>
      <span>{children}</span>
    </motion.div>
  );
}
