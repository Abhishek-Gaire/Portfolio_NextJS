import FeaturedProjectsClient from "./FeaturedProjectsClient";
import { getSupabaseServerClient } from "../../lib/supabase/server";
import type { Project } from "../../types/project";

/**
 * How many projects the home page shows. The database enforces the same cap
 * with a trigger, so a third flag cannot be set by a direct table write; this
 * constant is what the query asks for.
 */
const FEATURED_LIMIT = 2;

async function fetchFeaturedProjects(): Promise<Project[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("Projects")
    .select("*")
    // Explicit opt-in, newest first. This used to be an implicit
    // `order(completionDate).limit(3)`, which meant the home page picked its own
    // two rows by comparing dates, and a project could not opt out of appearing
    // there.
    .eq("isFeatured", true)
    .order("completionDate", { ascending: false })
    .limit(FEATURED_LIMIT);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Project[];
}

export default async function FeaturedProjects() {
  const projects = await fetchFeaturedProjects();

  return <FeaturedProjectsClient projects={projects} />;
}
