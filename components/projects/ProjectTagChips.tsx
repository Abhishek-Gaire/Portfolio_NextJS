import { FlagBadge } from "@/components/primitives/FlagBadge";
import { MonoTag } from "@/components/primitives/MonoTag";
import { cn } from "@/lib/utils";
import {
  PROJECT_TAGS,
  PROJECT_TAG_LABELS,
  type ProjectTag,
} from "../../types/project";

type ProjectTagChipsProps = {
  tags?: ProjectTag[] | string[] | null;
  className?: string;
  /**
   * `tag` is the dense mono pill. `flag` is the larger badge with the leading
   * colour bar, which needs the vertical room a project header has and a list
   * row does not. Opt-in rather than switched globally so the /projects rows
   * keep their current density; see the note on FlagBadge.
   */
  variant?: "tag" | "flag";
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
  variant = "tag",
}: ProjectTagChipsProps) {
  if (!Array.isArray(tags)) return null;

  const known = (tags as string[]).filter(
    (t): t is ProjectTag => (PROJECT_TAGS as string[]).includes(t),
  );
  if (known.length === 0) return null;

  // Order follows PROJECT_TAGS rather than the array's own order, so two rows
  // with the same tags always render in the same sequence.
  const ordered = PROJECT_TAGS.filter((t) => known.includes(t));
  const asFlag = variant === "flag";

  return (
    <span
      className={cn(
        "flex flex-wrap items-center",
        asFlag ? "gap-2" : "gap-1.5",
        className,
      )}
    >
      {ordered.map((tag) =>
        asFlag ? (
          <FlagBadge
            key={tag}
            tone={ACCENTED.includes(tag) ? "accent" : "neutral"}
          >
            {PROJECT_TAG_LABELS[tag]}
          </FlagBadge>
        ) : (
          <MonoTag key={tag} accent={ACCENTED.includes(tag)}>
            {PROJECT_TAG_LABELS[tag]}
          </MonoTag>
        ),
      )}
    </span>
  );
}

export default ProjectTagChips;
