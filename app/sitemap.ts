import type { MetadataRoute } from "next";
import { getSupabaseServerClient } from "../lib/supabase/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://www.abhishekgaire.com.np";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blogs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = getSupabaseServerClient();
    const { data: posts } = await supabase
      .from("Blogs")
      .select("slug, id, updated_at, created_at")
      .eq("publish", true);

    blogRoutes = (posts ?? []).map((post) => ({
      url: `${BASE_URL}/blogs/${post.slug ?? post.id}`,
      lastModified: new Date(post.updated_at ?? post.created_at),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {
    console.error("[sitemap] Failed to fetch blog posts");
  }

  return [...staticRoutes, ...blogRoutes];
}
