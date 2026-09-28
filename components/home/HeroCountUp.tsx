"use client";

import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";

const DURATION_MS = 900;

const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3);

type HeroCountUpProps = {
  target: number;
  suffix?: string;
};

export default function HeroCountUp({ target, suffix = "" }: HeroCountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // The server has no IntersectionObserver, so the SSR output is the final
  // value. Reading "10+" with JS off beats the reference's "0+".
  const [value, setValue] = useState(target);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.unobserve(el);

        const start = performance.now();
        setValue(0);

        const step = (now: number) => {
          const progress = Math.min((now - start) / DURATION_MS, 1);
          setValue(Math.round(target * easeOutCubic(progress)));
          if (progress < 1) frame = window.requestAnimationFrame(step);
        };

        frame = window.requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [target, reducedMotion]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
