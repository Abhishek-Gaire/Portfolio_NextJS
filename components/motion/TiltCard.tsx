"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const PERSPECTIVE = 1000;
const ROTATION_DIVISOR = 25;

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  depth?: number;
  wrapperClassName?: string;
};

export function TiltCard({
  children,
  className,
  depth = 0,
  wrapperClassName,
}: TiltCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  // The global `prefers-reduced-motion` block in globals.css only clamps CSS
  // animation/transition durations. This component writes `style.transform`
  // directly from a mousemove handler, which no CSS media query can reach, so
  // the pointer handler must never be attached when reduced motion is set.
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleMouseMove = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (event.clientX - left - width / 2) / ROTATION_DIVISOR;
    const y = (event.clientY - top - height / 2) / ROTATION_DIVISOR;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  }, []);

  useEffect(() => {
    if (prefersReducedMotion && containerRef.current) {
      containerRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
    }
  }, [prefersReducedMotion]);

  return (
    <div
      className={cn("flex items-center justify-center", wrapperClassName)}
      style={{ perspective: `${PERSPECTIVE}px` }}
    >
      <div
        ref={containerRef}
        onMouseEnter={prefersReducedMotion ? undefined : () => setIsMouseEntered(true)}
        onMouseMove={prefersReducedMotion ? undefined : handleMouseMove}
        onMouseLeave={prefersReducedMotion ? undefined : handleMouseLeave}
        className={cn(
          "relative flex items-center justify-center transition-transform duration-200 ease-linear",
          className,
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/*
          `w-full` is load-bearing and was missing until /projects switched to
          a list view. This wrapper is a flex item with no width of its own, so
          it sizes to its content. A card with `w-full` inside it then resolves
          100% against a content-sized box and collapses to shrink-to-fit — the
          card rendered 434px wide inside a 1132px row. It only looked correct
          in the grid view because the grid cell happened to constrain the
          width, which is what made the bug invisible until a full-width layout
          exposed it.
        */}
        <div
          className="w-full [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]"
          style={{
            transform: isMouseEntered ? `translateZ(${depth}px)` : "translateZ(0px)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
