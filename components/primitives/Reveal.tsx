"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ElementType,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
};

/** Staggered fade-up on scroll into view. */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [intersected, setIntersected] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const shown = reducedMotion || intersected;

  const handleIntersect = useCallback(() => {
    setIntersected(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          handleIntersect();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect, reducedMotion]);

  return (
    <Tag
      ref={ref}
      className={cn(
        /*
         * `reveal-hidden`, not bare `opacity-0`. The hidden state needs its own
         * class so the no-JS fallback can target it: a blanket rule un-hiding
         * every `opacity-0` would also un-hide BentoCard's hover spotlight and
         * PixelImage's loading state, which are opacity-0 for real reasons.
         * The class is defined in app/globals.css next to the keyframes.
         */
        shown ? (reducedMotion ? undefined : "fade-up") : "reveal-hidden",
        className,
      )}
      style={shown && !reducedMotion ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
