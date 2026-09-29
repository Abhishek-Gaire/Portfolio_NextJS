import { TYPESHala_SITE_URL } from "./site-urls";

/**
 * Projects that get a Download button in place of Live/Code, keyed on the
 * project title as it appears in the Projects table.
 *
 * The reference drives this from a `downloadTo` field and points it at its own
 * `/typeshala` route. This site points at the Typeshala subdomain instead, so
 * there is no route to link to here, and a column for one row is not worth a
 * migration — hence a lookup on the title.
 *
 * The fragility is real and worth stating plainly: renaming the row in /admin
 * silently drops the button, with no error anywhere and no visual hint that
 * anything is missing. It lives in one module, rather than inline in each card,
 * so the home and /projects cards cannot disagree about it — two copies of this
 * map is exactly the drift that made the duplicated "Tools" list on /about worth
 * deleting.
 *
 * Both consumers: components/home/FeaturedProjectsClient.tsx (the home page
 * Featured Work section) and components/projects/ProjectsPageClient.tsx.
 */
const DOWNLOAD_OVERRIDES: Record<string, string> = {
  Typeshala: TYPESHala_SITE_URL,
};

/** The download URL for a project title, or undefined to show Live/Code. */
export function getProjectDownloadUrl(title: string): string | undefined {
  return DOWNLOAD_OVERRIDES[title];
}
