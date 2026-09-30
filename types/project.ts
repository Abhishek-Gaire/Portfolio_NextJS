/**
 * "Frontend" was added with the 2026 seed in
 * supabase/migrations/20260929000001_seed_two_more_projects.sql, for the npm
 * package and the Tauri desktop app. Neither is a backend project and calling
 * them "Full Stack" would be wrong. Note that "Collaboration" is in this union
 * and in both selects but has no row in the table, so it is an option that
 * currently matches nothing.
 */
export type ProjectCategory =
  | "All"
  | "Full Stack"
  | "Backend"
  | "Frontend"
  | "Collaboration";

/**
 * Provenance of the work, added in
 * supabase/migrations/20260929000006_add_projects_tags_context.sql.
 *
 * Separate from ProjectCategory on purpose. `category` is the technology axis
 * and `tags` is where the work came from, and they cross: Livingstone School is
 * a Full Stack *client* site, the LMS is a Backend *college* project, barshik is
 * a Frontend *oss* package. Folding provenance into `category` would have made
 * the axis combinatorial.
 *
 * A union rather than a bare string so a typo is a type error, but the database
 * CHECK constraint is the real guard — this union cannot see rows written by a
 * direct SQL edit.
 */
export type ProjectTag = "client" | "personal" | "oss" | "hobby" | "college";

export const PROJECT_TAGS: ProjectTag[] = [
  "client",
  "personal",
  "oss",
  "hobby",
  "college",
];

export interface Project {
  id: string;
  title: string;
  description: string;
  completionDate: string;
  image_url: string;
  technologies: string[];
  role: string;
  challenges: string;
  solutions: string;
  live_url?: string;
  github_url?: string;
  category: ProjectCategory | string;
  /**
   * Opt-in flag for the home page's Featured Work section, added in
   * supabase/migrations/20260929000000_add_projects_is_featured.sql.
   *
   * Optional because the column is added by a migration that is applied
   * separately from the deploy: a build that runs before the migration reads
   * rows with no `isFeatured` key at all. The home fetcher filters on it in the
   * database rather than in JS, so the app degrades to an empty section rather
   * than to a crash, and `null` and `undefined` both mean "not featured".
   */
  isFeatured?: boolean;
  /**
   * Provenance chips, added in
   * supabase/migrations/20260929000006_add_projects_tags_context.sql.
   *
   * Optional for the same reason as `isFeatured`: a build that runs before the
   * migration sees no `tags` key at all. Treated as "untagged" rather than as an
   * error, so cards simply render no chips.
   *
   * The column is NOT NULL with default '{}', so `tags` is either an array or
   * absent -- never null. The runtime check is still worth it, because the admin
   * writes through the browser and a partial update could hand back a row where
   * the key exists but is not an array.
   */
  tags?: ProjectTag[];
  /**
   * Where coursework sat, e.g. "6th semester - Minor Project 2". Added in the
   * same migration as `tags`.
   *
   * Deliberately does not name the university. Optional and nullable: it is
   * null for every non-college row, and the detail page renders the line only
   * when it is present.
   */
  context?: string;
  /**
   * URL key for /projects/<slug>, added in
   * supabase/migrations/20260929000002_add_projects_slug.sql.
   *
   * Stored rather than derived from the title so that editing a title in the
   * admin form cannot break a live URL. Required on the type because the column
   * is NOT NULL, but the page still treats a missing one as "no such project"
   * rather than falling back to the title.
   */
  slug: string;
}
