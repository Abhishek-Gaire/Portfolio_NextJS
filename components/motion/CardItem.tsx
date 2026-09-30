"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

/**
 * Set by TiltCard. CardItem needs it to know whether to sit at its resting
 * depth or at its hover depth, and TiltCard is the only thing that knows
 * whether the pointer is over the card.
 *
 * Undefined rather than false when there is no provider, because a CardItem
 * rendered outside a TiltCard should still render — it just never lifts.
 */
export const TiltHoverContext = createContext<boolean | undefined>(undefined);

export function useTiltHovered(): boolean {
  return useContext(TiltHoverContext) === true;
}

type CardItemProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  translateX?: number;
  translateY?: number;
  translateZ?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
};

/**
 * Ported from
 * ../remix-of-pixel-perfect/src/components/ui/3d-card.tsx (CardItem).
 *
 * What changed and why:
 *
 * 1. The reference reaches for its `MouseEnterContext` and falls back to
 *    `[false]` via `|| [false]`. That fallback is a hook call in an
 *    expression, which breaks the rules of hooks the moment the provider
 *    appears. Here the context has an explicit `undefined` default and
 *    `useTiltHovered()` collapses it to `false`, so the call order is fixed.
 *
 * 2. The reference animates on mount by writing `style.transform` in an
 *    effect keyed on `isMouseEntered`. That is kept, because it is what makes
 *    the depth jump instantaneous rather than eased — a transition on
 *    translateZ during a pointer move fights the tilt.
 *
 * 3. Reduced motion needs no branch here. TiltCard withholds its pointer
 *    handlers when `prefers-reduced-motion` is set, so `isMouseEntered` can
 *    never become true and every item stays at its resting transform. Adding a
 *    second guard would be dead code.
 */
export function CardItem({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
}: CardItemProps) {
  const ref = useRef<HTMLElement>(null);
  const isHovered = useTiltHovered();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isHovered) {
      el.style.transform = `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    } else {
      el.style.transform = "translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)";
    }
  }, [isHovered, translateX, translateY, translateZ, rotateX, rotateY, rotateZ]);

  return (
    <Tag
      ref={ref}
      className={cn("[transform-style:preserve-3d]", className)}
    >
      {children}
    </Tag>
  );
}

type CardBodyProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Ported from the reference's CardBody, minus its `h-96 w-96`.
 *
 * The reference's CardBody hardcodes a 384px square because its two call sites
 * are fixed-size project tiles. The cards here are full-width list rows and
 * responsive grid cells, so the size comes from the caller. What is kept is the
 * part that matters: `preserve-3d` on the body and on every direct child, which
 * is what lets a child's translateZ actually separate from the body in 3D
 * space instead of being flattened into it.
 */
export function CardBody({ children, className }: CardBodyProps) {
  return (
    <div
      className={cn(
        "relative [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default CardItem;
