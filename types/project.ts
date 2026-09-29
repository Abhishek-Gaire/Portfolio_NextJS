export type ProjectCategory = "All" | "Full Stack" | "Backend" | "Collaboration";

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
}
