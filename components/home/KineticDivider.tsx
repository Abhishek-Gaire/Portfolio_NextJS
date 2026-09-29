import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/motion/ScrollVelocityRow";

export function KineticDivider() {
  return (
    <ScrollVelocityContainer className="border-y border-border py-14">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-background to-transparent" />
      <ScrollVelocityRow
        baseVelocity={18}
        direction={1}
        className="font-mono text-2xl tracking-tight text-hi sm:text-4xl"
      >
        SCALABLE ARCHITECTURE • CLEAN CODE • MODERN STACK •&nbsp;
      </ScrollVelocityRow>
      <ScrollVelocityRow
        baseVelocity={18}
        direction={-1}
        className="mt-3 font-mono text-2xl tracking-tight text-mid sm:text-4xl"
      >
        FULL-STACK DEVELOPER • PROBLEM SOLVER •&nbsp;
      </ScrollVelocityRow>
    </ScrollVelocityContainer>
  );
}
