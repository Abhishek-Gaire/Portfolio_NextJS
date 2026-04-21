import LatestBlogsClient from "./LatestBlogsClient";
import { getSupabaseServerClient } from "../../lib/supabase/server";
import type { BlogPost } from "../../types/blog";

async function fetchLatestPosts(): Promise<BlogPost[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("Blogs")
    .select("*")
    .eq("publish", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as BlogPost[];
}

export default async function LatestBlogs() {
  const posts = await fetchLatestPosts();

  return <LatestBlogsClient posts={posts} />;
}
