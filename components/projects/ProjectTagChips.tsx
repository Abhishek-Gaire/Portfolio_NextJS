import { MonoTag } from "@/components/primitives/MonoTag";
import { cn } from "@/lib/utils";
import { PROJECT_TAGS, type ProjectTag } from "../../types/project";

type ProjectTagChipsProps = {
  tags?: ProjectTag[] | string[] | null;
  className?: string;
};

/**
 * Provenance chips for a project.
 *
 * `client` is the only tag that gets the accent treatment. It is the one that
 * answers "has someone else's business run on this", so it should be the first
 * thing the eye lands on; the rest are supporting context and stay muted. A
 * row of five equally-weighted chips would flatten that distinction.
 *
 * Unknown values are dropped rather than rendered. The database CHECK
 * constraint is the real guard, but this is also reached from the admin's
 * browser-direct write path, and a chip labelled with a value the UI has never
 * heard of would look like a rendering bug rather than bad data.
 */
const ACCENTED: ProjectTag[] = ["client"];

export function ProjectTagChips({
  tags,
  className,
}: ProjectTagChipsProps) {
  if (!Array.isArray(tags)) return null;

  const known = (tags as string[]).filter(
    (t): t is ProjectTag => (PROJECT_TAGS as string[]).includes(t),
  );
  if (known.length === 0) return null;

  // Order follows PROJECT_TAGS rather than the array's own order, so two rows
  // with the same tags always render in the same sequence.
  const ordered = PROJECT_TAGS.filter((t) => known.includes(t));

  return (
    <span className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {ordered.map((tag) => (
        <MonoTag key={tag} accent={ACCENTED.includes(tag)}>
          {tag}
        </MonoTag>
      ))}
    </span>
  );
}

export default ProjectTagChips;
