import FeaturedProjectsClient from "./FeaturedProjectsClient";
import { getSupabaseServerClient } from "../../lib/supabase/server";
import type { Project } from "../../types/project";

async function fetchFeaturedProjects(): Promise<Project[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("Projects")
    .select("*")
    .order("completionDate", { ascending: false })
    .limit(3);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Project[];
}

export default async function FeaturedProjects() {
  const projects = await fetchFeaturedProjects();

  return <FeaturedProjectsClient projects={projects} />;
}
