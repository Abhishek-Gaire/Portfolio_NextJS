import type { MetadataRoute } from "next";
import { headers } from "next/headers";

import {
  PORTFOLIO_URL,
  TYPESHala_SITE_URL,
  isTypeshalaHost,
} from "@/lib/site-urls";
import { getSupabaseServerClient } from "../lib/supabase/server";

/**
 * Two sitemaps out of one route handler, because proxy.ts serves this app on
 * both the portfolio domain and the typeshala subdomain.
 *
 * The portfolio sitemap lists the portfolio's pages plus the Typeshala landing
 * page at its own canonical subdomain URL — the `/typeshala` route here is the
 * same page, but the copy people share, and the one with the keyword in the
 * domain, is the subdomain. The Typeshala sitemap lists only that page: the
 * subdomain redirects every other route to the portfolio, so listing anything
 * else would be a sitemap of 301s.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get("host");
  const now = new Date();

  if (isTypeshalaHost(host)) {
    return [
      {
        url: TYPESHala_SITE_URL,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 1,
      },
    ];
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: PORTFOLIO_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${PORTFOLIO_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${PORTFOLIO_URL}/projects`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${PORTFOLIO_URL}/blogs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${PORTFOLIO_URL}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      // The canonical home of the product page. Not `${PORTFOLIO_URL}/typeshala`
      // — that URL is only reachable by rewriting the subdomain root, and
      // proxy.ts 302s every other subdomain path back here, so it is not a place
      // a visitor can be sent or a crawler should be sent.
      url: TYPESHala_SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
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
      url: `${PORTFOLIO_URL}/blogs/${post.slug ?? post.id}`,
      lastModified: new Date(post.updated_at ?? post.created_at),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {
    console.error("[sitemap] Failed to fetch blog posts");
  }

  return [...staticRoutes, ...blogRoutes];
}