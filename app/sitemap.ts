import type { MetadataRoute } from "next";
import { getSupabaseServerClient } from "../lib/supabase/server";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://example.com";

async function getDynamicBlogUrls(): Promise<MetadataRoute.Sitemap> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("Blogs")
    .select("id, slug, updated_at")
    .eq("publish", true);

  if (error) {
    return [];
  }

  const now = new Date();

  return (data ?? []).map((post) => ({
    url: `${SITE_URL}/blogs/${post.slug ?? post.id}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const dynamicRoutes = await getDynamicBlogUrls();

  return [...staticRoutes, ...dynamicRoutes];
}
