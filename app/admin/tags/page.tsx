import type { Metadata } from "next";
import AdminTagsManager from "../../../components/admin/AdminTagsManager";
import { getSupabaseServerAuthClient } from "../../../lib/supabase/server-auth";
import type { Tag } from "../../../types/blog";

export const metadata: Metadata = {
  title: "Admin Tags",
  description: "Manage blog and project tags in the admin dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminTagsPage() {
  const supabase = await getSupabaseServerAuthClient();
  const { data, error } = await supabase
    .from("tags")
    .select("id, name")
    .order("name");

  const tags = error ? [] : ((data ?? []) as Tag[]);

  return <AdminTagsManager initialTags={tags} />;
}
