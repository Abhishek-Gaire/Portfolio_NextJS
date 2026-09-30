import { OrbitingCircles } from "@/components/motion/OrbitingCircles";
import { cn } from "@/lib/utils";

type StackOrbitProps = {
  /** Headline technologies, on the outer ring. */
  outer: string[];
  /** Secondary technologies, on the inner counter-rotating ring. */
  inner: string[];
  className?: string;
};

/**
 * The two counter-rotating rings, at the reference geometry.
 *
 * Extracted because three sites had the same forty lines of JSX and only
 * different arrays, and the home Skills copy already carried a comment warning
 * that the two lists must be kept in sync by hand -- a hazard that a shared
 * component removes rather than documents. Geometry, badge classes and the
 * `core` label are byte-identical to what all three sites had.
 *
 * Fixed at radius 170 / 100 because those are JS props on OrbitingCircles and
 * cannot be set in CSS, so responsive shrinking has to be a transform on the
 * wrapper -- `max-md:scale-[0.72]` -- rather than a smaller ring. That trade is
 * deliberate: the reference hides the diagram below md entirely, which is the
 * wrong call for a portfolio someone reads on a phone.
 *
 * The parent's flex centring is load-bearing. The orbit children are absolutely
 * positioned with no inset offsets, so the flexbox is what places them; remove
 * `items-center justify-center` and every badge collapses into the middle.
 */
export function StackOrbit({ outer, inner, className }: StackOrbitProps) {
  if (outer.length === 0) return null;

  return (
    <div
      className={cn(
        "relative mx-auto flex h-[420px] w-full origin-center items-center justify-center",
        "max-md:scale-[0.72] [&:hover_*]:[animation-play-state:paused]",
        className,
      )}
    >
      <span className="font-mono text-xs text-low">core</span>
      <OrbitingCircles radius={170} duration={40} iconSize={56} speed={0.6}>
        {outer.map((tech) => (
          <span
            key={tech}
            className="flex size-14 items-center justify-center rounded-full border border-line bg-surface-2 px-1.5 text-center font-mono text-[11px] leading-tight text-hi"
          >
            {tech}
          </span>
        ))}
      </OrbitingCircles>
      <OrbitingCircles radius={100} duration={32} iconSize={44} speed={0.6} reverse>
        {inner.map((tech) => (
          <span
            key={tech}
            className="flex size-11 items-center justify-center rounded-full border border-line bg-surface-2 px-1 text-center font-mono text-[10px] leading-tight text-mid"
          >
            {tech}
          </span>
        ))}
      </OrbitingCircles>
    </div>
  );
}

/**
 * Split a project's technology list across the two rings.
 *
 * Nine badges is the ceiling the rings were drawn for: six on the outer, three
 * on the inner. A project row can carry fourteen, and fourteen badges at 56px
 * on a 170px radius overlap into an unreadable band.
 *
 * Alternating rather than slicing, so the rings do not end up holding
 * near-identical entries -- six frontend names on one ring and the backend on
 * the other implies a grouping that does not exist.
 *
 * Whatever does not fit is dropped from the diagram and nothing else: the full
 * list is still rendered as text in the case-study sidebar, so no technology is
 * unreachable and nothing depends on the diagram being complete.
 */
export function splitForOrbit(
  technologies: string[],
  maxOuter = 6,
  maxInner = 3,
): { outer: string[]; inner: string[] } {
  const outer: string[] = [];
  const inner: string[] = [];

  for (const tech of technologies) {
    if (inner.length < maxInner && outer.length >= inner.length) {
      inner.push(tech);
    } else if (outer.length < maxOuter) {
      outer.push(tech);
    } else if (inner.length < maxInner) {
      inner.push(tech);
    }
  }

  return { outer, inner };
}

export default StackOrbit;
