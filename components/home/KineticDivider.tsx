"use client";

import { useState } from "react";

import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/motion/ScrollVelocityRow";

export function KineticDivider() {
  // Hover state lives here rather than in each row, because the two rows are
  // one band and should stop together. `group`/`group-hover` on the container
  // would also work for the CSS side, but the rows move via a rAF loop rather
  // than a CSS animation, so there is no `animation-play-state` to flip and
  // the pause has to come from JS.
  const [paused, setPaused] = useState(false);

  return (
    <ScrollVelocityContainer
      className="border-y border-line py-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/*
        `from-bg`, not the reference's `from-background`. That is a shadcn token
        and this repo has no --color-background, so `from-background` emits no
        rule at all and the whole gradient is dropped, leaving the text sliced
        off dead at both edges.
      */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-bg to-transparent" />
      {/*
        The trailing `&nbsp;` after the last bullet is load-bearing, not a typo.
        Every copy of the row is this exact string, so without the non-breaking
        space the wrap lands with one bullet jammed against the next. It also
        has to be a real NBSP rather than a collapsed space, or the seam closes
        up by one character and the loop visibly stutters once per cycle.
      */}
      <ScrollVelocityRow
        baseVelocity={45}
        direction={1}
        paused={paused}
        className="font-mono text-2xl tracking-tight text-hi sm:text-4xl"
      >
        SCALABLE ARCHITECTURE • CLEAN CODE • MODERN STACK • TYPED END TO END
        •&nbsp;
      </ScrollVelocityRow>
      <ScrollVelocityRow
        baseVelocity={45}
        direction={-1}
        paused={paused}
        className="mt-3 font-mono text-2xl tracking-tight text-mid sm:text-4xl"
      >
        FULL-STACK DEVELOPER • PROBLEM SOLVER • AVAILABLE FOR HIRE •&nbsp;
      </ScrollVelocityRow>
    </ScrollVelocityContainer>
  );
}
