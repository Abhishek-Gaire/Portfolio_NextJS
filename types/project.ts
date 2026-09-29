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
