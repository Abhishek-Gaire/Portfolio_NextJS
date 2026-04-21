import type { Metadata } from "next";
import AdminPostsManager from "../../../components/admin/AdminPostsManager";
import { getSupabaseServerAuthClient } from "../../../lib/supabase/server-auth";
import type { BlogPost } from "../../../types/blog";

export const metadata: Metadata = {
  title: "Admin Posts | Portfolio Dashboard",
  description: "Manage blog posts in the admin dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPostsPage() {
  const supabase = await getSupabaseServerAuthClient();
  const { data, error } = await supabase
    .from("Blogs")
    .select("*")
    .order("created_at", { ascending: false });

  const posts = error ? [] : ((data ?? []) as BlogPost[]);

  return <AdminPostsManager initialPosts={posts} />;
}
