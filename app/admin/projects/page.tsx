import type { Metadata } from "next";
import AdminProjectsManager from "../../../components/admin/AdminProjectsManager";
import { getSupabaseServerAuthClient } from "../../../lib/supabase/server-auth";
import type { Project } from "../../../types/project";

export const metadata: Metadata = {
  title: "Admin Projects",
  description: "Manage portfolio projects in the admin dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminProjectsPage() {
  const supabase = await getSupabaseServerAuthClient();
  const { data, error } = await supabase
    .from("Projects")
    .select("*")
    .order("completionDate", { ascending: false });

  const projects = error ? [] : ((data ?? []) as Project[]);

  return <AdminProjectsManager initialProjects={projects} />;
}
