"use client";

import { useEffect, useState } from "react";

import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";

const TICK_MS = 15000;
const PLACEHOLDER = "--:--";

function formatKathmanduTime(date: Date): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kathmandu",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return PLACEHOLDER;
  }
}

export default function HeroClock() {
  // The server cannot know the visitor's clock, so the first client render has to
  // agree with the server output or React reports a hydration mismatch. The real
  // time replaces the placeholder from the effect below, after mount.
  const [time, setTime] = useState(PLACEHOLDER);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const update = () => setTime(formatKathmanduTime(new Date()));
    update();

    // The reduced-motion kill switch in globals.css cannot stop a JS timer, so a
    // live clock has to opt out in JS: render it once, then leave it alone.
    if (reducedMotion) return;

    const id = window.setInterval(update, TICK_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  return <div className="my-3.5 mb-1 font-mono text-[22px] text-hi">{time}</div>;
}
